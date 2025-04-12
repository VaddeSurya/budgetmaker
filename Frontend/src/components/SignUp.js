import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // Basic client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    axios.post(
      'http://localhost:3001/register',
      { name, email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
      .then(result => {
        console.log("Registration successful:", result.data);
        navigate('/login');
      })
      .catch(err => {
        console.error("Error:", err);
        console.log("Response data:", err.response?.data); // Log exact error
        const errorMessage = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || "Something went wrong. Please try again.";
        setError(errorMessage);
      });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-64 h-64 bg-blue-500/10 rounded-full absolute top-10 left-10 animate-pulse blur-3xl"></div>
        <div className="w-96 h-96 bg-purple-500/10 rounded-full absolute bottom-20 right-20 animate-pulse blur-3xl delay-1000"></div>
        <div className="w-4 h-4 bg-blue-400/50 rounded-full absolute top-1/4 left-1/3 animate-particle-1 blur-sm"></div>
        <div className="w-6 h-6 bg-purple-400/50 rounded-full absolute bottom-1/3 right-1/4 animate-particle-2 blur-sm"></div>
        <div className="w-5 h-5 bg-blue-300/50 rounded-full absolute top-1/2 left-1/5 animate-particle-3 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-purple-900/10 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 bg-gray-800/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-gray-600/50 transform transition-all duration-700 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-float">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-500 blur-md"></div>
        
        <h2 className="text-5xl font-extrabold text-center text-white mb-10 animate-fade-in-down bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create Account
        </h2>
        
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <div className="relative group">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2 transition-all duration-300 group-hover:text-blue-400">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-gray-900/70 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 hover:bg-gray-800/80"
            />
            <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100 origin-center"></div>
          </div>

          <div className="relative group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 transition-all duration-300 group-hover:text-blue-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-900/70 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 hover:bg-gray-800/80"
            />
            <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100 origin-center"></div>
          </div>

          <div className="relative group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 transition-all duration-300 group-hover:text-blue-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-900/70 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 hover:bg-gray-800/80"
            />
            <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100 origin-center"></div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center animate-shake bg-red-900/20 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] hover:bg-gradient-to-l"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8 animate-fade-in-up">
          Already have an account?{' '}
          <Link
            to="/login"
            className="relative text-blue-400 font-semibold transition-all duration-300 hover:text-purple-400 hover:underline hover:glow-text before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:scale-x-0 before:origin-center before:transition-transform before:duration-300 hover:before:scale-x-100"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;