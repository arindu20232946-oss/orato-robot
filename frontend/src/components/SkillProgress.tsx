import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TrendingUp } from 'lucide-react';

interface Skill {
  name: string;
  percentage: number;
  color: string;
}

const skills: Skill[] = [
  { name: 'Vocabulary', percentage: 78, color: '#3B82F6' },
  { name: 'Grammar', percentage: 62, color: '#8B5CF6' },
  { name: 'Speaking', percentage: 45, color: '#1DB954' },
  { name: 'Listening', percentage: 70, color: '#F97316' },
  { name: 'Writing', percentage: 55, color: '#EC4899' },
];

function AnimatedPercentage({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
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
    }, 300);
    
    return () => clearTimeout(timer);
  }, [value]);

  return <span>{displayValue}%</span>;
}

export default function SkillProgress() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bars grow from left
      barsRef.current.forEach((bar, index) => {
        if (bar) {
          const skill = skills[index];
          gsap.fromTo(
            bar,
            { width: '0%' },
            { 
              width: `${skill.percentage}%`, 
              duration: 1, 
              delay: 0.2 + index * 0.1,
              ease: 'expo.out',
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-2xl p-6 card-shadow"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-orato-green" />
        <h3 className="text-lg font-semibold text-gray-900 font-heading">
          Skill Progress
        </h3>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {skills.map((skill, index) => {
          const isHovered = hoveredSkill === skill.name;
          
          return (
            <div 
              key={skill.name}
              className="group"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">
                  {skill.name}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  <AnimatedPercentage value={skill.percentage} />
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  ref={(el) => { barsRef.current[index] = el; }}
                  className="h-full rounded-full transition-all duration-300 relative"
                  style={{ 
                    width: '0%',
                    backgroundColor: skill.color,
                    height: isHovered ? '10px' : '8px',
                    marginTop: isHovered ? '-1px' : '0',
                    boxShadow: isHovered ? `0 0 12px ${skill.color}50` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
