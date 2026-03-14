const BASE_URL = `${window.config.backendUrl}/quiz`;

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

export const quizService = {
  getAllQuizzes: async () => {
    const res = await fetch(`${BASE_URL}/`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch quizzes');
    return res.json();
  },

  getQuizById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
  },

  submitQuiz: async (id: string, answers: number[], timeTaken: number) => {
    const res = await fetch(`${BASE_URL}/${id}/submit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ answers, timeTaken }),
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  getResults: async () => {
    const res = await fetch(`${BASE_URL}/results`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },

  getRecommended: async () => {
    const res = await fetch(`${BASE_URL}/recommended`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch recommended');
    return res.json();
  },
};