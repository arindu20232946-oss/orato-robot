import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.png";

const AssessmentResults = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get all user data including assessment results
  const userData = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    fullName = "User",
    email = "",
    password = "",
    age = 0,
    nativeLanguage = "",
    targetLanguage = "English",
    learningGoal = "",
    dailyGoalMinutes = 15,
    assessmentScore = 0,
    totalQuestions = 10,
    percentage = 0,
    skillLevel = "beginner",
  } = userData;

  // Get skill level details
  const getSkillLevelInfo = () => {
    switch (skillLevel) {
      case "beginner":
        return {
          emoji: "🌱",
          title: "Beginner",
          color: "green",
          message: "You're just starting your journey! We'll build a strong foundation together.",
        };
      case "intermediate":
        return {
          emoji: "🚀",
          title: "Intermediate",
          color: "yellow",
          message: "Great progress! You have a solid foundation. Let's take you to the next level!",
        };
      case "advanced":
        return {
          emoji: "⭐",
          title: "Advanced",
          color: "red",
          message: "Impressive! You have strong language skills. Let's refine and master them!",
        };
      default:
        return {
          emoji: "🌱",
          title: "Beginner",
          color: "green",
          message: "Let's start your learning journey!",
        };
    }
  };

  const skillInfo = getSkillLevelInfo();

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Creating account with data:", {
        fullName,
        email,
        age,
        nativeLanguage,
        targetLanguage,
        learningGoal,
        dailyGoalMinutes,
        skillLevel,
        assessmentScore,
      });

      // Create account with all collected data
      const res = await API.post("/auth/signup", {
        fullName,
        email,
        password,
        age,
        nativeLanguage,
        targetLanguage,
        learningGoal,
        dailyGoalMinutes,
        skillLevel,
        assessmentScore,
        assessmentCompleted: true,
      });

      console.log("✅ Account created:", res.data);

      // Store token and user data
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Show success message briefly
      alert(" Account created successfully! Welcome to Orato!");

      // Navigate to dashboard
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error: any) {
      console.error("❌ Account creation error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to create account. Please try again.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Orato Logo" className="w-20 h-20 rounded-xl shadow-md" />
        </div>

        {/* Congratulations */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Assessment Complete!
          </h2>
          <p className="text-gray-600">
            Great job completing the assessment, {fullName}!
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {assessmentScore}/{totalQuestions}
            </div>
            <div className="text-lg text-gray-700 mb-4">
              {percentage}% Correct
            </div>

            {/* Skill Level Badge */}
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${skillInfo.color === 'green' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
              skillInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                'bg-red-100 text-red-700 border-2 border-red-300'
              }`}>
              <span className="text-2xl">{skillInfo.emoji}</span>
              <span>{skillInfo.title} Level</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <p className="text-center text-gray-700 text-lg">
            {skillInfo.message}
          </p>
        </div>

        {/* Learning Plan Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-center">
            Your Personalized Learning Plan
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500">Daily Goal</div>
              <div className="font-semibold text-gray-800">{dailyGoalMinutes} min/day</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Focus Area</div>
              <div className="font-semibold text-gray-800">{learningGoal}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Native Language</div>
              <div className="font-semibold text-gray-800">{nativeLanguage}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Learning</div>
              <div className="font-semibold text-gray-800">{targetLanguage}</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Create Account Button */}
        <button
          onClick={handleCreateAccount}
          disabled={loading}
          className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Your Account...
            </span>
          ) : (
            "Create Account & Start Learning →"
          )}
        </button>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Your account will be created with all your personalized settings!
        </p>
      </div>
    </div>
  );
};

export default AssessmentResults;