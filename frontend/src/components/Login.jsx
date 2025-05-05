import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Add animation effect on component mount
  useEffect(() => {
    const loginCard = document.getElementById("login-card");
    if (loginCard) {
      loginCard.classList.add("opacity-100", "translate-y-0");
      loginCard.classList.remove("opacity-0", "translate-y-4");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (response.data && response.data.user) {
        const { user } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", response.data.token);

        // Redirect based on role
        if (user.role === "admin" || user.role === "hr") {
          navigate("/hr-home");
        } else {
          navigate("/employee-home");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goToLandingPage = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-br-full opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-tl-full opacity-10"></div>

      <div
        id="login-card"
        className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 transition-all duration-700 ease-out opacity-0 translate-y-4"
      >
        {/* Back button */}
        <button
          onClick={goToLandingPage}
          className="absolute top-6 left-6 text-gray-500 hover:text-blue-600 transition duration-300 flex items-center text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-500">MindMade Employee Zone: Your Gateway to Work</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div
              className={`relative transition-all duration-300 ${
                isEmailFocused ? "ring-2 ring-blue-300 rounded-md" : ""
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  className={`h-5 w-5 ${
                    isEmailFocused ? "text-blue-500" : "text-gray-400"
                  } transition-colors duration-300`}
                />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                required
                autoFocus
                placeholder="Enter your email"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
            </div>
            <div
              className={`relative transition-all duration-300 ${
                isPasswordFocused ? "ring-2 ring-blue-300 rounded-md" : ""
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  className={`h-5 w-5 ${
                    isPasswordFocused ? "text-blue-500" : "text-gray-400"
                  } transition-colors duration-300`}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                minLength="6"
                placeholder="Enter your password"
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition duration-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
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
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
