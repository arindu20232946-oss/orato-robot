import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // changed from /auth/forgot-password-otp to /otp/forgot-password
      const res = await API.post("/otp/forgot-password", { email });

      setMessage(res.data.message || "OTP sent to your email!");
      setOtpSent(true);
      setCooldown(60);
    } catch (err: any) {
      console.error("Forgot password error:", err);

      if (err.response) {
        setError(err.response.data.message || "Email not found!");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Orato Logo" className="w-20 h-20 rounded-xl shadow-md" />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Forgot Password?
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Enter your email to receive a 6-digit OTP code
        </p>

        {message && (
          <div className="mb-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg">
            <p className="font-semibold text-green-800">{message}</p>
            {cooldown > 0 && (
              <p className="text-xs text-green-600 mt-2">
                You can request a new OTP in {cooldown} seconds
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg">
            <p className="font-semibold text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || cooldown > 0}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
          />

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className={`w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 transition-all
              ${loading || cooldown > 0 ? "opacity-50 cursor-not-allowed" : "hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"}`}
          >
            {loading
              ? "Sending..."
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : otpSent
                  ? "Resend OTP"
                  : "Send OTP"}
          </button>
        </form>

        {otpSent && (
          <button
            onClick={handleProceed}
            className="w-full mt-4 py-3 rounded-lg text-green-600 font-semibold border-2 border-green-600 hover:bg-green-50 transition-all"
          >
            I have received the OTP →
          </button>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/signin"
            className="text-sm text-green-600 hover:underline"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;