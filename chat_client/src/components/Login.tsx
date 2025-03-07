import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { isLoading, error, handleAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAuth(activeTab, {
      email,
      password,
      ...(activeTab === "signup" && { username }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-96">
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
            {error}
          </div>
        )}
        <div className="border-b border-gray-600">
          <nav className="-mb-px flex w-full">
            <button
              disabled={isLoading}
              className={`flex-1 py-4 text-center text-sm font-medium border-b-2 !rounded-none ${
                activeTab === "login"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              disabled={isLoading}
              className={`flex-1 py-4 text-center text-sm font-medium border-b-2 !rounded-none ${
                activeTab === "signup"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          {activeTab === "signup" && (
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg bg-gray-600 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                required={activeTab === "signup"}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg bg-gray-600 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg bg-gray-600 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 !bg-blue-500 !text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : activeTab === "login" ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
