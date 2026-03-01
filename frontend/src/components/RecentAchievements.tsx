import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Star, Flame, Zap, BookOpen } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const achievements: Achievement[] = [
  {
    id: 1,
    title: 'Week Warrior',
    description: '7-day streak',
    icon: Flame,
    iconColor: 'text-orato-orange',
    iconBg: 'bg-orange-100',
  },
  {
    id: 2,
    title: 'Quick Learner',
    description: 'Completed 10 lessons',
    icon: Zap,
    iconColor: 'text-orato-yellow',
    iconBg: 'bg-yellow-100',
  },
  {
    id: 3,
    title: 'Vocabulary Master',
    description: 'Learned 100 words',
    icon: BookOpen,
    iconBg: 'bg-green-100',
    iconColor: 'text-orato-green',
  },
];

export default function RecentAchievements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards bounce in
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { scale: 0.3, opacity: 0 },
            { 
              scale: 1, 
              opacity: 1, 
              duration: 0.6, 
              delay: 0.1 + index * 0.1,
              ease: 'elastic.out(1, 0.5)',
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    gsap.to(card, {
      rotateX: -rotateX,
      rotateY: rotateY,
      translateZ: 30,
      duration: 0.3,
      ease: 'power2.out',
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
      ease: 'power2.out',
    });
    setHoveredId(null);
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-2xl p-6 card-shadow"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Star className="w-5 h-5 text-orato-green fill-orato-green" />
        <h3 className="text-lg font-semibold text-gray-900 font-heading">
          Recent Achievements
        </h3>
      </div>

      {/* Achievements List */}
      <div className="space-y-3" style={{ perspective: '500px' }}>
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const isHovered = hoveredId === achievement.id;
          
          return (
            <div
              key={achievement.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 cursor-pointer transition-all duration-300"
              style={{ 
                transformStyle: 'preserve-3d',
                backgroundColor: isHovered ? '#E8F5E9' : '#F9FAFB',
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => setHoveredId(achievement.id)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* Icon */}
              <div 
                className={`w-12 h-12 rounded-xl ${achievement.iconBg} flex items-center justify-center flex-shrink-0 transition-all duration-300`}
                style={{
                  transform: isHovered ? 'translateZ(30px) scale(1.1)' : 'translateZ(0)',
                }}
              >
                <Icon className={`w-6 h-6 ${achievement.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {achievement.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
