// frontend/src/services/dashboardService.ts

const BASE_URL = 'http://localhost:5002/api/dashboard';

const getToken = (): string | null => {
  // Try to get token from localStorage
  const token = localStorage.getItem('token');
  if (token) return token;

  // Some apps store the full auth object
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.token || parsed.accessToken || parsed.tokens?.accessToken || null;
    } catch {
      return null;
    }
  }

  return null;
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const dashboardService = {
  // Get all dashboard data in one call
  getDashboard: async () => {
    const res = await fetch(`${BASE_URL}/`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  },

  // Get stats only
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Get continue learning lessons
  getContinueLearning: async () => {
    const res = await fetch(`${BASE_URL}/continue-learning`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch lessons');
    return res.json();
  },

  // Get daily challenges
  getChallenges: async () => {
    const res = await fetch(`${BASE_URL}/challenges`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch challenges');
    return res.json();
  },

  // Get skill progress
  getSkills: async () => {
    const res = await fetch(`${BASE_URL}/skills`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  // Get recent achievements
  getAchievements: async () => {
    const res = await fetch(`${BASE_URL}/achievements`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch achievements');
    return res.json();
  },
};