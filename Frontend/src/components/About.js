import { useNavigate } from "react-router-dom";

const About = () => {
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
              About Budget Tracker
            </h1>
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-neon hover:shadow-neon-lg"
            >
              Back to Tracker
            </button>
          </div>

          {/* Intro Text */}
          <p className="text-lg font-medium text-gray-800 italic text-center mb-8 animate-fade-in">
            Your cosmic companion for managing finances with flair!
          </p>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <div className="bg-gradient-to-tr from-white to-indigo-50 p-6 rounded-2xl shadow-neon border-2 border-purple-200/50 hover:border-purple-400 transition-all duration-300 animate-slide-in">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                Welcome to Budget Tracker
              </h2>
              <p className="text-gray-700 text-md leading-relaxed">
                Built with <span className="font-semibold text-indigo-600">React</span> and powered by a sleek API, Budget Tracker is here to make budgeting fun, intuitive, and visually stunning. Whether you’re adding funds, tracking wild transactions, or keeping an eye on your savings, this app turns numbers into a vibrant, interactive experience.
              </p>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-tr from-white to-pink-100 p-6 rounded-2xl shadow-neon border-2 border-indigo-200/50 hover:shadow-neon-lg transition-all duration-300 animate-slide-in-right">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                What Makes It Awesome?
              </h2>
              <ul className="space-y-3 text-gray-700 text-md">
                <li className="flex items-center gap-3">
                  <span className="p-2 bg-green-200 text-green-700 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span><strong>Dynamic Budgeting:</strong> Add funds, log transactions, and watch your savings grow (or shrink!) in real-time.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-2 bg-blue-200 text-blue-700 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5h6a1 1 0 110 2H6a1 1 0 110-2z" />
                    </svg>
                  </span>
                  <span><strong>Month-by-Month Insights:</strong> Group entries by month and dive into daily details with a click.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-2 bg-purple-200 text-purple-700 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </span>
                  <span><strong>Slick Design:</strong> A gradient-filled, neon-glowing UI with smooth animations that feel like a sci-fi adventure.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-2 bg-teal-200 text-teal-700 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span><strong>User-Friendly:</strong> Secure login, easy navigation, and a playful tone to keep you motivated.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-2 bg-red-200 text-red-700 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 002 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM17 16a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zM10 17a1 1 0 01-1 1v-1a1 1 0 011-1v1z" />
                    </svg>
                  </span>
                  <span><strong>Powered by Tech:</strong> Built with React, Axios, Tailwind CSS, and a custom backend API.</span>
                </li>
              </ul>
            </div>

            {/* Purpose */}
            <div className="bg-gradient-to-tr from-white to-teal-50 p-6 rounded-2xl shadow-neon border-2 border-teal-200/50 hover:shadow-neon-lg transition-all duration-300 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-teal-700 mb-4">
                Why I Built It
              </h2>
              <p className="text-gray-700 text-md leading-relaxed">
                Budget Tracker was born from a love for coding and a mission to create something both practical and dazzling. I wanted to mix functionality with a bold aesthetic—think of it as a budget app with personality. It’s perfect for anyone who wants to master their finances without losing their sense of fun.
              </p>
            </div>

            {/* Call to Action */}
            <div className="text-center animate-slide-in">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                Ready to take control of your financial galaxy?
              </p>
              <button
                onClick={() => navigate("/home")}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-neon hover:shadow-neon-xl flex items-center gap-2 mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Start Tracking Now!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;