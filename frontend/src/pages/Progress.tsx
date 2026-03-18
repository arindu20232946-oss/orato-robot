import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from "../components/Navbar"; // Correct import statement
import Footer from '../components/Footer'; // Correct import statement for Footer
import jsPDF from 'jspdf';

import { 
  Calendar, 
  BookOpen, 
  Trophy, 
  Clock, 
  Star, 
  TrendingUp,
  Loader2 // Added for loading state
} from 'lucide-react';
import API from '../services/api';
import { dashboardService } from '../services/dashboardService';

// --- TYPES ---
interface Lesson {
  id: number;
  title: string;
  language: string;
  icon: string;
  date: string;
  time: string;
  score: number;
  duration: string;
  points: number;
}

interface StatItem {
  day: string;
  lessons: number;
  points: number;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: string;
}

interface DashboardStats {
  dayStreak?: number;
  totalPoints?: number;
  lessonsDone?: number;
  lessonsThisWeek?: number;
}

interface DashboardSkill {
  id?: string;
  name: string;
  percentage?: number;
  details?: Record<string, unknown>;
}

interface DashboardChallenge {
  id: string;
  title: string;
  current: number;
  target: number;
  points: number;
  type: string;
  completed: boolean;
}

interface DashboardAchievement {
  id: string;
  title: string;
  description: string;
}

interface UserProfile {
  fullName?: string;
  age?: number;
  nativeLanguage?: string;
  skillLevel?: string;
}

// --- SUB-COMPONENTS ---
const StatCard = ({ icon: Icon, value, label, colorClass, darkMode }: any) => (
  <div className={`rounded-2xl p-6 transition-all duration-300 border hover:scale-[1.02] ${
    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      </div>
    </div>
  </div>
);

interface Summary {
  totalLessons: number;
  avgScore: number;
  totalPoints: number;
  dayStreak: number;
  learningHours: number;
}

export default function Progress() {
  const [searchParams] = useSearchParams();
  const darkMode = false;
  // --- STATE MANAGEMENT ---
  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<StatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalLessons: 0, avgScore: 0, totalPoints: 0, dayStreak: 0, learningHours: 0 });
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [showDailyReport, setShowDailyReport] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const focus = searchParams.get('focus');
  const focusTask = searchParams.get('task');

  // --- DATA FETCHING LOGIC ---
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [progressRes, statsRes, skillsRes, challengesRes, achievementsRes, profileRes] = await Promise.allSettled([
          API.get('/progress'),
          dashboardService.getStats(),
          dashboardService.getSkills(),
          dashboardService.getChallenges(),
          dashboardService.getAchievements(),
          API.get('/users/profile'),
        ]);

        const progressData = progressRes.status === 'fulfilled' ? progressRes.value.data : {};
        const dashboardStats: DashboardStats =
          statsRes.status === 'fulfilled' ? (statsRes.value.data?.stats || {}) : {};
        const dashboardSkills: DashboardSkill[] =
          skillsRes.status === 'fulfilled' ? (skillsRes.value.data?.skills || []) : [];
        const dashboardChallenges: DashboardChallenge[] =
          challengesRes.status === 'fulfilled' ? (challengesRes.value.data?.challenges || []) : [];
        const dashboardAchievements: DashboardAchievement[] =
          achievementsRes.status === 'fulfilled' ? (achievementsRes.value.data?.achievements || []) : [];
        const profile: UserProfile =
          profileRes.status === 'fulfilled' ? (profileRes.value.data || {}) : {};

        let lessons: Lesson[] = progressData.lessons || [];
        let stats: StatItem[] = progressData.stats || [];
        let activities: Activity[] = progressData.activities || [];
        const apiSummary: Summary = progressData.summary || {
          totalLessons: 0,
          avgScore: 0,
          totalPoints: 0,
          dayStreak: 0,
          learningHours: 0,
        };

        if (lessons.length === 0 && dashboardSkills.length > 0) {
          lessons = dashboardSkills.map((skill, index) => {
            const score = skill.percentage || 0;
            return {
              id: index + 1,
              title: `${skill.name} Progress`,
              language: 'English',
              icon: skill.name === 'Grammar' ? '✍️' : skill.name === 'Reading' ? '📚' : skill.name === 'Listening' ? '🎧' : '📖',
              date: new Date().toISOString().split('T')[0],
              time: new Date().toTimeString().slice(0, 5),
              score,
              duration: '20 min',
              points: Math.round(score * 2),
            };
          });
        }

        if (stats.length === 0) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const today = new Date().getDay();
          const weekLessons = dashboardStats.lessonsThisWeek || dashboardChallenges.reduce((sum, c) => sum + (c.current || 0), 0);

          stats = dayNames.map((day, idx) => ({
            day,
            lessons: idx === today ? weekLessons : 0,
            points: idx === today ? (dashboardStats.totalPoints || 0) : 0,
          }));
        }

        if (activities.length === 0) {
          const achievementActivities: Activity[] = dashboardAchievements.map((a, index) => ({
            id: index + 1,
            type: 'achievement',
            title: `Earned "${a.title}" badge`,
            time: 'recently',
            icon: '🏆',
          }));

          const challengeActivities: Activity[] = dashboardChallenges.slice(0, 3).map((c, index) => ({
            id: index + 101,
            type: 'challenge',
            title: `${c.title} (${c.current}/${c.target})`,
            time: c.completed ? 'completed' : 'in progress',
            icon: c.completed ? '✅' : '🎯',
          }));

          activities = [...achievementActivities, ...challengeActivities];
        }

        const skillPercentages = dashboardSkills.map((s) => s.percentage || 0).filter((v) => v > 0);
        const derivedAvgScore = skillPercentages.length > 0
          ? Math.round(skillPercentages.reduce((sum, value) => sum + value, 0) / skillPercentages.length)
          : apiSummary.avgScore;

        const mergedSummary: Summary = {
          totalLessons: dashboardStats.lessonsDone || apiSummary.totalLessons || lessons.length,
          avgScore: derivedAvgScore || 0,
          totalPoints: dashboardStats.totalPoints || apiSummary.totalPoints || 0,
          dayStreak: dashboardStats.dayStreak || apiSummary.dayStreak || 0,
          learningHours: apiSummary.learningHours || Math.round((lessons.length * 20) / 60),
        };

        setCompletedLessons(lessons);
        setWeeklyStats(stats);
        setRecentActivities(activities);
        setSummary(mergedSummary);
        setUserProfile(profile);

      } catch (err: any) {
        console.error("Failed to fetch progress data:", err);
        setError("Unable to load progress data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, []); 

  const maxLessons = useMemo(() => {
    if (weeklyStats.length === 0) return 1;
    return Math.max(...weeklyStats.map((d) => d.lessons));
  }, [weeklyStats]);

  const dailyReport = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];
    const todayKey = dayNames[today.getDay()];

    const todayWeeklyStat = weeklyStats.find((s) => s.day === todayKey);
    const todayLessons = completedLessons.filter((l) => l.date === todayIso);

    const lessonsCount = todayLessons.length || todayWeeklyStat?.lessons || 0;
    const pointsToday = todayWeeklyStat?.points || todayLessons.reduce((sum, l) => sum + (l.points || 0), 0);
    const avgAccuracy = todayLessons.length > 0
      ? Math.round(todayLessons.reduce((sum, l) => sum + l.score, 0) / todayLessons.length)
      : summary.avgScore;

    const topLesson = [...completedLessons].sort((a, b) => b.score - a.score)[0];

    const milestonesToday = recentActivities.filter((a) => {
      const t = a.time.toLowerCase();
      return t.includes('just now') || t.includes('min') || t.includes('hour') || t.includes('today') || t.includes('recently') || t === 'completed';
    }).length;

    return {
      dateLabel: today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
      lessonsCount,
      pointsToday,
      avgAccuracy,
      milestonesToday,
      topLessonTitle: topLesson?.title || 'No lesson yet',
    };
  }, [weeklyStats, completedLessons, recentActivities, summary.avgScore]);

  useEffect(() => {
    if (!focus) return;
    const sectionMap: Record<string, string> = {
      lessons: 'progress-lessons',
      challenges: 'progress-weekly',
      skills: 'progress-weekly',
      milestones: 'progress-milestones',
    };
    const sectionId = sectionMap[focus];
    if (!sectionId) return;

    const timer = setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        section.classList.add('ring-2', 'ring-green-300', 'ring-offset-2');
        setTimeout(() => {
          section.classList.remove('ring-2', 'ring-green-300', 'ring-offset-2');
        }, 1800);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [focus, focusTask, isLoading]);

  const handleDownloadDailyReport = () => {
    const doc = new jsPDF();
    const generatedAt = new Date().toLocaleString();

    const userName = userProfile.fullName || 'N/A';
    const age = userProfile.age !== undefined ? String(userProfile.age) : 'N/A';
    const nativeLanguage = userProfile.nativeLanguage || 'N/A';
    const level = userProfile.skillLevel ? `${userProfile.skillLevel.charAt(0).toUpperCase()}${userProfile.skillLevel.slice(1)}` : 'N/A';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Orato - Daily Learning Report', 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Generated: ${generatedAt}`, 14, 26);
    doc.text(`Date: ${dailyReport.dateLabel}`, 14, 32);

    doc.setFont('helvetica', 'bold');
    doc.text('Student Profile', 14, 44);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${userName}`, 14, 52);
    doc.text(`Age: ${age}`, 14, 58);
    doc.text(`Native Language: ${nativeLanguage}`, 14, 64);
    doc.text(`Current Level: ${level}`, 14, 70);

    doc.setFont('helvetica', 'bold');
    doc.text('Daily Summary', 14, 82);
    doc.setFont('helvetica', 'normal');
    doc.text(`Lessons Today: ${dailyReport.lessonsCount}`, 14, 90);
    doc.text(`Points Today: ${dailyReport.pointsToday}`, 14, 96);
    doc.text(`Average Accuracy: ${dailyReport.avgAccuracy}%`, 14, 102);
    doc.text(`Milestones Today: ${dailyReport.milestonesToday}`, 14, 108);
    doc.text(`Top Lesson: ${dailyReport.topLessonTitle}`, 14, 114);

    doc.setFont('helvetica', 'bold');
    doc.text('Progress Snapshot', 14, 126);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Lessons: ${summary.totalLessons}`, 14, 134);
    doc.text(`Learning Hours: ${summary.learningHours}h`, 14, 140);
    doc.text(`Day Streak: ${summary.dayStreak} days`, 14, 146);
    doc.text(`Total Points: ${summary.totalPoints}`, 14, 152);

    const fileName = `daily-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Loading your progress...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center p-8 border rounded-2xl border-red-500/20 bg-red-500/10 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className={`flex-1 p-6 lg:p-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          
          <Navbar />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Your Progress</h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Keep it up! You've learned <span className="text-green-500 font-bold">12% more</span> this week.
            </p>
          </div>
          <button
            onClick={() => setShowDailyReport((prev) => !prev)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
          >
            <Calendar size={18} />
            {showDailyReport ? 'Hide Daily Report' : 'Daily Report'}
          </button>
        </div>

        {showDailyReport && (
          <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-green-900">Daily Report</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-green-700">{dailyReport.dateLabel}</span>
                <button
                  onClick={handleDownloadDailyReport}
                  className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-all"
                >
                  Download PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="rounded-xl bg-white p-3 border border-green-100">
                <p className="text-xs text-gray-500">Lessons Today</p>
                <p className="text-lg font-bold text-gray-900">{dailyReport.lessonsCount}</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-green-100">
                <p className="text-xs text-gray-500">Points Today</p>
                <p className="text-lg font-bold text-gray-900">{dailyReport.pointsToday}</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-green-100">
                <p className="text-xs text-gray-500">Avg Accuracy</p>
                <p className="text-lg font-bold text-gray-900">{dailyReport.avgAccuracy}%</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-green-100">
                <p className="text-xs text-gray-500">Milestones</p>
                <p className="text-lg font-bold text-gray-900">{dailyReport.milestonesToday}</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-green-100 sm:col-span-2 lg:col-span-1">
                <p className="text-xs text-gray-500">Top Lesson</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{dailyReport.topLessonTitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="rounded-xl bg-white p-3 border border-green-100">
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{userProfile.fullName || 'N/A'}</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-green-100">
                <p className="text-xs text-gray-500">Age</p>
                <p className="text-sm font-semibold text-gray-900">{userProfile.age ?? 'N/A'}</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-green-100">
                <p className="text-xs text-gray-500">Native Language</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{userProfile.nativeLanguage || 'N/A'}</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-green-100">
                <p className="text-xs text-gray-500">Current Level</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{userProfile.skillLevel || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            icon={BookOpen} value={summary.totalLessons.toString()} label="Total Lessons" 
            colorClass="bg-blue-500/10 text-blue-500" darkMode={darkMode} 
          />
          <StatCard 
            icon={Trophy} value={`${summary.avgScore}%`} label="Avg. Accuracy" 
            colorClass="bg-yellow-500/10 text-yellow-500" darkMode={darkMode} 
          />
          <StatCard 
            icon={Clock} value={`${summary.learningHours}h`} label="Learning Hours" 
            colorClass="bg-purple-500/10 text-purple-500" darkMode={darkMode} 
          />
          <StatCard 
            icon={TrendingUp} value={`${summary.dayStreak} days`} label="Day Streak" 
            colorClass="bg-green-500/10 text-green-500" darkMode={darkMode} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div id="progress-lessons" className={`rounded-3xl p-8 border transition-all duration-300 ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Recent Lessons</h2>
                <button className="text-sm font-semibold text-green-500 hover:underline">View All</button>
              </div>
              
              <div className="space-y-4">
                {completedLessons.length === 0 ? (
                  <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No lessons completed yet.</p>
                ) : (
                  completedLessons.map((lesson) => (
                    <div key={lesson.id} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all hover:bg-green-500/[0.02] ${
                      darkMode ? 'border-gray-700/50 hover:border-green-500/50' : 'border-gray-100 hover:border-green-300'
                    } ${focusTask && lesson.title === focusTask ? 'ring-2 ring-green-300 ring-offset-1' : ''}`}>
                      <div className="flex-1 flex items-center gap-4">
                        <div className="text-3xl bg-gray-100 dark:bg-gray-700 w-12 h-12 flex items-center justify-center rounded-xl">
                          {lesson.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{lesson.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={12}/> {lesson.duration}</span>
                            <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star size={12} fill="currentColor"/> {lesson.score}%</span>
                          </div>
                          <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                              style={{ width: `${Math.max(0, Math.min(100, lesson.score))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div id="progress-weekly" className={`rounded-3xl p-6 border transition-all duration-300 ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h2 className="text-lg font-bold mb-6">Weekly Activity</h2>
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyStats.map((stat) => (
                  <div key={stat.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className={`w-full rounded-lg transition-all duration-500 relative ${
                        darkMode ? 'bg-green-500/20 group-hover:bg-green-500' : 'bg-green-100 group-hover:bg-green-400'
                      }`}
                      style={{ height: `${(stat.lessons / maxLessons) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded">
                        {stat.lessons}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{stat.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="progress-milestones" className={`rounded-3xl p-6 border transition-all duration-300 ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h2 className="text-lg font-bold mb-6">Recent Milestones</h2>
              <div className="space-y-6">
                {recentActivities.length === 0 ? (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recent milestones.</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className={`flex items-center gap-4 ${focusTask && activity.title.includes(focusTask) ? 'rounded-lg ring-2 ring-green-300 p-2' : ''}`}>
                      <div className="text-2xl bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-none">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer outside main content */}
      <Footer />
    </div>
  );
}
