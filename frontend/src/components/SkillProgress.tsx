import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TrendingUp } from "lucide-react";
import { dashboardService } from "../services/dashboardService";

interface Skill {
  name: string;
  percentage: number;
  color: string;
  details?: {
    totalLevels?: number;
    completedLevels?: number;
    totalReading?: number;
    completedReading?: number;
    points?: number;
  };
}

interface FetchedSkill {
  name: string;
  percentage?: number;
  color?: string;
  details?: Record<string, unknown>;
}

const defaultSkills: Skill[] = [
  { name: "Vocabulary", percentage: 0, color: "#3B82F6" },
  { name: "Grammar", percentage: 0, color: "#8B5CF6" },
  { name: "Listening", percentage: 0, color: "#F97316" },
  { name: "Reading", percentage: 0, color: "#10B981" },
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
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const dashboardRes = await dashboardService.getSkills();

        if (dashboardRes.data?.skills?.length > 0) {
          let fetchedSkills = dashboardRes.data.skills.map(
            (s: FetchedSkill) => ({
              name: s.name,
              percentage: s.percentage || 0,
              color: s.color || "#3B82F6",
              details: s.details,
            }),
          );

          // Sort by highest completion (get completed levels from details)
          const getCompletedCount = (skill: any) => {
            if (skill.name === 'Grammar') return skill.details?.completedLevels || 0;
            if (skill.name === 'Reading') return skill.details?.completedReading || 0;
            if (skill.name === 'Listening') return skill.details?.completedListening || 0;
            if (skill.name === 'Vocabulary') return skill.details?.completedVocabulary || 0;
            return skill.percentage || 0;
          };

          fetchedSkills = fetchedSkills.sort((a: any, b: any) => {
            return getCompletedCount(b) - getCompletedCount(a);
          });

          setSkills(fetchedSkills);
        } else {
          setSkills(defaultSkills);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setSkills(defaultSkills);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        barsRef.current.forEach((bar, index) => {
          if (bar) {
            const skill = skills[index];
            gsap.fromTo(
              bar,
              { width: "0%" },
              {
                width: `${skill.percentage}%`,
                duration: 1,
                delay: 0.2 + index * 0.1,
                ease: "expo.out",
              },
            );
          }
        });
      });

      return () => ctx.revert();
    }
  }, [loading, skills]);

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-orato-green" />
        <h3 className="text-xl font-semibold text-gray-900 font-heading">
          Skill Progress
        </h3>
      </div>

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
                  {skill.name === 'Reading' 
                    ? `Level ${skill.details?.completedReading || 0}`
                    : skill.name === 'Grammar'
                    ? `Level ${skill.details?.completedLevels || 0}`
                    : skill.name === 'Vocabulary'
                    ? `Level ${skill.details?.completedVocabulary || 0}`
                    : skill.name === 'Listening'
                    ? `Level ${skill.details?.completedListening || 0}`
                    : <AnimatedPercentage value={skill.percentage} />
                  }
                </span>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  ref={(el) => {
                    barsRef.current[index] = el;
                  }}
                  className="h-full rounded-full transition-all duration-300 relative"
                  style={{
                    width: "0%",
                    backgroundColor: skill.color,
                    height: isHovered ? "10px" : "8px",
                    marginTop: isHovered ? "-1px" : "0",
                    boxShadow: isHovered ? `0 0 12px ${skill.color}50` : "none",
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
