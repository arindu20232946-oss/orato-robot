const BASE_URL = `${window.config.backendUrl}/grammar`;

const getToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (token) return token;

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

export const grammarService = {
  getLevels: async () => {
    const res = await fetch(`${BASE_URL}/levels`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch grammar levels');
    return res.json();
  },

  getQuestions: async (level: number) => {
    const res = await fetch(`${BASE_URL}/levels/${level}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch grammar questions');
    return res.json();
  },

  submitAnswers: async (level: number, answers: { questionId: string; selected: number }[]) => {
    const res = await fetch(`${BASE_URL}/levels/${level}/submit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Failed to submit grammar answers');
    return res.json();
  },

  getProgress: async () => {
    const res = await fetch(`${BASE_URL}/progress`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch grammar progress');
    return res.json();
  },
};
