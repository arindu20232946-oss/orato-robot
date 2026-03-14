const BASE_URL = `${window.config.backendUrl}/listening`;

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

export const listeningService = {
  // Get all items for a level
  getAll: async (level?: string) => {
    const query = level ? `?level=${level}` : '';
    const res = await fetch(`${BASE_URL}/${query}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch listening content');
    return res.json();
  },

  // Get single item with questions
  getById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch listening item');
    return res.json();
  },

  // Submit answers
  submit: async (id: string, answers: number[]) => {
    const res = await fetch(`${BASE_URL}/${id}/submit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Failed to submit answers');
    return res.json();
  },

  // Get progress summary
  getProgress: async () => {
    const res = await fetch(`${BASE_URL}/progress`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },
};
