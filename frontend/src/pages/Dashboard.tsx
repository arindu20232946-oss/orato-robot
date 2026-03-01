import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { gsap } from 'gsap';
import { Loader2 } from 'lucide-react';

import Header from '../components/Header';
import StatsGrid from '../components/StatsGrid';
import ContinueLearning from '../components/ContinueLearning';
import DailyChallenges from '../components/DailyChallenges';
import SkillProgress from '../components/SkillProgress';
import RecentAchievements from '../components/RecentAchievements';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mainRef = useRef<HTMLElement>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Run GSAP only after loading is done and content is mounted
  useEffect(() => {
    if (!isLoading && mainRef.current) {
      gsap.config({ nullTargetWarn: false });
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' }
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

      {/* Use existing Navbar component */}
      <Navbar />

      <div className="flex flex-1">

        
        {/* Main Content */}
        <main
          ref={mainRef}
          className="page-container flex-1 p-6 lg:p-8"
        >
          <Header />

          <div className="mb-6">
            <StatsGrid />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">
              <ContinueLearning />
              <DailyChallenges />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <SkillProgress />
              <RecentAchievements />
            </div>

          </div>
        </main>

      </div>

      {/* Use existing Footer component */}
      <Footer />

    </div>
  );
};

export default Dashboard;