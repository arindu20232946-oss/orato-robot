import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Clock, Star, ChevronRight } from "lucide-react";

interface QuizCardProps {
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

const difficultyStyle: Record<string, string> = {
  Beginner: "text-green-600 bg-green-100",
  Intermediate: "text-yellow-600 bg-yellow-100",
  Advanced: "text-red-600 bg-red-100",
};

const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  category,
  difficulty,
  icon,
  iconBg,
  timeLimit,
  points,
  totalQuestions,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -4,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleClick = () => {
    gsap.to(cardRef.current, {
      scale: 0.97,
      duration: 0.1,
      ease: "power2.in",
      onComplete: () => {
        navigate(`/quiz/${id}`);
      },
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white rounded-2xl p-5 card-shadow cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyStyle[difficulty] || "text-gray-600 bg-gray-100"}`}
        >
          {difficulty}
        </span>
      </div>

      {/* Title & category */}
      <h3 className="font-semibold text-gray-900 text-sm mb-1 font-heading">
        {title}
      </h3>
      <p className="text-xs text-gray-500 mb-4">{category}</p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeLimit} min
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            {points} pts
          </span>
        </div>
        <span>{totalQuestions} questions</span>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-1 flex-1 bg-gray-100 rounded-full mr-3" />
        <ChevronRight className="w-4 h-4 text-green-500" />
      </div>
    </div>
  );
};

export default QuizCard;
