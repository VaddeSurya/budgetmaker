import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [inputValue, setInputValue] = useState("");
  const [storedValues, setStoredValues] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isLoading, setIsLoading] = useState(false);
  const [transactionInputs, setTransactionInputs] = useState({});
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3001";

  const fetchBudgetData = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/budget/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      const data = response.data || [];
      setStoredValues(data);
      setTotalAmount(data.reduce((sum, entry) => sum + (entry.value || 0), 0));
    } catch (err) {
      console.error("Error fetching budget data:", err);
      console.log("Response data:", err.response?.data);
      if (err.response?.status === 404) {
        setStoredValues([]);
        setTotalAmount(0);
      } else {
        console.error("Unexpected error:", err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const storedUserId = localStorage.getItem("userId");

    if (!isAuthenticated || !storedUserId) {
      navigate("/login");
    } else {
      setUserId(storedUserId);
      fetchBudgetData(storedUserId);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
    setUserId(null);
    navigate("/login");
  };

  const handleSubmit = async () => {
    const amount = parseInt(inputValue);
    if (!amount || amount <= 0 || !userId) {
      console.warn("Invalid input or userId missing");
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/budget/${userId}`,
        { value: amount },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setStoredValues(response.data);
      setTotalAmount(prev => prev + amount);
      setInputValue("");
    } catch (err) {
      console.error("Error adding funds:", err);
      console.log("Response data:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransactionInput = (globalIndex, field, value) => {
    setTransactionInputs(prev => ({
      ...prev,
      [globalIndex]: {
        ...prev[globalIndex],
        [field]: value
      }
    }));
  };

  const handleTransaction = async (globalIndex, type) => {
    const input = transactionInputs[globalIndex] || {};
    if (!input.purchase || !input.cost) {
      console.warn("Missing transaction purchase or cost");
      return;
    }

    const cost = parseInt(input.cost);
    if (isNaN(cost) || cost <= 0) {
      console.warn("Invalid transaction cost");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/budget/${userId}/transaction/${globalIndex}`,
        { type, purchase: input.purchase, cost },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setStoredValues(response.data);
      setTotalAmount(prev => type === "remove" ? prev - cost : prev + cost);
      updateTransactionInput(globalIndex, "purchase", "");
      updateTransactionInput(globalIndex, "cost", "");
    } catch (err) {
      console.error("Error adding transaction:", err);
      console.log("Response data:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (globalIndex) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    if (!userId || globalIndex < 0 || globalIndex >= storedValues.length) {
      console.warn("Invalid userId or index");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${API_BASE_URL}/budget/${userId}/entry/${globalIndex}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setStoredValues(response.data);
      setTotalAmount(prev => prev - (storedValues[globalIndex]?.value || 0));
    } catch (err) {
      console.error("Error deleting entry:", err);
      console.log("Response data:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (globalIndex, transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    if (!userId || globalIndex < 0 || globalIndex >= storedValues.length) {
      console.warn("Invalid userId or index");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${API_BASE_URL}/budget/${userId}/transaction/${globalIndex}/${transactionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setStoredValues(response.data);
      const transaction = storedValues[globalIndex]?.transactions?.find(t => t.id === Number(transactionId));
      if (transaction) {
        setTotalAmount(prev => 
          transaction.type === "remove" 
            ? prev + transaction.cost 
            : prev - transaction.cost
        );
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
      console.log("Response data:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const groupByMonth = () => {
    return storedValues.reduce((acc, entry) => {
      const month = entry.date?.slice(0, 7) || "Unknown";
      acc[month] = acc[month] || {};
      acc[month][entry.date] = acc[month][entry.date] || [];
      acc[month][entry.date].push(entry);
      return acc;
    }, {});
  };

  const groupedData = groupByMonth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-64 h-64 bg-blue-500/10 rounded-full absolute top-10 left-10 animate-pulse blur-3xl"></div>
        <div className="w-96 h-96 bg-purple-500/10 rounded-full absolute bottom-20 right-20 animate-pulse blur-3xl delay-1000"></div>
        <div className="w-4 h-4 bg-blue-400/50 rounded-full absolute top-1/4 left-1/3 animate-particle-1 blur-sm"></div>
        <div className="w-6 h-6 bg-purple-400/50 rounded-full absolute bottom-1/3 right-1/4 animate-particle-2 blur-sm"></div>
        <div className="w-5 h-5 bg-blue-300/50 rounded-full absolute top-1/2 left-1/5 animate-particle-3 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-purple-900/10 animate-pulse-slow"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-pink-300 to-purple-300 rounded-3xl shadow-2xl p-8 transform hover:scale-[1.03] transition-all duration-500 ease-out-back border-4 border-yellow-300/50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-black via-red-500 to-purple-600 bg-clip-text text-transparent">
              BUDGET TRACKER
            </h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-neon hover:shadow-neon-lg"
            >
              Logout
            </button>
          </div>
          <p className="text-lg font-medium text-gray-800 italic text-center mb-6">
            Track your budget with cosmic ease!
          </p>

          <div className="text-center mb-10 relative">
            <div className="relative">
              <p
                className={`text-6xl font-extrabold mb-2 ${
                  totalAmount < 0 ? "text-red-600" : "text-green-600"
                } transition-all duration-300 bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text`}
              >
                ₹{(totalAmount ?? 0).toLocaleString()}
              </p>
              <span className="text-xl text-gray-700 font-semibold">Savings</span>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-300 rounded-full opacity-30 blur-sm"></div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex gap-6 justify-center items-center animate-slide-in">
              <input
                type="number"
                min="1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter your wild amount..."
                className="w-72 p-4 rounded-2xl border-2 border-indigo-300 focus:ring-4 focus:ring-purple-400 focus:border-purple-500 shadow-glow hover:shadow-glow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputValue}
                className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-neon hover:shadow-neon-xl flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                {isLoading ? "Adding..." : "Add Funds!"}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up">
              {Object.keys(groupedData).map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(selectedMonth === month ? null : month)}
                  className={`text-white-200 px-2 py-0 rounded-full text-xl font-medium transition-all duration-300 ${
                    selectedMonth === month
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-neon-lg transform scale-150"
                      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 shadow-md hover:shadow-neon"
                  }`}
                >
                  {new Date(month + "-01").toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </button>
              ))}
            </div>

            {selectedMonth && groupedData[selectedMonth] && (
              <div className="space-y-8 mt-8 animate-slide-in-right">
                {Object.entries(groupedData[selectedMonth]).map(([day, entries]) => (
                  <div
                    key={day}
                    className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-2xl border-2 border-purple-200/50 hover:border-purple-400 transition-all duration-300 animate-float"
                  >
                    <div
                      onClick={() =>
                        setExpandedDays({ ...expandedDays, [day]: !expandedDays[day] })
                      }
                      className="flex justify-between items-center cursor-pointer group hover:bg-indigo-100/50 rounded-xl p-4 transition-all duration-300"
                    >
                      <div>
                        <h2 className="text-2xl font-extrabold text-purple-800 group-hover:text-purple-900 transition-colors duration-200">
                          {new Date(day).toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                          })}
                        </h2>
                        <p className="text-sm text-gray-600">{day}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-teal-600">
                          ₹{(entries.reduce((sum, entry) => sum + (entry.value ?? 0), 0) || 0).toLocaleString()}
                        </span>
                        <svg
                          className={`w-6 h-6 text-purple-500 transform transition-transform duration-300 ${
                            expandedDays[day] ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {expandedDays[day] && (
                      <div className="mt-6 space-y-6 animate-fade-in">
                        {entries.map((entry, idx) => {
                          const globalIndex = storedValues.indexOf(entry);
                          return (
                            <div
                              key={globalIndex}
                              className="bg-gradient-to-tr from-white to-pink-100 p-5 rounded-2xl shadow-neon border-2 border-indigo-200/50 hover:shadow-neon-lg transition-all duration-300"
                            >
                              <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-4">
                                  <p
                                    className={`text-3xl font-bold ${
                                      (entry.value ?? 0) < 0 ? "text-red-600" : "text-green-600"
                                    }`}
                                  >
                                    ₹{(entry.value ?? 0).toLocaleString()}
                                  </p>
                                  {(entry.value ?? 0) < 0 && (
                                    <span className="text-red-500 text-sm font-bold bg-red-100 px-3 py-1 rounded-full">
                                      Oh No! Low Funds!
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDelete(globalIndex)}
                                  disabled={isLoading}
                                  className="text-gray-500 hover:text-red-600 transition-colors duration-300 p-2 rounded-full hover:bg-red-100"
                                  title="Delete Entry"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>

                              <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-4 rounded-xl mb-5 border-2 border-purple-100/50">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-md font-bold text-indigo-700 uppercase tracking-wide">
                                    Transactions
                                  </h3>
                                  <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                                    {entry.transactions?.length || 0} wild moves!
                                  </span>
                                </div>
                                {entry.transactions?.length > 0 ? (
                                  <div className="space-y-4">
                                    {entry.transactions.map((t) => (
                                      <div
                                        key={t.id}
                                        className={`flex justify-between items-center p-3 rounded-xl border ${
                                          t.type === "remove"
                                            ? "bg-red-50 border-red-200"
                                            : "bg-green-50 border-green-200"
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <span
                                            className={`p-2 rounded-full ${
                                              t.type === "remove"
                                                ? "bg-red-200 text-red-700"
                                                : "bg-green-200 text-green-700"
                                            }`}
                                          >
                                            {t.type === "remove" ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                            ) : (
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
                                            )}
                                          </span>
                                          <span className="text-md font-medium text-gray-800">
                                            {t.purchase || "Mystery Purchase!"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span
                                            className={`text-md font-bold ${
                                              t.type === "remove" ? "text-red-600" : "text-green-600"
                                            }`}
                                          >
                                            {t.type === "remove" ? "-₹" : "+₹"}
                                            {(t.cost ?? 0).toLocaleString()}
                                          </span>
                                          <button
                                            onClick={() => handleDeleteTransaction(globalIndex, t.id)}
                                            disabled={isLoading}
                                            className="text-gray-500 hover:text-red-600 transition-colors duration-300 p-2 rounded-full hover:bg-red-100"
                                            title="Delete Transaction"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-5 w-5"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 animate-fade-in">
                                    <p className="text-gray-500 text-md italic">No crazy transactions yet!</p>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-4 animate-slide-in-right">
                                <input
                                  type="text"
                                  placeholder="Item Name (Be Creative!)"
                                  value={transactionInputs[globalIndex]?.purchase || ""}
                                  onChange={(e) => updateTransactionInput(globalIndex, "purchase", e.target.value)}
                                  className="flex-1 p-4 rounded-xl border-2 border-indigo-300 focus:ring-4 focus:ring-purple-400 focus:border-purple-500 shadow-glow hover:shadow-glow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                  disabled={isLoading}
                                />
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="Amount"
                                  value={transactionInputs[globalIndex]?.cost || ""}
                                  onChange={(e) => updateTransactionInput(globalIndex, "cost", e.target.value.replace(/[^0-9]/g, ''))}
                                  className="w-28 p-4 rounded-xl border-2 border-indigo-300 focus:ring-4 focus:ring-purple-400 focus:border-purple-500 shadow-glow hover:shadow-glow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                  disabled={isLoading}
                                />
                                <button
                                  onClick={() => handleTransaction(globalIndex, "remove")}
                                  disabled={isLoading || !transactionInputs[globalIndex]?.purchase || !transactionInputs[globalIndex]?.cost}
                                  className="px-5 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-neon hover:shadow-neon-lg flex items-center gap-2 disabled:opacity-70"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Spend It!
                                </button>
                                <button
                                  onClick={() => handleTransaction(globalIndex, "add")}
                                  disabled={isLoading || !transactionInputs[globalIndex]?.purchase || !transactionInputs[globalIndex]?.cost}
                                  className="px-5 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-neon hover:shadow-neon-lg flex items-center gap-2 disabled:opacity-70"
                                >
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
                                  Add Cash!
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Tailwind CSS Animations and Effects
const styles = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0); }
  }

  @keyframes float-slow {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slide-in {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slide-in-right {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes ping-slow {
    75%, 100% { transform: scale(1.2); opacity: 0; }
  }

  .animate-float {
    animation: float 6s infinite ease-in-out;
  }

  .animate-float-slow {
    animation: float-slow 8s infinite ease-in-out;
  }

  .animate-pulse-slow {
    animation: pulse-slow 4s infinite ease-in-out;
  }

  .animate-fade-in {
    animation: fade-in 1s ease-in-out;
  }

  .animate-fade-in-up {
    animation: fade-in-up 1s ease-in-out;
  }

  .animate-slide-in {
    animation: slide-in 1s ease-in-out;
  }

  .animate-slide-in-right {
    animation: slide-in-right 1s ease-in-out;
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }

  .animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .shadow-neon {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.7), 0 0 20px rgba(139, 92, 246, 0.5);
  }

  .shadow-neon-lg {
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.9), 0 0 30px rgba(139, 92, 246, 0.7);
  }

  .shadow-glow {
    box-shadow: 0 0 5px rgba(147, 51, 234, 0.5), 0 0 10px rgba(126, 34, 206, 0.3);
  }

  .shadow-glow-lg {
    box-shadow: 0 0 10px rgba(147, 51, 234, 0.7), 0 0 20px rgba(126, 34, 206, 0.5);
  }

  .ease-out-back {
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @layer base {
    html {
      @apply scroll-smooth;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Main;