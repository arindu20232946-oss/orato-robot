import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const API = "http://localhost:5002/api/assessment";

interface Option {
  id: string;
  text: string;
}

interface Question {
  _id: string;
  questionId: number;
  category: string;
  difficulty: string;
  questionText: string;
  options: Option[];
  points: number;
}

const Assessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data from previous steps
  const userData = location.state || {};
  
  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/questions`);
      
      if (res.data.success && res.data.questions) {
        setQuestions(res.data.questions);
        console.log("✅ Loaded", res.data.questions.length, "questions");
      } else {
        setError("Failed to load questions");
      }
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setAnswers({
      ...answers,
      [questionId]: answerId,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredCount = questions.length - Object.keys(answers).length;
    
    if (unansweredCount > 0) {
      if (!window.confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    try {
      setLoading(true);

      // Format answers for submission
      const formattedAnswers = questions.map((q) => ({
        questionId: q.questionId,
        selectedAnswer: answers[q.questionId] || "",
      }));

      // Submit assessment
      const assessmentRes = await axios.post(`${API}/submit`, {
        answers: formattedAnswers,
      });

      console.log("Assessment result:", assessmentRes.data);

      // Combine all user data
      const completeUserData = {
        ...userData,
        assessmentScore: assessmentRes.data.score,
        totalQuestions: assessmentRes.data.totalQuestions,
        percentage: assessmentRes.data.percentage,
        skillLevel: assessmentRes.data.skillLevel,
      };

      // Navigate to results page
      navigate("/assessment-results", { state: completeUserData });

    } catch (error: any) {
      console.error("Error submitting assessment:", error);
      setError("Failed to submit assessment. Please try again.");
      setLoading(false);
    }
  };

  // Loading state
  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Questions</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchQuestions}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  // ===== FIXED PROGRESS CALCULATION =====
  // Calculate progress based on ANSWERED questions, not current question index
  const answeredCount = Object.keys(answers).length;
  const stepProgress = (answeredCount / questions.length) * 100; // 0-100%
  const overallProgress = 66 + (stepProgress / 100) * 34; // 66% + (0-34%) = 66-100%
  
  const selectedAnswer = answers[currentQuestion?.questionId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-green-600">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Step 3 of 3</span>
            <span className="text-xs text-green-600 font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Orato Logo" className="w-16 h-16 rounded-xl shadow-md" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Quick Assessment
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Help us understand your current level
          </p>

          {/* Question */}
          {currentQuestion && (
            <div>
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQuestion.difficulty === 'beginner'
                    ? 'bg-green-100 text-green-700'
                    : currentQuestion.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQuestion.questionText}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(currentQuestion.questionId, option.id)}
                    className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                      selectedAnswer === option.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option.id
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === option.id && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-semibold text-gray-700 mr-2">{option.id}</span>
                      <span className="text-gray-800">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ← Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Complete Assessment →"}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Next →
                  </button>
                )}
              </div>

              {/* Question Progress Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-green-600 w-8'
                        : answers[questions[index].questionId]
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;