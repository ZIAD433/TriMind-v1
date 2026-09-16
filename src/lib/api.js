const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_BASE = configuredApiUrl || (import.meta.env.DEV ? "http://localhost:3001/api" : "");

async function request(path, options = {}) {
  if (!API_BASE) {
    throw new Error("Backend URL is not configured. Set VITE_API_URL and redeploy the frontend.");
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  } catch {
    throw new Error("Unable to reach the backend. Check VITE_API_URL, Railway service status, and CORS settings.");
  }
  let payload = {};
  try { payload = await response.json(); } catch { /* empty response */ }
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

export const api = {
  me: () => request("/auth/me"),
  register: (input) => request("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  login: (input) => request("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  savePreferences: (input) => request("/me/preferences", { method: "PUT", body: JSON.stringify(input) }),
  progress: () => request("/progress"),
  completeLesson: (lessonId) => request("/progress/lesson", { method: "POST", body: JSON.stringify({ lessonId }) }),
  submitQuiz: (quizId, answers, score) => request("/progress/quiz", { method: "POST", body: JSON.stringify({ quizId, answers, score }) }),
  mentor: (message, conversation = []) => request("/ai/mentor", { method: "POST", body: JSON.stringify({ message, conversation }) }),
};
