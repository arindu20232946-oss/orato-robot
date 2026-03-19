import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import VisualVocabularyBanner from "../components/VisualVocabularyBanner";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mainRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const handleLessonClick = (_lessonId: string | number, lessonTitle: string) => {
    if (lessonTitle === 'Listening Lab' || lessonTitle === 'English Pronunciation Basics') {
      navigate('/listening');
    } else if (lessonTitle === 'Reading Tasks') {
      navigate('/reading');
    } else if (lessonTitle === 'Grammar Practice' || lessonTitle === 'Take a Quiz') {
      navigate('/grammar');
    } else if (lessonTitle === 'English Vocabulary: Daily Life') {
      navigate('/quiz?filter=Vocabulary');
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-gray-900">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="page-wrapper flex flex-col min-h-screen bg-green-50 text-gray-900">
      <Navbar />

      <div className="flex flex-1">
        <main ref={mainRef} className="page-container flex-1 p-6 lg:p-8">
          <Header />

          <div className="mb-6">
            <StatsGrid />
          </div>

          <div className="mb-6">
            <ContinueLearning onLessonClick={handleLessonClick} />
          </div>

          <div className="space-y-6">
            {/* Middle Row Grid: Daily Challenges & Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="md:col-span-2 lg:col-span-2">
                <DailyChallenges />
              </div>

              {/* Right Column */}
              <div className="md:col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <SkillProgress />
                <RecentAchievements />
              </div>
            </div>

            {/* Speaking Coach & Vocabulary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-2">
                <SpeakingCoach />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <VisualVocabularyBanner />
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