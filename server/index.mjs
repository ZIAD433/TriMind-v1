import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "trimind.json");
const port = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === "production";
const cookieName = "trimind_session";
const sessionDays = 14;
const quizAnswerKeys = {
  "investment-quiz": [1, 1, 1],
  "portfolio-quiz": [1, 1],
  "business-quiz": [1, 0, 1],
  "marketing-quiz": [0, 1, 1],
  "startup-quiz": [1, 1, 1],
  "pitch-quiz": [1, 0, 1],
};

const initialState = () => ({
  users: [],
  sessions: [],
  passwordResets: [],
  progress: [],
  quizAttempts: [],
  activities: [],
});

function loadState() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    const state = initialState();
    fs.writeFileSync(dataFile, JSON.stringify(state, null, 2));
    return state;
  }
  try {
    return { ...initialState(), ...JSON.parse(fs.readFileSync(dataFile, "utf8")) };
  } catch {
    throw new Error("Unable to read the application data file");
  }
}

let state = loadState();
function saveState() {
  const temporary = `${dataFile}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(state, null, 2));
  fs.renameSync(temporary, dataFile);
}

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => ({
  salt,
  hash: crypto.scryptSync(password, salt, 64).toString("hex"),
});
const checkPassword = (password, user) => crypto.timingSafeEqual(
  Buffer.from(hashPassword(password, user.passwordSalt).hash, "hex"),
  Buffer.from(user.passwordHash, "hex"),
);
const token = () => crypto.randomBytes(32).toString("hex");
const now = () => new Date().toISOString();
const json = (res, status, body, headers = {}) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers });
  res.end(JSON.stringify(body));
};
const publicUser = (user) => ({ id: user.id, email: user.email, name: user.name, preferences: user.preferences, onboardingComplete: user.onboardingComplete });
const parseCookies = (header = "") => Object.fromEntries(header.split(";").map((part) => part.trim().split("=")).filter(([key, value]) => key && value).map(([key, ...value]) => [key, decodeURIComponent(value.join("="))]));
const setSessionCookie = (res, value, maxAge = sessionDays * 86400) => {
  const flags = [`${cookieName}=${encodeURIComponent(value)}`, `Max-Age=${maxAge}`, "Path=/", "HttpOnly", "SameSite=Lax"];
  if (isProduction) flags.push("Secure");
  res.setHeader("Set-Cookie", flags.join("; "));
};
const clearSessionCookie = (res) => res.setHeader("Set-Cookie", `${cookieName}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${isProduction ? "; Secure" : ""}`);

function authUser(req) {
  const sessionId = parseCookies(req.headers.cookie)[cookieName];
  const session = state.sessions.find((item) => item.id === sessionId && new Date(item.expiresAt) > new Date());
  return session ? state.users.find((user) => user.id === session.userId) : null;
}
async function body(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new Error("Request too large");
  }
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { throw new Error("Invalid JSON"); }
}
function validateCredentials(input) {
  if (typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email)) throw new Error("Enter a valid email address");
  if (typeof input.password !== "string" || input.password.length < 8) throw new Error("Password must be at least 8 characters");
}

const route = (method, pattern, handler) => ({ method, pattern, handler });
const routes = [
  route("GET", /^\/api\/health$/, (_req, res) => json(res, 200, { ok: true })),
  route("POST", /^\/api\/auth\/(register|login)$/, async (req, res, match) => {
    const input = await body(req); validateCredentials(input);
    const email = input.email.trim().toLowerCase();
    let user = state.users.find((item) => item.email === email);
    if (match[1] === "register") {
      if (user) return json(res, 409, { error: "An account with these credentials may already exist" });
      const password = hashPassword(input.password);
      user = { id: crypto.randomUUID(), email, name: String(input.name || email.split("@")[0]).trim().slice(0, 80), passwordSalt: password.salt, passwordHash: password.hash, preferences: {}, onboardingComplete: false, createdAt: now() };
      state.users.push(user);
    } else if (!user || !checkPassword(input.password, user)) {
      return json(res, 401, { error: "Invalid email or password" });
    }
    const session = { id: token(), userId: user.id, createdAt: now(), expiresAt: new Date(Date.now() + sessionDays * 86400_000).toISOString() };
    state.sessions = state.sessions.filter((item) => item.userId !== user.id && new Date(item.expiresAt) > new Date());
    state.sessions.push(session); saveState(); setSessionCookie(res, session.id);
    return json(res, 200, { user: publicUser(user) });
  }),
  route("POST", /^\/api\/auth\/logout$/, (req, res) => { const sessionId = parseCookies(req.headers.cookie)[cookieName]; state.sessions = state.sessions.filter((item) => item.id !== sessionId); saveState(); clearSessionCookie(res); json(res, 200, { ok: true }); }),
  route("GET", /^\/api\/auth\/me$/, (req, res) => { const user = authUser(req); json(res, 200, { user: user ? publicUser(user) : null }); }),
  route("PUT", /^\/api\/me\/preferences$/, async (req, res) => { const user = authUser(req); if (!user) return json(res, 401, { error: "Authentication required" }); const input = await body(req); user.preferences = { ...user.preferences, ...input.preferences }; user.onboardingComplete = input.onboardingComplete === true || user.onboardingComplete; if (typeof input.name === "string" && input.name.trim()) user.name = input.name.trim().slice(0, 80); saveState(); json(res, 200, { user: publicUser(user) }); }),
  route("GET", /^\/api\/progress$/, (req, res) => { const user = authUser(req); if (!user) return json(res, 401, { error: "Authentication required" }); const progress = state.progress.filter((item) => item.userId === user.id); const attempts = state.quizAttempts.filter((item) => item.userId === user.id); const activities = state.activities.filter((item) => item.userId === user.id); json(res, 200, { completedLessons: Object.fromEntries(progress.map((item) => [item.lessonId, true])), quizScores: Object.fromEntries(attempts.map((item) => [item.quizId, item.score])), activities }); }),
  route("POST", /^\/api\/progress\/lesson$/, async (req, res) => { const user = authUser(req); if (!user) return json(res, 401, { error: "Authentication required" }); const input = await body(req); if (typeof input.lessonId !== "string" || input.lessonId.length > 100) return json(res, 400, { error: "Invalid lesson" }); const exists = state.progress.some((item) => item.userId === user.id && item.lessonId === input.lessonId); if (!exists) state.progress.push({ id: crypto.randomUUID(), userId: user.id, lessonId: input.lessonId, completedAt: now() }); state.activities.push({ id: crypto.randomUUID(), userId: user.id, type: "lesson", referenceId: input.lessonId, createdAt: now() }); saveState(); json(res, 200, { ok: true, completed: true }); }),
  route("POST", /^\/api\/progress\/quiz$/, async (req, res) => { const user = authUser(req); if (!user) return json(res, 401, { error: "Authentication required" }); const input = await body(req); if (typeof input.quizId !== "string" || !Array.isArray(input.answers)) return json(res, 400, { error: "Invalid quiz submission" }); const key = quizAnswerKeys[input.quizId]; if (!key) return json(res, 404, { error: "Quiz not found" }); const answers = input.answers.slice(0, key.length); const correct = answers.reduce((total, answer, index) => total + (answer === key[index] ? 1 : 0), 0); const score = Math.round((correct / key.length) * 100); const attempt = { id: crypto.randomUUID(), userId: user.id, quizId: input.quizId, score, answers, submittedAt: now() }; state.quizAttempts.push(attempt); state.activities.push({ id: crypto.randomUUID(), userId: user.id, type: "quiz", referenceId: input.quizId, createdAt: now() }); saveState(); json(res, 200, { attempt: { id: attempt.id, quizId: attempt.quizId, score: attempt.score, submittedAt: attempt.submittedAt } }); }),
  route("POST", /^\/api\/ai\/mentor$/, async (req, res) => { const user = authUser(req); if (!user) return json(res, 401, { error: "Authentication required" }); if (!process.env.ANTHROPIC_API_KEY) return json(res, 503, { error: "AI mentor is unavailable: configure ANTHROPIC_API_KEY on the backend" }); const input = await body(req); if (typeof input.message !== "string" || input.message.length > 4000) return json(res, 400, { error: "Invalid message" }); return json(res, 503, { error: "AI provider adapter is not enabled in this local build" }); }),
];

const server = http.createServer(async (req, res) => {
  const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5174";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
  if (req.method === "OPTIONS") return res.writeHead(204).end();
  const matchRoute = routes.find((item) => item.method === req.method && item.pattern.test(req.url.split("?")[0]));
  if (!matchRoute) return json(res, 404, { error: "Not found" });
  try { return await matchRoute.handler(req, res, matchRoute.pattern.exec(req.url.split("?")[0])); } catch (error) { return json(res, 400, { error: error.message || "Request failed" }); }
});
server.listen(port, () => console.log(`TRIMIND API listening on http://localhost:${port}`));
