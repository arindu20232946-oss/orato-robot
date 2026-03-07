import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContinueLearning() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quizBtnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container entrance
      gsap.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out" },
      );

      // Quiz button bounce in
      gsap.fromTo(
        quizBtnRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          ease: "elastic.out(1, 0.5)",
        },
      );
    });

    return () => ctx.revert();
  }, []);

  const handleQuizClick = () => {
    gsap.to(quizBtnRef.current, {
      scale: 0.95,
      duration: 0.1,
      onComplete: () => {
        navigate("/quiz");
      },
    });
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900 font-heading">
          Continue Learning
        </h3>
        <button className="text-sm text-orato-green font-medium hover:underline flex items-center gap-1 transition-all duration-300 hover:gap-2">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quiz Button */}
      <button
        ref={quizBtnRef}
        onClick={handleQuizClick}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-300 group border border-green-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 text-sm">Take a Quiz</p>
            <p className="text-xs text-gray-500">
              Test your knowledge & earn points
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-green-500 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
