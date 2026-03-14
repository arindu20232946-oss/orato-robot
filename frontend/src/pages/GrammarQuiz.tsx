import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { grammarService } from "../services/grammarService";

interface Question {
  id: number;
  questionId: string;
  text: string;
  options: string[];
}

interface ResultQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  pointsEarned: number;
  levelPassed: boolean;
  questions: ResultQuestion[];
}

const GrammarQuiz: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{questionId: string, selected: number}[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questionRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await grammarService.getQuestions(Number(level));
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [level]);

  useEffect(() => {
    if (!loading && questions.length > 0 && !result) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          questionRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
        if (optionsRef.current?.children) {
          gsap.fromTo(
            optionsRef.current.children,
            { x: 30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.08,
              delay: 0.2,
              ease: "power2.out",
            }
          );
        }
      });
      return () => ctx.revert();
    }
  }, [loading, currentQuestion, questions, result]);

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, [result]);

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const currentQ = questions[currentQuestion];
    const newAnswers = [...answers, { questionId: currentQ.questionId, selected: selectedAnswer }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      gsap.to(questionRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
        },
      });
    } else {
      submitAnswers(newAnswers);
    }
  };

  const submitAnswers = async (finalAnswers: { questionId: string; selected: number }[]) => {
    setSubmitting(true);
    try {
      const res = await grammarService.submitAnswers(Number(level), finalAnswers);
      setResult(res.data.result);
    } catch (err) {
      console.error("Submit failed:", err);
      setError("Failed to submit answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers([] as {questionId: string, selected: number}[]);
    setSelectedAnswer(null);
    setResult(null);
    setError("");
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading quiz...</h2>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar isLoggedIn={true} />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
            >
              Back to Grammar
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  if (result) {
    const isPassed = result.levelPassed;
    const isPerfect = result.score === 100;

    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar isLoggedIn={true} />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div
            ref={resultRef}
            className="bg-white rounded-2xl p-8 card-shadow w-full max-w-lg"
          >
            {isPassed && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
                  <Trophy className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">
                  Level Complete!
                </h2>
                <p className="text-green-600 font-medium mt-1">
                  Next level unlocked
                </p>
              </div>
            )}

            {!isPassed && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 mb-4">
                  <RotateCcw className="w-12 h-12 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">
                  Keep Practicing!
                </h2>
                <p className="text-gray-500 mt-1">
                  You need 60% to pass
                </p>
              </div>
            )}

            <h3 className="text-4xl font-bold text-gray-900 font-heading text-center mb-1">
              {result.score}%
            </h3>
            <p className="text-gray-500 text-center mb-6">
              {isPerfect
                ? "Perfect Score!"
                : isPassed
                  ? "Great job!"
                  : "Don't give up!"}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {result.correctAnswers}
                </p>
                <p className="text-xs text-gray-500 mt-1">Correct</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {result.totalQuestions - result.correctAnswers}
                </p>
                <p className="text-xs text-gray-500 mt-1">Wrong</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  +{result.pointsEarned}
                </p>
                <p className="text-xs text-gray-500 mt-1">Points</p>
              </div>
            </div>

            {result.questions && result.questions.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 font-heading">
                  Review
                </h3>
                <div className="space-y-3">
                  {result.questions.map((q, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        q.isCorrect
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {q.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {q.text}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Your answer:{" "}
                            <span
                              className={
                                q.isCorrect
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {q.options[q.selectedAnswer]}
                            </span>
                          </p>
                          {!q.isCorrect && (
                            <p className="text-xs text-gray-600">
                              Correct:{" "}
                              <span className="text-green-600 font-medium">
                                {q.options[q.correctAnswer]}
                              </span>
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {!isPassed && (
                <button
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              )}
              <button
                onClick={handleComplete}
                className={`flex-1 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors ${
                  !isPassed ? "" : "w-full"
                }`}
              >
                {isPassed ? "Continue →" : "Back to Grammar"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar isLoggedIn={true} />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Grammar</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 font-heading">
                Grammar Quiz
              </h1>
              <p className="text-sm text-gray-500">Level {level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {currentQuestion + 1} / {questions.length}
              </p>
              <p className="text-xs text-gray-500">questions</p>
            </div>
          </div>

          <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-white rounded-2xl p-8 card-shadow">
            <div ref={questionRef}>
              <p className="text-lg font-semibold text-gray-900 mb-6 font-heading leading-relaxed">
                {question.text}
              </p>
            </div>

            <div ref={optionsRef} className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium cursor-pointer ${
                      isSelected
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${
                        isSelected
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswer === null || submitting}
              className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                selectedAnswer !== null && !submitting
                  ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting
                ? "Submitting..."
                : currentQuestion < questions.length - 1
                  ? "Next Question →"
                  : "Submit Quiz ✓"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GrammarQuiz;
