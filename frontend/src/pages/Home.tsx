import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import welcomeBg from "../assets/welcome-bg.jpg";
import ctaImage from "../assets/cta-image.jpg";
import { FaArrowUp } from 'react-icons/fa';
import goalImg from "../assets/person_learning.jpg";
import progressImg from "../assets/progress.jpg";
import learnFastImg from "../assets/learn_fast.jpg";

const Home = () => {
  const isLandingPageMode = window.config.isLandingPageMode;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

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
    <div className="min-h-screen">

      {!isLandingPageMode && <Navbar isLoggedIn={isLoggedIn} />}

      {/* Welcome Section with Background Image */}
      <div
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: `url(${welcomeBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/50 to-black/70"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="ml-auto max-w-2xl">
            <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
              <h1 className="text-5xl md:text-5xl font-black mb-4 leading-tight animate-fade-in-up">
                <span className="text-white drop-shadow-2xl block">Welcome to</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 animate-gradient drop-shadow-2xl block">
                  ORATO
                </span>
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-green-400 to-emerald-400 mb-6 rounded-full animate-pulse"></div>
              <p className="text-lg md:text-xl text-white mb-8 animate-fade-in-up animation-delay-200 drop-shadow-lg leading-relaxed">
                Unlock smarter, personalized lessons designed to accelerate your fluency.
              </p>
              {!isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
                  <Link to="/signup" className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-base hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-105 text-center no-underline">
                    Get Started Free
                  </Link>
                  <Link to="/signin" className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 rounded-xl font-bold text-base hover:bg-white/30 transition-all shadow-2xl hover:scale-105 text-center no-underline">
                    Sign In
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
                  <Link to="/dashboard" className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-base hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-105 text-center no-underline">
                    Let's Begin →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-semibold mb-6">
              AI-Powered Language Learning
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Unlock Your Language Potential with
              <br />
              <span className="text-green-600">Personalized AI</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Learn at your own pace with AI-powered lessons tailored to your skill level.
              From beginner to advanced, Orato adapts to your learning journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-green-600">40+</div>
                <div className="text-gray-600 mt-2">Active Learners</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-green-600">5+</div>
                <div className="text-gray-600 mt-2">Languages</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-green-600">8.9</div>
                <div className="text-gray-600 mt-2">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gradient-to-b from-white via-green-50/30 to-white py-20 overflow-hidden">
        <div className="absolute top-20 right-0 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Orato?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a smarter way to learn languages with cutting-edge AI technology
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-green-300">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <img src={goalImg} alt="Personalized Learning" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">Personalized Learning</h3>
                <p className="text-gray-600 leading-relaxed mb-4">AI adapts to your skill level and learning pace. Every lesson is tailored just for you.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Adaptive AI</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Custom Path</span>
                </div>
              </div>
            </div>
            <div className="group relative">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-gray-300">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <img src={progressImg} alt="Track Progress" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">Track Progress</h3>
                <p className="text-gray-600 leading-relaxed mb-4">Visual dashboards show your improvement. Stay motivated with daily goals and streaks.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-green-700 text-xs font-semibold rounded-full">Analytics</span>
                  <span className="px-3 py-1 bg-gray-100 text-green-700 text-xs font-semibold rounded-full">Streak Tracking</span>
                </div>
              </div>
            </div>
            <div className="group relative">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-emerald-300">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <img src={learnFastImg} alt="Learn Faster" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-800 transition-colors">Learn Faster</h3>
                <p className="text-gray-600 leading-relaxed mb-4">Bite-sized lessons fit your schedule. Learn in just 5-15 minutes a day.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">Micro-lessons</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">Flexible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How ORATO Works Section */}
      <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How Orato Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Start learning English confidently in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: 1, color: 'from-green-500 to-green-600', bg: 'text-green-100', title: 'Create Account', desc: 'Sign up free and take a quick test to determine your English level.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /> },
              { num: 2, color: 'from-emerald-500 to-emerald-600', bg: 'text-emerald-100', title: 'Set Your Goals', desc: 'Tell us your objectives and we create a personalized learning path.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              { num: 3, color: 'from-gray-500 to-gray-600', bg: 'text-gray-100', title: 'Learn Daily', desc: 'Practice with AI tutors, interactive lessons, and real-world scenarios.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
              { num: 4, color: 'from-teal-500 to-teal-600', bg: 'text-teal-100', title: 'Track Progress', desc: 'Monitor improvement with detailed analytics and celebrate milestones.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
            ].map((step) => (
              <div key={step.num} className="group relative">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="mb-6 flex justify-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{step.icon}</svg>
                    </div>
                  </div>
                  <div className={`text-8xl font-black ${step.bg} absolute top-4 right-4 -z-10`}>{step.num}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">See The Difference</div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Why Orato Beats Traditional Learning</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Modern problems need modern solutions. Here's why smart learners choose Orato.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-block px-6 py-2 bg-green-600 text-white rounded-full font-bold text-lg mb-4">Orato Way</div>
                </div>
                <div className="space-y-4">
                  {['AI Personalization', '15 Minutes Daily', 'Instant Feedback', 'Affordable', 'Fluent in 3 Months'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{item}</h3>
                        <p className="text-sm text-gray-600">{['Adapts to your learning style in real-time', 'Learn anytime, anywhere at your pace', 'AI corrects mistakes immediately', '$9.99/month - Less than a coffee!', 'Proven track record of success'][i]}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <div className="text-4xl font-black text-green-600">5x Faster</div>
                  <p className="text-gray-600 font-medium mt-2">than traditional methods</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 border-2 border-gray-300 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-block px-6 py-2 bg-gray-600 text-white rounded-full font-bold text-lg mb-4">Traditional Way</div>
                </div>
                <div className="space-y-4">
                  {['One-Size-Fits-All', 'Fixed Schedule', 'Delayed Feedback', 'Expensive', '12+ Months'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm opacity-60">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{item}</h3>
                        <p className="text-sm text-gray-600">{['Same lessons for everyone', 'Must attend classes at set times', 'Wait days for corrections', '$50-200 per hour with tutors', 'Long, slow progress'][i]}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <div className="text-4xl font-black text-gray-600">Old School</div>
                  <p className="text-gray-500 font-medium mt-2">outdated methods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Stop Dreaming.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Start Speaking.</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">Your journey to fluency starts today. Join thousands who transformed their lives with just 15 minutes a day.</p>
              <div className="space-y-3 mb-6">
                {['14-day free trial - No credit card required', 'Cancel anytime - No questions asked', 'Start speaking in weeks, not years'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              {!isLoggedIn ? (
                <Link to="/signup" className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-105 no-underline">
                  <span>Begin Your Journey</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              ) : (
                <Link to="/dashboard" className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-105 no-underline">
                  <span>Continue Learning</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              )}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-gray-900"></div>
                </div>
                <div className="text-gray-400 text-xs"><span className="text-white font-bold">10+ people</span> joined this week</div>
              </div>
            </div>
            <div className="relative lg:block hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent rounded-3xl blur-2xl"></div>
              <img src={ctaImage} alt="Happy language learner" className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </div>

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

      {!isLandingPageMode && <Footer />}
    </div>
  );
};

export default Home;