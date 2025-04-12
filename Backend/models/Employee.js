// // models/Employee.js
// const mongoose = require("mongoose");

// const EmployeeSchema = new mongoose.Schema({
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//     budgetData: [{
//         value: Number,
//         transactions: [{
//             type: String,
//             purchase: String,
//             cost: Number,
//             id: Number
//         }],
//         date: String
//     }]
// });

// const EmployeeModel = mongoose.model("employees", EmployeeSchema);
// module.exports = EmployeeModel;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { type: String, required: true }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Employee", userSchema);