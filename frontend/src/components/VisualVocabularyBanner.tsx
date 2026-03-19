import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Layers, ArrowRight, Eye, HelpCircle, Headphones, Smile, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import illustration from "../assets/VVM.png";

export default function VisualVocabularyBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(containerRef.current, {
      rotateX: -rotateX,
      rotateY: rotateY,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(containerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    setIsHovered(false);
  };

  const steps = [
    { icon: Eye, label: "See", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: HelpCircle, label: "Guess", color: "text-amber-500", bg: "bg-amber-50" },
    { icon: Headphones, label: "Listen", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: Smile, label: "Enjoy", color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-2xl cursor-pointer transition-all duration-500 h-full flex flex-col group border border-slate-100"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate("/visual-cards")}
    >
      {/* Dynamic Background Gradient */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-emerald-400 via-teal-300 to-blue-400`}
      />

      {/* Floating Sparkles Ornament */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-3xl group-hover:bg-emerald-200/50 transition-colors duration-500" />

      {/* Header Section */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> New Experience
          </span>
        </div>
        <h5 className="text-2xl font-bold text-slate-900 font-heading leading-tight">
          Visual Vocabulary <br />
          <span className="text-emerald-500 font-extrabold">Mastery</span>
        </h5>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-[90%]">
          Unlock your potential with brain-friendly visual association.
          Discover words through immersive 3D-style learning.
        </p>

        {/* Featured Illustration */}
        <div className="flex-1 flex items-center justify-center p-4 relative mb-8">
          <div className="absolute inset-0 bg-emerald-50/50 rounded-full scale-90 group-hover:scale-100 transition-transform duration-700 blur-2xl" />
          <img
            src={illustration}
            alt="Visual Vocabulary"
            className="w-full max-w-[200px] h-auto object-contain relative z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500"
          />
        </div>

        {/* Interactive Steps Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {steps.map(({ icon: Icon, label, color, bg }, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-2xl border border-slate-50 shadow-sm transition-all duration-300 bg-white group-hover:border-emerald-100 group-hover:shadow-md`}
              style={{
                transitionDelay: `${i * 40}ms`,
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              <div className={`p-2 rounded-lg ${bg} ${color} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <button
            className={`group/btn w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden ${isHovered
                ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200 -translate-y-1"
                : "bg-emerald-600 text-white"
              }`}
          >
            <span className="relative z-10">Start Exploring Now</span>
            <ArrowRight className={`w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1`} />

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
          </button>
          <p className="text-[10px] text-slate-400 text-center mt-3 font-medium">
            Over 1,000+ visual cards available
          </p>
        </div>
      </div>
    </div>
  );
}
