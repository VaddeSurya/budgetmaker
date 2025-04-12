import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [btnName, setBtnName] = useState("Login");
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const updateAuthState = () => {
      const auth = localStorage.getItem("isAuthenticated");
      const email = localStorage.getItem("userEmail");

      if (auth === "true") {
        setBtnName("Logout");
        setUserEmail(email);
      } else {
        setBtnName("Login");
        setUserEmail(null);
      }
    };

    updateAuthState();
    window.addEventListener("storage", updateAuthState);
    return () => window.removeEventListener("storage", updateAuthState);
  }, []);

  const handleAuthClick = () => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (isAuth) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      setBtnName("Login");
      setUserEmail(null);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-black via-gray-900 to-black shadow-2xl relative overflow-hidden">
      {/* Enhanced Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-64 h-64 bg-blue-500/10 rounded-full absolute top-0 left-0 animate-pulse blur-3xl"></div>
        <div className="w-96 h-96 bg-purple-500/10 rounded-full absolute bottom-0 right-0 animate-pulse blur-3xl delay-1000"></div>
        <div className="w-4 h-4 bg-blue-400/50 rounded-full absolute top-1/4 left-1/3 animate-particle-1 blur-sm"></div>
        <div className="w-6 h-6 bg-purple-400/50 rounded-full absolute bottom-1/3 right-1/4 animate-particle-2 blur-sm"></div>
        <div className="w-5 h-5 bg-blue-300/50 rounded-full absolute top-1/2 left-1/5 animate-particle-3 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-purple-900/10 animate-pulse-slow"></div>
      </div>

      {/* Header Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center relative z-10">
        <h1 className="text-5xl font-extrabold text-white animate-fade-in-down bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:scale-105">
          <span className="text-yellow-300">BUDGET</span> TRACKER
        </h1>

        <nav className="mt-4 md:mt-0 flex items-center gap-6">
          <ul className="flex flex-wrap justify-center items-center gap-4">
            <li>
              <Link
                to="/home"
                className="px-5 py-3 bg-gray-900/70 text-white font-semibold rounded-xl border border-gray-600 transition-all duration-300 hover:bg-gray-800/80 hover:scale-102 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-slide-in transform"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="px-5 py-3 bg-gray-900/70 text-white font-semibold rounded-xl border border-gray-600 transition-all duration-300 hover:bg-gray-800/80 hover:scale-102 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-slide-in transform"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="px-5 py-3 bg-gray-900/70 text-white font-semibold rounded-xl border border-gray-600 transition-all duration-300 hover:bg-gray-800/80 hover:scale-102 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-slide-in transform"
              >
                Contact
              </Link>
            </li>
            <li className="flex flex-col items-center">
              <button
                onClick={handleAuthClick}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] hover:bg-gradient-to-l animate-slide-in"
              >
                {btnName}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;