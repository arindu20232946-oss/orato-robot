import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";

export default function SignIn() {
  // ===== STATE MANAGEMENT =====
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State for loading indicator during API call
  const [loading, setLoading] = useState(false);
  
  //  NEW: State to toggle password visibility
  // false = password hidden (shows dots ••••)
  // true = password visible (shows actual text)
  const [showPassword, setShowPassword] = useState(false);

  // Navigation hook for redirecting after successful login
  const navigate = useNavigate();

  // ===== FORM SUBMISSION HANDLER =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Show loading state

    try {
      // Send login request to backend
      const res = await API.post("/auth/signin", {
        email,
        password,
      });

      // Store authentication token in browser's localStorage
      localStorage.setItem("token", res.data.token);
      
      // Store user information for later use
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Show success message to user
      toast.success("Login successful!");

      // Wait 800ms then redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error: any) {
      // Log error for debugging
      console.error("Signin error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error (e.g., wrong password)
        toast.error(error.response.data.message || "Invalid credentials!");
      } else {
        // Network error (server not reachable)
        toast.error("Cannot connect to server.");
      }

    } finally {
      // Always hide loading state after request completes
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* ===== LOGO SECTION ===== */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Orato Logo"
            className="w-20 h-20 rounded-xl shadow-md"
          />
        </div>

        {/* ===== TITLE & SUBTITLE ===== */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Sign in to continue your learning journey
        </p>

        {/* ===== LOGIN FORM ===== */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ===== EMAIL INPUT FIELD ===== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state on change
              required // HTML5 validation - field cannot be empty
              disabled={loading} // Disable input while submitting
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* ===== PASSWORD INPUT FIELD WITH EYE ICON ===== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            {/* 
              Relative container: Creates positioning context for the eye icon
              The eye icon will be positioned absolutely inside this container
            */}
            <div className="relative">
              <input
                //  DYNAMIC INPUT TYPE
                // When showPassword is true: type="text" (password visible)
                // When showPassword is false: type="password" (password hidden with dots)
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
                required // Field cannot be empty
                disabled={loading} // Disable during submission
                placeholder="Enter your password"
                // pr-12: Adds right padding (48px) to make space for the eye icon
                // This prevents text from overlapping with the icon
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              
              {/* ===== EYE ICON TOGGLE BUTTON ===== */}
              <button
                type="button" // Prevents form submission when clicked
                // Toggle showPassword state between true/false
                onClick={() => setShowPassword(!showPassword)}
                // Positioning classes:
                // absolute: Position relative to parent container
                // right-3: 12px from right edge
                // top-1/2: Positioned at 50% from top
                // -translate-y-1/2: Moves up by 50% of own height (perfect vertical centering)
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                tabIndex={-1} // Removes from keyboard tab navigation order
                disabled={loading} // Disable during form submission
              >
                {/* Conditional rendering based on showPassword state */}
                {showPassword ? (
                  // ===== OPEN EYE ICON (Password is VISIBLE) =====
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    {/* Eye outline */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    {/* Eye pupil */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  // ===== CLOSED EYE ICON WITH SLASH (Password is HIDDEN) =====
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    {/* Eye with diagonal slash lines indicating "hidden" */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ===== FORGOT PASSWORD LINK ===== */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-green-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* ===== SUBMIT BUTTON ===== */}
          <button
            type="submit"
            disabled={loading} // Disable button during submission
            className={`w-full py-3 rounded-lg text-white font-semibold 
                       bg-gradient-to-r from-green-500 to-green-600
                       hover:from-green-600 hover:to-green-700 transition-all
                       // Conditional styling based on loading state
                       ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
          >
            {/* Show different text based on loading state */}
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        {/* ===== SIGN UP LINK ===== */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-green-600 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}