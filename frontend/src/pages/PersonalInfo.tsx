import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = location.state || {};

  const [age, setAge] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [learningGoal, setLearningGoal] = useState("");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);

  // ===== DYNAMIC PROGRESS CALCULATION =====
  // Step 2 progress: 33% to 66% (of total 3 steps)
  const stepProgress = useMemo(() => {
    let filledFields = 0;
    if (age.trim().length > 0) filledFields++;
    if (nativeLanguage.length > 0) filledFields++;
    if (targetLanguage.length > 0) filledFields++; // Always has default
    if (learningGoal.length > 0) filledFields++;
    if (dailyGoalMinutes > 0) filledFields++; // Always has default
    
    const stepCompletion = (filledFields / 5) * 100; // 0-100% within this step
    return 33 + (stepCompletion / 100) * 33; // 33% + (0-33%) = 33-66%
  }, [age, nativeLanguage, targetLanguage, learningGoal, dailyGoalMinutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!age || parseInt(age) < 5 || parseInt(age) > 100) {
      alert("Please enter a valid age (5-100)");
      return;
    }

    if (!nativeLanguage) {
      alert("Please select your native language");
      return;
    }

    if (!learningGoal) {
      alert("Please select your learning goal");
      return;
    }

    const completeData = {
      ...userData,
      age: parseInt(age),
      nativeLanguage,
      targetLanguage,
      learningGoal,
      dailyGoalMinutes,
    };

    console.log("Personal info collected:", completeData);
    navigate("/assessment", { state: completeData });
  };

  const handleBack = () => {
    navigate("/signup", { state: userData });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Orato Logo" className="w-20 h-20 rounded-xl shadow-md" />
        </div>

        {/* Progress Bar - DYNAMIC */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-green-600">{Math.round(stepProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${stepProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Step 2 of 3</span>
            <span className="text-xs text-green-600 font-semibold">Personal Information</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Help us personalize your learning experience
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your age? <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="5"
              max="100"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Native Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your native language? <span className="text-red-500">*</span>
            </label>
            <select
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select your native language</option>
              <option value="Sinhala">Sinhala (සිංහල)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Chinese">Chinese (中文)</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="Korean">Korean (한국어)</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="Portuguese">Portuguese (Português)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Target Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which language do you want to learn? <span className="text-red-500">*</span>
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Currently, English is our primary course. More languages coming soon!
            </p>
          </div>

          {/* Learning Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Why do you want to learn {targetLanguage}? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLearningGoal("travel")}
                className={`p-4 border-2 rounded-xl transition-all ${learningGoal === "travel"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-green-300"
                  }`}
              >
                <div className="text-3xl mb-2">✈️</div>
                <div className="font-semibold">Travel</div>
                <div className="text-xs text-gray-500">Explore the world</div>
              </button>

              <button
                type="button"
                onClick={() => setLearningGoal("career")}
                className={`p-4 border-2 rounded-xl transition-all ${
                  learningGoal === "career"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-3xl mb-2">💼</div>
                <div className="font-semibold">Career</div>
                <div className="text-xs text-gray-500">Professional growth</div>
              </button>

              <button
                type="button"
                onClick={() => setLearningGoal("education")}
                className={`p-4 border-2 rounded-xl transition-all ${
                  learningGoal === "education"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-3xl mb-2">📚</div>
                <div className="font-semibold">Education</div>
                <div className="text-xs text-gray-500">Studies & exams</div>
              </button>

              <button
                type="button"
                onClick={() => setLearningGoal("personal")}
                className={`p-4 border-2 rounded-xl transition-all ${
                  learningGoal === "personal"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-semibold">Personal</div>
                <div className="text-xs text-gray-500">Self-improvement</div>
              </button>
            </div>
          </div>

          {/* Daily Learning Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's your daily learning goal? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setDailyGoalMinutes(5)}
                className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all ${dailyGoalMinutes === 5
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">☕</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">5-10 min/day</div>
                    <div className="text-sm text-gray-500">Casual - Just the basics</div>
                  </div>
                </div>
                {dailyGoalMinutes === 5 && (
                  <div className="text-green-600">✓</div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDailyGoalMinutes(15)}
                className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all ${dailyGoalMinutes === 15
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎯</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">15-20 min/day</div>
                    <div className="text-sm text-gray-500">Regular - Steady progress</div>
                  </div>
                </div>
                {dailyGoalMinutes === 15 && (
                  <div className="text-green-600">✓</div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDailyGoalMinutes(30)}
                className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all ${dailyGoalMinutes === 30
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔥</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">30+ min/day</div>
                    <div className="text-sm text-gray-500">Serious - Fast track</div>
                  </div>
                </div>
                {dailyGoalMinutes === 30 && (
                  <div className="text-green-600">✓</div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDailyGoalMinutes(60)}
                className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all ${dailyGoalMinutes === 60
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">⚡</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">1+ hour/day</div>
                    <div className="text-sm text-gray-500">Intense - Maximum results</div>
                  </div>
                </div>
                {dailyGoalMinutes === 60 && (
                  <div className="text-green-600">✓</div>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              Next: Assessment →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;