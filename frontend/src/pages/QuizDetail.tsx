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
import { quizService } from "../services/quizService";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer?: number;
}

interface QuizData {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  icon: string;
  points: number;
  timeLimit: number;
  questions: Question[];
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
  questions: ResultQuestion[];
}

// ── Fallback mock quizzes (used when backend is unavailable) ──────────────────
const mockQuizzes: Record<string, QuizData> = {
  "1": {
    id: "1",
    title: "Present Tense Quiz",
    category: "Grammar",
    difficulty: "Beginner",
    icon: "📝",
    points: 50,
    timeLimit: 10,
    questions: [
      {
        id: 0,
        text: "Which sentence uses the correct present tense?",
        options: [
          "She go to school",
          "She goes to school",
          "She going to school",
          "She gone to school",
        ],
        correctAnswer: 1,
      },
      {
        id: 1,
        text: 'Fill in the blank: "I ___ English every day."',
        options: ["studies", "study", "studied", "studying"],
        correctAnswer: 1,
      },
      {
        id: 2,
        text: 'Which is the correct negative form? "She ___ like coffee."',
        options: ["don't", "doesn't", "not", "isn't"],
        correctAnswer: 1,
      },
      {
        id: 3,
        text: "Which sentence is in the simple present tense?",
        options: [
          "He was reading a book",
          "He reads a book every night",
          "He will read a book",
          "He has read a book",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        text: 'Choose the correct form: "They ___ football every Sunday."',
        options: ["plays", "play", "played", "playing"],
        correctAnswer: 1,
      },
    ],
  },

  "2": {
    id: "2",
    title: "Daily Vocabulary Quiz",
    category: "Vocabulary",
    difficulty: "Beginner",
    icon: "📖",
    points: 10,
    timeLimit: 8,
    questions: [
      {
        id: 0,
        text: 'What does "grateful" mean?',
        options: ["Angry", "Thankful", "Sad", "Excited"],
        correctAnswer: 1,
      },
      {
        id: 1,
        text: 'Which word means "very tired"?',
        options: ["Energetic", "Happy", "Exhausted", "Confused"],
        correctAnswer: 2,
      },
      {
        id: 2,
        text: 'What is the opposite of "ancient"?',
        options: ["Old", "Modern", "Large", "Heavy"],
        correctAnswer: 1,
      },
      {
        id: 3,
        text: 'What does "enormous" mean?',
        options: ["Very small", "Very fast", "Very large", "Very loud"],
        correctAnswer: 2,
      },
      {
        id: 4,
        text: 'Which word means "to look at something carefully"?',
        options: ["Glance", "Examine", "Ignore", "Blink"],
        correctAnswer: 1,
      },
    ],
  },

  "3": {
    id: "3",
    title: "Intermediate Grammar Quiz",
    category: "Grammar",
    difficulty: "Intermediate",
    icon: "✍️",
    points: 25,
    timeLimit: 15,
    questions: [
      {
        id: 0,
        text: "Which sentence is in the past perfect tense?",
        options: [
          "She was eating when I called",
          "She had already eaten when I called",
          "She ate before I called",
          "She will have eaten by then",
        ],
        correctAnswer: 1,
      },
      {
        id: 1,
        text: 'Choose the correct first conditional: "If it rains, I ___ stay home."',
        options: ["would", "will", "had", "have"],
        correctAnswer: 1,
      },
      {
        id: 2,
        text: "Which sentence is grammatically correct?",
        options: [
          "The list of items are on the desk",
          "The list of items is on the desk",
          "The lists of item is on the desk",
          "The list of item are on the desk",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        text: "Which sentence is grammatically correct?",
        options: [
          "Him and me are going",
          "He and me are going",
          "Me and him are going",
          "He and I are going",
        ],
        correctAnswer: 3,
      },
      {
        id: 4,
        text: 'Choose the correct passive voice: "Someone broke the window."',
        options: [
          "The window is broken",
          "The window was broken",
          "The window has broken",
          "The window broke",
        ],
        correctAnswer: 1,
      },
    ],
  },

  "4": {
    id: "4",
    title: "Advanced Grammar Quiz",
    category: "Grammar",
    difficulty: "Advanced",
    icon: "🖋️",
    points: 40,
    timeLimit: 20,
    questions: [
      {
        id: 0,
        text: "Which sentence correctly uses advanced pronoun case?",
        options: [
          "Me and him went to the library",
          "He and I went to the library",
          "Him and I went to the library",
          "Me and he went to the library",
        ],
        correctAnswer: 1,
      },
      {
        id: 1,
        text: "Which sentence maintains proper parallel structure?",
        options: [
          "The committee valued honesty, punctuality, and hard work",
          "The committee valued honesty, being punctual, and that members worked hard",
          "The committee valued honesty, punctuality, and working hard",
          "The committee valued honesty, punctuality, and that members were hardworking",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        text: "Which sentence correctly uses a non-restrictive clause?",
        options: [
          "My brother who lives in Canada is visiting next week",
          "My brother, who lives in Canada, is visiting next week",
          "My brother, who lives in Canada is visiting next week",
          "My brother who lives in Canada, is visiting next week",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        text: "Which sentence correctly uses reported speech?",
        options: [
          "She said she will finish the report yesterday",
          "She said she would finish the report yesterday",
          "She said she will finish the report tomorrow",
          "She said she would finish the report tomorrow",
        ],
        correctAnswer: 3,
      },
      {
        id: 4,
        text: "Which sentence demonstrates correct article usage with abstract nouns?",
        options: [
          "She has a knowledge of French literature",
          "She has knowledge of French literature",
          "She has the knowledge of French literature",
          "She has an knowledge of French literature",
        ],
        correctAnswer: 1,
      },
    ],
  },

  "5": {
    id: "5",
    title: "Intermediate Vocabulary Quiz",
    category: "Vocabulary",
    difficulty: "Intermediate",
    icon: "📚",
    points: 20,
    timeLimit: 12,
    questions: [
      {
        id: 0,
        text: 'What is a synonym for "abundant"?',
        options: ["Scarce", "Plentiful", "Rare", "Few"],
        correctAnswer: 1,
      },
      {
        id: 1,
        text: 'What does "meticulous" mean?',
        options: ["Careless", "Sloppy", "Thorough", "Quick"],
        correctAnswer: 2,
      },
      {
        id: 2,
        text: 'Which word means "to make something less severe"?',
        options: ["Aggravate", "Worsen", "Mitigate", "Intensify"],
        correctAnswer: 2,
      },
      {
        id: 3,
        text: 'What is the opposite of "ambiguous"?',
        options: ["Clear", "Vague", "Uncertain", "Obscure"],
        correctAnswer: 0,
      },
      {
        id: 4,
        text: 'Which word means "a person who is deeply involved in reading"?',
        options: ["Bookworm", "Athlete", "Musician", "Artist"],
        correctAnswer: 0,
      },
    ],
  },

  "6": {
    id: "6",
    title: "Advanced Vocabulary Quiz",
    category: "Vocabulary",
    difficulty: "Advanced",
    icon: "🎓",
    points: 30,
    timeLimit: 15,
    questions: [
      {
        id: 0,
        text: 'What does the word "ephemeral" signify?',
        options: ["Eternal", "Short-lived", "Permanent", "Endless"],
        correctAnswer: 1,
      },
      {
        id: 1,
        text: 'Choose the correct synonym for "ubiquitous":',
        options: ["Rare", "Omnipresent", "Isolated", "Hidden"],
        correctAnswer: 1,
      },
      {
        id: 2,
        text: 'Which of the following is an antonym for "cacophony"?',
        options: ["Noise", "Clamor", "Harmony", "Uproar"],
        correctAnswer: 2,
      },
      {
        id: 3,
        text: 'What does "esoteric" mean?',
        options: ["Common", "Understood by few", "Public", "Obvious"],
        correctAnswer: 1,
      },
      {
        id: 4,
        text: 'Which word means "having a stubbornly uncooperative attitude"?',
        options: ["Compliant", "Docile", "Recalcitrant", "Amenable"],
        correctAnswer: 2,
      },
    ],
  },
};

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime] = useState(Date.now());
  const [usingMock, setUsingMock] = useState(false);

  const questionRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(id!);
        setQuiz(res.data.quiz);
        setUsingMock(false);
      } catch (error) {
        console.error("Using mock quiz:", error);
        const fallback = mockQuizzes[id!] || mockQuizzes["1"];
        setQuiz(fallback);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!loading && quiz && !quizComplete) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          questionRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
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
            },
          );
        }
      });
      return () => ctx.revert();
    }
  }, [loading, currentQuestion, quiz, quizComplete]);

  useEffect(() => {
    if (quizComplete && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" },
      );
    }
  }, [quizComplete]);

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const submitAnswers = async (newAnswers: number[]) => {
    if (!quiz) return;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    // ✅ If using mock data — calculate locally using correctAnswer
    if (usingMock) {
      let correctCount = 0;
      const reviewQuestions: ResultQuestion[] = quiz.questions.map((q, i) => {
        const isCorrect = newAnswers[i] === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer ?? 0,
          selectedAnswer: newAnswers[i],
          isCorrect,
          explanation: "",
        };
      });
      const score = Math.round((correctCount / quiz.questions.length) * 100);
      setResult({
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers: correctCount,
        pointsEarned: Math.round((score / 100) * quiz.points),
        questions: reviewQuestions,
      });
      setQuizComplete(true);
      return;
    }

    // ✅ If using real backend — submit to API
    try {
      const res = await quizService.submitQuiz(id!, newAnswers, timeTaken);
      setResult(res.data.result);
    } catch (error) {
      console.error("Submit failed:", error);
      setResult({
        score: 0,
        totalQuestions: quiz.questions.length,
        correctAnswers: 0,
        pointsEarned: 0,
        questions: [],
      });
    }
    setQuizComplete(true);
  };

  const handleNext = () => {
    if (selectedAnswer === null || !quiz) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
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

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setQuizComplete(false);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading quiz...</h2>
      </div>
    );
  }

  if (!quiz) return null;

  const progress = (currentQuestion / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];

  // ===== RESULTS SCREEN =====
  if (quizComplete && result) {
    const isPerfect = result.score === 100;
    const isGood = result.score >= 70;

    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar isLoggedIn={true} />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div
            ref={resultRef}
            className="bg-white rounded-2xl p-8 card-shadow w-full max-w-lg"
          >
            {/* Trophy */}
            <div
              className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${isPerfect ? "bg-yellow-100" : isGood ? "bg-green-100" : "bg-red-100"}`}
            >
              <Trophy
                className={`w-10 h-10 ${isPerfect ? "text-yellow-500" : isGood ? "text-green-500" : "text-red-500"}`}
              />
            </div>

            {/* Score */}
            <h2 className="text-4xl font-bold text-gray-900 font-heading text-center mb-1">
              {result.score}%
            </h2>
            <p className="text-gray-500 text-center mb-6">
              {isPerfect
                ? "🎉 Perfect Score!"
                : isGood
                  ? "👍 Great job!"
                  : "💪 Keep practicing!"}
            </p>

            {/* Stats */}
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

            {/* Question Review */}
            {result.questions && result.questions.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 font-heading">
                  Review
                </h3>
                <div className="space-y-3">
                  {result.questions.map((q, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${q.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
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
                onClick={() => navigate("/quiz")}
                className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                More Quizzes
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ===== QUIZ SCREEN =====
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar isLoggedIn={true} />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Back */}
          <button
            onClick={() => navigate("/quiz")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Quizzes</span>
          </button>

          {/* Quiz Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 font-heading">
                {quiz.title}
              </h1>
              <p className="text-sm text-gray-500">{quiz.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {currentQuestion + 1} / {quiz.questions.length}
              </p>
              <p className="text-xs text-gray-500">questions</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl p-8 card-shadow">
            <div ref={questionRef}>
              <p className="text-lg font-semibold text-gray-900 mb-6 font-heading leading-relaxed">
                {question.text}
              </p>
            </div>

            {/* Options */}
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
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${isSelected ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                selectedAnswer !== null
                  ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {currentQuestion < quiz.questions.length - 1
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

export default QuizDetail;
