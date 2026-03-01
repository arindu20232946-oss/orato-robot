import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flame, Trophy, Award, BookOpen } from "lucide-react";

interface StatCard {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: number;
  suffix?: string;
  label: string;
  subtext: string;
  subtextColor: string;
}

const stats: StatCard[] = [
  {
    icon: Flame,
    iconBg: "bg-orange-100",
    iconColor: "text-orato-orange",
    value: 15,
    label: "Day Streak",
    subtext: "+2 from last week",
    subtextColor: "text-orato-green",
  },
  {
    icon: Trophy,
    iconBg: "bg-yellow-100",
    iconColor: "text-orato-yellow",
    value: 2450,
    suffix: "",
    label: "Total Points",
    subtext: "Top 10% this month",
    subtextColor: "text-orato-green",
  },
  {
    icon: Award,
    iconBg: "bg-purple-100",
    iconColor: "text-orato-purple",
    value: 12,
    label: "Badges Earned",
    subtext: "3 more to next level",
    subtextColor: "text-gray-500",
  },
  {
    icon: BookOpen,
    iconBg: "bg-green-100",
    iconColor: "text-orato-green",
    value: 47,
    label: "Lessons Done",
    subtext: "+5 this week",
    subtextColor: "text-orato-green",
  },
];

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <span
      ref={numberRef}
      className="text-3xl font-bold text-gray-900 font-heading"
    >
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards entrance animation with flip effect
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            {
              rotateX: 90,
              opacity: 0,
              transformPerspective: 1000,
            },
            {
              rotateX: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.2 + index * 0.1,
              ease: "expo.out",
            },
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, {
      rotateX: -rotateX,
      rotateY: rotateY,
      translateZ: 20,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    setHoveredIndex(null);
  };

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      style={{ perspective: "1000px" }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={stat.label}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="bg-white rounded-2xl p-5 card-shadow transition-shadow duration-300 cursor-pointer relative overflow-hidden w-full"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: isHovered
                ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                : undefined,
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {/* Shimmer effect on hover */}
            {isHovered && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                  style={{
                    transform: "translateX(-100%)",
                    animation: "shimmer 1.5s infinite",
                  }}
                />
              </div>
            )}

            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
              >
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>

            <div className="mt-4 pl-1">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              <p className={`text-xs ${stat.subtextColor} mt-1 font-medium`}>
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
