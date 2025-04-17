import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black p-6 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-64 h-64 bg-blue-500/10 rounded-full absolute top-10 left-10 animate-pulse blur-3xl"></div>
        <div className="w-96 h-96 bg-purple-500/10 rounded-full absolute bottom-20 right-20 animate-pulse blur-3xl delay-1000"></div>
        <div className="w-4 h-4 bg-blue-400/50 rounded-full absolute top-1/4 left-1/3 animate-particle-1 blur-sm"></div>
        <div className="w-6 h-6 bg-purple-400/50 rounded-full absolute bottom-1/3 right-1/4 animate-particle-2 blur-sm"></div>
        <div className="w-5 h-5 bg-blue-300/50 rounded-full absolute top-1/2 left-1/5 animate-particle-3 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-purple-900/10 animate-pulse-slow"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-pink-300 to-purple-300 rounded-3xl shadow-2xl p-8 transform hover:scale-[1.03] transition-all duration-500 ease-out-back border-4 border-yellow-300/50">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-black via-red-500 to-purple-600 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-neon hover:shadow-neon-lg"
            >
              Back to Tracker
            </button>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-tr from-white to-teal-50 p-6 rounded-2xl shadow-neon border-2 border-teal-200/50 hover:shadow-neon-lg transition-all duration-300 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-teal-700 mb-4">
              Reach Us
            </h2>
            <p className="text-gray-700 text-md">
              Email:{" "}
              <a
                href="mailto:ajaydeepak103@gmail.com"
                className="text-indigo-600 hover:underline"
              >
                ajaydeepak103@gmail.com
              </a>
            </p>
            <p className="text-gray-700 text-md mt-2">
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/vadde-surya-3a6233258/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;