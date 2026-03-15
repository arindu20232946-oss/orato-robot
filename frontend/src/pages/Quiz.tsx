import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuizCard from "../components/QuizCard";
import { quizService } from "../services/quizService";

const mockQuizzes: Quiz[] = [
  {
    id: "2",
    title: "Daily Vocabulary Quiz",
    category: "Vocabulary",
    difficulty: "Beginner",
    icon: "📖",
    iconBg: "bg-green-100",
    timeLimit: 8,
    points: 10,
    totalQuestions: 5,
  },
  {
    id: "5",
    title: "Intermediate Vocabulary Quiz",
    category: "Vocabulary",
    difficulty: "Intermediate",
    icon: "📚",
    iconBg: "bg-yellow-100",
    timeLimit: 12,
    points: 20,
    totalQuestions: 5,
  },
  {
    id: "6",
    title: "Advanced Vocabulary Quiz",
    category: "Vocabulary",
    difficulty: "Advanced",
    icon: "🎓",
    iconBg: "bg-indigo-100",
    timeLimit: 15,
    points: 30,
    totalQuestions: 5,
  },
];

interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  icon: string;
  iconBg: string;
  timeLimit: number;
  points: number;
  totalQuestions: number;
}

const categories = [
  "Vocabulary",
];

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Vocabulary");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam && categories.includes(filterParam)) {
      setFilter(filterParam);
    }
  }, [location]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await quizService.getAllQuizzes();
        let fetchedQuizzes: Quiz[] = res.data.quizzes;

        // If backend does not have Intermediate and Advanced Vocabulary quizzes, add them from mock
        const hasIntermediate = fetchedQuizzes.some(q => q.title === "Intermediate Vocabulary Quiz");
        const hasAdvanced = fetchedQuizzes.some(q => q.title === "Advanced Vocabulary Quiz");

        if (!hasIntermediate) {
          const interMock = mockQuizzes.find(q => q.id === "5");
          if (interMock) fetchedQuizzes.push(interMock);
        }
        if (!hasAdvanced) {
          const advMock = mockQuizzes.find(q => q.id === "6");
          if (advMock) fetchedQuizzes.push(advMock);
        }

        setQuizzes(fetchedQuizzes);
        // AFTER
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        setQuizzes(mockQuizzes); // ← back to mock fallback
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" },
        );
        if (cardsRef.current?.children) {
          gsap.fromTo(
            cardsRef.current.children,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              delay: 0.2,
              ease: "power2.out",
            },
          );
        }
      });
      return () => ctx.revert();
    }
  }, [loading]);

  const filteredQuizzes = quizzes.filter((q) => {
    return q.category === filter;
  });


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Loading quizzes...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">
              Vocabulary Quizzes
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-1">
            Test your knowledge and earn points!
          </p>

          {/* Category Filter */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === cat
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 card-shadow"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">😊</p>
            <p className="text-gray-500 text-lg">
              More quizzes coming soon!
            </p>
          </div>
        ) : (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} {...quiz} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
