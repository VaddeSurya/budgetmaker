require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const winston = require('winston');

const app = express();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'https://deluxe-entremet-20f0e4.netlify.app/register',
      'http://localhost:1234',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Database connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/employee")
  .then(() => logger.info("Connected to MongoDB"))
  .catch(err => {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { type: String, required: true },
  budgetData: [{
    value: { type: Number, required: true, min: 0 },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    transactions: [{
      type: { type: String, enum: ['add', 'remove'], required: true },
      purchase: { type: String, required: true, trim: true },
      cost: { type: Number, required: true, min: 1 },
      id: { type: Number, required: true }
    }]
  }]
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    logger.info(`Password hashed for ${this.email}`);
    next();
  } catch (err) {
    logger.error("Hashing error:", err);
    next(err);
  }
});

const EmployeeModel = mongoose.model("Employee", userSchema);

// Validation middleware
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    logger.info("Validation errors:", errors.array());
    res.status(400).json({ errors: errors.array() });
  };
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Routes
app.post('/register', 
  validateRequest([
    body('name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ]),
  async (req, res) => {
    try {
      logger.info("Register request body:", req.body);
      const { name, email, password } = req.body;
      const existingUser = await EmployeeModel.findOne({ email });
      if (existingUser) {
        logger.info("Email already exists:", email);
        return res.status(400).json({ error: "Email already exists" });
      }
      const user = new EmployeeModel({ name, email, password });
      await user.save();
      res.status(201).json({ 
        status: "Success", 
        userId: user._id 
      });
    } catch (err) {
      logger.error("Registration error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post('/login', 
  validateRequest([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ]),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      logger.info(`Login attempt - Email: ${email}`);
      const user = await EmployeeModel.findOne({ email });
      if (!user) {
        logger.info(`User not found: ${email}`);
        return res.status(404).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.info(`Invalid password for: ${email}`);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.json({ 
        status: "Success", 
        userId: user._id 
      });
    } catch (err) {
      logger.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Budget Routes
app.get('/budget/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(`Fetching budget for user: ${userId}`);
    const user = await EmployeeModel.findById(userId);
    if (!user) {
      logger.info(`User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.budgetData || []);
  } catch (err) {
    logger.error("Error fetching budget:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/budget/:userId', 
  validateRequest([
    body('value').isInt({ min: 1 })
  ]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { value } = req.body;
      logger.info(`Adding budget entry for user: ${userId}, value: ${value}`);
      const user = await EmployeeModel.findById(userId);
      if (!user) {
        logger.info(`User not found: ${userId}`);
        return res.status(404).json({ error: 'User not found' });
      }
      user.budgetData.push({ value });
      await user.save();
      res.json(user.budgetData);
    } catch (err) {
      logger.error("Error adding budget:", err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.post('/budget/:userId/transaction/:entryIndex', 
  validateRequest([
    body('type').isIn(['add', 'remove']),
    body('purchase').notEmpty().trim().escape(),
    body('cost').isInt({ min: 1 })
  ]),
  async (req, res) => {
    try {
      const { userId, entryIndex } = req.params;
      const { type, purchase, cost } = req.body;
      logger.info(`Adding transaction for user: ${userId}, entry: ${entryIndex}`);
      const user = await EmployeeModel.findById(userId);
      if (!user) {
        logger.info(`User not found: ${userId}`);
        return res.status(404).json({ error: 'User not found' });
      }
      if (entryIndex < 0 || entryIndex >= user.budgetData.length) {
        logger.info(`Invalid entry index: ${entryIndex}`);
        return res.status(400).json({ error: 'Invalid entry index' });
      }
      const entry = user.budgetData[entryIndex];
      const transactionId = entry.transactions.length 
        ? Math.max(...entry.transactions.map(t => t.id)) + 1 
        : 1;
      entry.transactions.push({ type, purchase, cost, id: transactionId });
      if (type === 'remove') {
        entry.value -= cost;
      } else {
        entry.value += cost;
      }
      await user.save();
      res.json(user.budgetData);
    } catch (err) {
      logger.error("Error adding transaction:", err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.delete('/budget/:userId/entry/:entryIndex', async (req, res) => {
  try {
    const { userId, entryIndex } = req.params;
    logger.info(`Deleting budget entry for user: ${userId}, entry: ${entryIndex}`);
    const user = await EmployeeModel.findById(userId);
    if (!user) {
      logger.info(`User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    if (entryIndex < 0 || entryIndex >= user.budgetData.length) {
      logger.info(`Invalid entry index: ${entryIndex}`);
      return res.status(400).json({ error: 'Invalid entry index' });
    }
    user.budgetData.splice(entryIndex, 1);
    await user.save();
    res.json(user.budgetData);
  } catch (err) {
    logger.error("Error deleting entry:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/budget/:userId/transaction/:entryIndex/:transactionId', async (req, res) => {
  try {
    const { userId, entryIndex, transactionId } = req.params;
    logger.info(`Deleting transaction for user: ${userId}, entry: ${entryIndex}, transaction: ${transactionId}`);
    const user = await EmployeeModel.findById(userId);
    if (!user) {
      logger.info(`User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    if (entryIndex < 0 || entryIndex >= user.budgetData.length) {
      logger.info(`Invalid entry index: ${entryIndex}`);
      return res.status(400).json({ error: 'Invalid entry index' });
    }
    const entry = user.budgetData[entryIndex];
    const transactionIndex = entry.transactions.findIndex(t => t.id === Number(transactionId));
    if (transactionIndex === -1) {
      logger.info(`Transaction not found: ${transactionId}`);
      return res.status(404).json({ error: 'Transaction not found' });
    }
    const transaction = entry.transactions[transactionIndex];
    if (transaction.type === 'remove') {
      entry.value += transaction.cost;
    } else {
      entry.value -= transaction.cost;
    }
    entry.transactions.splice(transactionIndex, 1);
    await user.save();
    res.json(user.budgetData);
  } catch (err) {
    logger.error("Error deleting transaction:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log registered routes for debugging
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    logger.info(`Registered route: ${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});