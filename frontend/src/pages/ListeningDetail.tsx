import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Loader2,
  Headphones,
  Lock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { listeningService } from "../services/listeningService";
import axios from "axios";

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface ListeningData {
  id: string;
  level: string;
  order: number;
  type: string;
  title: string;
  content: string;
  questions: Question[];
}

interface ResultQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

interface SubmitResult {
  correctAnswers: number;
  totalQuestions: number;
  allCorrect: boolean;
  questions: ResultQuestion[];
  attempts: number;
  nextItemUnlocked: boolean;
}

const ListeningDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<ListeningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [audioSettings, setAudioSettings] = useState<any>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Fetch content
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await listeningService.getById(id!);
        setItem(res.data.item);
      } catch (err: any) {
        if (err.message.includes("403") || err.message.includes("locked")) {
          setError("locked");
        } else {
          setError("Failed to load content. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItem();

    // Cleanup speech on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [id]);

  // Fetch audio settings mapping
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const userId = user.id || user._id;
        axios.get(`${window.config.backendUrl}/settings/${userId}`)
          .then(res => {
            if (res.data.settings?.audioDisplay) {
              setAudioSettings(res.data.settings.audioDisplay);
            }
          })
          .catch(err => console.error("Could not fetch user settings", err));
      } catch(e) {}
    }
  }, []);

  // Animate content on load
  useEffect(() => {
    if (!loading && item && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [loading, item]);

  // Animate quiz on show
  useEffect(() => {
    if (showQuiz && quizRef.current) {
      gsap.fromTo(
        quizRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [showQuiz, currentQuestion]);

  // Animate result
  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, [result]);

  // ===== Text-to-Speech =====
  const handlePlay = () => {
    if (!item) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Hide quiz if user chooses to listen again
    setShowQuiz(false);

    const utterance = new SpeechSynthesisUtterance(item.content);
    utterance.lang = "en-US";
    
    // Default rate based on level
    let rate = item.level === "beginner" ? 0.8 : item.level === "intermediate" ? 0.9 : 1.0;
    
    // Override if settings exists
    if (audioSettings?.playbackSpeed) {
      const match = audioSettings.playbackSpeed.match(/(\d+\.\d+|\d+)/);
      if (match) {
        rate = parseFloat(match[1]);
      }
    }
    utterance.rate = rate;
    
    // Apply volume
    if (audioSettings?.volume !== undefined) {
      utterance.volume = audioSettings.volume / 100;
    }

    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
      setHasListened(true);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // ===== Quiz Logic =====
  const handleStartQuiz = () => {
    setShowQuiz(true);
    // Reset only if we have a previous result (starting a new attempt)
    if (result) {
      setCurrentQuestion(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setResult(null);
    }
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null || !item) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < 2) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      submitAnswers(newAnswers);
    }
  };

  const submitAnswers = async (finalAnswers: number[]) => {
    if (!item) return;
    setSubmitting(true);

    try {
      const res = await listeningService.submit(id!, finalAnswers);
      setResult(res.data.result);
    } catch (err) {
      console.error("Submit failed:", err);
      setResult({
        correctAnswers: 0,
        totalQuestions: 3,
        allCorrect: false,
        questions: [],
        attempts: 0,
        nextItemUnlocked: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setResult(null);
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
      </div>
    );
  }

  // ===== LOCKED ERROR =====
  if (error === "locked") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Content Locked</h2>
          <p className="text-gray-500 mb-6">
            Complete the previous item with all 3 correct answers to unlock this one.
          </p>
          <button
            onClick={() => navigate("/listening")}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
          >
            Back to Listening
          </button>
        </div>
      </div>
    );
  }

  // ===== ERROR =====
  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/listening")}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
          >
            Back to Listening
          </button>
        </div>
      </div>
    );
  }

  // ===== RESULT SCREEN =====
  if (result) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar isLoggedIn={true} />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div ref={resultRef} className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg">
            {/* Trophy */}
            <div
              className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                result.allCorrect ? "bg-green-100" : "bg-orange-100"
              }`}
            >
              {result.allCorrect ? (
                <Trophy className="w-10 h-10 text-green-500" />
              ) : (
                <RotateCcw className="w-10 h-10 text-orange-500" />
              )}
            </div>

            {/* Score */}
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-1">
              {result.correctAnswers}/3 Correct
            </h2>
            <p className="text-gray-500 text-center mb-6">
              {result.allCorrect
                ? "🎉 Perfect! Next item unlocked!"
                : "💪 Not quite. Answer all 3 correctly to unlock the next item."}
            </p>

            {/* Next unlock badge */}
            {result.nextItemUnlocked && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
                <p className="text-green-700 font-semibold text-sm">
                  🔓 Next item is now unlocked!
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{result.correctAnswers}</p>
                <p className="text-xs text-gray-500 mt-1">Correct</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{result.attempts}</p>
                <p className="text-xs text-gray-500 mt-1">Attempts</p>
              </div>
            </div>

            {/* Question Review */}
            {result.questions && result.questions.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Review</h3>
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
                          <p className="text-sm font-medium text-gray-900">{q.text}</p>
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => navigate("/listening")}
                className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                {result.allCorrect ? "Next Item →" : "Back to List"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const question = item.questions[currentQuestion];

  // ===== MAIN CONTENT =====
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar isLoggedIn={true} />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/listening")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Listening</span>
        </button>

        <div ref={contentRef}>
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-green-500/10">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{item.title}</h1>
                <p className="text-xs text-gray-500 capitalize">
                  Level {item.order} • {item.level}
                </p>
              </div>
            </div>
          </div>

          {/* Listening Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4 text-center">
              🎧 Listen Carefully
            </h2>

            {/* Visual indicator for listening */}
            <div className="flex justify-center py-8 mb-4">
              <div className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-green-50 transition-all duration-500 ${isPlaying ? 'scale-110 shadow-lg shadow-green-100' : ''}`}>
                <Headphones className={`w-12 h-12 transition-colors duration-500 ${isPlaying ? 'text-green-600' : 'text-green-300'}`} />
                {isPlaying && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping opacity-75"></div>
                    <div className="absolute -inset-2 rounded-full border border-green-100 animate-pulse opacity-50"></div>
                  </>
                )}
              </div>
            </div>

            {/* Play button */}
            <button
              onClick={handlePlay}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm transition-all duration-300 tracking-wide ${
                isPlaying
                  ? "bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100"
                  : "gradient-primary text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 active:scale-[0.98]"
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-5 h-5" />
                  Stop Playing
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  {hasListened ? "Play Again 🔊" : "Listen to Paragraph 🔊"}
                </>
              )}
            </button>

            {/* Speed note */}
            <p className="text-xs text-gray-400 text-center mt-2">
              Speed: {item.level === "beginner" ? "Slow" : item.level === "intermediate" ? "Normal" : "Fast"} •
              You can listen multiple times
            </p>
          </div>

          {/* Start Quiz or Quiz Section */}
          {!showQuiz ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                📝 Comprehension Quiz
              </h2>
              <p className="text-gray-600 text-sm mb-5">
                Answer all 3 questions correctly to unlock the next item.
                Listen to the paragraph first, then start the quiz.
              </p>
              <button
                onClick={handleStartQuiz}
                disabled={!hasListened || isPlaying}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                  !hasListened || isPlaying
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {!hasListened 
                  ? "Listen fully to unlock quiz" 
                  : isPlaying 
                  ? "Playing... (Wait for finish)" 
                  : (currentQuestion > 0 || answers.length > 0) 
                  ? "Resume Quiz →" 
                  : "Start Quiz →"}
              </button>
              {!hasListened && (
                <p className="text-[10px] text-amber-600 mt-2 text-center font-medium">
                  ⚠️ The quiz will be available after the paragraph has been heard in full.
                </p>
              )}
            </div>
          ) : (
            <div ref={quizRef} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* Quiz header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Question {currentQuestion + 1} of 3
                </h2>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-1.5 rounded-full transition-all ${
                        i <= currentQuestion ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              <p className="text-lg font-semibold text-gray-900 mb-5 leading-relaxed">
                {question.text}
              </p>

              {/* Options */}
              <div className="space-y-3">
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

              {/* Next / Submit button */}
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
                  : currentQuestion < 2
                    ? "Next Question →"
                    : "Submit Answers ✓"}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListeningDetail;
