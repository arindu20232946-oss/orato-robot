import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { gsap } from "gsap";
import { Loader2 } from "lucide-react";

import Header from "../components/Header";
import StatsGrid from "../components/StatsGrid";
import ContinueLearning from "../components/ContinueLearning";
import DailyChallenges from "../components/DailyChallenges";
import SkillProgress from "../components/SkillProgress";
import RecentAchievements from "../components/RecentAchievements";
import SpeakingCoach from "../components/SpeakingCoach";
import VisualCards from "../components/VisualCards";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mainRef = useRef<HTMLElement>(null);
  const visualCardsRef = useRef<HTMLDivElement>(null);

  const handleLessonClick = (_lessonId: number, lessonTitle: string) => {
    if (lessonTitle === 'Visual Vocabulary Cards' && visualCardsRef.current) {
      visualCardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight the VisualCards section briefly
      visualCardsRef.current.classList.add('ring-2', 'ring-green-400', 'ring-offset-2');
      setTimeout(() => {
        visualCardsRef.current?.classList.remove('ring-2', 'ring-green-400', 'ring-offset-2');
      }, 2000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && mainRef.current) {
      gsap.config({ nullTargetWarn: false });
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power2.out" },
      );
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-gray-900">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="page-wrapper flex flex-col min-h-screen bg-[#F8FAFC] text-gray-900">
      <Navbar />

      <div className="flex flex-1">
        <main ref={mainRef} className="page-container flex-1 p-6 lg:p-8">
          <Header />

          <div className="mb-6">
            <StatsGrid />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <ContinueLearning onLessonClick={handleLessonClick} />
              <DailyChallenges />

              {/* ✅ Speaking Coach Feature */}
              <SpeakingCoach />
            </div>

            <div className="space-y-6">
              <SkillProgress />
              <RecentAchievements />
              <div ref={visualCardsRef} className="transition-all duration-300 rounded-2xl">
                <VisualCards />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
