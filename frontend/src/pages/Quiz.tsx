import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2, PenTool, Headphones, BookMarked } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  path: string;
  available: boolean;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  const categories: QuizCategory[] = [
    {
      id: "grammar",
      name: "Grammar",
      description: "Master grammar rules and patterns",
      icon: <PenTool className="w-8 h-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      path: "/grammar",
      available: true,
    },
    {
      id: "vocabulary",
      name: "Vocabulary",
      description: "Expand your word knowledge",
      icon: <BookMarked className="w-8 h-8" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      path: "/visual-cards",
      available: false,
    },
    {
      id: "listening",
      name: "Listening",
      description: "Improve your listening skills",
      icon: <Headphones className="w-8 h-8" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      path: "/listening",
      available: true,
    },
  ];

  useEffect(() => {
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
  }, []);

  const handleCategoryClick = (category: QuizCategory) => {
    if (category.available) {
      navigate(category.path);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
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
              Quiz Center
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-1">
            Select a category to test your knowledge!
          </p>
        </div>

        {/* Category Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              disabled={!category.available}
              className={`relative p-6 rounded-2xl card-shadow transition-all duration-300 hover:scale-[1.02] ${
                category.available
                  ? "bg-white cursor-pointer hover:shadow-lg"
                  : "bg-gray-100 cursor-not-allowed opacity-60"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-xl ${category.bgColor} ${category.color} flex items-center justify-center mb-4`}
              >
                {category.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {category.description}
              </p>

              {/* Status Badge */}
              {!category.available && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}

              {category.available && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                    Available
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
