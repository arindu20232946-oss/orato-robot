import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  User,
  Bell,
  Volume2,
  Shield,
  ChevronRight,
  Settings as SettingsIcon,
  Globe,
  Target
} from 'lucide-react';
import { gsap } from 'gsap';
import { FaArrowUp } from 'react-icons/fa';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguagePreferences from '../components/LanguagePreferences';
import Notifications from '../components/Notifications';
import AudioDisplay from '../components/AudioDisplay';
import PrivacyData from '../components/PrivacyData';
import AccountActions from '../components/AccountActions';
import LearningPreferences from '../components/LearningPreferences';

const API = `${window.config.backendUrl}/settings`;

type Category = 'language' | 'learning' | 'notifications' | 'audio' | 'privacy' | 'account';

const Settings: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [notifSettings, setNotifSettings] = useState<any>(undefined);
  const [audioSettings, setAudioSettings] = useState<any>(undefined);
  const [nativeLanguage, setNativeLanguage] = useState<string>('Sinhala');
  const [proficiency, setProficiency] = useState<string>('beginner');
  const [dailyGoal, setDailyGoal] = useState<number>(15);
  const [activeCategory, setActiveCategory] = useState<Category>('language');

  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (haloRef.current) {
        gsap.to(haloRef.current, { x: e.clientX, y: e.clientY, duration: 1.8, ease: "power3.out" });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      const id = user.id || user._id;
      setUserId(id);
      axios.get(`${API}/${id}`).then(res => {
        if (res.data.settings) {
          setNotifSettings(res.data.settings.notifications);
          setAudioSettings(res.data.settings.audioDisplay);
          setNativeLanguage(res.data.settings.nativeLanguage || 'Sinhala');
          setProficiency(res.data.settings.skillLevel || 'beginner');
          setDailyGoal(res.data.settings.dailyGoalMinutes || 15);
        }
      }).catch(err => console.error('Failed to load settings:', err));
    }

    if (bgRef.current) {
      const blobs = bgRef.current.querySelectorAll('.blob');
      blobs.forEach((blob, i) => {
        gsap.to(blob, { x: 'random(-100, 100)', y: 'random(-100, 100)', duration: `random(10, 20)`, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 2 });
      });
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }
  }, [activeCategory]);

  const handleNotifChange = async (newSettings: any) => {
    setNotifSettings(newSettings);
    const stored = localStorage.getItem('user');
    const id = stored ? JSON.parse(stored).id || JSON.parse(stored)._id : userId;
    if (id) {
      try { await axios.put(`${API}/${id}`, { notifications: newSettings }); }
      catch (err) { console.error('Failed to save notification settings:', err); }
    }
  };

  const handleAudioChange = async (newSettings: any) => {
    setAudioSettings(newSettings);
    const stored = localStorage.getItem('user');
    const id = stored ? JSON.parse(stored).id || JSON.parse(stored)._id : userId;
    if (id) {
      try { await axios.put(`${API}/${id}`, { audioDisplay: newSettings }); }
      catch (err) { console.error('Failed to save audio settings:', err); }
    }
  };

  const handleSyncChange = async (field: string, value: any) => {
    const stored = localStorage.getItem('user');
    const id = stored ? JSON.parse(stored).id || JSON.parse(stored)._id : userId;
    if (id) {
      try {
        const update: any = {};
        if (field === 'nativeLanguage') { setNativeLanguage(value); update.nativeLanguage = value; }
        else if (field === 'skillLevel') { setProficiency(value); update.skillLevel = value; }
        else if (field === 'dailyGoalMinutes') { setDailyGoal(value); update.dailyGoalMinutes = value; }
        await axios.put(`${API}/${id}`, update);
      } catch (err) { console.error(`Failed to sync ${field}:`, err); }
    }
  };

  const categories = [
    { id: 'language', label: 'Language Preferences', icon: Globe },
    { id: 'learning', label: 'Learning Goals', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'audio', label: 'Audio & Display', icon: Volume2 },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
    { id: 'account', label: 'Account Actions', icon: User },
  ] as const;

  const renderContent = () => {
    switch (activeCategory) {
      case 'language': return <LanguagePreferences nativeLanguage={nativeLanguage} proficiency={proficiency} onNativeChange={(val) => handleSyncChange('nativeLanguage', val)} onProficiencyChange={(val) => handleSyncChange('skillLevel', val)} />;
      case 'learning': return <LearningPreferences dailyGoal={dailyGoal} onChange={(val) => handleSyncChange('dailyGoalMinutes', val)} />;
      case 'notifications': return <Notifications settings={notifSettings} onChange={handleNotifChange} />;
      case 'audio': return <AudioDisplay settings={audioSettings} onChange={handleAudioChange} />;
      case 'privacy': return <PrivacyData userId={userId ?? undefined} />;
      case 'account': return <AccountActions userId={userId ?? undefined} />;
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-green-50">
      <div ref={bgRef} className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/60 rounded-full blur-[120px] blob"></div>
        <div className="absolute bottom-[5%] right-[-10%] w-[45%] h-[45%] bg-green-50/50 rounded-full blur-[140px] blob"></div>
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-teal-50/40 rounded-full blur-[110px] blob"></div>
        <div ref={haloRef} className="absolute top-0 left-0 w-[800px] h-[800px] bg-emerald-400/10 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply pointer-events-none"></div>
        <svg className="absolute inset-0 w-full h-full opacity-[0.05] contrast-150 brightness-100">
          <filter id="premium-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#premium-noise)" />
        </svg>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-emerald-100">
              <SettingsIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-emerald-950 tracking-tight">Settings</h1>
          </div>
          <p className="text-emerald-700/80 text-lg font-medium ml-1">Configure your Orato environment and privacy</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <nav className="space-y-2 sticky top-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] transition-all duration-500 group ${
                    activeCategory === cat.id
                      ? 'bg-white/80 backdrop-blur-md shadow-[0_20px_40px_rgba(16,185,129,0.08)] border border-emerald-100/50 text-emerald-950 scale-[1.03]'
                      : 'text-emerald-800/60 hover:bg-white/40 hover:text-emerald-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${activeCategory === cat.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'}`}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">{cat.label}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${activeCategory === cat.id ? 'bg-emerald-50 text-emerald-600 opacity-100' : 'opacity-0 translate-x-4'}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-grow">
            <div ref={contentRef} className="content-pane max-w-3xl">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const Setting: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <div className="page-wrapper min-h-screen">
      <Navbar isLoggedIn={true} />
      <main className="page-container relative">
        <Settings />
      </main>
      <Footer />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 rounded-2xl bg-[#1a9e6b] text-white shadow-[0_10px_30px_rgba(26,158,107,0.3)] hover:bg-[#14c781] hover:scale-110 active:scale-95 transition-all duration-500 z-50 group ${
          showScrollTop ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible'
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

export default Setting;