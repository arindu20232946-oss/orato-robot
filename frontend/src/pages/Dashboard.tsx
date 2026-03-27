import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { gsap } from "gsap";
import { Loader2 } from "lucide-react";
import { FaArrowUp } from 'react-icons/fa';

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
  const [showScrollTop, setShowScrollTop] = useState(false);
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
        { opacity: 0, y: 10 }, // ✅ reduced from 20 → 10
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power2.out" },
      );
    }
  }, [isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <main 
          ref={mainRef} 
          className="page-container flex-1 p-6 lg:p-8 overflow-hidden" //  added
        >
          <Header />

          <div className="mb-6">
            <StatsGrid />
          </div>

          <div className="mb-6">
            <ContinueLearning onLessonClick={handleLessonClick} />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-2">
                <DailyChallenges />
              </div>
              <div className="md:col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <SkillProgress />
                <RecentAchievements />
              </div>
            </div>
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

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-4 p-4 rounded-2xl bg-[#1a9e6b] text-white shadow-[0_10px_30px_rgba(26,158,107,0.3)] hover:bg-[#14c781] hover:scale-110 active:scale-95 transition-all duration-500 z-50 group ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'hidden' //  fixed
        }`}
        aria-label="Scroll to top"
      >
        <span className="flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
          <FaArrowUp size={20} />
        </span>
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0d2d2a] text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Back to Top
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-[#0d2d2a]"></span>
        </span>
      </button>
    </div>
  );
};

export default Dashboard;