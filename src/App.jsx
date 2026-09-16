import React, {
  useMemo,
  useState,
  useContext,
  createContext,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";

import {
  Home as HomeIcon,
  BookOpen,
  Code2,
  FlaskConical,
  Bot,
  User,
  TrendingUp,
  TrendingDown,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Flame,
  Trophy,
  ShieldAlert,
  Sparkles,
  Coffee,
  Rocket,
  Truck,
  PieChart as PieIcon,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Signal,
  Wifi,
  BatteryFull,
  Settings,
  Bell,
  LogOut,
  Target,
  Clock,
  Video,
  BookOpenCheck,
  Brain,
  Play,
  Award,
  BarChart3,
  Lock,
  RotateCcw,
  CircleHelp,
  GraduationCap,
  Lightbulb,
  Moon,
  Sun,
  Languages,
  DollarSign,
  Users,
  Megaphone,
  LineChart as LineChartIcon,
  Calculator,
  Landmark,
  CreditCard,
  PiggyBank,
  Store,
  Timer,
  Send,
  MessageCircle,
  Mic,
  Mail,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { api } from "./lib/api";
/* =========================================================
   DESIGN TOKENS

   NOTE ON ACCESSIBILITY:
   Every brand/accent color (navy, royal, electric, purple,
   emerald, amber, red, and their tint backgrounds) is wired
   to a CSS custom property (--mf-navy, --mf-royal, etc).
    The App shell sets the actual values on the root element
    based on the selected appearance, so every screen picks up
    the light or dark palette automatically without each
    component having to manage its own theme.
========================================================= */

const C = {
  navy: "var(--mf-navy, #0B1F3A)",
  royal: "var(--mf-royal, #2563EB)",
  electric: "var(--mf-electric, #38BDF8)",
  purple: "var(--mf-purple, #8B5CF6)",
  emerald: "var(--mf-emerald, #10B981)",
  amber: "var(--mf-amber, #F59E0B)",
  red: "var(--mf-red, #EF4444)",

  bg: "var(--mf-bg, #F8FAFC)",
  card: "var(--mf-card, #FFFFFF)",
  bg2: "var(--mf-bg2, #F1F5F9)",

  text: "var(--mf-text, #0F172A)",
  sub: "var(--mf-sub, #64748B)",
  border: "var(--mf-border, #E2E8F0)",

  greenBg: "var(--mf-greenBg, #ECFDF5)",
  blueBg: "var(--mf-blueBg, #EFF6FF)",
  purpleBg: "var(--mf-purpleBg, #F5F3FF)",
  amberBg: "var(--mf-amberBg, #FFFBEB)",
  redBg: "var(--mf-redBg, #FEF2F2)",
};

const aiGrad = `linear-gradient(
  135deg,
  ${C.royal} 0%,
  ${C.electric} 55%,
  ${C.purple} 100%
)`;

const FONT_DISPLAY = "'Sora', 'Cairo', sans-serif";
const FONT_BODY = "'Inter', 'Cairo', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const APP_NAME = "TRIMIND";

/* =========================================================
   ACCESSIBILITY SETTINGS CONTEXT
   (Focus Mode + Appearance + Language)
========================================================= */

const NavigationContext = createContext({ go: () => {} });

function useNavigation() {
  return useContext(NavigationContext);
}

const SettingsContext = createContext({
  focusMode: false,
  darkMode: false,
  language: "en",
  setFocusMode: () => {},
  setDarkMode: () => {},
  setLanguage: () => {},
});

function useAppSettings() {
  return useContext(SettingsContext);
}

/* =========================================================
   ARABIC UI COPY
   The learning catalog was originally authored in English.
   This dictionary keeps the existing data model intact while
   presenting its visible labels and descriptions in Arabic.
========================================================= */

const ARABIC_COPY = {
  Investment: "الاستثمار",
  Investing: "الاستثمار",
  Business: "الأعمال",
  Founder: "المؤسس",
  Builder: "الباني",
  Entrepreneurship: "ريادة الأعمال",
  Startup: "شركة ناشئة",
  "Personal Finance": "المالية الشخصية",
  Money: "المال",
  "Understand markets, investments, risk and portfolio building through practical learning.":
    "افهم الأسواق والاستثمار والمخاطر وبناء المحافظ من خلال تعلّم عملي.",
  "Build practical business skills including strategy, marketing, pricing and operations.":
    "طوّر مهارات عملية في الأعمال تشمل الاستراتيجية والتسويق والتسعير والعمليات.",
  "Turn ideas into real startup concepts through validation, business models and pitching.":
    "حوّل الأفكار إلى مشاريع ناشئة حقيقية عبر التحقق من الفكرة ونماذج الأعمال والعروض.",
  "Build better money habits through budgeting, saving, debt awareness and planning.":
    "ابنِ عادات مالية أفضل من خلال الميزانية والادخار وفهم الديون والتخطيط.",
  "Investment Fundamentals": "أساسيات الاستثمار",
  Beginner: "مبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
  "Learn the foundations of investing, markets, assets and risk.":
    "تعلّم أسس الاستثمار والأسواق والأصول والمخاطر.",
  "Portfolio Building": "بناء المحفظة",
  "Learn how diversification and asset allocation affect a portfolio.":
    "تعلّم كيف يؤثر التنويع وتوزيع الأصول في المحفظة.",
  "Business Fundamentals": "أساسيات الأعمال",
  "Understand customers, value propositions, revenue and business models.":
    "افهم العملاء وعرض القيمة والإيرادات ونماذج الأعمال.",
  "Marketing & Strategy": "التسويق والاستراتيجية",
  "Learn positioning, marketing channels, pricing and growth strategy.":
    "تعلّم التموضع وقنوات التسويق والتسعير واستراتيجية النمو.",
  "Startup Basics": "أساسيات الشركات الناشئة",
  "Learn how entrepreneurs identify problems and create useful solutions.":
    "تعلّم كيف يحدد رواد الأعمال المشكلات ويبتكرون حلولًا مفيدة.",
  "Pitching Your Idea": "عرض فكرتك",
  "Learn how to communicate a startup idea clearly and confidently.":
    "تعلّم كيف تعرض فكرة مشروع ناشئ بوضوح وثقة.",
  "Money Basics": "أساسيات المال",
  "Learn budgeting, saving and smart everyday money decisions.":
    "تعلّم إعداد الميزانية والادخار واتخاذ قرارات مالية يومية ذكية.",
  "Financial Planning": "التخطيط المالي",
  "Understand financial goals, saving strategies and long-term planning.":
    "افهم الأهداف المالية واستراتيجيات الادخار والتخطيط طويل المدى.",
  "What Is Investing?": "ما هو الاستثمار؟",
  "Understand what investing means and why people invest.":
    "افهم معنى الاستثمار ولماذا يستثمر الناس.",
  "Stocks vs Bonds": "الأسهم مقابل السندات",
  "Learn the basic differences between stocks and bonds.":
    "تعلّم الفروقات الأساسية بين الأسهم والسندات.",
  "Understanding ETFs": "فهم صناديق المؤشرات المتداولة",
  "Learn how exchange-traded funds work.":
    "تعلّم كيف تعمل صناديق المؤشرات المتداولة.",
  "Risk and Return": "المخاطر والعائد",
  "Explore the relationship between risk and potential return.":
    "استكشف العلاقة بين المخاطر والعائد المحتمل.",
  "Why Diversification Matters": "أهمية التنويع",
  "See why spreading exposure can reduce concentration risk.":
    "اكتشف كيف يقلل توزيع الاستثمارات من مخاطر التركّز.",
  "Asset Allocation": "توزيع الأصول",
  "Understand how different asset types can fit together.":
    "افهم كيف تتكامل أنواع الأصول المختلفة.",
  "What Makes a Business?": "ما الذي يصنع مشروعًا ناجحًا؟",
  "Learn the basic components of a sustainable business.":
    "تعلّم المكونات الأساسية لمشروع مستدام.",
  "Understanding Customers": "فهم العملاء",
  "Discover how customer needs influence business decisions.":
    "اكتشف كيف تؤثر احتياجات العملاء في قرارات الأعمال.",
  "Business Models": "نماذج الأعمال",
  "Explore common ways businesses create and capture value.":
    "استكشف الطرق الشائعة التي تخلق بها الأعمال قيمة وتحصل منها على إيرادات.",
  "Finding Your Target Customer": "تحديد العميل المستهدف",
  "Learn how to define and understand your target customer.":
    "تعلّم كيف تحدد عميلك المستهدف وتفهمه.",
  "Pricing Strategy": "استراتيجية التسعير",
  "Understand the main factors behind pricing decisions.":
    "افهم العوامل الرئيسية وراء قرارات التسعير.",
  "From Problem to Idea": "من المشكلة إلى الفكرة",
  "Understand how real problems can become startup opportunities.":
    "افهم كيف يمكن للمشكلات الحقيقية أن تصبح فرصًا لمشاريع ناشئة.",
  "Idea Validation": "التحقق من الفكرة",
  "Learn how to test an idea before investing heavily in it.":
    "تعلّم كيف تختبر فكرة قبل استثمار الكثير فيها.",
  "Business Model Canvas": "لوحة نموذج الأعمال",
  "Get an introduction to the Business Model Canvas.":
    "تعرّف إلى لوحة نموذج الأعمال.",
  "What Makes a Great Pitch?": "ما الذي يجعل العرض مميزًا؟",
  "Understand the structure of a strong startup pitch.":
    "افهم بنية عرض قوي لمشروع ناشئ.",
  "Why Budgeting Matters": "أهمية إعداد الميزانية",
  "Understand how a simple budget can help organize your money.":
    "افهم كيف تساعدك ميزانية بسيطة في تنظيم أموالك.",
  "Needs vs Wants": "الاحتياجات مقابل الرغبات",
  "Learn a useful framework for thinking about spending.":
    "تعلّم إطارًا مفيدًا للتفكير في الإنفاق.",
  "Building an Emergency Fund": "بناء صندوق للطوارئ",
  "Learn why having savings available for unexpected expenses matters.":
    "تعلّم أهمية وجود مدخرات للمصاريف غير المتوقعة.",
  "Setting Financial Goals": "تحديد الأهداف المالية",
  "Learn how to turn financial goals into actionable steps.":
    "تعلّم كيف تحوّل الأهداف المالية إلى خطوات قابلة للتنفيذ.",
  "Investment Fundamentals Quiz": "اختبار أساسيات الاستثمار",
  "Portfolio Diversification Quiz": "اختبار تنويع المحفظة",
  "Business Fundamentals Quiz": "اختبار أساسيات الأعمال",
  "Marketing Quiz": "اختبار التسويق",
  "Startup Basics Quiz": "اختبار أساسيات الشركات الناشئة",
  "Pitch Practice Quiz": "اختبار التدرّب على العرض",
  "Personal Finance Quiz": "اختبار المالية الشخصية",
  "Planning Quiz": "اختبار التخطيط",
  "Course Overview": "نظرة عامة على الدورة",
  Lessons: "الدروس",
  Courses: "الدورات",
  Course: "الدورة",
  "Start Lesson": "ابدأ الدرس",
  "Continue Lesson": "تابع الدرس",
  "Mark as Complete": "وضع علامة كمكتمل",
  Completed: "مكتمل",
  "Course complete": "الدورة مكتملة",
  "Take Quiz": "ابدأ الاختبار",
  "Check your understanding": "اختبر فهمك",
  "Question": "السؤال",
  "Next Question": "السؤال التالي",
  "See Results": "عرض النتيجة",
  "Correct!": "إجابة صحيحة!",
  "Not quite": "ليست الإجابة الصحيحة",
  "Try Again": "حاول مجددًا",
  "Your Results": "نتيجتك",
  Score: "النتيجة",
  "Back to Practice": "العودة إلى التدريب",
  "Back to Course": "العودة إلى الدورة",
  "Back to Learn": "العودة إلى التعلّم",
  "Video lesson": "درس فيديو",
  "Reading lesson": "درس قراءة",
  "Quiz lesson": "درس اختبار",
  video: "فيديو",
  reading: "قراءة",
  quiz: "اختبار",
  "Quick prompts": "أسئلة سريعة",
  "AI Learning Insight": "ملاحظة تعليمية ذكية",
  "BUSINESS SCORE": "تقييم المشروع",
  "BUSINESS SCORE ·": "تقييم المشروع ·",
  "Course progress": "تقدم الدورة",
  "Track progress": "تقدم المسار",
  "Lesson complete": "اكتمل الدرس",
  "Review your answer": "راجع إجابتك",
  "Submit Answer": "إرسال الإجابة",
  "Write your answer here...": "اكتب إجابتك هنا...",
  "Great work!": "عمل رائع!",
  "Keep learning": "واصل التعلّم",
  "Investment Explorer": "مستكشف الاستثمار",
  "Quiz Master": "خبير الاختبارات",
  "Business Builder": "صانع الأعمال",
  "Entrepreneur Mindset": "عقلية رائد الأعمال",
  "First Course": "أول دورة",
  "7-Day Streak": "سلسلة 7 أيام",
  "No quizzes completed yet": "لم تُكمل أي اختبار بعد",
  "Complete your first quiz to see your score here.":
    "أكمل أول اختبار لرؤية نتيجتك هنا.",
  "Your portfolio": "محفظتك",
  "Starting cash": "النقد المبدئي",
  "Portfolio value": "قيمة المحفظة",
  "Choose Assets": "اختر الأصول",
  "Risk Analysis": "تحليل المخاطر",
  Diversification: "التنويع",
  "Volatility Exposure": "التعرّض للتقلّب",
  "Asset Concentration": "تركيز الأصول",
  "Buy $500": "اشترِ بـ 500$",
  "Sell 50%": "بِع 50%",
  Holding: "المحتفظ به",
  Low: "منخفضة",
  Medium: "متوسطة",
  High: "مرتفعة",
  "Investment Simulator": "محاكي الاستثمار",
  "Business Simulator": "محاكي الأعمال",
  "Simulation Complete": "اكتملت المحاكاة",
  "Advance to Next Day": "انتقل إلى اليوم التالي",
};

const ARABIC_COPY_REVERSE = Object.fromEntries(
  Object.entries(ARABIC_COPY).map(([english, arabic]) => [arabic, english])
);

function translateVisibleCopy(value, language, remoteCopy = {}) {
  if (typeof value !== "string") return value;

  const whitespaceBefore = value.match(/^\s*/)?.[0] || "";
  const whitespaceAfter = value.match(/\s*$/)?.[0] || "";
  const source = value.trim();
  const remoteReverse = Object.fromEntries(
    Object.entries(remoteCopy).map(([english, arabic]) => [arabic, english])
  );
  const dictionary =
    language === "ar"
      ? { ...ARABIC_COPY, ...remoteCopy }
      : { ...ARABIC_COPY_REVERSE, ...remoteReverse };
  const translated = dictionary[source];

  return translated ? `${whitespaceBefore}${translated}${whitespaceAfter}` : value;
}

const TRANSLATION_ENDPOINT =
  "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=";
const TRANSLATION_SEPARATOR = "\n<<<TRIMIND_TRANSLATION_SPLIT>>>\n";

function needsArabicTranslation(value) {
  const source = value.trim();
  return (
    /[A-Za-z]{2,}/.test(source) &&
    source !== APP_NAME &&
    !Object.prototype.hasOwnProperty.call(ARABIC_COPY, source)
  );
}

async function translateArabicBatch(strings) {
  const source = strings.join(TRANSLATION_SEPARATOR);
  const response = await fetch(
    `${TRANSLATION_ENDPOINT}${encodeURIComponent(source)}`
  );
  if (!response.ok) throw new Error("Translation request failed");

  const payload = await response.json();
  const translated = payload[0]
    .map((segment) => segment[0])
    .join("")
    .split(TRANSLATION_SEPARATOR);

  return Object.fromEntries(
    strings.map((string, index) => [string, translated[index] || string])
  );
}

function translateArabicBatches(strings) {
  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;

  strings.forEach((text) => {
    if (
      currentChunk.length > 0 &&
      currentLength + text.length + TRANSLATION_SEPARATOR.length > 4200
    ) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentLength = 0;
    }
    currentChunk.push(text);
    currentLength += text.length + TRANSLATION_SEPARATOR.length;
  });
  if (currentChunk.length) chunks.push(currentChunk);

  return Promise.all(chunks.map(translateArabicBatch));
}

function ArabicContentLocalizer({ language }) {
  const [remoteCopy, setRemoteCopy] = useState({});
  const pendingTranslations = useRef(new Set());

  useLayoutEffect(() => {
    const shell = document.querySelector(".mf-shell");
    if (!shell) return undefined;
    const untranslated = new Set();

    const requestMissingTranslations = () => {
      const missing = Array.from(untranslated).filter(
        (text) =>
          !remoteCopy[text] &&
          !ARABIC_COPY[text] &&
          !pendingTranslations.current.has(text)
      );
      if (language !== "ar" || missing.length === 0) return;

      shell.classList.add("mf-localizing");
      missing.forEach((text) => pendingTranslations.current.add(text));
      translateArabicBatches(missing)
        .then((results) => {
          missing.forEach((text) => pendingTranslations.current.delete(text));
          setRemoteCopy((previous) => ({
            ...previous,
            ...Object.assign({}, ...results),
          }));
        })
        .catch(() => {
          missing.forEach((text) => pendingTranslations.current.delete(text));
          shell.classList.remove("mf-localizing");
        });
    };

    const localizeElement = (element) => {
      ["placeholder", "title", "aria-label"].forEach((attribute) => {
        const current = element.getAttribute(attribute);
        const translated = translateVisibleCopy(current, language, remoteCopy);
        if (translated !== current) element.setAttribute(attribute, translated);
        if (language === "ar" && current && needsArabicTranslation(current)) {
          untranslated.add(current.trim());
        }
      });
    };

    const localizeTree = (root) => {
      localizeElement(root);

      const textNodes = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (textNodes.nextNode()) nodes.push(textNodes.currentNode);
      nodes.forEach((node) => {
        const translated = translateVisibleCopy(node.nodeValue, language, remoteCopy);
        if (translated !== node.nodeValue) node.nodeValue = translated;
        if (language === "ar" && needsArabicTranslation(node.nodeValue || "")) {
          untranslated.add(node.nodeValue.trim());
        }
      });

      root.querySelectorAll("*").forEach(localizeElement);
    };

    localizeTree(shell);
    requestMissingTranslations();
    if (language !== "ar" || untranslated.size === 0) {
      shell.classList.remove("mf-localizing");
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          const translated = translateVisibleCopy(
            mutation.target.nodeValue,
            language,
            remoteCopy
          );
          if (translated !== mutation.target.nodeValue) mutation.target.nodeValue = translated;
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) localizeTree(node);
          if (node.nodeType === Node.TEXT_NODE) {
            const translated = translateVisibleCopy(node.nodeValue, language);
            if (translated !== node.nodeValue) node.nodeValue = translated;
          }
        });
      });
      requestMissingTranslations();
    });

    observer.observe(shell, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      shell.classList.remove("mf-localizing");
    };
  }, [language, remoteCopy]);

  return null;
}

/* =========================================================
   LEARNING PREFERENCES CONTEXT
   Tracks the learning format(s) the student picked during
   onboarding (videos / reading / quizzes / simulations / AI),
   plus which learning tracks (Investment / Founder / Builder)
   they're interested in. Screens use this to only surface
   matching content instead of always showing everything. If
   nothing is selected (or a filtered view would be empty), we
   fall back to showing everything rather than leaving the
   student with a dead end.
========================================================= */

const ALL_STYLE_IDS = ["videos", "reading", "quizzes", "sim", "ai"];

const PreferencesContext = createContext({
  preferredStyles: ALL_STYLE_IDS,
  setPreferredStyles: () => {},
  preferredTracks: [],
  setPreferredTracks: () => {},
});

function usePreferences() {
  return useContext(PreferencesContext);
}

/* =========================================================
   TOAST CONTEXT
   Lightweight "coming soon" / status feedback for prototype
   actions that don't have real backend behavior yet (e.g.
   Notifications, Forgot Password). Keeps every not-yet-wired
   control honest about its state instead of doing nothing.
========================================================= */

const ToastContext = createContext(() => {});

function useToast() {
  return useContext(ToastContext);
}

function ToastHost({ toast }) {
  if (!toast) return null;

  return (
    <div
      className="mf-fade"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 96,
        zIndex: 80,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: C.navy,
          color: "#fff",
          fontSize: 12.5,
          fontWeight: 600,
          padding: "10px 16px",
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(15,23,42,0.3)",
          maxWidth: "100%",
        }}
      >
        {toast}
      </div>
    </div>
  );
}

/* =========================================================
   GLOBAL STYLE
========================================================= */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');

      * {
        box-sizing: border-box;
      }

      html, body, #root {
        margin: 0;
        height: 100%;
      }

      body {
        margin: 0;
        background: ${C.bg2};
      }

      button,
      input,
      textarea {
        font-family: inherit;
      }

      .mf-scroll::-webkit-scrollbar {
        display: none;
      }

      .mf-scroll {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .mf-tap {
        transition:
          transform .12s ease,
          opacity .12s ease,
          box-shadow .15s ease;
      }

      .mf-tap:active {
        transform: scale(0.97);
        opacity: 0.9;
      }

      .mf-tap:focus-visible {
        outline: 2px solid ${C.royal};
        outline-offset: 2px;
      }

      .mf-mode-card {
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      }

      .mf-mode-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 18px 42px rgba(15,23,42,0.12) !important;
        border-color: rgba(37,99,235,0.18) !important;
      }

      .mf-mode-cta {
        transition: transform .15s ease, filter .15s ease;
      }

      .mf-mode-cta:hover {
        filter: brightness(1.06);
        transform: translateY(-1px);
      }

      @media (max-width: 1000px) {
        .mf-mode-grid {
          grid-template-columns: 1fr 1fr !important;
        }
      }

      @media (max-width: 680px) {
        .mf-mode-grid {
          grid-template-columns: 1fr !important;
        }

        .mf-mode-card {
          min-height: auto !important;
        }
      }


      .trimind-footer-heading {
        font-family: ${FONT_DISPLAY};
        font-weight: 800;
        font-size: 10.5px;
        letter-spacing: .5px;
        color: #E2E8F0;
      }

      .trimind-footer-grid button:hover {
        color: #FFFFFF !important;
      }

      @media (max-width: 680px) {
        .trimind-footer-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 22px 16px !important;
        }
      }

      @media (max-width: 390px) {
        .trimind-footer-grid {
          grid-template-columns: 1fr !important;
        }
      }

      .mf-fade {
        animation: mfFade .25s ease;
      }

      @keyframes mfFade {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      @keyframes mfFloat {
        0%,100% {
          transform: translateY(0) translateX(0);
        }

        50% {
          transform: translateY(-18px) translateX(10px);
        }
      }

      @keyframes mfFloat2 {
        0%,100% {
          transform: translateY(0) translateX(0);
        }

        50% {
          transform: translateY(16px) translateX(-14px);
        }
      }

      @keyframes mfPop {
        0% {
          opacity: 0;
          transform: scale(0.6) rotate(-8deg);
        }

        60% {
          opacity: 1;
          transform: scale(1.08) rotate(2deg);
        }

        100% {
          transform: scale(1) rotate(0);
        }
      }

      @keyframes mfRise {
        from {
          opacity: 0;
          transform: translateY(14px);
        }

        to {
          opacity: 1;
          transform: none;
        }
      }

      @keyframes mfPulseRing {
        0% {
          box-shadow: 0 0 0 0 rgba(56,189,248,0.45);
        }

        70% {
          box-shadow: 0 0 0 16px rgba(56,189,248,0);
        }

        100% {
          box-shadow: 0 0 0 0 rgba(56,189,248,0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .mf-fade,
        .mf-tap {
          animation: none !important;
          transition: none !important;
        }
      }

      /* ============ RESPONSIVE APP SHELL ============
         On phones, the app fills the viewport edge-to-edge like a real
         installed app: no bezel, no rounded corners, and the
         decorative fake status bar (9:41 / notch / signal
         icons) is hidden since the device's own status bar
         already does that job.

         On tablets and desktop browsers, the shell becomes a
         spacious web app. Content keeps a readable line length,
         while the bottom navigation remains easy to reach. */

      .mf-shell-wrapper {
        display: flex;
        justify-content: center;
        align-items: stretch;
        min-height: 100dvh;
        width: 100%;
        background: ${C.bg2};
      }

      .mf-shell {
        width: 100%;
        max-width: 480px;
        height: 100dvh;
        min-height: 100svh;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .mf-shell-inner {
        flex: 1;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      /* Keep the familiar phone layout on tablets. */
      @media (min-width: 640px) and (max-width: 1023.98px) {
        .mf-shell-wrapper {
          align-items: center;
          padding: 24px;
        }

        .mf-shell {
          height: min(844px, 92dvh);
          min-height: 0;
          border-radius: 34px;
          border: 8px solid ${C.navy};
          box-shadow: 0 20px 40px rgba(15,23,42,0.25);
        }
      }

      /* Use the wider website layout only on desktop screens. */
      @media (min-width: 1024px) {
        .mf-shell-wrapper {
          align-items: center;
          padding: clamp(24px, 4vw, 56px);
        }

        .mf-shell {
          width: min(100%, 1180px);
          max-width: 1180px;
          height: min(900px, calc(100dvh - 48px));
          min-height: 0;
          border-radius: 28px;
          border: 1px solid ${C.border};
          box-shadow: 0 24px 60px rgba(15,23,42,0.16);
          background: ${C.card};
        }

        .mf-status-bar {
          display: none !important;
        }

        .mf-shell-inner > .mf-scroll {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }

        .mf-bottom-nav {
          border-radius: 0 0 27px 27px !important;
          padding-left: 28px !important;
          padding-right: 28px !important;
        }
      }

      @media (max-width: 767.98px) {
        .mf-shell {
          border-radius: 0;
          border: none;
          box-shadow: none;
        }

        .mf-status-bar {
          display: none;
        }
      }

      /* ============ FOCUS MODE ============
         Kills decorative/looping motion and shortens
         entrance transitions app-wide so the screen holds
         still and stays easier to focus on. An !important
         stylesheet rule beats an element's inline style,
         so this reliably overrides the inline "animation"
         props used for the floating blobs etc. Internally
         Focus Mode also removes decorative elements so the
         student sees less visual noise. */
      .focus-mode *,
      .focus-mode *::before,
      .focus-mode *::after {
        animation: none !important;
        transition: none !important;
      }

      .focus-mode {
        letter-spacing: 0.1px;
      }

      .focus-mode .mf-decor {
        display: none !important;
      }

      .mf-shell[dir="rtl"] input,
      .mf-shell[dir="rtl"] textarea {
        text-align: right;
      }

      .mf-shell.mf-localizing .mf-shell-inner {
        visibility: hidden;
      }

      /* ============ LEARNING MODE CARDS ============ */
      .mf-mode-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        align-items: stretch;
      }

      .mf-mode-grid > * {
        min-width: 0;
      }

      .mf-mode-card {
        height: 100%;
        overflow: hidden;
        position: relative;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      }

      .mf-mode-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 32px rgba(15,23,42,0.10);
      }

      @media (max-width: 1023.98px) {
        .mf-mode-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (min-width: 1024px) {
        .mf-mode-grid {
          gap: 20px;
        }
      }
             /* ============ TRACK STORY CARDS ============ */
           .mf-story-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 12px 0 20px;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .mf-story-card {
        position: relative;
        width: 220px;
        height: 470px;
        border-radius: 24px;
        padding: 18px 16px;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #E2E8F0;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        overflow: hidden;
        transform-origin: center center;
        transition:
          transform .7s cubic-bezier(.4, 0, .2, 1),
          opacity .5s ease,
          box-shadow .5s ease,
          border-color .5s ease;
        will-change: transform;
      }

      .mf-story-card.pos-left {
        transform: scale(.92);
        z-index: 2;
        opacity: .92;
      }

      .mf-story-card.pos-center {
        transform: scale(1.18);
        z-index: 3;
        box-shadow: 0 24px 52px rgba(15,23,42,.2);
      }

      .mf-story-card.pos-right {
        transform: scale(.92);
        z-index: 2;
        opacity: .92;
      }


      .mf-story-inner-box {
        margin-top: 8px;
        padding: 10px 10px 11px;
        border-radius: 13px;
        border: 1px dashed rgba(11, 31, 58, .22);
        background: #F8FAFC;
      }

      .mf-story-explore-btn {
        margin-top: auto;
        padding-top: 10px;
        font-size: 11px;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        background: transparent;
        border: none;
        text-align: left;
      }

               /* ============ TRACK 3D CAROUSEL ============ */
      .mf-carousel-stage {
        position: relative;
        width: 100%;
        height: 500px;
        perspective: 1600px;
        perspective-origin: 50% 50%;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        cursor: grab;
        touch-action: pan-y;
        overflow: hidden;
      }

      .mf-carousel-stage.is-dragging {
        cursor: grabbing;
      }

      .mf-carousel-wheel {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        transform-style: preserve-3d;
        transition: transform .55s cubic-bezier(.22,.9,.28,1);
      }

      .mf-carousel-stage.is-dragging .mf-carousel-wheel {
        transition: none;
      }

      .mf-carousel-card {
        position: absolute;
        top: 0;
        left: 0;
        width: 600px;
        height: 500px;
        margin-left: -300px;
        margin-top: -250px;
        border-radius: 26px;
        padding: 22px 20px;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #E2E8F0;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        overflow: hidden;
        backface-visibility: hidden;
        transition: box-shadow .4s ease, border-color .4s ease, opacity .4s ease;
      }

      .mf-carousel-card.is-center {
        box-shadow: 0 24px 52px rgba(15,23,42,.22);
      }

      .mf-carousel-card:not(.is-center) {
        opacity: .85;
      }

      .mf-carousel-inner-box {
        margin-top: 8px;
        padding: 10px 10px 11px;
        border-radius: 13px;
        border: 1px dashed rgba(11, 31, 58, .22);
        background: #F8FAFC;
      }

      .mf-carousel-explore-btn {
        margin-top: auto;
        padding-top: 10px;
        font-size: 12px;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        background: transparent;
        border: none;
        text-align: left;
      }

      .mf-carousel-arrow {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid #E2E8F0;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(15,23,42,.06);
        transition: transform .18s ease, box-shadow .18s ease;
      }

      .mf-carousel-arrow:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 18px rgba(15,23,42,.12);
      }

      @media (max-width: 420px) {
        .mf-carousel-stage {
          height: 520px;
        }
        .mf-carousel-card {
          width: 260px;
          height: 480px;
          margin-left: -130px;
          margin-top: -240px;
          padding: 16px 14px;
          border-radius: 20px;
        }
        .mf-carousel-inner-box {
          padding: 8px 8px 9px;
        }
        .mf-carousel-explore-btn {
          font-size: 11px;
        }
      }
    `}</style>
  );
}

/* =========================================================
   BASIC COMPONENTS
========================================================= */

function Card({
  children,
  style,
  onClick,
  className = "",
  role,
  ariaLabel,
}) {
  const interactive = !!onClick;

  return (
    <div
      onClick={onClick}
      role={role || (interactive ? "button" : undefined)}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={`mf-fade ${interactive ? "mf-tap" : ""} ${className}`}
      style={{
        background: C.card,
        borderRadius: 20,
        padding: 18,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  style,
  disabled = false,
  full = false,
  icon: Icon,
  ariaLabel,
}) {
  const base = {
    border: "none",
    borderRadius: 14,
    padding: "13px 18px",
    fontFamily: FONT_BODY,
    fontWeight: 700,
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto",
  };

  const variants = {
    primary: {
      background: C.royal,
      color: "#fff",
    },

    ghost: {
      background: C.bg2,
      color: C.navy,
    },

    outline: {
      background: "transparent",
      color: C.royal,
      border: `1.5px solid ${C.royal}`,
    },

    ai: {
      background: aiGrad,
      color: "#fff",
    },

    danger: {
      background: C.redBg,
      color: C.red,
    },

    success: {
      background: C.greenBg,
      color: C.emerald,
    },
  };

  return (
    <button
      className="mf-tap"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        ...base,
        ...variants[variant],
        ...style,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Bar({
  value,
  color = C.royal,
  bg = C.bg2,
  height = 8,
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        width: "100%",
        height,
        borderRadius: 99,
        background: bg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width .4s ease",
        }}
      />
    </div>
  );
}

function Ring({
  value,
  size = 92,
  stroke = 10,
  color = C.royal,
  label,
  sub,
}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      role="img"
      aria-label={`${label || value + "%"}${sub ? " " + sub : ""}`}
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.bg2}
          strokeWidth={stroke}
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontWeight: 700,
            fontSize: size * 0.22,
            color: C.navy,
          }}
        >
          {label}
        </div>

        {sub && (
          <div
            style={{
              fontSize: 10,
              color: C.sub,
              fontWeight: 600,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({
  children,
  color = C.royal,
  bg = C.blueBg,
}) {
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        color,
        background: bg,
        padding: "4px 10px",
        borderRadius: 99,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function TopBar({
  title,
  subtitle,
  onBack,
}) {
  const { language } = useAppSettings();
  const backLabel = language === "ar" ? "رجوع" : "Back";
  const BackIcon = language === "ar" ? ChevronRight : ChevronLeft;

  return (
    <div style={{ padding: "20px 20px 6px" }}>
      {onBack && (
        <div
          className="mf-tap"
          onClick={onBack}
          role="button"
          tabIndex={0}
          aria-label={backLabel}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBack();
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: C.sub,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          <BackIcon size={16} />
          {backLabel}
        </div>
      )}

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 24,
          color: C.navy,
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            color: C.sub,
            fontSize: 13,
            marginTop: 4,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

function AIInsightCard({
  eyebrow = "AI Learning Insight",
  text,
  cta,
  onClick,
  style,
}) {
  return ( 
  <div
      className={`mf-fade ${onClick ? "mf-tap" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      style={{
        borderRadius: 20,
        padding: 18,
        background: aiGrad,
        color: "#fff",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
   
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 700,
          opacity: 0.9,
          marginBottom: 8,
        }}
      >
        <Sparkles size={14} />
        {eyebrow}
      </div>

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        {text}
      </div>

      {cta && (
        <div
          style={{
            marginTop: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12.5,
            fontWeight: 700,
            background: "rgba(255,255,255,0.18)",
            padding: "8px 14px",
            borderRadius: 12,
          }}
        >
          {cta}
          <ChevronRight size={14} />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STATUS BAR
========================================================= */

function StatusBar() {
  return (
    <div
      className="mf-status-bar"
      style={{
        flexShrink: 0,
        height: 34,
        position: "relative",
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        fontFamily: FONT_BODY,
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: 0.3,
          color: C.navy,
        }}
      >
        9:41
      </span>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 140,
          height: 22,
          background: "#000",
          borderRadius: "0 0 16px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 99,
            background: "#242424",
          }}
        />

        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "#12151c",
            boxShadow:
              "inset 0 0 0 1.5px #2b3140, inset -1px -1px 2px rgba(56,189,248,0.55)",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <Signal size={17} color={C.navy} strokeWidth={3} />
        <Wifi size={17} color={C.navy} strokeWidth={3} />
        <BatteryFull size={20} color={C.navy} strokeWidth={2.8} />
      </div>
    </div>
  );
}

/* =========================================================
   BOTTOM NAV
========================================================= */

function BottomNav({
  tab,
  setTab,
}) {
  const { language } = useAppSettings();
  const labels =
    language === "ar"
      ? {
          home: "الرئيسية",
          learn: "تعلّم",
          practice: "تدريب",
          ai: "الذكاء",
          profile: "حسابي",
        }
      : {
          home: "Home",
          learn: "Learn",
          practice: "Practice",
          ai: "AI",
          profile: "Profile",
        };

  const tabs = [
    {
      id: "home",
      label: labels.home,
      icon: HomeIcon,
    },
    {
      id: "learn",
      label: labels.learn,
      icon: BookOpen,
    },
    {
      id: "practice",
      label: labels.practice,
      icon: FlaskConical,
    },
    {
      id: "ai",
      label: labels.ai,
      icon: Bot,
    },
    {
      id: "profile",
      label: labels.profile,
      icon: User,
    },
  ];

  return (
    <div
      className="mf-bottom-nav"
      role="tablist"
        aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"}
      style={{
        /* In-flow footer element (not an absolute overlay):
           this keeps BottomNav directly under whatever content
           precedes it — including sitting right below the AI
           Mentor's mic/input composer — instead of floating on
           top of the screen's content. */
        position: "relative",
        width: "100%",
        flexShrink: 0,
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        padding: "10px 6px calc(10px + env(safe-area-inset-bottom))",
        borderRadius: "0 0 34px 34px",
        zIndex: 20,
      }}
    >
      {tabs.map((tabItem) => {
        const active = tab === tabItem.id;
        const Icon = tabItem.icon;

        return (
          <div
            key={tabItem.id}
            className="mf-tap"
            onClick={() => setTab(tabItem.id)}
            role="tab"
            tabIndex={0}
            aria-selected={active}
            aria-label={tabItem.label}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setTab(tabItem.id);
              }
            }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            <Icon
              size={21}
              color={active ? C.royal : "#94A3B8"}
              strokeWidth={active ? 2.4 : 2}
            />

            <span
              style={{
                fontSize: 10.5,
                fontWeight: active ? 700 : 500,
                color: active ? C.royal : "#94A3B8",
              }}
            >
              {tabItem.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   SPLASH
========================================================= */

function Splash({
  onDone,
}) {
  return (
    <div
      className="mf-tap"
      onClick={onDone}
      role="button"
      tabIndex={0}
      aria-label={`Continue to ${APP_NAME}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDone();
        }
      }}
      style={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background:
          `radial-gradient(circle at 30% 15%, #16264a 0%, ${C.navy} 45%, #060e1e 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <div
        className="mf-decor"
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.35), transparent 70%)",
          animation: "mfFloat 7s ease-in-out infinite",
        }}
      />

      <div
        className="mf-decor"
        style={{
          position: "absolute",
          bottom: -80,
          left: -70,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)",
          animation: "mfFloat2 8.5s ease-in-out infinite",
        }}
      />

          <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgb(37, 103, 147) 50%, rgb(20, 37, 71) 100%,  rgb(20, 37, 71) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
          position: "relative",
          boxShadow:"none" ,
          animation: "mfPop .7s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <img
          src="/logo.png"
          alt={`${APP_NAME} logo`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          color: "#A9B8CE",
          fontSize: 13.5,
          marginTop: 10,
          letterSpacing: 0.4,
          animation: "mfRise .6s ease .3s both",
        }}
      >
        Learn. Practice. Build. Grow.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 46,
          fontSize: 13,
          color: "#fff",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 8,
          animation: "mfRise .6s ease .5s both",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          padding: "10px 18px",
          borderRadius: 99,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.electric,
            animation: "mfPulseRing 1.8s ease-out infinite",
          }}
        />
        tap to start
      </div>
    </div>
  );
}

/* =========================================================
   TRACK DATA
   Only 3 tracks now: Investment, Founder, Builder — matching
   the 3 modes on the landing page and the 3 Practice
   simulators. (Personal Finance was removed.)
========================================================= */

const TRACKS = [
  {
    id: "investment",
    title: "Investment",
    shortTitle: "Investing",
    description:
      "Understand markets, investments, risk and portfolio building through practical learning.",
    color: C.royal,
    bg: C.blueBg,
    icon: TrendingUp,

    courses: [
      {
        id: "investment-fundamentals",
        title: "Investment Fundamentals",
        level: "Beginner",
        duration: "45 min",
        description:
          "Learn the foundations of investing, markets, assets and risk.",
        lessons: [
          {
            id: "inv-1",
            title: "What Is Investing?",
            type: "video",
            duration: "6 min",
            description:
              "Understand what investing means and why people invest.",
            videoUrl: "",
            keyPoints: [
              "Investing means putting money to work today for a potential future benefit, rather than spending it now.",
              "It's different from saving: saving protects money, investing exposes it to some risk in exchange for potential growth.",
              "Think about one everyday decision — buying now vs. saving to invest later — and what would change your mind.",
            ],
          },
          {
            id: "inv-2",
            title: "Stocks vs Bonds",
            type: "reading",
            duration: "8 min",
            description:
              "Learn the basic differences between stocks and bonds.",
            keyPoints: [
              "A stock represents partial ownership in a company; a bond represents a loan you make to a company or government.",
              "Stocks tend to carry more risk and more potential upside; bonds tend to be steadier but with lower typical returns.",
              "Picture a company you know — what would it mean to own a tiny slice of it versus lending it money?",
            ],
          },
          {
            id: "inv-3",
            title: "Understanding ETFs",
            type: "video",
            duration: "7 min",
            description:
              "Learn how exchange-traded funds work.",
            videoUrl: "",
            keyPoints: [
              "An ETF bundles many assets (stocks, bonds, or both) into a single tradeable fund.",
              "Buying one ETF share can give you exposure to dozens or hundreds of companies at once.",
              "Consider why owning a bundle might feel less risky than owning one single company.",
            ],
          },
          {
            id: "inv-4",
            title: "Risk and Return",
            type: "reading",
            duration: "9 min",
            description:
              "Explore the relationship between risk and potential return.",
            keyPoints: [
              "Higher potential returns usually come with higher uncertainty — there's no free upside without some risk.",
              "Risk tolerance is personal: it depends on your goals, timeline, and how you react to seeing losses.",
              "Ask yourself: how would you feel if an investment dropped 20% in a month? That answer says a lot about your risk comfort.",
            ],
          },
          {
            id: "inv-5",
            title: "Investment Fundamentals Quiz",
            type: "quiz",
            duration: "5 min",
            quizId: "investment-quiz",
          },
        ],
      },

      {
        id: "portfolio-building",
        title: "Portfolio Building",
        level: "Intermediate",
        duration: "50 min",
        description:
          "Learn how diversification and asset allocation affect a portfolio.",
        lessons: [
          {
            id: "port-1",
            title: "Why Diversification Matters",
            type: "video",
            duration: "7 min",
            description:
              "See why spreading exposure can reduce concentration risk.",
            videoUrl: "",
            keyPoints: [
              "Diversification means spreading money across different assets so no single one can sink your whole portfolio.",
              "It doesn't eliminate risk, but it reduces the impact of any one investment performing badly.",
              "Think of it like not putting all your eggs in one basket — if one asset drops, others may hold steady or rise.",
            ],
          },
          {
            id: "port-2",
            title: "Asset Allocation",
            type: "reading",
            duration: "10 min",
            description:
              "Understand how different asset types can fit together.",
            keyPoints: [
              "Asset allocation is the mix of stocks, bonds, cash, and other assets you hold — it's your portfolio's blueprint.",
              "The right mix depends on your goals, timeline, and comfort with risk, and it usually shifts over time.",
              "Try sketching a rough allocation for a goal 20 years away versus one only 2 years away — notice how different they look.",
            ],
          },
          {
            id: "port-3",
            title: "Portfolio Diversification Quiz",
            type: "quiz",
            duration: "6 min",
            quizId: "portfolio-quiz",
          },
        ],
      },

      {
        id: "advanced-investing",
        title: "Advanced Investing",
        level: "Advanced",
        locked: true,
        duration: "Coming soon",
        description:
          "Master advanced portfolio strategies, market analysis and investment decision-making.",
        lessons: [],
      },
    ],
  },

  {
    id: "business",
    title: "Founder",
    shortTitle: "Founder",
    description:
      "Build practical business skills including strategy, marketing, pricing and operations.",
    color: C.purple,
    bg: C.purpleBg,
    icon: Briefcase,

    courses: [
      {
        id: "business-fundamentals",
        title: "Business Fundamentals",
        level: "Beginner",
        duration: "50 min",
        description:
          "Understand customers, value propositions, revenue and business models.",
        lessons: [
          {
            id: "biz-1",
            title: "What Makes a Business?",
            type: "video",
            duration: "6 min",
            description:
              "Learn the basic components of a sustainable business.",
            videoUrl: "",
            keyPoints: [
              "A sustainable business solves a real problem for real customers and earns more than it spends doing so.",
              "The core loop is: offer value → get paid for it → reinvest to keep offering value.",
              "Think of a business you use often — what problem is it actually solving for you?",
            ],
          },
          {
            id: "biz-2",
            title: "Understanding Customers",
            type: "reading",
            duration: "8 min",
            description:
              "Discover how customer needs influence business decisions.",
            keyPoints: [
              "Every product decision should trace back to a specific customer need or frustration.",
              "Talking to real customers usually reveals more than guessing what they want.",
              "Pick a product you dislike — what customer need do you think it's failing to meet?",
            ],
          },
          {
            id: "biz-3",
            title: "Business Models",
            type: "video",
            duration: "9 min",
            description:
              "Explore common ways businesses create and capture value.",
            videoUrl: "",
            keyPoints: [
              "A business model explains how a company creates value and how it captures some of that value as revenue.",
              "Common patterns include one-time sales, subscriptions, marketplaces, and advertising.",
              "Consider two businesses you use — how does each one actually make money?",
            ],
          },
          {
            id: "biz-4",
            title: "Business Fundamentals Quiz",
            type: "quiz",
            duration: "5 min",
            quizId: "business-quiz",
          },
        ],
      },

      {
        id: "marketing-strategy",
        title: "Marketing & Strategy",
        level: "Intermediate",
        duration: "55 min",
        description:
          "Learn positioning, marketing channels, pricing and growth strategy.",
        lessons: [
          {
            id: "mkt-1",
            title: "Finding Your Target Customer",
            type: "video",
            duration: "8 min",
            description:
              "Learn how to define and understand your target customer.",
            videoUrl: "",
            keyPoints: [
              "A target customer is a specific group most likely to want what you're offering — not 'everyone'.",
              "Being specific about who you serve makes marketing, pricing, and product decisions much easier.",
              "Try describing your target customer in one sentence — could you picture a real person who fits it?",
            ],
          },
          {
            id: "mkt-2",
            title: "Pricing Strategy",
            type: "reading",
            duration: "9 min",
            description:
              "Understand the main factors behind pricing decisions.",
            keyPoints: [
              "Price affects demand (how many people buy) and perception (what quality customers expect).",
              "Pricing too low can hurt margins and even signal low quality; pricing too high can shrink your customer base.",
              "Think of a product priced higher than similar options — what does that price seem to be signaling?",
            ],
          },
          {
            id: "mkt-3",
            title: "Marketing Quiz",
            type: "quiz",
            duration: "5 min",
            quizId: "marketing-quiz",
          },
        ],
      },

      {
        id: "advanced-business-strategy",
        title: "Advanced Business Strategy",
        level: "Advanced",
        locked: true,
        duration: "Coming soon",
        description:
          "Explore advanced strategy, growth planning and complex business decisions.",
        lessons: [],
      },
    ],
  },

  {
    id: "entrepreneurship",
    title: "Builder",
    shortTitle: "Builder",
    description:
      "Turn ideas into real startup concepts through validation, business models and pitching.",
    color: C.amber,
    bg: C.amberBg,
    icon: Rocket,

    courses: [
      {
        id: "startup-basics",
        title: "Startup Basics",
        level: "Beginner",
        duration: "40 min",
        description:
          "Learn how entrepreneurs identify problems and create useful solutions.",
        lessons: [
          {
            id: "start-1",
            title: "From Problem to Idea",
            type: "video",
            duration: "7 min",
            description:
              "Understand how real problems can become startup opportunities.",
            videoUrl: "",
            keyPoints: [
              "Strong startup ideas usually start from a real, specific, and frequently felt problem.",
              "A good filter: would you pay to have this problem solved yourself?",
              "Think of something that annoys you weekly — could there be a startup hiding in that annoyance?",
            ],
          },
          {
            id: "start-2",
            title: "Idea Validation",
            type: "reading",
            duration: "9 min",
            description:
              "Learn how to test an idea before investing heavily in it.",
            keyPoints: [
              "Validation means testing whether people actually want your idea before you spend heavily building it.",
              "Cheap validation methods include interviews, landing pages, and small pilot tests.",
              "If you had to validate an idea this week with zero budget, what's the smallest test you could run?",
            ],
          },
          {
            id: "start-3",
            title: "Business Model Canvas",
            type: "video",
            duration: "10 min",
            description:
              "Get an introduction to the Business Model Canvas.",
            videoUrl: "",
            keyPoints: [
              "The Business Model Canvas maps a business on one page: customers, value, channels, revenue, and costs.",
              "It's a working sketch, not a fixed plan — it's meant to be revised as you learn more.",
              "Pick any business idea and try naming just its customer segment and its main value proposition.",
            ],
          },
          {
            id: "start-4",
            title: "Startup Basics Quiz",
            type: "quiz",
            duration: "5 min",
            quizId: "startup-quiz",
          },
        ],
      },

      {
        id: "pitching",
        title: "Pitching Your Idea",
        level: "Intermediate",
        duration: "35 min",
        description:
          "Learn how to communicate a startup idea clearly and confidently.",
        lessons: [
          {
            id: "pitch-1",
            title: "What Makes a Great Pitch?",
            type: "video",
            duration: "7 min",
            description:
              "Understand the structure of a strong startup pitch.",
            videoUrl: "",
            keyPoints: [
              "A strong pitch clearly states the problem, the solution, and why it matters — in that order.",
              "Clarity beats cleverness: a confused audience won't remember a clever line.",
              "Try summarizing any idea you have in exactly two sentences: the problem, then the solution.",
            ],
          },
          {
            id: "pitch-2",
            title: "Pitch Practice Quiz",
            type: "quiz",
            duration: "5 min",
            quizId: "pitch-quiz",
          },
        ],
      },

      {
        id: "advanced-product-building",
        title: "Advanced Product Building",
        level: "Advanced",
        locked: true,
        duration: "Coming soon",
        description:
          "Go deeper into product strategy, scaling and advanced problem-solving.",
        lessons: [],
      },
    ],
  },
];

/* =========================================================
   PROGRESS HELPERS
========================================================= */

function isLessonDone(lesson, completedLessons, quizScores) {
  if (lesson.type === "quiz") {
    return quizScores[lesson.quizId] !== undefined;
  }
  return !!completedLessons[lesson.id];
}

function getCourseProgress(course, completedLessons, quizScores) {
  if (!course.lessons.length) return 0;
  const done = course.lessons.filter((lesson) =>
    isLessonDone(lesson, completedLessons, quizScores)
  ).length;
  return Math.round((done / course.lessons.length) * 100);
}

// Weighted by lesson count so a 2-lesson course and a 5-lesson
// course don't count equally toward the track's overall progress.
function getTrackProgress(track, completedLessons, quizScores) {
  const totalLessons = track.courses.reduce(
    (sum, course) => sum + course.lessons.length,
    0
  );

  if (!totalLessons) return 0;

  const doneLessons = track.courses.reduce(
    (sum, course) =>
      sum +
      course.lessons.filter((lesson) =>
        isLessonDone(lesson, completedLessons, quizScores)
      ).length,
    0
  );

  return Math.round((doneLessons / totalLessons) * 100);
}

function getTotalLessonsDone(completedLessons, quizScores) {
  const allLessons = TRACKS.flatMap((track) =>
    track.courses.flatMap((course) => course.lessons)
  );
  return allLessons.filter((lesson) =>
    isLessonDone(lesson, completedLessons, quizScores)
  ).length;
}

function getTotalLessonsCount() {
  return TRACKS.flatMap((track) =>
    track.courses.flatMap((course) => course.lessons)
  ).length;
}

function getCompletedCoursesCount(completedLessons, quizScores) {
  const allCourses = TRACKS.flatMap((track) => track.courses);
  return allCourses.filter(
    (course) =>
      getCourseProgress(course, completedLessons, quizScores) === 100
  ).length;
}

/* =========================================================
   QUIZ DATA
========================================================= */

const QUIZZES = {
  "investment-quiz": {
    title: "Investment Fundamentals Quiz",
    description:
      "Check how well you understand the basics of investing.",
    color: C.royal,

    questions: [
      {
        question: "What does diversification mainly help with?",
        options: [
          "Increasing every investment's return",
          "Reducing concentration risk",
          "Guaranteeing profits",
          "Avoiding all market changes",
        ],
        answer: 1,
        explanation:
          "Diversification can reduce the impact of one investment performing poorly.",
      },

      {
        question: "What is an ETF?",
        options: [
          "A type of savings account",
          "A basket of assets traded like a security",
          "A business loan",
          "A type of insurance",
        ],
        answer: 1,
        explanation:
          "An ETF can hold a collection of assets and can be traded during market hours.",
      },

      {
        question: "Generally, higher potential returns are associated with...",
        options: [
          "No risk",
          "Higher uncertainty or risk",
          "Guaranteed income",
          "Zero volatility",
        ],
        answer: 1,
        explanation:
          "Potential return and risk are often related, though higher risk never guarantees higher returns.",
      },
    ],
  },

  "portfolio-quiz": {
    title: "Portfolio Diversification Quiz",
    description:
      "Test your understanding of building a balanced portfolio.",
    color: C.royal,

    questions: [
      {
        question: "What is asset allocation?",
        options: [
          "Choosing a single stock",
          "Dividing a portfolio among asset categories",
          "Selling every investment",
          "Only buying bonds",
        ],
        answer: 1,
        explanation:
          "Asset allocation means deciding how much exposure to give different asset categories.",
      },

      {
        question: "A portfolio concentrated in one asset can have...",
        options: [
          "Lower concentration risk",
          "Higher concentration risk",
          "Guaranteed returns",
          "No volatility",
        ],
        answer: 1,
        explanation:
          "If one asset represents a large share of a portfolio, its performance can have a bigger impact.",
      },
    ],
  },

  "business-quiz": {
    title: "Business Fundamentals Quiz",
    description:
      "Check your understanding of basic business concepts.",
    color: C.purple,

    questions: [
      {
        question: "What is a value proposition?",
        options: [
          "A company's office location",
          "The reason a customer should choose the product",
          "The employee salary list",
          "A company's tax number",
        ],
        answer: 1,
        explanation:
          "A value proposition explains the value a product or service offers customers.",
      },

      {
        question: "Revenue is best described as...",
        options: [
          "Money earned from sales before expenses",
          "All company debt",
          "Employee count",
          "Only marketing costs",
        ],
        answer: 0,
        explanation:
          "Revenue is the money generated from selling products or services before subtracting expenses.",
      },

      {
        question: "Why is understanding customers important?",
        options: [
          "It removes competition",
          "It helps businesses create useful solutions",
          "It guarantees success",
          "It eliminates costs",
        ],
        answer: 1,
        explanation:
          "Understanding customer needs helps businesses create products and services that solve real problems.",
      },
    ],
  },

  "marketing-quiz": {
    title: "Marketing Quiz",
    description:
      "Test your understanding of marketing strategy.",
    color: C.purple,

    questions: [
      {
        question: "What is a target market?",
        options: [
          "Every person in the world",
          "A specific group of potential customers",
          "Only company employees",
          "A company's competitors",
        ],
        answer: 1,
        explanation:
          "A target market is a defined group of customers a business wants to serve.",
      },

      {
        question: "Why is pricing important?",
        options: [
          "It has no effect on customers",
          "It affects demand, revenue and positioning",
          "It only matters to employees",
          "It removes the need for marketing",
        ],
        answer: 1,
        explanation:
          "Pricing can influence customer demand, revenue, perception and profitability.",
      },
    ],
  },

  "startup-quiz": {
    title: "Startup Basics Quiz",
    description:
      "Check your understanding of startup fundamentals.",
    color: C.amber,

    questions: [
      {
        question: "What should a startup idea ideally solve?",
        options: [
          "A real customer problem",
          "A random trend only",
          "No problem",
          "Only an internal company issue",
        ],
        answer: 0,
        explanation:
          "Strong startup ideas usually begin with a meaningful problem or unmet need.",
      },

      {
        question: "What is idea validation?",
        options: [
          "Building everything immediately",
          "Testing whether a problem and solution have real demand",
          "Hiring 100 employees",
          "Buying an office",
        ],
        answer: 1,
        explanation:
          "Validation helps determine whether customers actually care about the problem and proposed solution.",
      },
    ],
  },

  "pitch-quiz": {
    title: "Pitch Practice Quiz",
    description:
      "Test your understanding of startup pitching.",
    color: C.amber,

    questions: [
      {
        question: "A good pitch should clearly explain...",
        options: [
          "Only the founder's hobbies",
          "The problem, solution and value",
          "Every technical detail",
          "Only the company logo",
        ],
        answer: 1,
        explanation:
          "A pitch should communicate the problem, solution, value and why the idea matters.",
      },

      {
        question: "Why should a pitch be concise?",
        options: [
          "To hide important information",
          "To make the main idea easy to understand",
          "Because details never matter",
          "To avoid answering questions",
        ],
        answer: 1,
        explanation:
          "A concise pitch helps the audience quickly understand the core idea.",
      },
    ],
  },
};

/* =========================================================
   AI-GRADED REFLECTION QUESTIONS
   One open-ended question per quiz. The student writes a short
   answer in their own words; the AI Mentor grades it against
   the internal `guidance` (a grading rubric, never shown to
   the student) and returns a verdict + short feedback. This
   checks real understanding rather than pattern-matching a
   multiple-choice option.
========================================================= */

const REFLECTION_QUESTIONS = {
  "investment-quiz": {
    prompt:
      "In your own words, explain why an ETF can be less risky than buying a single stock.",
    guidance:
      "A strong answer mentions that an ETF holds a basket/collection of many assets, so it spreads exposure across them (diversification), meaning one company doing badly has less impact on the total than if all the money were in that one stock.",
  },

  "portfolio-quiz": {
    prompt:
      "Explain in your own words why putting all your money into one asset is risky, even if that asset seems strong right now.",
    guidance:
      "A strong answer mentions concentration risk: if the one asset drops in value, the whole portfolio is affected with nothing to offset the loss, whereas diversification spreads that risk.",
  },

  "business-quiz": {
    prompt:
      "In your own words, explain what a 'value proposition' is and why a business needs one.",
    guidance:
      "A strong answer explains that a value proposition is the reason a customer chooses this product/service over alternatives — the specific benefit or problem it solves for them — and that without a clear one, customers have no reason to pick the business.",
  },

  "marketing-quiz": {
    prompt:
      "Explain in your own words how pricing can affect both demand and how customers perceive a product.",
    guidance:
      "A strong answer connects price to demand (higher price can reduce how many people buy) and to perception (price can signal quality/positioning, e.g. premium vs budget).",
  },

  "startup-quiz": {
    prompt:
      "In your own words, explain why validating an idea before building it fully is important for a startup.",
    guidance:
      "A strong answer mentions testing whether real customers actually want/need the solution before investing significant time and money, reducing the risk of building something nobody wants.",
  },

  "pitch-quiz": {
    prompt:
      "Explain in your own words what makes a startup pitch easy for an audience to follow.",
    guidance:
      "A strong answer mentions clarity and structure: clearly stating the problem, the solution, and the value, without unnecessary detail, so the audience can quickly grasp the core idea.",
  },
};

async function gradeReflectionAnswer(quizTitle, prompt, guidance, studentAnswer) {
  const gradingPrompt =
    "You are grading a short written answer from a teenage student in a business & finance " +
    `learning app called ${APP_NAME}. Be encouraging but honest.\n\n` +
    `Quiz topic: ${quizTitle}\n` +
    `Question given to the student: ${prompt}\n` +
    `Internal grading guidance (do not reveal this verbatim, use it only to judge quality): ${guidance}\n` +
    `Student's answer: ${studentAnswer}\n\n` +
    "Reply in the same language the student used. Respond in exactly this format, nothing else:\n" +
    "VERDICT: <one of: Strong understanding / Good start / Needs practice>\n" +
    "FEEDBACK: <2-3 short, encouraging sentences on what was right and what to improve, under 60 words>";

  const raw = await callClaudeAI(gradingPrompt, 300);

  const verdictMatch = raw.match(/VERDICT:\s*(.+)/i);
  const feedbackMatch = raw.match(/FEEDBACK:\s*([\s\S]+)/i);

  return {
    verdict: verdictMatch ? verdictMatch[1].trim() : "Reviewed",
    feedback: feedbackMatch
      ? feedbackMatch[1].trim()
      : raw.trim(),
  };
}




/* =========================================================
   TRIMIND FOOTER
   One shared footer component. Rendered once per screen.
========================================================= */
function TRIMINDFooter({ language = "en" }) {
  const isArabic = language === "ar";
  const { go } = useNavigation();

  const socialItems = [
    { Icon: BookOpen, label: "LinkedIn" },
    { Icon: Video, label: "YouTube" },
    { Icon: Send, label: "Telegram" },
    { Icon: Mail, label: "Email" },
  ];

  return (
    <footer className="trimind-footer">
      <style>{`
        .trimind-footer {
          position: relative;
          margin: 34px -18px 0;
          padding: 30px 24px 16px;
          overflow: hidden;
          background:
            radial-gradient(circle at 100% 0%, rgba(56,189,248,.13), transparent 28%),
            radial-gradient(circle at 0% 100%, rgba(37,99,235,.10), transparent 30%),
            linear-gradient(135deg, #EEF6FF 0%, #F8FBFF 52%, #EEF5FF 100%);
          border-top: 1px solid #D9E8FA;
        }

        .trimind-footer-card {
          position: relative;
          max-width: 1120px;
          margin: 0 auto;
          padding: 28px 30px 15px;
          border: 1px solid #D3E4FA;
          border-radius: 24px;
          background: rgba(255,255,255,.72);
          box-shadow: 0 14px 35px rgba(36,107,254,.08);
          backdrop-filter: blur(10px);
        }

        .trimind-footer-grid {
          display: grid;
          grid-template-columns: 1.45fr 1fr 1.05fr 1fr;
          gap: 28px;
          align-items: start;
        }

        .trimind-footer-brand {
          min-width: 0;
        }

        .trimind-footer-logo {
          width: 46px;
          height: 46px;
          padding: 5px;
          object-fit: contain;
          border-radius: 14px;
          background: #FFFFFF;
          border: 1px solid #DCE9F8;
          box-shadow: 0 7px 18px rgba(37,99,235,.10);
        }

        .trimind-footer-brand-title {
          font-family: ${FONT_DISPLAY};
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -.5px;
color: ${C.royal};        }

        .trimind-footer-tagline {
          margin-top: 13px;
          color: ${C.royal};
          font-size: 13px;
          font-weight: 850;
          line-height: 1.45;
        }

        .trimind-footer-description {
          max-width: 300px;
          margin-top: 7px;
          color: ${C.sub};
          font-size: 11.5px;
          line-height: 1.65;
        }

        .trimind-footer-socials {
          display: flex;
          gap: 9px;
          margin-top: 16px;
          direction: ltr;
        }

        .trimind-footer-social {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          border: 1px solid #D4E5FA;
          background: rgba(255,255,255,.9);
          color: ${C.royal};
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
        }

        .trimind-footer-social:hover {
          transform: translateY(-2px);
          background: #ffffff;
          box-shadow: 0 7px 16px rgba(37,99,235,.12);
        }
.trimind-footer-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  margin-bottom: 8px;
  color: #246BFE;
  font-family: ${FONT_DISPLAY};
  font-size: 11.5px;
  font-weight: 900;
  letter-spacing: .25px;
  text-transform: uppercase;
}

        .trimind-footer-heading-icon {
          width: 31px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          border-radius: 10px;
          background: #E8F2FF;
          color: ${C.royal};
        }

        .trimind-footer-list {
          display: grid;
          gap: 2px;
        }

  .trimind-footer-link {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding: 7px 0;
  margin: 0;

  border: none;
  border-radius: 6px;

  background: transparent;

  color: #64748B !important;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  text-align: inherit;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.trimind-footer-link:hover {
  color: #2563EB !important;
  background: rgba(37, 99, 235, 0.06);
}

.trimind-footer-link:hover span {
  color: #2563EB !important;
}

.trimind-footer-link:hover .trimind-footer-chevron {
  color: #2563EB !important;
}

.trimind-footer-link:focus,
.trimind-footer-link:focus-visible {
  color: #2563EB !important;
  background: rgba(37, 99, 235, 0.06);
  outline: none;
}

.trimind-footer-link:active {
  color: #2563EB !important;
  background: rgba(37, 99, 235, 0.1);
}

.trimind-footer-link:active span,
.trimind-footer-link:active .trimind-footer-chevron {
  color: #2563EB !important;
}

.trimind-footer-chevron {
  color: inherit !important;
  flex-shrink: 0;
}
        .trimind-footer-divider {
          height: 1px;
          margin-top: 20px;
          background: #2563EB;
        }

        .trimind-footer-copy {
          padding-top: 13px;
          text-align: center;
          color: #2563EB;
          font-size: 10.5px;
        }

        .trimind-footer-decoration {
          position: absolute;
          width: 155px;
          height: 155px;
          border-radius: 50%;
          pointer-events: none;
        }

        .trimind-footer-decoration.one {
          left: -105px;
          bottom: -115px;
          background: rgba(37,99,235,.08);
        }

        .trimind-footer-decoration.two {
          right: -105px;
          top: -115px;
          background: rgba(56,189,248,.10);
        }

        @media (max-width: 900px) {
          .trimind-footer-grid {
            grid-template-columns: 1.35fr 1fr 1fr;
          }

          .trimind-footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 620px) {
          .trimind-footer {
            margin-left: -12px;
            margin-right: -12px;
            padding: 20px 12px 12px;
          }

          .trimind-footer-card {
            padding: 22px 18px 14px;
            border-radius: 20px;
          }

          .trimind-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px 18px;
          }

          .trimind-footer-brand {
            grid-column: 1 / -1;
          }

          .trimind-footer-description {
            max-width: 360px;
          }
        }

        @media (max-width: 430px) {
          .trimind-footer-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .trimind-footer-brand {
            grid-column: auto;
          }

          .trimind-footer-card {
            padding: 20px 16px 13px;
          }

          .trimind-footer-brand-title {
            font-size: 19px;
          }
        }
      `}</style>

      <div className="trimind-footer-decoration one" />
      <div className="trimind-footer-decoration two" />

      <div className="trimind-footer-card">
        <div
          className="trimind-footer-grid"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {/* BRAND */}
          <section className="trimind-footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <img
                src="/logo.png"
                alt={`${APP_NAME} logo`}
                className="trimind-footer-logo"
              />
              <div className="trimind-footer-brand-title">TRIMIND</div>
            </div>

            <div className="trimind-footer-tagline">
              {isArabic
                ? "تعلّم. طبّق. ابنِ. وتطوّر."
                : "Learn. Practice. Build. Grow."}
            </div>

            <div className="trimind-footer-description">
              {isArabic
                ? "منصة تعليمية تفاعلية تساعدك على التطور من خلال التعلم والممارسة والمحاكاة."
                : "An interactive learning platform that helps you grow through learning, practice and simulations."}
            </div>

            <div className="trimind-footer-socials">
              {socialItems.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="trimind-footer-social"
                  title={label}
                  aria-label={label}
                >
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </section>

          {/* QUICK LINKS */}
          <section>
            <div className="trimind-footer-heading">
              <span className="trimind-footer-heading-icon">
                <ArrowUpRight size={16} />
              </span>
              QUICK LINKS
            </div>

            <div className="trimind-footer-list">
              {[
                ["Home", "home"],
                ["Learn", "learn"],
                ["Practice", "practice"],
                ["AI Mentor", "ai"],
              ].map(([label, destination]) => (
                <button
                  key={label}
                  type="button"
                  className="trimind-footer-link"
                  onClick={() => go(destination)}
                >
                  <span>{label}</span>
                  <ChevronRight
                    className="trimind-footer-chevron"
                    size={14}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* LEARNING TRACKS */}
          <section>
            <div className="trimind-footer-heading">
              <span className="trimind-footer-heading-icon">
                <GraduationCap size={17} />
              </span>
              LEARNING TRACKS
            </div>

            <div className="trimind-footer-list">
              {[
                ["Investor", "investment"],
                ["Founder", "business"],
                ["Builder", "entrepreneurship"],
                ["Personal Finance", "learn"],
              ].map(([label, trackId]) => (
                <button
                  key={label}
                  type="button"
                  className="trimind-footer-link"
                  onClick={() =>
                    trackId === "learn"
                      ? go("learn")
                      : go("track", { trackId })
                  }
                >
                  <span>{label}</span>
                  <ChevronRight
                    className="trimind-footer-chevron"
                    size={14}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* SUPPORT */}
          <section>
            <div className="trimind-footer-heading">
              <span className="trimind-footer-heading-icon">
                <CircleHelp size={16} />
              </span>
              SUPPORT
            </div>

            <div className="trimind-footer-list">
              {[
                { label: "Help Center", Icon: CircleHelp },
                { label: "About TRIMIND", Icon: Lightbulb },
                { label: "Feedback", Icon: MessageCircle },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="trimind-footer-link"
                  onClick={() => go("settings")}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <Icon size={14} color={C.royal} />
                    {label}
                  </span>
                  <ChevronRight
                    className="trimind-footer-chevron"
                    size={14}
                  />
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="trimind-footer-divider" />

        <div className="trimind-footer-copy">
          © 2026 TRIMIND. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function HomeScreen({
  go,
  name,
  completedLessons,
  quizScores,
  streakDays,
}) {
  const { language } = useAppSettings();
  const isArabic = language === "ar";
  const ForwardIcon = isArabic ? ChevronLeft : ChevronRight;
  const trackTitles = isArabic
    ? {
        investment: "الاستثمار",
        business: "المؤسس",
        entrepreneurship: "الباني",
      }
    : {};
  const invTrack = TRACKS.find((t) => t.id === "investment");
  const invCourse = invTrack.courses.find(
    (c) => c.id === "investment-fundamentals"
  );
  const invProgress = getCourseProgress(
    invCourse,
    completedLessons,
    quizScores
  );

  const quizValues = Object.values(quizScores);
  const avgQuiz =
    quizValues.length > 0
      ? Math.round(
          quizValues.reduce((a, b) => a + b, 0) / quizValues.length
        )
      : 0;

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "20px 18px 100px",
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 21,
          color: C.navy,
        }}
      >
                {isArabic ? "صباح الخير" : `Good morning, ${name || "there"}`}
      </div>

      <div
        style={{
          color: C.sub,
          fontSize: 13.5,
          marginTop: 3,
          marginBottom: 18,
        }}
      >
        {isArabic ? "جاهز لتطوير مهاراتك اليوم؟" : "Ready to grow your skills today?"}
      </div>

      {/* Continue course */}

      <Card
        onClick={() =>
          go("course", {
            trackId: "investment",
            courseId: "investment-fundamentals",
          })
        }
        style={{
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <Pill>{isArabic ? "تابع التعلّم" : "Continue Learning"}</Pill>

            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: 17,
                color: C.navy,
                marginTop: 8,
              }}
            >
              {isArabic ? "أساسيات الاستثمار" : "Investment Fundamentals"}
            </div>
          </div>

          <div
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 700,
              color: C.royal,
            }}
          >
            {invProgress}%
          </div>
        </div>

        <div style={{ margin: "12px 0" }}>
          <Bar value={invProgress} />
        </div>

        <Btn variant="primary" full>
          {isArabic ? "تابع التعلّم" : "Continue Learning"}
        </Btn>
      </Card>

      {/* Stats */}

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <Card
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <Flame
            size={22}
            color={C.amber}
            style={{
              marginBottom: 6,
            }}
          />

          <div
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 700,
              fontSize: 18,
              color: C.navy,
            }}
          >
            {isArabic
              ? `${streakDays} ${streakDays === 1 ? "يوم" : "أيام"}`
              : `${streakDays} ${streakDays === 1 ? "Day" : "Days"}`}
          </div>

          <div
            style={{
              fontSize: 11,
              color: C.sub,
              fontWeight: 600,
            }}
          >
            {isArabic ? "سلسلة التعلّم" : "Learning streak"}
          </div>
        </Card>

        <Card
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <Trophy
            size={22}
            color={C.emerald}
            style={{
              marginBottom: 6,
            }}
          />

          <div
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 700,
              fontSize: 18,
              color: C.navy,
            }}
          >
            {quizValues.length > 0 ? `${avgQuiz}%` : "—"}
          </div>

          <div
            style={{
              fontSize: 11,
              color: C.sub,
              fontWeight: 600,
            }}
          >
            {isArabic ? "متوسط الاختبارات" : "Avg. quiz score"}
          </div>
        </Card>
      </div>

      {/* Focus Mode removes motion and decorative elements to keep
          this recommendation calm and easy to scan. */}
      <AIInsightCard
        text={
          isArabic
            ? "أداؤك جيد في أساسيات الاستثمار. موضوعك المقترح التالي هو تنويع المحفظة."
            : "You're doing well in Investment Fundamentals. Your next recommended topic is Portfolio Diversification."
        }
        cta={isArabic ? "استكشف الاقتراح" : "Explore recommendation"}
        onClick={() =>
          go("course", {
            trackId: "investment",
            courseId: "portfolio-building",
          })
        }
      />

      {/* Tracks */}

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 10px",
        }}
      >
        {isArabic ? "مسارات تعلّمك" : "Your learning tracks"}
      </div>

      {TRACKS.map((track) => {
        const Icon = track.icon;
        const trackProgress = getTrackProgress(
          track,
          completedLessons,
          quizScores
        );

        return (
          <Card
            key={track.id}
            onClick={() =>
              go("track", {
                trackId: track.id,
              })
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: track.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={20} color={track.color} />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: C.navy,
                }}
              >
                {trackTitles[track.id] || track.title}
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  color: C.sub,
                  marginTop: 2,
                }}
              >
                {isArabic
                  ? `${track.courses.length} دورات · مكتمل ${trackProgress}%`
                  : `${track.courses.length} courses · ${trackProgress}% complete`}
              </div>

              <div style={{ marginTop: 7 }}>
                <Bar
                  value={trackProgress}
                  color={track.color}
                  height={6}
                />
              </div>
            </div>

            <ForwardIcon
              size={18}
              color={C.sub}
            />
          </Card>
        );
      })}

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "18px 0 10px",
        }}
      >
        {isArabic ? "تدريب سريع" : "Quick practice"}
      </div>

      <Card
        onClick={() => go("practice")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: C.greenBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FlaskConical
            size={20}
            color={C.emerald}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: C.navy,
            }}
          >
            {isArabic ? "ابدأ محاكاة" : "Jump into a simulation"}
          </div>

          <div
            style={{
              fontSize: 11.5,
              color: C.sub,
              marginTop: 2,
            }}
          >
            {isArabic ? "طبّق ما تعلّمته للتو" : "Apply what you just learned"}
          </div>
        </div>

        <ForwardIcon
          size={18}
          color={C.sub}
        />
      </Card>
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   LEARN / TRACK HUB
========================================================= */

function LearnScreen({
  go,
}) {
  const { darkMode, language } = useAppSettings();
  const isArabic = language === "ar";
  const ForwardIcon = isArabic ? ChevronLeft : ChevronRight;
  const trackTitles = isArabic
    ? {
        investment: "الاستثمار",
        business: "المؤسس",
        entrepreneurship: "الباني",
      }
    : {};
  const [search, setSearch] = useState("");

  const filteredTracks = TRACKS.filter((track) => {
    const query = search.toLowerCase();

    if (!query) return true;

    return (
      track.title.toLowerCase().includes(query) ||
      track.description.toLowerCase().includes(query) ||
      track.courses.some((course) =>
        course.title.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title={isArabic ? "تعلّم" : "Learn"}
        subtitle={
          isArabic
            ? "اختر مسارًا وتعلّم من خلال الدورات والفيديوهات والقراءة والاختبارات."
            : "Choose a track and learn through courses, videos, reading and quizzes."
        }
      />

      <Card
        onClick={() => go("modeSelect")}
        style={{
          marginTop: 14,
          marginBottom: 4,
          background: aiGrad,
          color: "#fff",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Sparkles size={22} color="#fff" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>
            {isArabic ? "اختر وضع التعلّم" : "Choose Your Learning Mode"}
          </div>
          <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>
            {isArabic ? "استكشف المستثمر، المؤسس، والباني" : "Explore Investor, Founder & Builder"}
          </div>
        </div>
        {isArabic ? <ChevronLeft size={18} color="#fff" /> : <ChevronRight size={18} color="#fff" />}
      </Card>

      <div
        style={{
          marginTop: 14,
          marginBottom: 18,
        }}
      >
        <label htmlFor="mf-track-search" style={{ display: "none" }}>
          {isArabic ? "ابحث في المسارات أو الدورات" : "Search tracks or courses"}
        </label>
        <input
          id="mf-track-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isArabic ? "ابحث في المسارات أو الدورات..." : "Search tracks or courses..."}
          style={{
            width: "100%",
            padding: "13px 14px",
            borderRadius: 14,
            border: `1px solid ${C.border}`,
            background: C.card,
            outline: "none",
            fontSize: 13,
            color: C.text,
          }}
        />
      </div>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          marginBottom: 10,
        }}
      >
        {isArabic ? "مسارات التعلّم" : "Learning Tracks"}
      </div>

      {filteredTracks.map((track) => {
        const Icon = track.icon;

        return (
          <Card
            key={track.id}
            onClick={() =>
              go("track", {
                trackId: track.id,
              })
            }
            style={{
              marginBottom: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: track.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  size={22}
                  color={track.color}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 800,
                    fontSize: 15,
                    color: C.navy,
                  }}
                >
                  {trackTitles[track.id] || track.title}
                </div>

                <div
                  style={{
                    color: C.sub,
                    fontSize: 11.5,
                    marginTop: 3,
                    lineHeight: 1.5,
                  }}
                >
                  {track.description}
                </div>
              </div>

              <ForwardIcon
                size={18}
                color={C.sub}
              />
            </div>
          </Card>
        );
      })}

      {filteredTracks.length === 0 && (
        <Card
          style={{
            textAlign: "center",
            padding: 30,
          }}
        >
          <CircleHelp
            size={30}
            color={C.sub}
          />

          <div
            style={{
              fontWeight: 700,
              color: C.navy,
              marginTop: 10,
            }}
          >
            {isArabic ? "لم يتم العثور على مسارات" : "No tracks found"}
          </div>
        </Card>
      )}
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   MODE SELECTION SCREEN
   "Choose Your Learning Mode" — Investor / Founder / Builder
========================================================= */
const MODE_DETAILS = [
  {
    id: "investment",
    emoji: "📈",
    icon: TrendingUp,
    color: C.emerald,
    secondary: C.royal,
    bg: C.greenBg,
    title: { en: "Investor Mode", ar: "وضع المستثمر" },
    subtitle: { en: "Build Your Financial Mindset", ar: "ابنِ عقليتك المالية" },
    description: {
      en: "Step into the world of investing. Explore opportunities, understand risk and return, and make informed decisions through interactive financial experiences.",
      ar: "انطلق إلى عالم الاستثمار. استكشف الفرص، وافهم العلاقة بين المخاطرة والعائد، واتخذ قرارات مدروسة من خلال تجارب مالية تفاعلية.",
    },
  skills: {
      en: ["Investment Basics  ·  Risk & Return ", " Market & Assets  ·  Portfolio Building "],
      ar: ["أساسيات الاستثمار · المخاطر والعائد", "الأسواق والأصول · بناء المحفظة"],
    },
    aiAgent: { en: "Financial Coach", ar: "المدرب المالي" },
    exploreCta: { en: "Explore Investor Mode", ar: "استكشف وضع المستثمر" },
  },
  {
    id: "business",
    emoji: "🚀",
    icon: Rocket,
    color: C.purple,
    secondary: "#A78BFA",
    bg: C.purpleBg,
    title: { en: "Founder Mode", ar: "وضع المؤسس" },
    subtitle: { en: "Build Your Entrepreneurial Mindset", ar: "ابنِ عقليتك الريادية" },
    description: {
      en: "Step into the founder's seat. Discover problems worth solving, understand your customers, shape business models, and turn ideas into opportunities.",
      ar: "اجلس في مقعد المؤسس. اكتشف المشكلات التي تستحق الحل، وافهم عملاءك، وصمّم نماذج الأعمال، وحوّل الأفكار إلى فرص حقيقية.",
    },
    skills: {
  en: ["Business Fundamentals", "Customer Insights", "Business Models", "Pitching"],
  ar: ["أساسيات الأعمال", "فهم العملاء", "نماذج الأعمال", "العرض التقديمي"],
},
    aiAgent: { en: "AI Pitch Mentor", ar: "مرشد العرض الذكي" },
    exploreCta: { en: "Explore Founder Mode", ar: "استكشف وضع المؤسس" },
  },
  {
    id: "entrepreneurship",
    emoji: "💻",
    icon: Code2,
    color: C.royal,
    secondary: C.electric,
    bg: C.blueBg,
    title: { en: "Builder Mode", ar: "وضع الباني" },
    subtitle: { en: "Build Your Technology Mindset", ar: "ابنِ عقليتك التقنية" },
    description: {
      en: "Step into the builder's seat. Solve real-world problems, turn ideas into digital solutions, and experience the journey from idea to MVP.",
      ar: "اجلس في مقعد الباني. حل مشكلات حقيقية، وحوّل الأفكار إلى حلول رقمية، وعِش رحلة الانتقال من الفكرة إلى الـMVP.",
    },
    skills: {
      en: ["Programming Fundamentals", "Problem Solving", "AI & Technology", "MVP Building"],
      ar: ["أساسيات البرمجة", "حل المشكلات", "الذكاء الاصطناعي والتقنية", "بناء الـMVP"],
    },
    aiAgent: { en: "AI Code Companion", ar: "رفيق الكود الذكي" },
    exploreCta: { en: "Explore Builder Mode", ar: "استكشف وضع الباني" },
  },
];


function ModeCard({ mode, isArabic, selected, onToggle }) {
  const Icon = mode.icon;
  const title = mode.title[isArabic ? "ar" : "en"]
    .replace(" Mode", "")
    .replace("وضع ", "");
  const descriptions = {
    investment: {
      en: "Understand markets, investments, risk and portfolio building through practical learning.",
      ar: "افهم الأسواق والاستثمار والمخاطر وبناء المحافظ من خلال تعلّم عملي."
    },
    business: {
      en: "Build practical business skills including strategy, marketing, pricing and operations.",
      ar: "طوّر مهارات عملية في الأعمال تشمل الاستراتيجية والتسويق والتسعير والتشغيل."
    },
    entrepreneurship: {
      en: "Turn ideas into real startup concepts through validation, business models and pitching.",
      ar: "حوّل الأفكار إلى مفاهيم شركات ناشئة حقيقية من خلال التحقق من الفكرة ونماذج الأعمال والعرض التقديمي."
    }
  };
  const description = descriptions[mode.id][isArabic ? "ar" : "en"];

  return (
    <button
      type="button"
      className={`mf-mode-card ${selected ? "is-selected" : ""}`}
      onClick={() => onToggle(mode.id)}
      aria-pressed={selected}
      style={{
        width: "100%",
        textAlign: isArabic ? "right" : "left",
        padding: "17px 18px",
        borderRadius: 22,
        border: selected ? `2px solid ${mode.color}` : `1px solid ${C.border}`,
        background: selected ? `${mode.bg}` : C.card,
        boxShadow: selected
          ? `0 8px 24px ${mode.color}18`
          : "0 4px 14px rgba(15,23,42,0.035)",
        cursor: "pointer",
        fontFamily: FONT_BODY,
        display: "flex",
        alignItems: "center",
        gap: 15,
        position: "relative",
        transition: "all .18s ease",
        minHeight: 108,
      }}
    >
      <div
        style={{
          width: 55,
          height: 55,
          borderRadius: 17,
          flexShrink: 0,
          background: selected ? "rgba(255,255,255,.82)" : mode.bg,
          color: mode.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: selected ? `1px solid ${mode.color}22` : "none",
        }}
      >
        <Icon size={25} strokeWidth={2.2} />
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 17,
            fontWeight: 900,
            color: C.navy,
            lineHeight: 1.2,
            marginBottom: 7,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 11.5,
            lineHeight: 1.55,
            color: C.sub,
            maxWidth: 560,
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          width: 23,
          height: 23,
          borderRadius: "50%",
          flexShrink: 0,
          border: selected ? `2px solid ${mode.color}` : `1.5px solid ${C.border}`,
          background: selected ? mode.color : C.card,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 900,
        }}
      >
        {selected ? "✓" : ""}
      </div>
    </button>
  );
}

function ModeSelectionScreen({ go, goBack }) {
  const { language } = useAppSettings();
  const isArabic = language === "ar";
  const { preferredTracks, setPreferredTracks } = usePreferences();
  const selectedTracks = preferredTracks;
  const toggleTrack = (trackId) => {
    setPreferredTracks((current) =>
      current.includes(trackId)
        ? current.filter((id) => id !== trackId)
        : [...current, trackId]
    );
  };

  const handleContinue = () => {
    if (!selectedTracks.length) {
      go("track", { trackId: MODE_DETAILS[0].id });
      return;
    }
    go("track", { trackId: selectedTracks[0] });
  };

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 20px 96px",
        background: C.bg,
      }}
    >
      <div
        style={{
          maxWidth: 650,
          margin: "0 auto",
          paddingTop: 8,
        }}
      >
        <div
          className="mf-tap"
          onClick={goBack}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goBack();
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            paddingTop: 10,
            color: C.sub,
            fontSize: 13,
            fontWeight: 650,
            cursor: "pointer",
          }}
        >
          {isArabic ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {isArabic ? "رجوع" : "Back"}
        </div>

        <div style={{ textAlign: "center", marginTop: 17 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(27px, 7vw, 34px)",
              lineHeight: 1.15,
              fontWeight: 900,
              letterSpacing: -0.8,
              color: C.navy,
            }}
          >
            {isArabic ? "اختر مساراتك" : "Choose your tracks"}
          </h1>
          <p
            style={{
              margin: "9px auto 0",
              maxWidth: 540,
              fontSize: 12.5,
              lineHeight: 1.65,
              color: C.sub,
            }}
          >
            {isArabic
              ? "اختر مسارًا واحدًا أو أكثر، ثم اختر مستواك لكل مسار. يمكنك تغيير ذلك لاحقًا من الإعدادات."
              : "Pick one or more tracks, then choose your level for each one. You can change this later in Settings."}
          </p>
        </div>

        <div
          className="mf-mode-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 14,
            marginTop: 28,
          }}
        >
          {MODE_DETAILS.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              isArabic={isArabic}
              selected={selectedTracks.includes(mode.id)}
              onToggle={toggleTrack}
            />
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            margin: "18px 0 20px",
            color: C.sub,
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          {isArabic
            ? "مش اخترت؟ ولا يهمك — هنعرّفك بكل المسارات."
            : "Didn't pick any? No problem — we'll show you everything."}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          style={{
            width: "100%",
            height: 52,
            border: "none",
            borderRadius: 16,
            background: C.royal,
            color: "#fff",
            fontFamily: FONT_BODY,
            fontSize: 15,
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: `0 10px 24px ${C.royal}30`,
          }}
        >
          {isArabic ? "متابعة" : "Continue"}
        </button>
      </div>
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   TRACK DETAILS
========================================================= */

function TrackScreen({
  trackId,
  goBack,
  go,
  completedLessons,
  quizScores,
}) {
  const { language } = useAppSettings();
  const isArabic = language === "ar";
  const track = TRACKS.find(
    (item) => item.id === trackId
  );

  if (!track) {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          paddingBottom: 100,
        }}
      >
        <TopBar
          title="Track not found"
          onBack={goBack}
        />
      </div>
    );
  }

  const Icon = track.icon;
  const modeDetails = MODE_DETAILS.find((mode) => mode.id === track.id);
  const trackTitle = modeDetails
    ? modeDetails.title[language === "ar" ? "ar" : "en"]
    : track.title;
  const trackDescription = modeDetails
    ? modeDetails.description[language === "ar" ? "ar" : "en"]
    : track.description;
  const simulationConfig = {
    investment: {
      route: "investmentSim",
      icon: TrendingUp,
      title: { en: "Investor Simulation", ar: "محاكي الاستثمار" },
      description: {
        en: "Build a virtual $10,000 portfolio, choose assets, manage risk and see how your decisions affect the result.",
        ar: "أنشئ محفظة افتراضية بقيمة 10,000$، اختر الأصول، وأدر المخاطر وشاهد تأثير قراراتك على النتيجة."
      }
    },
    business: {
      route: "businessSim",
      icon: Briefcase,
      title: { en: "Founder Simulation", ar: "محاكي المؤسس" },
      description: {
        en: "Run a startup and make decisions about pricing, marketing, hiring and cash flow.",
        ar: "أدر شركة ناشئة واتخذ قرارات في التسعير والتسويق والتوظيف والتدفق النقدي."
      }
    },
    entrepreneurship: {
      route: "builderSim",
      icon: Rocket,
      title: { en: "Builder Simulation", ar: "محاكي الباني" },
      description: {
        en: "Choose a problem, validate the idea, build an MVP and pitch it to investors while managing budget and time.",
        ar: "اختر مشكلة، تحقّق من الفكرة، ابنِ MVP وقدّمها للمستثمرين مع إدارة الميزانية والوقت."
      }
    }
  }[track.id];
  const SimulationIcon = simulationConfig?.icon || FlaskConical;
  const currentLanguage = language === "ar" ? "ar" : "en";

  const allLessons = track.courses.flatMap(
    (course) => course.lessons
  );

  const videos = allLessons.filter(
    (lesson) => lesson.type === "video"
  );

  const quizzes = allLessons.filter(
    (lesson) => lesson.type === "quiz"
  );

  const trackProgress = getTrackProgress(
    track,
    completedLessons,
    quizScores
  );

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title={trackTitle}
        subtitle={trackDescription}
        onBack={goBack}
      />

      {/* Track Header */}

      <div
        style={{
          marginTop: 14,
          borderRadius: 22,
          padding: 20,
          background: `linear-gradient(135deg, ${track.color}, ${C.navy})`,
          color: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="mf-decor"
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            right: -50,
            top: -60,
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <Icon
          size={30}
          color="#fff"
        />

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 20,
            marginTop: 12,
          }}
        >
          {track.title} Track
        </div>

        <div
          style={{
            fontSize: 12.5,
            color: "rgba(255,255,255,.82)",
            lineHeight: 1.6,
            marginTop: 5,
          }}
        >
          {track.description}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11.5,
          }}
        >
          <span>Track progress</span>

          <b
            style={{
              fontFamily: FONT_MONO,
            }}
          >
            {trackProgress}%
          </b>
        </div>

        <div
          style={{
            marginTop: 6,
            height: 7,
            borderRadius: 99,
            background: "rgba(255,255,255,.2)",
          }}
        >
          <div
            style={{
              width: `${trackProgress}%`,
              height: "100%",
              borderRadius: 99,
              background: "#fff",
            }}
          />
        </div>
      </div>

      {/* Track Summary */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginTop: 14,
        }}
      >
        {[
          {
            icon: BookOpen,
            value: track.courses.length,
            label: "Courses",
          },
          {
            icon: Video,
            value: videos.length,
            label: "Videos",
          },
          {
            icon: Brain,
            value: quizzes.length,
            label: "Quizzes",
          },
        ].map((item) => {
          const ItemIcon = item.icon;

          return (
            <Card
              key={item.label}
              style={{
                padding: 12,
                textAlign: "center",
              }}
            >
              <ItemIcon
                size={18}
                color={track.color}
              />

              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontWeight: 700,
                  color: C.navy,
                  marginTop: 5,
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  fontSize: 10,
                  color: C.sub,
                  marginTop: 2,
                }}
              >
                {item.label}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Track-specific Simulation */}
      {simulationConfig && (
        <Card
          onClick={() => go(simulationConfig.route)}
          style={{
            marginTop: 18,
            padding: 16,
            background: `linear-gradient(135deg, ${track.bg}, #ffffff)`,
            border: `1px solid ${track.color}33`,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <SimulationIcon size={21} color={track.color} />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: track.color,
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                {language === "ar" ? "محاكاة المسار" : "TRACK SIMULATION"}
              </div>

              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: 16,
                  color: C.navy,
                }}
              >
                {simulationConfig.title[currentLanguage]}
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  color: C.sub,
                  lineHeight: 1.55,
                  marginTop: 5,
                }}
              >
                {simulationConfig.description[currentLanguage]}
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 800,
                  color: track.color,
                }}
              >
                {language === "ar" ? "ابدأ المحاكاة" : "Start Simulation"}
                {language === "ar" ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Courses */}

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 16,
          color: C.navy,
          margin: "22px 0 10px",
        }}
      >
        Courses
      </div>

      {track.courses.map((course) => {
        const courseProgress = getCourseProgress(
          course,
          completedLessons,
          quizScores
        );
        const isLocked = !!course.locked;

        return (
          <Card
            key={course.id}
            onClick={
              isLocked
                ? undefined
                : () =>
                    go("course", {
                      trackId: track.id,
                      courseId: course.id,
                    })
            }
            style={{
              marginBottom: 12,
              opacity: isLocked ? 0.78 : 1,
              background: isLocked ? C.bg2 : C.card,
              boxShadow: isLocked
                ? "none"
                : "0 1px 2px rgba(15,23,42,0.04)",
              cursor: isLocked ? "default" : "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <div>
                <Pill
                  color={isLocked ? C.sub : track.color}
                  bg={isLocked ? "#E2E8F0" : track.bg}
                >
                  {course.level}
                </Pill>

                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 15,
                    color: isLocked ? C.sub : C.navy,
                    marginTop: 8,
                  }}
                >
                  {course.title}
                </div>

                <div
                  style={{
                    color: C.sub,
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    marginTop: 4,
                  }}
                >
                  {course.description}
                </div>
              </div>

              {isLocked ? (
                <div
                  aria-label="Locked"
                  title="Locked"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 11,
                    background: "#E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Lock size={17} color={C.sub} />
                </div>
              ) : (
                <ChevronRight
                  size={18}
                  color={C.sub}
                />
              )}
            </div>

            {isLocked ? (
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: C.card,
                  border: `1px dashed ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  color: C.sub,
                  fontSize: 11.5,
                  fontWeight: 600,
                }}
              >
                <Lock size={14} />
                {isArabic
                  ? "أكمل المستوى المتوسط لفتح المستوى المتقدم."
                  : "Complete Intermediate to unlock Advanced."}
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Pill
                    color={C.sub}
                    bg={C.bg2}
                  >
                    <Clock
                      size={10}
                      style={{
                        verticalAlign: "middle",
                        marginRight: 3,
                      }}
                    />
                    {course.duration}
                  </Pill>

                  <Pill
                    color={C.sub}
                    bg={C.bg2}
                  >
                    {course.lessons.length} lessons
                  </Pill>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 13,
                    marginBottom: 5,
                    fontSize: 11,
                  }}
                >
                  <span
                    style={{
                      color: C.sub,
                    }}
                  >
                    Progress
                  </span>

                  <span
                    style={{
                      color: track.color,
                      fontFamily: FONT_MONO,
                      fontWeight: 700,
                    }}
                  >
                    {courseProgress}%
                  </span>
                </div>

                <Bar
                  value={courseProgress}
                  color={track.color}
                  height={6}
                />
              </>
            )}
          </Card>
        );
      })}

      <AIInsightCard
        eyebrow={`${track.title} AI Mentor`}
        text={`Based on your progress, keep building your ${track.title.toLowerCase()} fundamentals and use quizzes to identify concepts that need more practice.`}
      />
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   COURSE DETAILS
========================================================= */

function CourseScreen({
  trackId,
  courseId,
  goBack,
  go,
  completedLessons,
  quizScores,
}) {
  const track = TRACKS.find(
    (item) => item.id === trackId
  );

  const course = track?.courses.find(
    (item) => item.id === courseId
  );

  const { preferredStyles } = usePreferences();
  const { language } = useAppSettings();
  const [showAllTypes, setShowAllTypes] = useState(false);

  if (course?.locked) {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          paddingBottom: 100,
        }}
      >
        <TopBar
          title={course.title}
          onBack={goBack}
        />
        <div style={{ padding: "18px" }}>
          <Card
            style={{
              textAlign: "center",
              padding: 28,
              background: C.bg2,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                margin: "0 auto 14px",
                background: "#E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={26} color={C.sub} />
            </div>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 17,
                color: C.navy,
              }}
            >
              {language === "ar" ? "المستوى المتقدم مغلق" : "Advanced Level Locked"}
            </div>
            <div
              style={{
                color: C.sub,
                fontSize: 12,
                lineHeight: 1.6,
                marginTop: 7,
              }}
            >
              {language === "ar"
                ? "أكمل المستوى المتوسط لفتح هذا المحتوى."
                : "Complete the Intermediate level to unlock this content."}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!track || !course) {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          paddingBottom: 100,
        }}
      >
        <TopBar
          title="Course not found"
          onBack={goBack}
        />
      </div>
    );
  }

  const Icon = track.icon;

  const courseProgress = getCourseProgress(
    course,
    completedLessons,
    quizScores
  );

  // Learning-style filter: only show lesson formats the student
  // picked during onboarding (videos / reading / quizzes). If that
  // would hide every lesson in this course, fall back to showing
  // them all rather than leaving an empty screen.
  const LESSON_TYPE_TO_STYLE = {
    video: "videos",
    reading: "reading",
    quiz: "quizzes",
  };

  const styleFilteredLessons = course.lessons.filter((lesson) =>
    preferredStyles.includes(LESSON_TYPE_TO_STYLE[lesson.type])
  );

  const visibleLessons =
    showAllTypes || styleFilteredLessons.length === 0
      ? course.lessons
      : styleFilteredLessons;

  const isFiltered = visibleLessons.length < course.lessons.length;

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title={course.title}
        subtitle={course.description}
        onBack={goBack}
      />

      <Card
        style={{
          marginTop: 14,
          background: track.bg,
          border: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              background: C.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              size={22}
              color={track.color}
            />
          </div>

          <div>
            <Pill
              color={track.color}
              bg="#fff"
            >
              {course.level}
            </Pill>

            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: C.navy,
                marginTop: 5,
              }}
            >
              {courseProgress}% complete
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 13,
          }}
        >
          <Bar
            value={courseProgress}
            color={track.color}
            bg="rgba(255,255,255,.7)"
          />
        </div>
      </Card>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          margin: "22px 0 10px",
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 16,
            color: C.navy,
          }}
        >
          Course Content
        </div>

        {isFiltered && (
          <span
            className="mf-tap"
            role="button"
            tabIndex={0}
            onClick={() => setShowAllTypes(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowAllTypes(true);
              }
            }}
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: C.royal,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Show all formats
          </span>
        )}
      </div>

      {isFiltered && (
        <div
          style={{
            fontSize: 11.5,
            color: C.sub,
            lineHeight: 1.5,
            marginBottom: 12,
            marginTop: -4,
          }}
        >
          Showing only the formats you picked as your preferred learning style. You can change this anytime in Profile → Settings.
        </div>
      )}

      {visibleLessons.map((lesson) => {
        const index = course.lessons.findIndex(
          (item) => item.id === lesson.id
        );

        const lessonIcon =
          lesson.type === "video"
            ? Video
            : lesson.type === "quiz"
              ? Brain
              : BookOpen;

        const LessonIcon = lessonIcon;

        const iconColor =
          lesson.type === "video"
            ? C.royal
            : lesson.type === "quiz"
              ? C.purple
              : C.emerald;

        const iconBg =
          lesson.type === "video"
            ? C.blueBg
            : lesson.type === "quiz"
              ? C.purpleBg
              : C.greenBg;

        const done = isLessonDone(
          lesson,
          completedLessons,
          quizScores
        );

        return (
          <Card
            key={lesson.id}
            onClick={() => {
              if (lesson.type === "quiz") {
                go("quiz", {
                  quizId: lesson.quizId,
                  trackId,
                  courseId,
                });
              } else {
                go("lesson", {
                  trackId,
                  courseId,
                  lessonId: lesson.id,
                });
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
              padding: 14,
            }}
          >
            {lesson.type === "video" ? (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${track.color}, ${C.navy})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                  boxShadow: "0 3px 8px rgba(15,23,42,0.18)",
                }}
              >
                <Play
                  size={16}
                  color="#fff"
                  fill="#fff"
                  style={{ marginLeft: 2 }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <LessonIcon
                  size={18}
                  color={iconColor}
                />
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: track.color,
                  marginBottom: 3,
                }}
              >
                LESSON {index + 1} ·{" "}
                {lesson.type.toUpperCase()}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: C.navy,
                }}
              >
                {lesson.title}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                  marginTop: 4,
                  fontSize: 10.5,
                  color: C.sub,
                }}
              >
                <Clock size={11} />
                {lesson.duration}
              </div>
            </div>

            {done ? (
              <CheckCircle2
                size={18}
                color={C.emerald}
              />
            ) : (
              <ChevronRight
                size={17}
                color={C.sub}
              />
            )}
          </Card>
        );
      })}

      <div
        style={{
          marginTop: 18,
        }}
      >
        <AIInsightCard
          eyebrow="AI Course Coach"
          text={`You have completed ${courseProgress}% of this course. Try the quiz after finishing the lessons to check your understanding.`}
        />
      </div>
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   LESSON / VIDEO
========================================================= */

function LessonScreen({
  trackId,
  courseId,
  lessonId,
  goBack,
  go,
  completedLessons,
  onCompleteLesson,
}) {
  const { language } = useAppSettings();
  const track = TRACKS.find(
    (item) => item.id === trackId
  );

  const course = track?.courses.find(
    (item) => item.id === courseId
  );

  const lesson = course?.lessons.find(
    (item) => item.id === lessonId
  );

  if (!track || !course || !lesson) {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          paddingBottom: 100,
        }}
      >
        <TopBar
          title="Lesson not found"
          onBack={goBack}
        />
      </div>
    );
  }

  const isVideo = lesson.type === "video";
  const alreadyDone = !!completedLessons[lesson.id];

  const keyPoints =
    lesson.keyPoints && lesson.keyPoints.length
      ? lesson.keyPoints
      : [
          "Understand the main concept clearly.",
          "Connect the concept to a real-world situation.",
          "Use what you learned in the next activity.",
        ];

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title={lesson.title}
        subtitle={`${course.title} · ${track.title}`}
        onBack={goBack}
      />

      {/* VIDEO PLAYER */}

      {isVideo ? (
        <div
          style={{
            marginTop: 14,
            aspectRatio: "16 / 9",
            borderRadius: 18,
            background: `linear-gradient(135deg, ${C.navy} 0%, ${track.color} 170%)`,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 26px rgba(15,23,42,0.22)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at center, rgba(255,255,255,.18), transparent 60%)",
            }}
          />

          {/* Filmstrip perforations, top & bottom */}
          {[0, 1].map((edge) => (
            <div
              key={edge}
              className="mf-decor"
              style={{
                position: "absolute",
                [edge === 0 ? "top" : "bottom"]: 0,
                left: 0,
                right: 0,
                height: 8,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                opacity: 0.35,
              }}
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 4,
                    borderRadius: 2,
                    background: "#fff",
                  }}
                />
              ))}
            </div>
          ))}

          {/* Duration chip */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              fontSize: 10.5,
              fontWeight: 700,
              padding: "5px 10px",
              borderRadius: 99,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Clock size={11} />
            {lesson.duration}
          </div>

          {/* Video badge */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "5px 10px",
              borderRadius: 99,
            }}
          >
            LESSON VIDEO
          </div>

          {/* Play button with pulse ring */}
          <div
            style={{
              width: 68,
              height: 68,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="mf-decor"
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.35)",
                animation: "mfPulseRing 2.2s ease-out infinite",
              }}
            />

            <div
              role="button"
              tabIndex={0}
              aria-label="Play lesson video (preview only in this prototype)"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") e.preventDefault();
              }}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.96)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                cursor: "pointer",
              }}
              onClick={() => {}}
            >
              <Play
                size={26}
                color={track.color}
                fill={track.color}
                style={{ marginLeft: 3 }}
              />
            </div>
          </div>

          {/* Progress / scrubber mock */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              right: 14,
            }}
          >
            <div
              style={{
                height: 3,
                borderRadius: 99,
                background: "rgba(255,255,255,0.28)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "0%",
                  height: "100%",
                  borderRadius: 99,
                  background: "#fff",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "rgba(255,255,255,0.85)",
                fontSize: 10,
                marginTop: 5,
              }}
            >
              <span>00:00</span>
              <span>{lesson.duration}</span>
            </div>
          </div>
        </div>
      ) : (
        <Card
          style={{
            marginTop: 14,
            background: track.bg,
            border: "none",
          }}
        >
          <BookOpen
            size={30}
            color={track.color}
          />

          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 18,
              color: C.navy,
              marginTop: 10,
            }}
          >
            Reading Lesson
          </div>
        </Card>
      )}

      {/* Lesson info */}

      <Card
        style={{
          marginTop: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 7,
            marginBottom: 10,
          }}
        >
          <Pill
            color={track.color}
            bg={track.bg}
          >
            {isVideo ? "VIDEO" : "READING"}
          </Pill>

          <Pill
            color={C.sub}
            bg={C.bg2}
          >
            {lesson.duration}
          </Pill>

          {alreadyDone && (
            <Pill
              color={C.emerald}
              bg={C.greenBg}
            >
              Completed
            </Pill>
          )}
        </div>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 18,
            color: C.navy,
          }}
        >
          {lesson.title}
        </div>

        <div
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: C.text,
            marginTop: 10,
          }}
        >
          {lesson.description}
        </div>
      </Card>

      {/* Learning content — specific to this lesson */}

      <Card
        style={{
          marginTop: 12,
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            color: track.color,
            marginBottom: 8,
          }}
        >
          KEY LEARNING POINTS
        </div>

        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            color: C.text,
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          {keyPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </Card>

      <div
        style={{
          marginTop: 16,
        }}
      >
        <Btn
          variant="success"
          full
          icon={CheckCircle2}
          onClick={() => {
            onCompleteLesson(lesson.id);
            go("course", {
              trackId,
              courseId,
            });
          }}
        >
          {alreadyDone
            ? "Lesson Completed"
            : "Mark Lesson Complete"}
        </Btn>
      </div>
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   QUIZ SCREEN
========================================================= */

function QuizScreen({
  quizId,
  goBack,
  go,
  onQuizComplete,
}) {
  const quiz = QUIZZES[quizId];
  const reflection = REFLECTION_QUESTIONS[quizId];
  const { darkMode, language } = useAppSettings();
  const answerTextColor = darkMode ? "#475569" : null;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const [reflectionAnswer, setReflectionAnswer] = useState("");
  const [reflectionResult, setReflectionResult] = useState(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [reflectionError, setReflectionError] = useState(false);

  async function submitReflection() {
    if (!reflectionAnswer.trim() || reflectionLoading) return;

    setReflectionLoading(true);
    setReflectionError(false);

    try {
      const result = await gradeReflectionAnswer(
        quiz.title,
        reflection.prompt,
        reflection.guidance,
        reflectionAnswer.trim()
      );

      setReflectionResult(result);
    } catch (err) {
      setReflectionError(true);
    } finally {
      setReflectionLoading(false);
    }
  }

  if (!quiz) {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          paddingBottom: 100,
        }}
      >
        <TopBar
          title="Quiz not found"
          onBack={goBack}
        />
      </div>
    );
  }

  const question = quiz.questions[current];

  const handleNext = () => {
    if (selected === null) return;

    const newAnswers = [
      ...answers,
      selected,
    ];

    setAnswers(newAnswers);
    setSelected(null);

    if (current === quiz.questions.length - 1) {
      const score = Math.round(
        (newAnswers.filter(
          (answer, index) =>
            answer === quiz.questions[index].answer
        ).length /
          quiz.questions.length) *
          100
      );

      onQuizComplete(
        quizId,
        score,
        newAnswers
      );

      setFinished(true);
    } else {
      setCurrent((value) => value + 1);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setReflectionAnswer("");
    setReflectionResult(null);
    setReflectionLoading(false);
    setReflectionError(false);
  };

  if (finished) {
    const correct = answers.filter(
      (answer, index) =>
        answer === quiz.questions[index].answer
    ).length;

    const score = Math.round(
      (correct / quiz.questions.length) * 100
    );

    const passed = score >= 70;

    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "0 18px 100px",
        }}
      >
        <TopBar
          title="Quiz Results"
          onBack={goBack}
        />

        <Card
          style={{
            marginTop: 14,
            textAlign: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Ring
              value={score}
              size={130}
              stroke={11}
              color={
                passed
                  ? C.emerald
                  : C.amber
              }
              label={`${score}%`}
              sub="score"
            />
          </div>

          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 20,
              color: C.navy,
              marginTop: 14,
            }}
          >
            {passed
              ? "Great job! 🎉"
              : "Keep practicing! 💪"}
          </div>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pill
              color={passed ? C.emerald : C.amber}
              bg={passed ? C.greenBg : C.amberBg}
            >
              {passed ? "Passed" : "Needs Practice"}
            </Pill>
          </div>

          <div
            style={{
              color: C.sub,
              fontSize: 13,
              marginTop: 10,
              lineHeight: 1.6,
            }}
          >
            You answered {correct} out of{" "}
            {quiz.questions.length} questions correctly.
          </div>
        </Card>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 16,
            color: C.navy,
            margin: "22px 0 10px",
          }}
        >
          Review Your Answers
        </div>

        {quiz.questions.map(
          (item, index) => {
            const userAnswer =
              answers[index];

            const correctAnswer =
              item.answer;

            const isCorrect =
              userAnswer ===
              correctAnswer;

            return (
              <Card
                key={index}
                style={{
                  marginBottom: 10,
                  border: `1px solid ${
                    isCorrect
                      ? "#BBF7D0"
                      : "#FECACA"
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                >
                  {isCorrect ? (
                    <CheckCircle2
                      size={18}
                      color={C.emerald}
                    />
                  ) : (
                    <XCircle
                      size={18}
                      color={C.red}
                    />
                  )}

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.navy,
                    }}
                  >
                    {index + 1}.{" "}
                    {item.question}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 9,
                    fontSize: 12,
                    color: C.sub,
                  }}
                >
                  Your answer:{" "}
                  <b
                    style={{
                      color: isCorrect
                        ? C.emerald
                        : C.red,
                    }}
                  >
                    {item.options[userAnswer]}
                  </b>
                </div>

                {!isCorrect && (
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      color: C.sub,
                    }}
                  >
                    Correct answer:{" "}
                    <b
                      style={{
                        color: C.emerald,
                      }}
                    >
                      {item.options[
                        correctAnswer
                      ]}
                    </b>
                  </div>
                )}

                <div
                  style={{
                    marginTop: 8,
                    padding: 9,
                    borderRadius: 10,
                    background: C.bg2,
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    color: C.text,
                  }}
                >
                  {item.explanation}
                </div>
              </Card>
            );
          }
        )}

        {reflection && (
          <>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 16,
                color: C.navy,
                margin: "22px 0 10px",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Sparkles size={16} color={C.purple} />
              Understanding Check
            </div>

            <Card>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: C.purple,
                  marginBottom: 8,
                }}
              >
                IN YOUR OWN WORDS
              </div>

              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: C.navy,
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                {reflection.prompt}
              </div>

              <label htmlFor="mf-reflection" style={{ display: "none" }}>
                Your reflection answer
              </label>
              <textarea
                id="mf-reflection"
                value={reflectionAnswer}
                onChange={(e) =>
                  setReflectionAnswer(e.target.value)
                }
                disabled={!!reflectionResult}
                placeholder="Write a few sentences in your own words..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: `1.5px solid ${C.border}`,
                  outline: "none",
                  fontSize: 13,
                  color: answerTextColor || C.text,
                  fontFamily: FONT_BODY,
                  resize: "vertical",
                  background: reflectionResult ? C.bg2 : "#fff",
                }}
              />

              {!reflectionResult && (
                <Btn
                  variant="ai"
                  full
                  icon={Sparkles}
                  disabled={
                    !reflectionAnswer.trim() || reflectionLoading
                  }
                  onClick={submitReflection}
                  style={{ marginTop: 12 }}
                >
                  {reflectionLoading
                    ? "AI is reviewing your answer…"
                    : "Get AI Feedback"}
                </Btn>
              )}

              {reflectionError && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 12,
                    background: C.amberBg,
                    color: "#92400E",
                    fontSize: 12.5,
                    lineHeight: 1.5,
                  }}
                >
                  Couldn't reach the AI Mentor to grade this — this
                  only works when the app has live Claude API
                  access (e.g. inside claude.ai / Claude Code).
                  <div style={{ marginTop: 8 }}>
                    <Btn
                      variant="outline"
                      onClick={submitReflection}
                      style={{ padding: "7px 12px", fontSize: 12 }}
                      icon={RotateCcw}
                    >
                      Retry
                    </Btn>
                  </div>
                </div>
              )}

              {reflectionResult && (
                <div
                  className="mf-fade"
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 12,
                    background: C.purpleBg,
                  }}
                >
                  <div style={{ marginBottom: 6 }}>
                    <Pill color={C.purple} bg="#fff">
                      {reflectionResult.verdict}
                    </Pill>
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      color: C.text,
                      lineHeight: 1.6,
                    }}
                  >
                    {reflectionResult.feedback}
                  </div>
                </div>
              )}
            </Card>
          </>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 14,
          }}
        >
          <Btn
            variant="ghost"
            style={{ flex: 1 }}
            icon={RotateCcw}
            onClick={restart}
          >
            Retry
          </Btn>

          <Btn
            variant="primary"
            style={{ flex: 1 }}
            onClick={goBack}
          >
            Done
          </Btn>
        </div>
      </div>
    );
  }

  const progress =
    ((current + 1) /
      quiz.questions.length) *
    100;

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title={quiz.title}
        subtitle={quiz.description}
        onBack={goBack}
      />

      <div
        style={{
          marginTop: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11.5,
          color: C.sub,
          marginBottom: 6,
        }}
      >
        <span>
          Question {current + 1} of{" "}
          {quiz.questions.length}
        </span>

        <span
          style={{
            fontFamily: FONT_MONO,
            fontWeight: 700,
            color: quiz.color,
          }}
        >
          {Math.round(progress)}%
        </span>
      </div>

      <Bar
        value={progress}
        color={quiz.color}
        height={7}
      />

      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 10,
        }}
      >
        {quiz.questions.map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 99,
              background:
                idx < current
                  ? quiz.color
                  : idx === current
                    ? `${quiz.color}80`
                    : C.bg2,
            }}
          />
        ))}
      </div>

      <Card
        style={{
          marginTop: 18,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: quiz.color,
            marginBottom: 10,
          }}
        >
          QUESTION {current + 1}
        </div>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 17,
            color: C.navy,
            lineHeight: 1.5,
          }}
        >
          {question.question}
        </div>
      </Card>

      <div
        role="radiogroup"
        aria-label="Answer options"
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 9,
        }}
      >
        {question.options.map(
          (option, index) => {
            const isSelected =
              selected === index;

            return (
              <div
                key={option}
                className="mf-tap"
                onClick={() =>
                  setSelected(index)
                }
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(index);
                  }
                }}
                style={{
                  border: `1.5px solid ${
                    isSelected
                      ? quiz.color
                      : C.border
                  }`,
                  background:
                    isSelected
                      ? `${quiz.color}0D`
                      : "#fff",
                  borderRadius: 15,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: `1.5px solid ${
                      isSelected
                        ? quiz.color
                        : C.border
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: isSelected
                      ? quiz.color
                      : answerTextColor || C.sub,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {String.fromCharCode(
                    65 + index
                  )}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: answerTextColor || C.text,
                    lineHeight: 1.4,
                  }}
                >
                  {option}
                </div>
              </div>
            );
          }
        )}
      </div>

      <Btn
        variant="primary"
        full
        disabled={selected === null}
        onClick={handleNext}
        style={{
          marginTop: 18,
        }}
      >
        {current ===
        quiz.questions.length - 1
          ? "Finish Quiz"
          : "Next Question"}
      </Btn>
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   PRACTICE HUB
========================================================= */

function PracticeHub({
  go,
}) {
  const { preferredStyles, preferredTracks } = usePreferences();
  const { language, darkMode } = useAppSettings();
  const isArabic = language === "ar";
  const ForwardIcon = isArabic ? ChevronLeft : ChevronRight;
  const showSims = preferredStyles.includes("sim");
  const showQuizzes = preferredStyles.includes("quizzes");

  // Track filter: an empty preferredTracks list means "no
  // preference set" (e.g. logged in directly, or onboarding was
  // skipped), so every simulator stays visible — same fallback
  // pattern used for preferredStyles elsewhere in the app.
  const trackFilterActive = preferredTracks.length > 0;
  const wantsInvestment = !trackFilterActive || preferredTracks.includes("investment");
  const wantsFounder = !trackFilterActive || preferredTracks.includes("business");
  const wantsBuilder = !trackFilterActive || preferredTracks.includes("entrepreneurship");

  const showInvestmentSim = wantsInvestment;
  const showFounderSim =  wantsFounder;
  const showBuilderCard = wantsBuilder;
  const showNothing = !showInvestmentSim && !showFounderSim && !showBuilderCard && !showQuizzes;
  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title={isArabic ? "تعلّم بالممارسة" : "Learn by Doing"}
        subtitle={
          isArabic
            ? "طبّق معرفتك من خلال محاكاة واقعية دون أي مخاطرة مالية حقيقية."
            : "Put your knowledge into practice through realistic simulations — without real financial risk."
        }
      />

      {showNothing && (
        <Card
          style={{
            marginTop: 16,
            textAlign: "center",
          }}
        >
          <FlaskConical size={26} color={C.sub} />

          <div
            style={{
              fontWeight: 700,
              color: C.navy,
              marginTop: 10,
            }}
          >
            {isArabic ? "لا يوجد محتوى يطابق أسلوب تعلّمك حتى الآن" : "Nothing here matches your learning style yet"}
          </div>

          <div
            style={{
              color: C.sub,
              fontSize: 11.5,
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            {isArabic
              ? "فعّل المحاكاة أو الاختبارات، أو عدّل المسارات المفضّلة، من حسابي ← الإعدادات لرؤية محتوى التدريب هنا."
              : "Turn on Simulations or Quizzes, or adjust your preferred tracks, in Profile → Settings to see practice content here."}
          </div>
        </Card>
      )}

      {(showInvestmentSim || showFounderSim) && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {showInvestmentSim && (
            <Card
              onClick={() => go("investmentSim")}
              style={{
                background: C.card,
              }}
            >
              <TrendingUp
                size={22}
                color={C.electric}
              />

              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: 17,
                  marginTop: 10,
                  color: darkMode ? "#FFFFFF" : undefined,
                }}
              >
                {isArabic ? "محاكي الاستثمار" : "Investor Simulation"}
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color: "#B7C4D9",
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {isArabic
                  ? "أنشئ محفظة افتراضية بقيمة 10,000$ واكتشف أثر قراراتك."
                  : "Build a virtual $10,000 portfolio and see decisions play out."}
              </div>
            </Card>
          )}

          {showFounderSim && (
            <Card
              onClick={() => go("businessSim")}
            >
              <Briefcase
                size={22}
                color={C.purple}
              />

              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: 17,
                  marginTop: 10,
                  color: C.navy,
                }}
              >
                {isArabic ? "محاكي الأعمال" : "Founder Simulation"}
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color: C.sub,
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {isArabic
                  ? "أطلق وأدر مشروعًا: التسعير والتسويق والتوظيف والتدفق النقدي."
                  : "Launch and run a business — pricing, marketing, hiring and cash flow."}
              </div>
            </Card>
          )}
        </div>
      )}

      {showBuilderCard && (
        <div
          style={{
            marginTop: (showInvestmentSim || showFounderSim) ? 14 : 16,
          }}
        >
          <Card
  onClick={() => {
    console.log("BUILDER CLICKED");
    go("builderSim");
  }}
>
            <Rocket size={22} color={C.amber} />

            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: 17,
                marginTop: 10,
                color: C.navy,
              }}
            >
              {isArabic ? "تحديات الشركات الناشئة" : "Builder Simulation"}
            </div>

            <div
              style={{
                fontSize: 12.5,
                color: C.sub,
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              {isArabic
                ? "تحقّق من فكرتك، ابنِ منتجًا أوليًا واعرضها على المستثمرين."
                : "Validate an idea, build an MVP and pitch it to investors."}
            </div>
          </Card>
        </div>
      )}

      {showQuizzes && (
        <>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 15,
              color: C.navy,
              margin: "22px 0 10px",
            }}
          >
            {isArabic ? "اختبارات سريعة" : "Quick Quizzes"}
          </div>

          <Card
            onClick={() =>
              go("quiz", {
                quizId: "investment-quiz",
              })
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: C.purpleBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain
                size={20}
                color={C.purple}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: C.navy,
                }}
              >
                {isArabic ? "اختبار أساسيات الاستثمار" : "Investment Fundamentals Quiz"}
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  color: C.sub,
                  marginTop: 2,
                }}
              >
                {isArabic ? "3 أسئلة · 5 دقائق" : "3 questions · 5 min"}
              </div>
            </div>

            <ForwardIcon
              size={18}
              color={C.sub}
            />
          </Card>
        </>
      )}
          <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   INVESTMENT SIMULATOR
========================================================= */

const ASSETS = [
  {
    id: "growth",
    name: "Tech Growth ETF",
    type: "ETF",
    price: 100,
    risk: "Medium",
    drift: [
      0,
      1.2,
      2.0,
      1.5,
      3.6,
      4.6,
      4.3,
      5.8,
    ],
  },

  {
    id: "blue",
    name: "Blue Chip Stocks",
    type: "Stock",
    price: 80,
    risk: "Low",
    drift: [
      0,
      0.5,
      0.8,
      1.2,
      1.4,
      2.0,
      2.3,
      2.7,
    ],
  },

  {
    id: "bonds",
    name: "Government Bonds",
    type: "Bond",
    price: 50,
    risk: "Low",
    drift: [
      0,
      0.1,
      0.2,
      0.25,
      0.35,
      0.4,
      0.45,
      0.5,
    ],
  },

  {
    id: "em",
    name: "Emerging Markets Fund",
    type: "ETF",
    price: 60,
    risk: "High",
    drift: [
      0,
      3.0,
      0.5,
      4.5,
      1.5,
      3.5,
      2.0,
      5.5,
    ],
  },
];

function riskColor(risk) {
  if (risk === "Low") return C.emerald;
  if (risk === "Medium") return C.amber;
  return C.red;
}

function InvestmentSimulator({
  goBack,
  onSimComplete,
}) {
  const [day, setDay] = useState(0);
  const [cash, setCash] = useState(10000);
  const [holdings, setHoldings] = useState({});
  const [history, setHistory] = useState([
    {
      day: 0,
      value: 10000,
    },
  ]);

  const [feedbackOpen, setFeedbackOpen] =
    useState(false);

  const [aiReview, setAiReview] = useState(null);
  const [aiReviewLoading, setAiReviewLoading] = useState(false);
  const [aiReviewError, setAiReviewError] = useState(false);

  const priceAt = (
    asset,
    currentDay
  ) =>
    asset.price *
    (1 +
      asset.drift[currentDay] / 100);

  const currentPrice = (asset) =>
    priceAt(asset, day);

  const holdingsValue = useMemo(() => {
    return ASSETS.reduce(
      (sum, asset) =>
        sum +
        (holdings[asset.id] || 0) *
          currentPrice(asset),
      0
    );
  }, [holdings, day]);

  const totalValue =
    cash + holdingsValue;

  const pnlPct =
    ((totalValue - 10000) /
      10000) *
    100;

  function buy(asset, amount) {
    if (amount > cash) return;

    const units =
      amount /
      currentPrice(asset);

    setHoldings((previous) => ({
      ...previous,
      [asset.id]:
        (previous[asset.id] || 0) +
        units,
    }));

    setCash(
      (previous) =>
        previous - amount
    );
  }

  function sell(asset, percentage) {
    const units =
      (holdings[asset.id] || 0) *
      percentage;

    if (units <= 0) return;

    setHoldings((previous) => ({
      ...previous,
      [asset.id]:
        previous[asset.id] -
        units,
    }));

    setCash(
      (previous) =>
        previous +
        units *
          currentPrice(asset)
    );
  }

  function advanceDay() {
    const nextDay = Math.min(
      day + 1,
      7
    );

    const nextHoldingsValue =
      ASSETS.reduce(
        (sum, asset) =>
          sum +
          (holdings[asset.id] || 0) *
            priceAt(
              asset,
              nextDay
            ),
        0
      );

    setDay(nextDay);

    setHistory((previous) => [
      ...previous,
      {
        day: nextDay,
        value: Math.round(
          cash +
            nextHoldingsValue
        ),
      },
    ]);

    if (nextDay >= 7 && onSimComplete) {
      onSimComplete();
    }
  }

  const heldAssets =
    ASSETS.filter(
      (asset) =>
        (holdings[asset.id] || 0) >
        0.0001
    );

  const concentration =
    heldAssets.length
      ? Math.max(
          ...heldAssets.map(
            (asset) =>
              ((holdings[
                asset.id
              ] || 0) *
                currentPrice(
                  asset
                )) /
              (holdingsValue || 1)
          )
        ) * 100
      : 0;

  const diversification =
    Math.min(
      100,
      (heldAssets.length /
        ASSETS.length) *
        100
    );

  const riskWeights = {
    Low: 20,
    Medium: 55,
    High: 90,
  };

  const volExposure =
    holdingsValue > 0
      ? heldAssets.reduce(
          (sum, asset) =>
            sum +
            riskWeights[
              asset.risk
            ] *
              (((holdings[
                asset.id
              ] || 0) *
                currentPrice(
                  asset
                )) /
                holdingsValue),
          0
        )
      : 0;

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title="Investment Simulator"
        onBack={goBack}
      />

      <Card
        style={{
          marginTop: 14,
          background: C.navy,
          color: "#fff",
          border: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11.5,
                color: "#94A3B8",
                fontWeight: 600,
              }}
            >
              Portfolio Value
            </div>

            <div
              style={{
                fontFamily: FONT_MONO,
                fontWeight: 700,
                fontSize: 26,
                marginTop: 4,
              }}
            >
              $
              {Math.round(
                totalValue
              ).toLocaleString()}
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                color: "#94A3B8",
                fontWeight: 600,
              }}
            >
              Return
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                justifyContent:
                  "flex-end",
                marginTop: 4,
              }}
            >
              {pnlPct >= 0 ? (
                <ArrowUpRight
                  size={16}
                  color={C.emerald}
                />
              ) : (
                <ArrowDownRight
                  size={16}
                  color={C.red}
                />
              )}

              <span
                style={{
                  fontFamily:
                    FONT_MONO,
                  fontWeight: 700,
                  fontSize: 18,
                  color:
                    pnlPct >= 0
                      ? C.emerald
                      : C.red,
                }}
              >
                {pnlPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            height: 90,
            marginTop: 12,
            marginLeft: -8,
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={history}
            >
              <XAxis
                dataKey="day"
                hide
              />

              <YAxis
                hide
                domain={[
                  "dataMin - 200",
                  "dataMax + 200",
                ]}
              />

              <Tooltip
                contentStyle={{
                  background: C.navy,
                  border: "none",
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke={C.electric}
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginTop: 6,
            fontSize: 11.5,
            color: "#94A3B8",
          }}
        >
          <span>
            Cash:{" "}
            <b
              style={{
                color: "#fff",
                fontFamily:
                  FONT_MONO,
              }}
            >
              $
              {Math.round(
                cash
              ).toLocaleString()}
            </b>
          </span>

          <span>
            Day {day} / 7
          </span>
        </div>
      </Card>

      <Btn
        variant="ghost"
        full
        onClick={advanceDay}
        disabled={day >= 7}
        style={{
          marginTop: 12,
        }}
      >
        {day >= 7
          ? "Simulation Complete"
          : "Advance to Next Day"}
      </Btn>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 10px",
        }}
      >
        Choose Assets
      </div>

      {ASSETS.map((asset) => {
        const held =
          holdings[asset.id] ||
          0;

        const price =
          currentPrice(asset);

        const change =
          asset.drift[day];

        return (
          <Card
            key={asset.id}
            style={{
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: C.navy,
                  }}
                >
                  {asset.name}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 5,
                  }}
                >
                  <Pill
                    bg={C.bg2}
                    color={C.sub}
                  >
                    {asset.type}
                  </Pill>

                  <Pill
                    bg={`${riskColor(
                      asset.risk
                    )}1A`}
                    color={riskColor(
                      asset.risk
                    )}
                  >
                    {asset.risk} risk
                  </Pill>
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontFamily:
                      FONT_MONO,
                    fontWeight: 700,
                    color: C.navy,
                  }}
                >
                  ${price.toFixed(2)}
                </div>

                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color:
                      change >= 0
                        ? C.emerald
                        : C.red,
                  }}
                >
                  {change >= 0
                    ? "+"
                    : ""}
                  {change.toFixed(1)}%
                </div>
              </div>
            </div>

            {held > 0.0001 && (
              <div
                style={{
                  fontSize: 11.5,
                  color: C.sub,
                  marginTop: 8,
                }}
              >
                Holding:{" "}
                <b
                  style={{
                    color: C.navy,
                    fontFamily:
                      FONT_MONO,
                  }}
                >
                  $
                  {(
                    held * price
                  ).toFixed(0)}
                </b>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
              }}
            >
              <Btn
                variant="outline"
                style={{
                  flex: 1,
                  padding:
                    "9px 8px",
                  fontSize: 12,
                }}
                onClick={() =>
                  buy(
                    asset,
                    500
                  )
                }
              >
                + Buy $500
              </Btn>

              <Btn
                variant="danger"
                style={{
                  flex: 1,
                  padding:
                    "9px 8px",
                  fontSize: 12,
                }}
                disabled={
                  held <= 0.0001
                }
                onClick={() =>
                  sell(
                    asset,
                    0.5
                  )
                }
              >
                Sell 50%
              </Btn>
            </div>
          </Card>
        );
      })}

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 10px",
        }}
      >
        Risk Analysis
      </div>

      <Card>
        {[
          {
            label:
              "Diversification",
            value:
              diversification,
            color: C.emerald,
          },
          {
            label:
              "Volatility Exposure",
            value:
              volExposure,
            color: C.amber,
          },
          {
            label:
              "Asset Concentration",
            value:
              concentration,
            color: C.red,
          },
        ].map((risk) => (
          <div
            key={risk.label}
            style={{
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                fontSize: 12.5,
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  color: C.sub,
                  fontWeight: 600,
                }}
              >
                {risk.label}
              </span>

              <span
                style={{
                  fontFamily:
                    FONT_MONO,
                  fontWeight: 700,
                  color: C.navy,
                }}
              >
                {risk.value.toFixed(
                  0
                )}
                %
              </span>
            </div>

            <Bar
              value={risk.value}
              color={risk.color}
            />
          </div>
        ))}
      </Card>

      <div
        style={{
          marginTop: 16,
        }}
      >
        <AIInsightCard
          eyebrow="AI Portfolio Feedback"
          text={
            heldAssets.length === 0
              ? "You haven't invested yet. Try allocating virtual cash across a few different asset types."
              : concentration > 70
                ? `Your portfolio is heavily concentrated in one asset (${concentration.toFixed(
                    0
                  )}%). Try spreading your virtual portfolio across different asset types.`
                : `Good diversification across ${heldAssets.length} assets. Your volatility exposure is ${volExposure < 40
                    ? "low"
                    : volExposure < 70
                      ? "moderate"
                      : "high"
                  }.`
          }
          cta="View full review"
          onClick={() =>
            setFeedbackOpen(true)
          }
        />
      </div>

      {feedbackOpen && (
        <div
          className="mf-fade"
          role="dialog"
          aria-modal="true"
          aria-label="AI Portfolio Review"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "rgba(11,31,58,0.55)",
            display: "flex",
            alignItems:
              "flex-end",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: C.card,
              width: "100%",
              borderRadius:
                "24px 24px 0 0",
              padding: 22,
              maxHeight: "80%",
              overflowY: "auto",
            }}
            className="mf-scroll"
          >
            <div
              style={{
                fontFamily:
                  FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 18,
                color: C.navy,
                marginBottom: 12,
              }}
            >
              AI Portfolio Review
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.emerald,
                marginBottom: 6,
              }}
            >
              WHAT YOU DID WELL
            </div>

            <div
              style={{
                fontSize: 13.5,
                color: C.text,
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              {heldAssets.length > 1
                ? "You spread virtual capital across multiple asset types instead of putting everything into one position."
                : "You started exploring the market. Try adding more than one asset type to learn how diversification works."}
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.amber,
                marginBottom: 6,
              }}
            >
              POTENTIAL RISK
            </div>

            <div
              style={{
                fontSize: 13.5,
                color: C.text,
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              {concentration > 60
                ? "High exposure to one asset means its performance can have a larger effect on the overall portfolio."
                : "Your simulated exposure looks reasonably balanced for this exercise."}
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.royal,
                marginBottom: 6,
              }}
            >
              WHAT TO LEARN NEXT
            </div>

            <div
              style={{
                fontSize: 13.5,
                color: C.text,
                marginBottom: 16,
              }}
            >
              Portfolio Diversification · Risk Management
            </div>

            <div
              style={{
                fontSize: 11,
                color: C.sub,
                background: C.bg2,
                padding: 10,
                borderRadius: 10,
                marginBottom: 14,
              }}
            >
              Educational simulation only. It does not provide personalized financial advice or guarantee investment returns.
            </div>

            <Btn
              variant="primary"
              full
              onClick={() =>
                setFeedbackOpen(
                  false
                )
              }
            >
              Close
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   BUSINESS SIMULATOR

   Each business idea now carries its own economics (cost
   structure, base demand, price sensitivity) so the choice
   made in Step 1 actually changes the numbers in Step 4 —
   previously every idea used identical fixed formulas.
========================================================= */

const BUSINESS_IDEAS = [
  {
    id: "coffee",
    label: "Coffee Shop",
    icon: Coffee,
    // Local foot-traffic business: modest base demand, very
    // price-sensitive, lower marketing leverage, high COGS
    // (ingredients/labor per cup).
    baseDemand: 1800,
    priceSensitivity: 55,
    marketingLeverage: 6,
    cogsRate: 0.35,
    referencePrice: 5,
  },
  {
    id: "ecom",
    label: "E-commerce Store",
    icon: Truck,
    // Wider reach via marketing spend, moderate price
    // sensitivity, moderate COGS (goods + shipping).
    baseDemand: 2600,
    priceSensitivity: 40,
    marketingLeverage: 10,
    cogsRate: 0.45,
    referencePrice: 25,
  },
  {
    id: "tech",
    label: "Tech Startup",
    icon: Rocket,
    // Smaller initial demand (early adopters), least price
    // sensitive, highest marketing leverage, low COGS
    // (software has near-zero marginal cost).
    baseDemand: 900,
    priceSensitivity: 20,
    marketingLeverage: 14,
    cogsRate: 0.15,
    referencePrice: 40,
  },
];

function BusinessSimulator({
  goBack,
  onSimComplete,
}) {
  const [step, setStep] =
    useState(0);

  const [ideaId, setIdeaId] =
    useState(null);

  const idea = BUSINESS_IDEAS.find((b) => b.id === ideaId) || null;

  const [price, setPrice] =
    useState(25);

  const [marketing, setMarketing] =
    useState(6000);

  const [employees, setEmployees] =
    useState(3);

  const budget = 50000;
  const rent = 5000;

  const spent =
    marketing +
    employees * 2000 +
    rent;

  const remaining =
    budget - spent;

  // Demand now depends on which idea was picked: its base
  // demand, how much marketing spend moves the needle for
  // that kind of business, and how sensitive its customers
  // are to price relative to that business's own reference
  // price point (a $25 coffee vs a $25 gadget mean very
  // different things).
  const demand = idea
    ? Math.max(
        0,
        Math.round(
          idea.baseDemand +
            marketing / idea.marketingLeverage -
            (price - idea.referencePrice) * idea.priceSensitivity
        )
      )
    : 0;

  const revenue = Math.round(
    demand * price
  );

  const cogs = idea
    ? Math.round(demand * price * idea.cogsRate)
    : 0;

  const expenses = Math.round(
    marketing +
      employees * 2000 +
      rent +
      cogs
  );

  const profit =
    revenue - expenses;

  const margin =
    revenue
      ? (profit / revenue) * 100
      : 0;

  const scores = {
    financial: Math.max(
      10,
      Math.min(
        98,
        55 + margin
      )
    ),

    marketing: Math.max(
      10,
      Math.min(
        98,
        40 +
          (marketing /
            budget) *
            120
      )
    ),

    risk: Math.max(
      10,
      Math.min(
        98,
        remaining > 0
          ? 70 +
              (remaining /
                budget) *
                60
          : 30
      )
    ),

    growth: Math.max(
      10,
      Math.min(
        98,
        50 +
          margin *
            0.8
      )
    ),
  };

  const overall = Math.round(
    (scores.financial +
      scores.marketing +
      scores.risk +
      scores.growth) /
      4
  );

  const steps = [
    "Idea",
    "Budget",
    "Pricing",
    "Results",
  ];

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title="Founder Simulator"
        onBack={goBack}
      />

      <div
        style={{
          display: "flex",
          gap: 6,
          margin: "14px 0 18px",
        }}
      >
        {steps.map(
          (stepName, index) => (
            <div
              key={stepName}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 99,
                background:
                  index <= step
                    ? C.purple
                    : C.bg2,
              }}
            />
          )
        )}
      </div>

      {step === 0 && (
        <div className="mf-fade">
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: C.navy,
              marginBottom: 12,
            }}
          >
            Choose your business idea
          </div>

          {BUSINESS_IDEAS.map(
            (business) => {
              const Icon =
                business.icon;

              const selected =
                ideaId ===
                business.id;

              return (
                <Card
                  key={business.id}
                  onClick={() => {
                    setIdeaId(business.id);
                    // Seed price near this idea's own
                    // reference point so Step 3's numbers
                    // start realistic for the chosen idea.
                    setPrice(business.referencePrice);
                  }}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 12,
                    border: selected
                      ? `2px solid ${C.purple}`
                      : `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background:
                        C.purpleBg,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <Icon
                      size={19}
                      color={C.purple}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: C.navy,
                      }}
                    >
                      {business.label}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: C.sub,
                        marginTop: 2,
                      }}
                    >
                      Typical price ~${business.referencePrice} ·{" "}
                      {Math.round(business.cogsRate * 100)}% cost of goods
                    </div>
                  </div>

                  {selected && (
                    <CheckCircle2
                      size={18}
                      color={
                        C.purple
                      }
                    />
                  )}
                </Card>
              );
            }
          )}

          <Btn
            variant="primary"
            full
            disabled={!idea}
            onClick={() =>
              setStep(1)
            }
            style={{
              marginTop: 8,
            }}
          >
            Next
          </Btn>
        </div>
      )}

      {step === 1 && (
        <div className="mf-fade">
          <Card
            style={{
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                color: C.sub,
                fontWeight: 600,
              }}
            >
              Available Capital
            </div>

            <div
              style={{
                fontFamily:
                  FONT_MONO,
                fontWeight: 700,
                fontSize: 22,
                color: C.navy,
                marginTop: 4,
              }}
            >
              $
              {budget.toLocaleString()}
            </div>

            <div
              style={{
                fontSize: 12,
                color:
                  remaining >= 0
                    ? C.emerald
                    : C.red,
                marginTop: 4,
                fontWeight: 700,
              }}
            >
              $
              {remaining.toLocaleString()}{" "}
              remaining
            </div>
          </Card>

          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: C.navy,
              marginBottom: 6,
            }}
          >
            Marketing Budget:{" "}
            <span
              style={{
                fontFamily:
                  FONT_MONO,
                color: C.royal,
              }}
            >
              $
              {marketing.toLocaleString()}
            </span>
          </div>

          <label htmlFor="mf-marketing" style={{ display: "none" }}>
            Marketing budget
          </label>
          <input
            id="mf-marketing"
            type="range"
            min={0}
            max={20000}
            step={500}
            value={marketing}
            onChange={(e) =>
              setMarketing(
                Number(
                  e.target.value
                )
              )
            }
            style={{
              width: "100%",
              accentColor:
                C.royal,
              marginBottom: 18,
            }}
          />

          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: C.navy,
              marginBottom: 6,
            }}
          >
            Employees:{" "}
            <span
              style={{
                fontFamily:
                  FONT_MONO,
                color: C.royal,
              }}
            >
              {employees}
            </span>{" "}
            <span
              style={{
                fontSize: 11.5,
                color: C.sub,
                fontWeight: 500,
              }}
            >
              ($2,000 each)
            </span>
          </div>

          <label htmlFor="mf-employees" style={{ display: "none" }}>
            Number of employees
          </label>
          <input
            id="mf-employees"
            type="range"
            min={0}
            max={10}
            step={1}
            value={employees}
            onChange={(e) =>
              setEmployees(
                Number(
                  e.target.value
                )
              )
            }
            style={{
              width: "100%",
              accentColor:
                C.royal,
              marginBottom: 20,
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <Btn
              variant="ghost"
              style={{
                flex: 1,
              }}
              onClick={() =>
                setStep(0)
              }
            >
              Back
            </Btn>

            <Btn
              variant="primary"
              style={{
                flex: 1,
              }}
              onClick={() =>
                setStep(2)
              }
            >
              Next
            </Btn>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mf-fade">
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: C.navy,
              marginBottom: 6,
            }}
          >
            Set your price:{" "}
            <span
              style={{
                fontFamily:
                  FONT_MONO,
                color: C.royal,
              }}
            >
              ${price}
            </span>
          </div>

          <label htmlFor="mf-price" style={{ display: "none" }}>
            Product price
          </label>
          <input
            id="mf-price"
            type="range"
            min={Math.max(1, Math.round((idea?.referencePrice || 25) * 0.3))}
            max={Math.round((idea?.referencePrice || 25) * 2.5)}
            step={1}
            value={price}
            onChange={(e) =>
              setPrice(
                Number(
                  e.target.value
                )
              )
            }
            style={{
              width: "100%",
              accentColor:
                C.royal,
              marginBottom: 18,
            }}
          />

          <Card
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11.5,
                  color: C.sub,
                  fontWeight: 600,
                }}
              >
                Estimated Demand
              </div>

              <div
                style={{
                  fontFamily:
                    FONT_MONO,
                  fontWeight: 700,
                  color: C.navy,
                }}
              >
                {demand.toLocaleString()}{" "}
                units
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 11.5,
                  color: C.sub,
                  fontWeight: 600,
                }}
              >
                Est. Revenue
              </div>

              <div
                style={{
                  fontFamily:
                    FONT_MONO,
                  fontWeight: 700,
                  color: C.emerald,
                }}
              >
                $
                {revenue.toLocaleString()}
              </div>
            </div>
          </Card>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <Btn
              variant="ghost"
              style={{
                flex: 1,
              }}
              onClick={() =>
                setStep(1)
              }
            >
              Back
            </Btn>

            <Btn
              variant="primary"
              style={{
                flex: 1,
              }}
              onClick={() =>
                setStep(3)
              }
            >
              Run Simulation
            </Btn>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mf-fade">
          <Card
            style={{
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.sub,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              BUSINESS SCORE · {idea?.label?.toUpperCase()}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
              }}
            >
              <Ring
                value={overall}
                size={110}
                color={
                  overall > 65
                    ? C.emerald
                    : overall > 45
                      ? C.amber
                      : C.red
                }
                label={overall}
                sub="/ 100"
              />
            </div>
          </Card>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              {
                label: "Revenue",
                value: `$${revenue.toLocaleString()}`,
                color: C.navy,
              },
              {
                label: "Expenses",
                value: `$${expenses.toLocaleString()}`,
                color: C.navy,
              },
              {
                label: "Net Profit",
                value: `$${profit.toLocaleString()}`,
                color:
                  profit >= 0
                    ? C.emerald
                    : C.red,
              },
              {
                label: "Margin",
                value: `${margin.toFixed(1)}%`,
                color: C.navy,
              },
            ].map((item) => (
              <Card
                key={item.label}
                style={{
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: C.sub,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    fontFamily:
                      FONT_MONO,
                    fontWeight: 700,
                    fontSize: 16,
                    color:
                      item.color,
                    marginTop: 3,
                  }}
                >
                  {item.value}
                </div>
              </Card>
            ))}
          </div>

          {[
            {
              label:
                "Financial Management",
              value:
                scores.financial,
              color: C.emerald,
            },
            {
              label: "Marketing",
              value:
                scores.marketing,
              color: C.royal,
            },
            {
              label:
                "Risk Management",
              value:
                scores.risk,
              color: C.amber,
            },
            {
              label:
                "Growth Potential",
              value:
                scores.growth,
              color: C.purple,
            },
          ].map((score) => (
            <div
              key={score.label}
              style={{
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  fontSize: 12.5,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    color: C.sub,
                    fontWeight: 600,
                  }}
                >
                  {score.label}
                </span>

                <span
                  style={{
                    fontFamily:
                      FONT_MONO,
                    fontWeight: 700,
                    color: C.navy,
                  }}
                >
                  {score.value.toFixed(
                    0
                  )}
                  %
                </span>
              </div>

              <Bar
                value={score.value}
                color={score.color}
              />
            </div>
          ))}

          <div
            style={{
              margin: "18px 0",
            }}
          >
            <AIInsightCard
              eyebrow="AI Business Mentor"
              text={
                margin < 10
                  ? `Your marketing and hiring costs are eating into your margin for a ${idea?.label?.toLowerCase()}. Consider adjusting expenses or pricing before scaling.`
                  : `Your pricing strategy is generating a healthy margin for a ${idea?.label?.toLowerCase()}. Keep an eye on cash reserves as you consider reinvesting in growth.`
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <Btn
              variant="ghost"
              style={{
                flex: 1,
              }}
              onClick={() => {
                setStep(0);
                setIdeaId(null);
              }}
            >
              Try Again
            </Btn>

            <Btn
              variant="primary"
              style={{
                flex: 1,
              }}
              onClick={() => {
                if (onSimComplete) onSimComplete();
                goBack();
              }}
            >
              Done
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
/* =========================================================
   STARTUP BUILDER SIMULATOR (Builder track)
========================================================= */

const BUILDER_IDEAS = [
  { id: "planner", label: "Student Study Planner App", icon: BookOpenCheck, problemStrength: 65 },
  { id: "delivery", label: "Local Grocery Delivery", icon: Truck, problemStrength: 85 },
  { id: "aiTutor", label: "AI Homework Helper", icon: Brain, problemStrength: 55 },
];

const VALIDATION_METHODS = [
  { id: "interviews", label: "Customer Interviews", cost: 1000, weeks: 2, boost: 30 },
  { id: "landing", label: "Landing Page + Waitlist", cost: 500, weeks: 1, boost: 35 },
  { id: "buildFirst", label: "Skip Validation, Just Build", cost: 0, weeks: 0, boost: 0 },
];

const MVP_SCOPES = [
  { id: "core", label: "One Core Feature Only", weeks: 3, cost: 3000, completeness: 40 },
  { id: "coreplus", label: "Core + A Few Extras", weeks: 6, cost: 7000, completeness: 70 },
  { id: "full", label: "Full-Featured Product", weeks: 12, cost: 15000, completeness: 100 },
];

const PITCH_STYLES = [
  { id: "problemFirst", label: "Problem → Solution → Ask", clarity: 90 },
  { id: "visionFirst", label: "Big Vision First", clarity: 60 },
  { id: "featureDump", label: "List Every Feature", clarity: 35 },
];

const BUILDER_BUDGET = 20000;
const BUILDER_RUNWAY_WEEKS = 16;

function clamp100(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function BuilderSimulator({ goBack, onSimComplete }) {
  const [step, setStep] = useState(0);
  const [ideaId, setIdeaId] = useState(null);
  const [validationId, setValidationId] = useState(null);
  const [scopeId, setScopeId] = useState(null);
  const [pitchId, setPitchId] = useState(null);

  const idea = BUILDER_IDEAS.find((i) => i.id === ideaId) || null;
  const validation = VALIDATION_METHODS.find((v) => v.id === validationId) || null;
  const scope = MVP_SCOPES.find((s) => s.id === scopeId) || null;
  const pitch = PITCH_STYLES.find((p) => p.id === pitchId) || null;

  const budgetUsed = (validation?.cost || 0) + (scope?.cost || 0);
  const weeksUsed = (validation?.weeks || 0) + (scope?.weeks || 0);

  const validationScore = idea && validation
    ? clamp100(idea.problemStrength * 0.5 + validation.boost * 1.5)
    : 0;

  const productFitScore = idea && scope
    ? clamp100(scope.completeness * 0.6 + idea.problemStrength * 0.4)
    : 0;

  const pitchScore = pitch ? pitch.clarity : 0;

  const overBudget = budgetUsed > BUILDER_BUDGET;
  const overTime = weeksUsed > BUILDER_RUNWAY_WEEKS;

  const runwayScore = clamp100(
    90 -
      (overBudget ? ((budgetUsed - BUILDER_BUDGET) / 300) : 0) -
      (overTime ? (weeksUsed - BUILDER_RUNWAY_WEEKS) * 4 : 0)
  );

  const overall = Math.round(
    (validationScore + productFitScore + pitchScore + runwayScore) / 4
  );

  const steps = ["Idea", "Validate", "Build", "Pitch", "Results"];

  return (
    <div className="mf-scroll" style={{ height: "100%", overflowY: "auto", padding: "0 18px 100px" }}>
      <TopBar title="Builder Simulation" onBack={goBack} />

      <div style={{ display: "flex", gap: 6, margin: "14px 0 18px" }}>
        {steps.map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 99,
              background: i <= step ? C.amber : C.bg2,
            }}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="mf-fade">
          <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 12 }}>
            Pick a real-world problem to solve
          </div>

          {BUILDER_IDEAS.map((b) => {
            const Icon = b.icon;
            const selected = ideaId === b.id;
            return (
              <Card
                key={b.id}
                onClick={() => setIdeaId(b.id)}
                style={{
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  border: selected ? `2px solid ${C.amber}` : `1px solid ${C.border}`,
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: C.amberBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={19} color={C.amber} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                    Problem strength: {b.problemStrength}/100
                  </div>
                </div>
                {selected && <CheckCircle2 size={18} color={C.amber} />}
              </Card>
            );
          })}

          <Btn variant="primary" full disabled={!idea} onClick={() => setStep(1)} style={{ marginTop: 8 }}>
            Next
          </Btn>
        </div>
      )}

      {step === 1 && (
        <div className="mf-fade">
          <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 12 }}>
            How will you validate this idea before building?
          </div>

          {VALIDATION_METHODS.map((v) => {
            const selected = validationId === v.id;
            return (
              <Card
                key={v.id}
                onClick={() => setValidationId(v.id)}
                style={{ marginBottom: 10, border: selected ? `2px solid ${C.amber}` : `1px solid ${C.border}` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{v.label}</div>
                  {selected && <CheckCircle2 size={18} color={C.amber} />}
                </div>
                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>
                  Cost ${v.cost.toLocaleString()} · {v.weeks} week{v.weeks === 1 ? "" : "s"}
                </div>
              </Card>
            );
          })}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" style={{ flex: 1 }} onClick={() => setStep(0)}>Back</Btn>
            <Btn variant="primary" style={{ flex: 1 }} disabled={!validation} onClick={() => setStep(2)}>Next</Btn>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mf-fade">
          <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 12 }}>
            How much should you build before launching?
          </div>

          {MVP_SCOPES.map((s) => {
            const selected = scopeId === s.id;
            return (
              <Card
                key={s.id}
                onClick={() => setScopeId(s.id)}
                style={{ marginBottom: 10, border: selected ? `2px solid ${C.amber}` : `1px solid ${C.border}` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{s.label}</div>
                  {selected && <CheckCircle2 size={18} color={C.amber} />}
                </div>
                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>
                  Cost ${s.cost.toLocaleString()} · {s.weeks} weeks
                </div>
              </Card>
            );
          })}

          <Card style={{ marginTop: 4, marginBottom: 16, background: C.bg2, border: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: C.sub }}>Budget used</span>
              <b style={{ color: overBudget ? C.red : C.navy, fontFamily: FONT_MONO }}>
                ${budgetUsed.toLocaleString()} / ${BUILDER_BUDGET.toLocaleString()}
              </b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
              <span style={{ color: C.sub }}>Time used</span>
              <b style={{ color: overTime ? C.red : C.navy, fontFamily: FONT_MONO }}>
                {weeksUsed} / {BUILDER_RUNWAY_WEEKS} weeks
              </b>
            </div>
          </Card>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</Btn>
            <Btn variant="primary" style={{ flex: 1 }} disabled={!scope} onClick={() => setStep(3)}>Next</Btn>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mf-fade">
          <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 12 }}>
            How will you pitch it to investors?
          </div>

          {PITCH_STYLES.map((p) => {
            const selected = pitchId === p.id;
            return (
              <Card
                key={p.id}
                onClick={() => setPitchId(p.id)}
                style={{ marginBottom: 10, border: selected ? `2px solid ${C.amber}` : `1px solid ${C.border}` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{p.label}</div>
                  {selected && <CheckCircle2 size={18} color={C.amber} />}
                </div>
              </Card>
            );
          })}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</Btn>
            <Btn variant="primary" style={{ flex: 1 }} disabled={!pitch} onClick={() => setStep(4)}>
              Run Simulation
            </Btn>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mf-fade">
          <Card style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: C.sub, fontWeight: 700, marginBottom: 8 }}>
              STARTUP SCORE · {idea?.label?.toUpperCase()}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Ring
                value={overall}
                size={110}
                color={overall > 65 ? C.emerald : overall > 45 ? C.amber : C.red}
                label={overall}
                sub="/ 100"
              />
            </div>
          </Card>

          {[
            { label: "Idea Validation", value: validationScore, color: C.royal },
            { label: "Product Fit", value: productFitScore, color: C.emerald },
            { label: "Pitch Clarity", value: pitchScore, color: C.purple },
            { label: "Budget & Runway", value: runwayScore, color: C.amber },
          ].map((score) => (
            <div key={score.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                <span style={{ color: C.sub, fontWeight: 600 }}>{score.label}</span>
                <span style={{ fontFamily: FONT_MONO, fontWeight: 700, color: C.navy }}>{score.value}%</span>
              </div>
              <Bar value={score.value} color={score.color} />
            </div>
          ))}

          <div style={{ margin: "18px 0" }}>
            <AIInsightCard
              eyebrow="AI Startup Mentor"
              text={
                overBudget || overTime
                  ? "You ran over your budget or runway before launching — in real life this often means raising more money or cutting scope earlier."
                  : validationScore < 50
                    ? "You built with weak validation. Cheap, fast tests (interviews or a landing page) usually catch bad ideas before they cost real money."
                    : "Solid execution: you validated the idea, matched your build to your resources, and pitched it clearly."
              }
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn
              variant="ghost"
              style={{ flex: 1 }}
              onClick={() => {
                setStep(0);
                setIdeaId(null);
                setValidationId(null);
                setScopeId(null);
                setPitchId(null);
              }}
            >
              Try Again
            </Btn>
            <Btn
              variant="primary"
              style={{ flex: 1 }}
              onClick={() => {
                if (onSimComplete) onSimComplete();
                goBack();
              }}
            >
              Done
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   AI MENTOR — now a real chat interface.

   - Quick-prompt chips are shown before the first message
     (tapping one sends it as a user message).
   - The student can also type any question in the input bar.
   - Responses are generated live via the Anthropic API so
     answers are dynamic instead of fixed canned text.
========================================================= */
  const PROMPTS = [
  {
    id: "tracks",
    icon: Target,
    text: "Tell me about the 3 learning tracks.",
    ar: "احكيلي عن الـ 3 Tracks في المنصة",
  },
  {
    id: "compare",
    icon: BarChart3,
    text: "Compare the Investment, Founder and Builder tracks.",
    ar: "قارنلي بين Track الاستثمار والمؤسس والباني",
  },
  {
    id: "start",
    icon: GraduationCap,
    text: "Which track should I start with?",
    ar: "أبدأ بأنهي Track؟",
  },
  {
    id: "learn",
    icon: Lightbulb,
    text: "What will I learn in each track?",
    ar: "هتعلم إيه في كل Track؟",
  },
];
/* =========================================================
   SHARED AI HELPER
   Used by AI Mentor chat, AI-graded reflection questions, and
   the AI-generated simulator reviews below. Throws on failure
   so each caller can show its own clear error/retry state.
========================================================= */

async function callClaudeAI(promptText) {
  const payload = await api.mentor(promptText);
  if (!payload.text) throw new Error("AI returned an empty response");
  return payload.text;
}

const AI_MENTOR_SYSTEM_PROMPT =
  `You are 'AI Mentor', a warm, encouraging learning coach inside a business & finance education app called ${APP_NAME} that serves students from middle school through university. ` +
  "Answer the student's question simply and clearly, in under about 130 words, using short paragraphs or a short bullet list when useful. " +
  "Reply in the same language the student used (Arabic or English). " +
  "Keep things educational and general — never give personalized financial, investment or trading advice, and don't recommend specific stocks, brokers or products. " +
  "If the question is unrelated to business, money, investing or entrepreneurship, gently steer the student back to those topics.";

async function fetchAIMentorReply(userText) {
  return callClaudeAI(
    `${AI_MENTOR_SYSTEM_PROMPT}\n\nStudent question: ${userText}`,
    600
  );
}
function ChatBubble({ role, text, isError, darkMode }) {
  const isUser = role === "user";
  const mentorTextColor = darkMode ? "#475569" : null;

  return (
    <div
      className="mf-fade"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 14,
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 20,
            flexShrink: 1,
            overflow: "hidden",
            background: "#bbc7d7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "none",
          }}
        >
          <img
            src="logodarkmode.png"
            alt="AI Mentor"
            style={{
              width: 30,
              height: 30,
              objectFit: "contain",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <Bot size={18} color={C.royal} />
        </div>
      )}

      <div
        style={{
          maxWidth: "82%",
          padding: "12px 15px",
          borderRadius: isUser
            ? "18px 18px 5px 18px"
            : "18px 18px 18px 5px",
          fontSize: 13,
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
          direction: "auto",

          background: isUser
            ? `linear-gradient(135deg, ${C.royal}, ${C.electric})`
            : isError
              ? C.amberBg
              : "#FFFFFF",

          color: mentorTextColor || (isUser
            ? "#FFFFFF"
            : isError
              ? "#92400E"
              : C.text),

          border: isUser
            ? "none"
            : isError
              ? "1px solid #FDE68A"
              : `1px solid ${C.border}`,

          boxShadow: isUser
            ? "0 5px 16px rgba(37,99,235,0.20)"
            : "0 3px 12px rgba(15,23,42,0.05)",
        }}
      >
        {text}
      </div>
    </div>
  );
}
function AIMentor({ go }) {
  const { language, darkMode } = useAppSettings();
  const isArabic = language === "ar";
  const mentorTextColor = darkMode ? "#475569" : null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastFailedText, setLastFailedText] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage(rawText) {
    const text = (rawText || "").trim();

    if (!text || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        id: `u-${Date.now()}`,
        role: "user",
        text,
      },
    ]);

    setInput("");
    setLoading(true);
    setLastFailedText(null);

    try {
      const replyText = await fetchAIMentorReply(text);

      setMessages((previous) => [
        ...previous,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          text: replyText,
        },
      ]);
    } catch (err) {
      setMessages((previous) => [
        ...previous,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          isError: true,
          text: isArabic
            ? "تعذر الوصول إلى المرشد الذكي حاليًا. حاولي مرة أخرى."
            : "I couldn't reach the AI Mentor right now. Please try again.",
        },
      ]);

      setLastFailedText(text);
    } finally {
      setLoading(false);
    }
  }

  function clearConversation() {
    setMessages([]);
    setInput("");
    setLastFailedText(null);
  }

  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setInput(
        isArabic
          ? "الإدخال الصوتي غير مدعوم في هذا المتصفح."
          : "Voice input is not supported in this browser."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = isArabic
      ? "ar-EG"
      : "en-US";

    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  const hasStarted = messages.length > 0;

  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        direction: isArabic ? "rtl" : "ltr",
        position: "relative",
        overflow: "visible",
        background:
          "linear-gradient(180deg, #EAF1FD 0%, #F3F7FE 38%, #FBFDFF 100%)",
      }}
    >
      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes aiFloat {
            0%, 100% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-6px);
            }
          }

          @keyframes aiPulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(37,99,235,0.18);
            }

            50% {
              box-shadow: 0 0 0 9px rgba(37,99,235,0);
            }
          }

          @keyframes aiGlow {
            0%, 100% {
              opacity: .35;
            }

            50% {
              opacity: .75;
            }
          }

          @keyframes aiHeaderSheen {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }

          .ai-question-card {
            transition:
              transform .2s ease,
              box-shadow .2s ease,
              border-color .2s ease;
          }

          .ai-question-card:hover {
            transform: translateY(-4px);
            border-color: rgba(37,99,235,.28) !important;
            box-shadow:
              0 12px 28px rgba(37,99,235,.12) !important;
          }

          .ai-send-button {
            transition:
              transform .18s ease,
              box-shadow .18s ease;
          }

          .ai-send-button:hover:not(:disabled) {
            transform: translateY(-2px) scale(1.03);
            box-shadow:
              0 10px 25px rgba(37,99,235,.30) !important;
          }

          .ai-mic-button {
            transition:
              transform .18s ease,
              box-shadow .18s ease;
          }

          .ai-mic-button:hover {
            transform: scale(1.05);
          }

          .ai-back-button {
            transition:
              transform .18s ease,
              background .18s ease;
          }

          .ai-back-button:hover {
            transform: translateX(-3px);
            background: #EFF6FF !important;
          }

          .ai-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .ai-scroll::-webkit-scrollbar-thumb {
            background: #CBD5E1;
            border-radius: 99px;
          }

          @media (max-width: 800px) {
            .ai-questions-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 520px) {
            .ai-questions-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* HEADER — deep blue banner carrying the app logo and mentor identity */}
      <div
        style={{
          flexShrink: 0,
          position: "relative",
          zIndex: 5,
          overflow: "hidden",
          background:
            "linear-gradient(120deg, #0B1F3A 0%, #16336B 42%, #2563EB 82%, #38BDF8 130%)",
          backgroundSize: "220% 220%",
          animation: "aiHeaderSheen 14s ease-in-out infinite alternate",
          borderRadius: "0 0 26px 26px",
          boxShadow: "0 14px 30px rgba(15,42,90,.22)",
          padding: "14px 16px 18px",
        }}
      >
        {/* soft decorative glows */}
        <div
          className="mf-decor"
          style={{
            position: "absolute",
            top: -46,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,.45), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="mf-decor"
          style={{
            position: "absolute",
            bottom: -60,
            left: -40,
            width: 170,
            height: 170,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,.28), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              minWidth: 0,
            }}
          >
            {/* BACK */}
            <button
              type="button"
              onClick={() => go("home")}
              className="ai-back-button"
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.12)",
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Back"
            >
              <ChevronLeft size={18} />
            </button>

            {/* LOGO BADGE */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 15,
                background: "rgba(255,255,255,0.94)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(11,31,58,.35)",
                flexShrink: 0,
                overflow: "hidden",
                padding: 6,
              }}
            >
              <img
                src="/logodarkmode.png"
                alt={`${APP_NAME} logo`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 18,
                    fontWeight: 850,
                    color: "#FFFFFF",
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {isArabic ? "المرشد الذكي" : "AI Mentor"}
                </div>

                <Sparkles size={14} color="#BFE0FF" />
              </div>

              <div
                style={{
                  fontSize: 10.5,
                  color: "rgba(255,255,255,0.78)",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {APP_NAME} ·{" "}
                {isArabic ? "مساعدك للتعلّم والنمو" : "Your learning companion"}
              </div>
            </div>
          </div>

          {/* CLEAR */}
          {hasStarted && (
            <button
              type="button"
              onClick={clearConversation}
              style={{
                border: "1px solid rgba(255,255,255,0.28)",
                background: "rgba(255,255,255,0.14)",
                color: "#FFFFFF",
                borderRadius: 11,
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 10.5,
                fontWeight: 750,
                flexShrink: 0,
              }}
            >
              {isArabic ? "مسح" : "Clear"}
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        ref={scrollRef}
        className="ai-scroll"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px 18px 12px",
        }}
      >
        {!hasStarted ? (
          <>
            {/* HERO */}
            <div
              style={{
                position: "relative",
                textAlign: "center",
                padding: "5px 5px 12px",
              }}
            >
              {/* DECORATIVE CIRCLE */}
              <div
                style={{
                  position: "absolute",
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: "#DBEAFE",
                  filter: "blur(30px)",
                  opacity: 0.55,
                  left: "17%",
                  top: 10,
                  pointerEvents: "none",
                  animation: "aiGlow 3s infinite",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "#E0F2FE",
                  filter: "blur(28px)",
                  opacity: 0.5,
                  right: "18%",
                  top: 30,
                  pointerEvents: "none",
                }}
              />

              {/* BOT */}
              <div
                style={{
                  position: "relative",
                  width: 78,
                  height: 78,
                  margin: "3px auto 9px",
                  borderRadius: 25,
                  background:
                    "linear-gradient(145deg, #E0EDFF, #F8FBFF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    "1px solid rgba(37,99,235,.10)",
                  boxShadow:
                    "0 14px 35px rgba(37,99,235,.13)",
                  animation:
                    "aiFloat 3.5s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    width: 57,
                    height: 57,
                    borderRadius: 19,
                    background:
                      `linear-gradient(135deg, ${C.royal}, ${C.electric})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 9px 22px rgba(37,99,235,.25)",
                  }}
                >
                  <Bot
                    size={31}
                    color="#FFFFFF"
                    strokeWidth={1.8}
                  />
                </div>

                <span
                  style={{
                    position: "absolute",
                    right: 2,
                    bottom: 2,
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: "#22C55E",
                    border: "3px solid #FFFFFF",
                  }}
                />
              </div>

              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 24,
                  fontWeight: 850,
                  color: mentorTextColor || C.navy,
                  letterSpacing: "-0.6px",
                }}
              >
                {isArabic
                  ? "أهلًا! إزاي أساعدك؟"
                  : "Hi! How can I help you?"}
              </div>

              <div
                style={{
                  margin: "5px auto 0",
                  maxWidth: 480,
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  color: mentorTextColor || C.sub,
                }}
              >
                {isArabic
                  ? "اسألني عن الـ 3 Tracks، الفرق بينهم، أو تبدأ منين."
                  : "Ask me about the 3 tracks, their differences, or where to start."}
              </div>
            </div>

            {/* QUICK QUESTIONS */}
            <div
              style={{
                marginTop: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 7,
                  color: mentorTextColor || C.royal,
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    background: "#DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles
                    size={13}
                    color={C.royal}
                  />
                </div>

                {isArabic
                  ? "أسئلة سريعة"
                  : "Quick questions"}
              </div>

              <div
                className="ai-questions-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(4, minmax(0, 1fr))",
                  gap: 8,
                }}
              >
                {PROMPTS.map((prompt) => {
                  const Icon = prompt.icon;

                  return (
                    <button
                      key={prompt.id}
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        sendMessage(prompt.text)
                      }
                      className="ai-question-card"
                      style={{
                        minHeight: 70,
                        padding: "9px 10px",
                        borderRadius: 15,
                        border:
                          "1px solid rgba(37,99,235,.12)",
                        background:
                          "rgba(255,255,255,.92)",
                        cursor: loading
                          ? "default"
                          : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        textAlign: isArabic
                          ? "right"
                          : "left",
                        boxShadow:
                          "0 4px 14px rgba(37,99,235,.05)",
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          flexShrink: 0,
                          borderRadius: 11,
                          background: "#E5F0FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          size={17}
                          color={C.royal}
                        />
                      </div>

                      <span
                        style={{
                          fontSize: 10.5,
                          lineHeight: 1.35,
                          fontWeight: 750,
                          color: mentorTextColor || C.navy,
                        }}
                      >
                        {isArabic
                          ? prompt.ar
                          : prompt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SMALL INFO CARD */}
            <div
              style={{
                marginTop: 10,
                padding: "10px 13px",
                borderRadius: 15,
                background:
                  "linear-gradient(135deg, #EFF6FF, #F8FBFF)",
                border:
                  "1px solid rgba(37,99,235,.08)",
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background: "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MessageCircle
                  size={15}
                  color={C.royal}
                />
              </div>

              <div
                style={{
                  fontSize: 10.5,
                  lineHeight: 1.45,
                  color: mentorTextColor || C.text,
                }}
              >
                <strong style={{ color: mentorTextColor || C.royal }}>
                  AI Mentor
                </strong>{" "}
                {isArabic
                  ? "اسأل عن Track الاستثمار أو المؤسس أو الباني."
                  : "Ask about the Investment, Founder, or Builder track."}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* CHAT MESSAGES */}
            <div
              style={{
                maxWidth: 900,
                margin: "0 auto",
                paddingTop: 5,
              }}
            >
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  role={message.role}
                  text={message.text}
                  isError={message.isError}
                  darkMode={darkMode}
                />
              ))}

              {/* LOADING */}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      background: "#DBEAFE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles
                      size={15}
                      color={C.royal}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius:
                        "17px 17px 17px 5px",
                      background: "#FFFFFF",
                      border:
                        `1px solid ${C.border}`,
                      color: mentorTextColor || C.sub,
                      fontSize: 11.5,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        animation:
                          "aiGlow 1.2s infinite",
                      }}
                    >
                      {isArabic
                        ? "المرشد بيفكر..."
                        : "AI is thinking..."}
                    </span>
                  </div>
                </div>
              )}

              {/* RETRY */}
              {!loading && lastFailedText && (
                <div
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Btn
                    variant="outline"
                    icon={RotateCcw}
                    onClick={() =>
                      sendMessage(lastFailedText)
                    }
                    style={{
                      padding: "7px 12px",
                      fontSize: 11,
                      color: mentorTextColor || C.royal,
                    }}
                  >
                    {isArabic
                      ? "إعادة المحاولة"
                      : "Retry"}
                  </Btn>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ==================== CHAT COMPOSER ==================== */}
      <div
        style={{
          flexShrink: 0,
          width: "100%",
          padding: "12px 16px 14px",
          background: "#FFFFFF",
          borderTop: "2px solid #E5EDFA",
          boxShadow:
            "0 -10px 30px rgba(37,99,235,0.12)",
          position: "relative",
          zIndex: 100,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 950,
            margin: "0 auto",
          }}
        >
          {/* INPUT BOX */}
          <div
            style={{
              width: "100%",
              minHeight: 64,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 9px",
              boxSizing: "border-box",
              background: "#FFFFFF",
              border: "3px solid #2563EB",
              borderRadius: 20,
              boxShadow:
                "0 8px 28px rgba(37,99,235,0.18)",
              direction: isArabic ? "rtl" : "ltr",
            }}
          >
            {/* MIC */}
            <button
              type="button"
              onClick={startVoiceInput}
              className="ai-mic-button"
              style={{
                width: 48,
                height: 48,
                minWidth: 48,
                border: "none",
                borderRadius: 15,
                background: isListening
                  ? "#FEE2E2"
                  : "#2563EB",
                color: isListening
                  ? "#DC2626"
                  : "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isListening
                  ? "0 0 0 6px rgba(239,68,68,0.12)"
                  : "0 6px 18px rgba(37,99,235,0.28)",
                flexShrink: 0,
              }}
              aria-label="Voice input"
            >
              <Mic
                size={23}
                strokeWidth={2.4}
              />
            </button>

            {/* INPUT */}
            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={
                isListening
                  ? isArabic
                    ? "جاري الاستماع..."
                    : "Listening..."
                  : isArabic
                    ? "اكتبي سؤالك هنا..."
                    : "Type your question here..."
              }
              style={{
                flex: 1,
                minWidth: 0,
                height: 48,
                border: "none",
                outline: "none",
                background: "transparent",
                color: mentorTextColor || "#0F172A",
                fontSize: 14,
                fontWeight: 500,
                padding: "0 5px",
                direction: isArabic
                  ? "rtl"
                  : "ltr",
              }}
            />

            {/* SEND */}
            <button
              type="button"
              onClick={() =>
                sendMessage(input)
              }
              disabled={!input.trim() || loading}
              className="ai-send-button"
              style={{
                width: 48,
                height: 48,
                minWidth: 48,
                border: "none",
                borderRadius: 15,
                background:
                  !input.trim() || loading
                    ? "#CBD5E1"
                    : "linear-gradient(135deg, #2563EB, #38BDF8)",
                color: "#FFFFFF",
                cursor:
                  !input.trim() || loading
                    ? "default"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  !input.trim() || loading
                    ? "none"
                    : "0 6px 18px rgba(37,99,235,0.28)",
                flexShrink: 0,
              }}
              aria-label="Send message"
            >
              <Send
                size={21}
                strokeWidth={2.4}
              />
            </button>
          </div>

          {/* VOICE STATUS */}
          {isListening && (
            <div
              style={{
                marginTop: 6,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 700,
                color: mentorTextColor || "#DC2626",
              }}
            >
              ●{" "}
              {isArabic
                ? "جاري الاستماع..."
                : "Listening..."}
            </div>
          )}

          {/* FOOTER */}
          <div
            style={{
              marginTop: 5,
              textAlign: "center",
              fontSize: 9.5,
              color: mentorTextColor || "#94A3B8",
            }}
          >
            AI Mentor • Investment • Founder • Builder
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   SETTINGS (Focus Mode + Appearance + Language + Learning Style)
========================================================= */

function SettingsToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  accentColor,
  accentBg,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 8px",
        borderRadius: 14,
        background: checked ? accentBg : "transparent",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: checked ? "rgba(255,255,255,0.72)" : C.bg2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={checked ? accentColor : C.sub} />
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: checked ? accentColor : C.navy,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 11.5,
            color: C.sub,
            marginTop: 3,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>

      <div
        className="mf-tap"
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={title}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        style={{
          width: 44,
          height: 26,
          borderRadius: 99,
          background: checked ? accentColor : C.bg2,
          position: "relative",
          cursor: "pointer",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            insetInlineStart: checked ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            transition: "inset-inline-start .18s ease",
          }}
        />
      </div>
    </div>
  );
}

function SettingsChoice({
  icon: Icon,
  title,
  description,
  value,
  options,
  onChange,
  accentColor = C.royal,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 8px",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: C.bg2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={accentColor} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: C.navy,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 11.5,
            color: C.sub,
            marginTop: 3,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>

        <div
          role="group"
          aria-label={title}
          style={{
            display: "flex",
            gap: 6,
            marginTop: 10,
            padding: 4,
            borderRadius: 12,
            background: C.bg2,
          }}
        >
          {options.map((option) => {
            const selected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className="mf-tap"
                onClick={() => onChange(option.value)}
                aria-pressed={selected}
                style={{
                  flex: 1,
                  border: 0,
                  borderRadius: 9,
                  padding: "8px 10px",
                  background: selected ? C.card : "transparent",
                  color: selected ? accentColor : C.sub,
                  boxShadow: selected ? "0 1px 3px rgba(15,23,42,0.12)" : "none",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({
  goBack,
}) {
  const {
    focusMode,
    setFocusMode,
    darkMode,
    setDarkMode,
    language,
    setLanguage,
  } = useAppSettings();

  const { preferredStyles, setPreferredStyles, preferredTracks, setPreferredTracks } = usePreferences();
  const isArabic = language === "ar";
  const styleLabels = isArabic
    ? {
        videos: "فيديوهات",
        reading: "قراءة",
        quizzes: "اختبارات",
        sim: "محاكاة",
        ai: "تعلّم بالذكاء الاصطناعي",
      }
    : {};

  const toggleStyle = (styleId) => {
    setPreferredStyles((previous) => {
      const isSelected = previous.includes(styleId);

      // Keep at least one format selected so the student
      // never ends up with every screen empty.
      if (isSelected && previous.length === 1) return previous;

      return isSelected
        ? previous.filter((item) => item !== styleId)
        : [...previous, styleId];
    });
  };

  // No minimum here — leaving preferredTracks empty is the
  // valid "no preference / show everything" state, unlike
  // preferredStyles above.
  const toggleTrack = (trackId) => {
    setPreferredTracks((previous) =>
      previous.includes(trackId)
        ? previous.filter((item) => item !== trackId)
        : [...previous, trackId]
    );
  };

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar
        title={isArabic ? "إعدادات التطبيق" : "App Settings"}
        subtitle={
          isArabic
            ? `خصّص ${APP_NAME} بالطريقة التي تناسبك.`
            : `Personalize ${APP_NAME} to fit the way you learn best.`
        }
        onBack={goBack}
      />

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "18px 0 8px",
        }}
      >
        {isArabic ? "التركيز والانتباه" : "Focus & Attention"}
      </div>

      <Card style={{ padding: "6px 14px" }}>
        <SettingsToggle
          icon={Timer}
          title={isArabic ? "وضع التركيز" : "Focus Mode"}
          description={
            isArabic
              ? "يقلّل الحركة والعناصر الزخرفية لتبقى الشاشات أهدأ وأسهل في التركيز."
              : "Reduced distractions and motion — turns off decorative animations and floating shapes app-wide so screens stay calmer and easier to focus on."
          }
          checked={focusMode}
          onChange={setFocusMode}
          accentColor={C.purple}
          accentBg={C.purpleBg}
        />
      </Card>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 8px",
        }}
      >
        {isArabic ? "المظهر" : "Appearance"}
      </div>

      <Card style={{ padding: "6px 14px" }}>
        <SettingsChoice
          icon={darkMode ? Moon : Sun}
          title={isArabic ? "المظهر" : "Appearance"}
          description={
            isArabic
              ? "اختر المظهر الفاتح أو الداكن للتطبيق بالكامل."
              : "Choose a light or dark appearance for the entire app."
          }
          value={darkMode ? "dark" : "light"}
          options={[
            { value: "light", label: isArabic ? "فاتح" : "Light" },
            { value: "dark", label: isArabic ? "داكن" : "Dark" },
          ]}
          onChange={(appearance) => setDarkMode(appearance === "dark")}
          accentColor={C.royal}
        />
      </Card>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 8px",
        }}
      >
        {isArabic ? "اللغة" : "Language"}
      </div>

      <Card style={{ padding: "6px 14px" }}>
        <SettingsChoice
          icon={Languages}
          title={isArabic ? "لغة التطبيق" : "App language"}
          description={
            isArabic
              ? "اختر العربية أو الإنجليزية. يتغيّر اتجاه التطبيق تلقائيًا مع العربية."
              : "Choose English or العربية. The app automatically switches to right-to-left for Arabic."
          }
          value={language}
          options={[
            { value: "en", label: isArabic ? "الإنجليزية" : "E · English" },
            { value: "ar", label: isArabic ? "العربية" : "ع · العربية" },
          ]}
          onChange={setLanguage}
          accentColor={C.purple}
        />
      </Card>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 8px",
        }}
      >
        {isArabic ? "المسارات المفضّلة" : "Preferred Tracks"}
      </div>

      <div
        style={{
          fontSize: 11.5,
          color: C.sub,
          lineHeight: 1.5,
          marginBottom: 10,
        }}
      >
        {isArabic
          ? "اختر المسارات التي تهمّك. ستعرض شاشة التدريب فقط المحاكاة المطابقة. اتركها فارغة لعرض كل المسارات."
          : "Choose the tracks you're interested in. Practice will only show matching simulations. Leave empty to see everything."}
      </div>

      <div
        role="group"
        aria-label={isArabic ? "المسارات المفضّلة" : "Preferred tracks"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {TRACKS.map((track) => {
          const Icon = track.icon;
          const selected = preferredTracks.includes(track.id);

          return (
            <Card
              key={track.id}
              onClick={() => toggleTrack(track.id)}
              role="checkbox"
              ariaLabel={track.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 13,
                border: selected
                  ? `1.5px solid ${track.color}`
                  : `1px solid ${C.border}`,
              }}
            >
              <Icon size={17} color={selected ? track.color : C.sub} />

              <span
                style={{
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: selected ? track.color : C.text,
                  flex: 1,
                }}
              >
                {track.title}
              </span>

              {selected && (
                <CheckCircle2 size={16} color={track.color} />
              )}
            </Card>
          );
        })}
      </div>

      {preferredTracks.length > 0 && (
        <div
          className="mf-tap"
          role="button"
          tabIndex={0}
          onClick={() => setPreferredTracks([])}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setPreferredTracks([]);
            }
          }}
          style={{
            marginTop: 10,
            fontSize: 11.5,
            fontWeight: 700,
            color: C.royal,
            cursor: "pointer",
          }}
        >
          {isArabic ? "إظهار كل المسارات" : "Show all tracks"}
        </div>
      )}

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 8px",
        }}
      >
        {isArabic ? "أسلوب التعلّم" : "Learning Style"}
      </div>

      <div
        style={{
          fontSize: 11.5,
          color: C.sub,
          lineHeight: 1.5,
          marginBottom: 10,
        }}
      >
        {isArabic
          ? "اختر صيغ التعلّم التي تريد رؤيتها. ستعرض الدورات والتدريب المحتوى المطابق لاختيارك فقط."
          : "Choose the formats you want to see. Courses and Practice will only show content that matches your selection."}
      </div>

      <div
        role="group"
        aria-label={isArabic ? "أسلوب التعلّم المفضّل" : "Preferred learning style"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {STYLES.map((styleItem) => {
          const Icon = styleItem.icon;
          const selected = preferredStyles.includes(styleItem.id);

          return (
            <Card
              key={styleItem.id}
              onClick={() => toggleStyle(styleItem.id)}
              role="checkbox"
              ariaLabel={styleLabels[styleItem.id] || styleItem.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 13,
                border: selected
                  ? `1.5px solid ${C.royal}`
                  : `1px solid ${C.border}`,
              }}
            >
              <Icon size={17} color={selected ? C.royal : C.sub} />

              <span
                style={{
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: selected ? C.royal : C.text,
                  flex: 1,
                }}
              >
                {styleLabels[styleItem.id] || styleItem.label}
              </span>

              {selected && (
                <CheckCircle2 size={16} color={C.royal} />
              )}
            </Card>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 18,
        }}
      >
        <AIInsightCard
          eyebrow={isArabic ? "لماذا يهم ذلك؟" : "Why this matters"}
          text={
            isArabic
              ? "تساعد هذه الإعدادات البسيطة على جعل الدروس والاختبارات والمحاكاة أسهل في المتابعة."
              : "Small interface adjustments like these can make lessons, quizzes and simulations easier to follow."
          }
        />
      </div>
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileScreen({
  go,
  onLogout,
  quizScores,
  completedLessons,
  investmentSimDone,
  businessSimDone,
  builderSimDone,
  streakDays,
}) {
  const toast = useToast();
  const { language } = useAppSettings();
  const isArabic = language === "ar";
  const ForwardIcon = isArabic ? ChevronLeft : ChevronRight;

  const investmentTrack = TRACKS.find((t) => t.id === "investment");
  const businessTrack = TRACKS.find((t) => t.id === "business");
  const entrepreneurTrack = TRACKS.find(
    (t) => t.id === "entrepreneurship"
  );

  const skills = [
    {
      label: isArabic ? "أساسيات الاستثمار" : "Investment Basics",
      value: getTrackProgress(
        investmentTrack,
        completedLessons,
        quizScores
      ),
      color: C.royal,
    },

    {
      label: isArabic ? "استراتيجية المؤسس" : "Founder Strategy",
      value: getTrackProgress(
        businessTrack,
        completedLessons,
        quizScores
      ),
      color: C.purple,
    },

    {
      label: isArabic ? "مهارات البناء" : "Builder Skills",
      value: getTrackProgress(
        entrepreneurTrack,
        completedLessons,
        quizScores
      ),
      color: C.amber,
    },

    {
      label: isArabic ? "إدارة المخاطر" : "Risk Management",
      value: Math.round(
        (getTrackProgress(
          investmentTrack,
          completedLessons,
          quizScores
        ) +
          getTrackProgress(
            businessTrack,
            completedLessons,
            quizScores
          )) /
          2
      ),
      color: C.red,
    },
  ];

  const totalLessonsDone = getTotalLessonsDone(
    completedLessons,
    quizScores
  );

  const totalLessonsCount = getTotalLessonsCount();

  const completedCourses = getCompletedCoursesCount(
    completedLessons,
    quizScores
  );

  const quizValues = Object.values(quizScores);

  const avgQuiz =
    quizValues.length > 0
      ? Math.round(
          quizValues.reduce((a, b) => a + b, 0) /
            quizValues.length
        )
      : 0;

  // Overall progress now also folds in simulator completion,
  // alongside the three learning tracks, instead of silently
  // ignoring practice work that's tracked as its own achievement.
  const trackAvg =
    TRACKS.reduce(
      (sum, track) =>
        sum +
        getTrackProgress(
          track,
          completedLessons,
          quizScores
        ),
      0
    ) / TRACKS.length;

  const simsCompleted =
    (investmentSimDone ? 1 : 0) + (businessSimDone ? 1 : 0) + (builderSimDone ? 1 : 0);

  const overallProgress = Math.round(
    trackAvg * 0.8 + (simsCompleted / 3) * 100 * 0.2
  );

  const achievements = [
    {
      icon: Trophy,
      label: "First Course",
      unlocked: streakDays >= 7,
    },

    {
      icon: Flame,
      label: "7-Day Streak",
      unlocked: true,
    },

    {
      icon: TrendingUp,
      label: "Investment Explorer",
      unlocked:
        getTrackProgress(
          investmentTrack,
          completedLessons,
          quizScores
        ) > 0,
    },

    {
      icon: Brain,
      label: "Quiz Master",
      unlocked:
        Object.keys(
          quizScores
        ).length >= 2,
    },

    {
      icon: Briefcase,
      label: "Business Builder",
      unlocked: !!businessSimDone,
    },

    {
      icon: Rocket,
      label: "Entrepreneur Mindset",
      unlocked: !!builderSimDone,
    },
  ];

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 18px 100px",
      }}
    >
      <TopBar title={isArabic ? "رحلة تعلّمك" : "Your Learning Journey"} />

      <Card
        style={{
          marginTop: 14,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Ring
          value={overallProgress}
          label={`${overallProgress}%`}
          sub={isArabic ? "الإجمالي" : "overall"}
          color={C.royal}
        />

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 10,
          }}
        >
          {[
            [isArabic ? "الدورات" : "Courses", String(completedCourses)],
            [isArabic ? "الدروس" : "Lessons", `${totalLessonsDone}/${totalLessonsCount}`],
            [
              isArabic ? "متوسط الاختبارات" : "Quiz Avg",
              quizValues.length > 0 ? `${avgQuiz}%` : "—",
            ],
            [
              isArabic ? "الاختبارات" : "Quizzes",
              String(
                Object.keys(quizScores).length
              ),
            ],
          ].map(
            ([label, value]) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily:
                      FONT_MONO,
                    fontWeight: 700,
                    fontSize: 15,
                    color: C.navy,
                  }}
                >
                  {value}
                </div>

                <div
                  style={{
                    fontSize: 10.5,
                    color: C.sub,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              </div>
            )
          )}
        </div>
      </Card>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 10px",
        }}
      >
        {isArabic ? "تطوير المهارات" : "Skill Development"}
      </div>

      <Card>
        {skills.map(
          (skill) => (
            <div
              key={skill.label}
              style={{
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  fontSize: 12.5,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    color: C.text,
                    fontWeight: 600,
                  }}
                >
                  {skill.label}
                </span>

                <span
                  style={{
                    fontFamily:
                      FONT_MONO,
                    fontWeight: 700,
                    color: C.navy,
                  }}
                >
                  {skill.value}%
                </span>
              </div>

              <Bar
                value={skill.value}
                color={skill.color}
              />
            </div>
          )
        )}
      </Card>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 10px",
        }}
      >
        {isArabic ? "الإنجازات" : "Achievements"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr 1fr",
          gap: 10,
        }}
      >
        {achievements.map(
          (achievement, index) => {
            const Icon =
              achievement.icon;

            return (
              <Card
                key={index}
                style={{
                  textAlign:
                    "center",
                  padding: 14,
                  opacity:
                    achievement.unlocked
                      ? 1
                      : 0.4,
                }}
              >
                <Icon
                  size={22}
                  color={
                    achievement.unlocked
                      ? C.amber
                      : C.sub
                  }
                  style={{
                    marginBottom: 6,
                  }}
                />

                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: C.navy,
                  }}
                >
                  {achievement.label}
                </div>
              </Card>
            );
          }
        )}
      </div>

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 10px",
        }}
      >
        {isArabic ? "نتائج الاختبارات" : "Quiz Results"}
      </div>

      {Object.keys(
        quizScores
      ).length === 0 ? (
        <Card
          style={{
            textAlign: "center",
          }}
        >
          <Brain
            size={25}
            color={C.sub}
          />

          <div
            style={{
              fontWeight: 700,
              color: C.navy,
              marginTop: 8,
            }}
          >
            {isArabic ? "لم تُكمل أي اختبار بعد" : "No quizzes completed yet"}
          </div>

          <div
            style={{
              color: C.sub,
              fontSize: 11.5,
              marginTop: 3,
            }}
          >
            {isArabic ? "أكمل أول اختبار لرؤية نتيجتك هنا." : "Complete your first quiz to see your score here."}
          </div>
        </Card>
      ) : (
        <Card>
          {Object.entries(
            quizScores
          ).map(
            ([quizId, score]) => {
              const quiz =
                QUIZZES[quizId];

              return (
                <div
                  key={quizId}
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 10,
                    padding:
                      "8px 0",
                    borderBottom:
                      `1px solid ${C.border}`,
                  }}
                >
                  <Brain
                    size={17}
                    color={
                      quiz?.color ||
                      C.royal
                    }
                  />

                  <div
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.navy,
                    }}
                  >
                    {quiz?.title ||
                      quizId}
                  </div>

                  <span
                    style={{
                      fontFamily:
                        FONT_MONO,
                      fontWeight: 700,
                      color:
                        score >= 70
                          ? C.emerald
                          : C.amber,
                    }}
                  >
                    {score}%
                  </span>
                </div>
              );
            }
          )}
        </Card>
      )}

      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: C.navy,
          margin: "20px 0 10px",
        }}
      >
        {isArabic ? "الحساب" : "Account"}
      </div>

      <Card
        style={{
          padding: 6,
        }}
      >
        <div
          className="mf-tap"
          onClick={() => go && go("settings")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              go && go("settings");
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 10px",
            cursor: "pointer",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: C.bg2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Settings size={16} color={C.navy} />
          </div>

          <span
            style={{
              fontWeight: 600,
              fontSize: 13.5,
              color: C.navy,
              flex: 1,
            }}
          >
            {isArabic ? "الإعدادات" : "Settings"}
          </span>

          <ForwardIcon size={16} color={C.sub} />
        </div>

        <div
          className="mf-tap"
          onClick={() =>
            toast(
              isArabic
                ? "الإشعارات غير مفعّلة في هذا النموذج التجريبي بعد."
                : "Notifications aren't wired up yet in this prototype."
            )
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toast(
                isArabic
                  ? "الإشعارات غير مفعّلة في هذا النموذج التجريبي بعد."
                  : "Notifications aren't wired up yet in this prototype."
              );
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: C.bg2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={16} color={C.navy} />
          </div>

          <span
            style={{
              fontWeight: 600,
              fontSize: 13.5,
              color: C.navy,
              flex: 1,
            }}
          >
            {isArabic ? "الإشعارات" : "Notifications"}
          </span>

          <ForwardIcon size={16} color={C.sub} />
        </div>

        <div
          className="mf-tap"
          onClick={onLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onLogout();
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: C.redBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut
              size={16}
              color={C.red}
            />
          </div>

          <span
            style={{
              fontWeight: 700,
              fontSize: 13.5,
              color: C.red,
              flex: 1,
            }}
          >
            {isArabic ? "تسجيل الخروج" : "Logout"}
          </span>
        </div>
      </Card>
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   LANDING PAGE
========================================================= */

const MODES = [
  {
    id: "investor",
    title: "Investor",
    icon: TrendingUp,
    color: C.royal,
    bg: C.blueBg,
    text:
      "Build a virtual investment portfolio and learn risk management safely.",
  },

  {
    id: "founder",
    title: "Founder",
    icon: Briefcase,
    color: C.purple,
    bg: C.purpleBg,
    text:
      "Run a startup and make pricing, marketing and hiring decisions.",
  },

  {
    id: "builder",
    title: "Builder",
    icon: Rocket,
    color: C.amber,
    bg: C.amberBg,
    text:
      "Level up your skills through hands-on challenges and quizzes.",
  },
];

function LandingPage({
  onStart,
  onLogin,
}) {
  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        fontFamily: FONT_BODY,
        background: C.bg,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding:
            "26px 22px 34px",
          background:
            `radial-gradient(circle at 70% 0%, #0b1329 0%, ${C.navy} 55%, #071635 100%)`,
          color: "#fff",
          borderRadius:
            "0 0 32px 32px",
        }}
      >
        <div
          className="mf-decor"
          style={{
            position:
              "absolute",
            top: -40,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%)",
            animation:
              "mfFloat 7s ease-in-out infinite",
          }}
        />
        <div
          className="mf-decor"
          style={{
            position:
              "absolute",
            top: -40,
            left: -50,
            width: 150,
            height: 150,
            borderRadius: "20%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.3), transparent 60%)",
            animation:
              "mfFloat 7s ease-in-out infinite",
          }}
        />


        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            position:
              "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 8,
            }}
          >
    <img
  src="/logo.png"
  alt={APP_NAME}
  style={{
    width: 80,
    height: 80,
    objectFit: "contain",
    borderRadius: 9,
  }}
/>

            
          </div>

          <span
            className="mf-tap"
            onClick={onLogin}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onLogin();
              }
            }}
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color:
                C.electric,
              cursor:
                "pointer",
            }}
          >
            Log In
          </span>
        </div>

        <div
          className="mf-fade"
          style={{
            marginTop: 30,
            position:
              "relative",
          }}
        >
          <div
            style={{
              fontFamily:
                FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 24,
              lineHeight: 1.4,
            }}
          >
            Understanding the learner,
            <br />
            not just teaching the lesson
          </div>

          <div
            style={{
              color: "#A9B8CE",
              fontSize: 13.5,
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            A smart learning platform that combines courses, videos, quizzes and hands-on practice — because real skills come from real decisions.
          </div>

          <div
            className="mf-tap"
            onClick={onStart}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStart();
              }
            }}
            style={{
              marginTop: 22,
              background:
                C.royal,
              color: "#fff",
              padding:
                "14px 20px",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 14,
              display:
                "inline-flex",
              alignItems:
                "center",
              gap: 8,
              cursor:
                "pointer",
              boxShadow:
                "0 10px 24px rgba(37,99,235,0.4)",
            }}
          >
            Start Your Learning Journey
            <ChevronRight
              size={16}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          padding:
            "24px 20px 8px",
        }}
      >
        <div
          style={{
            fontFamily:
              FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 16,
            color: C.navy,
            marginBottom: 4,
          }}
        >
          Choose how you want to learn
        </div>

        <div
          style={{
            color: C.sub,
            fontSize: 12.5,
            marginBottom: 14,
          }}
        >
          Three tracks, multiple learning formats, one goal: real skills.
        </div>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: 12,
          }}
        >
          {MODES.map(
            (mode) => {
              const Icon =
                mode.icon;

              return (
                <Card
                  key={mode.id}
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      background:
                        mode.bg,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      size={20}
                      color={
                        mode.color
                      }
                    />
                  </div>

                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 14.5,
                        color:
                          C.navy,
                        fontFamily:
                          FONT_DISPLAY,
                      }}
                    >
                      {mode.title}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color:
                          C.sub,
                        marginTop: 3,
                        lineHeight:
                          1.6,
                      }}
                    >
                      {mode.text}
                    </div>
                  </div>
                </Card>
              );
            }
          )}
        </div>
      </div>

      <div
        style={{
          padding:
            "18px 20px 34px",
        }}
      >
        <Btn
          variant="primary"
          full
          style={{
            padding:
              "15px 18px",
          }}
          onClick={onStart}
        >
          Start Your Learning Journey
        </Btn>

        <div
          style={{
            textAlign:
              "center",
            marginTop: 12,
            fontSize: 12.5,
            color: C.sub,
          }}
        >
          Already have an account?{" "}
          <span
            className="mf-tap"
            onClick={onLogin}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onLogin();
              }
            }}
            style={{
              color:
                C.royal,
              fontWeight: 700,
              cursor:
                "pointer",
            }}
          >
            Log In
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AUTH
========================================================= */

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
  id,
}) {
  const fieldId =
    id ||
    `mf-field-${label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div
      style={{
        marginBottom: 14,
      }}
    >
      <label
        htmlFor={fieldId}
        style={{
          display: "block",
          fontSize: 12.5,
          fontWeight: 700,
          color: C.navy,
          marginBottom: 6,
        }}
      >
        {label}
        {required && (
          <span
            style={{
              color: C.red,
            }}
          >
            {" "}
            *
          </span>
        )}
      </label>

      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding:
            "12px 14px",
          borderRadius: 12,
          border: `1.5px solid ${C.border}`,
          fontSize: 13.5,
          outline: "none",
          color: C.text,
          background:
            "#fff",
        }}
      />
    </div>
  );
}

function SelectRow({
  label,
  options,
  value,
  onChange,
  required,
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      style={{
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: C.navy,
          marginBottom: 6,
        }}
      >
        {label}
        {required && (
          <span
            style={{
              color: C.red,
            }}
          >
            {" "}
            *
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {options.map(
          (option) => (
            <div
              key={option}
              onClick={() =>
                onChange(
                  option
                )
              }
              className="mf-tap"
              role="radio"
              aria-checked={value === option}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(option);
                }
              }}
              style={{
                flex: "1 1 auto",
                minWidth: 90,
                textAlign:
                  "center",
                padding:
                  "11px 8px",
                borderRadius: 12,
                cursor:
                  "pointer",
                fontSize: 12.5,
                fontWeight: 700,
                border: `1.5px solid ${
                  value ===
                  option
                    ? C.royal
                    : C.border
                }`,
                background:
                  value ===
                  option
                    ? C.blueBg
                    : "#fff",
                color:
                  value ===
                  option
                    ? C.royal
                    : C.text,
              }}
            >
              {option}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function AuthPage({
  initialMode = "signup",
  onDone,
  onBack,
}) {
  const toast = useToast();

  const [mode, setMode] =
    useState(initialMode);

  const [stageSel, setStageSel] =
    useState("High School");

  const [consent, setConsent] =
    useState(false);

  const [fullName, setFullName] =
    useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const isSignup =
    mode === "signup";

  const canSubmit =
    isSignup
      ? consent &&
        fullName.trim()
      : true;

  function handleSignupSubmit() {
  if (!password || password !== confirmPassword) {
    setPasswordMismatch(true);
    return;
  }
    setPasswordMismatch(false);
    onDone(fullName, { email, password });
  }

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding:
          "0 20px 40px",
        background: C.bg,
      }}
    >
      
      <div
        style={{
          padding:
            "20px 0 6px",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
        }}
      >
        <span
          className="mf-tap"
          onClick={onBack}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBack();
            }
          }}
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap: 4,
            color: C.sub,
            fontSize: 13,
            fontWeight: 700,
            cursor:
              "pointer",
          }}
        >
          <ChevronLeft
            size={16}
          />
          Back
        </span>

        <img
          src="/logodarkmode.png"
          alt={APP_NAME}
          style={{
            width: 70,
            height: 70,
            borderRadius: 8,
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          fontFamily:
            FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 21,
          color: C.navy,
          marginTop: 10,
        }}
      >
        {isSignup
          ? "Create Your Account"
          : "Log In"}
      </div>

      <div
        style={{
          color: C.sub,
          fontSize: 12.5,
          marginTop: 4,
          marginBottom: 18,
        }}
      >
        {isSignup
          ? "Start your learning journey in a minute"
          : "Welcome back! Log in to continue"}
      </div>

      <div
        style={{
          display:
            "flex",
          background:
            C.bg2,
          borderRadius: 12,
          padding: 4,
          marginBottom: 20,
        }}
      >
        {[
          ["signup", "Sign Up"],
          ["login", "Log In"],
        ].map(
          ([id, label]) => (
            <div
              key={id}
              onClick={() =>
                setMode(id)
              }
              className="mf-tap"
              role="tab"
              aria-selected={mode === id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMode(id);
                }
              }}
              style={{
                flex: 1,
                textAlign:
                  "center",
                padding:
                  "9px 0",
                borderRadius: 9,
                cursor:
                  "pointer",
                fontSize: 12.5,
                fontWeight: 700,
                background:
                  mode === id
                    ? "#fff"
                    : "transparent",
                color:
                  mode === id
                    ? C.royal
                    : C.sub,
                boxShadow:
                  mode === id
                    ? "0 1px 3px rgba(15,23,42,0.08)"
                    : "none",
              }}
            >
              {label}
            </div>
          )
        )}
      </div>

      {isSignup ? (
        <div className="mf-fade">
          <Field
            label="Full Name"
            placeholder="e.g. Youssef Ahmed"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            required
          />

          <Field
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Field
            label="Password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Field
            label="Confirm Password"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {passwordMismatch && (
            <div
              role="alert"
              style={{
                marginTop: -6,
                marginBottom: 14,
                fontSize: 12,
                color: C.red,
                fontWeight: 600,
              }}
            >
              Passwords don't match — check both fields and try again.
            </div>
          )}

          <SelectRow
            label="Education Stage"
            options={[
              "Middle School",
              "High School",
              "University",
              "other",
            ]}
            value={stageSel}
            onChange={
              setStageSel
            }
            required
          />

          <div
            style={{
              display:
                "flex",
              gap: 10,
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              <div style={{ flex: 1 }}>
  <Field
    label="Age"
    placeholder="e.g. 16"
    type="number"
    required
  />
</div>

<div style={{ flex: 2 }}>
  <Field
    label={
      stageSel === "University"
        ? "University (optional)"
        : stageSel === "other"
          ? "Organization (optional)"
          : "School (optional)"
    }
    placeholder={
      stageSel === "University"
        ? "University name"
        : stageSel === "other"
          ? "Organization name"
          : "School name"
    }
  />
</div>
</div>

            
          </div>

          {stageSel !== "University" && stageSel !== "other" && (
            <Card
              style={{
                background:
                  C.amberBg,
                border: "1px solid #FDE68A",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#92400E",
                  marginBottom: 8,
                }}
              >
                Parent / Guardian Information
              </div>

  <div
    style={{
      display: "flex",
      gap: 10,
    }}
  >
    <div style={{ flex: 1 }}>
      <Field
        label="Age"
        placeholder="e.g. 16"
        type="number"
        required
      />
    </div>
  
  </div>
    
 

              <Field
                label="Parent's Email"
                placeholder="parent@email.com"
                required
              />

              <label
                style={{
                  display:
                    "flex",
                  alignItems:
                    "flex-start",
                  gap: 8,
                  fontSize: 12,
                  color:
                    "#78350F",
                  lineHeight:
                    1.6,
                  cursor:
                    "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    consent
                  }
                  onChange={(e) =>
                    setConsent(
                      e.target
                        .checked
                    )
                  }
                  style={{
                    marginTop: 2,
                    accentColor:
                      C.amber,
                  }}
                />

                I confirm, as the parent/guardian, that I consent to my child's registration and the use of their data according to the platform's Privacy Policy.
              </label>
            </Card>
          )}

         <Btn
  variant="primary"
  full
  disabled={
    stageSel === "University" || stageSel === "other"
      ? !fullName.trim()
      : !canSubmit
  }
  onClick={handleSignupSubmit}
>

  Create My Account
</Btn>

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 10,
              margin:
                "16px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  C.border,
              }}
            />

            <span
              style={{
                fontSize: 11.5,
                color: C.sub,
              }}
            >
              or
            </span>

            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  C.border,
              }}
            />
          </div>

          <Btn
            variant="ghost"
            full
            onClick={() =>
              toast(
                "Google sign-up isn't connected yet in this prototype."
              )
            }
          >
            Sign up with Google
          </Btn>
        </div>
      ) : (
        <div className="mf-fade">
          <Field
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Field
            label="Password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div
            style={{
              textAlign:
                "right",
              marginBottom: 18,
            }}
          >
            <span
              className="mf-tap"
              role="button"
              tabIndex={0}
              onClick={() =>
                toast(
                  "Password reset isn't wired up yet in this prototype."
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toast(
                    "Password reset isn't wired up yet in this prototype."
                  );
                }
              }}
              style={{
                fontSize: 12,
                color: C.royal,
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Forgot password?
            </span>
          </div>

          <Btn
            variant="primary"
            full
            onClick={() => {
              if (!email || !password) {
                toast("Enter your email and password.");
                return;
              }
              onDone("", { email, password });
            }}
          >
            Log In
          </Btn>

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 10,
              margin:
                "16px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  C.border,
              }}
            />

            <span
              style={{
                fontSize: 11.5,
                color: C.sub,
              }}
            >
              or
            </span>

            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  C.border,
              }}
            />
          </div>

          <Btn
            variant="ghost"
            full
            onClick={() =>
              toast(
                "Google log-in isn't connected yet in this prototype."
              )
            }
          >
            Log in with Google
          </Btn>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TRACK LEVELS
   Each selected track has its own learning level.
========================================================= */

const LEVELS = [
  {
    id: "beginner",
    title: "Beginner",
    text: "Start from the basics and build a strong foundation.",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    text: "You know the fundamentals and want to go deeper.",
  },
  {
    id: "advanced",
    title: "Advanced",
    text: "You're comfortable with core concepts and want a challenge.",
  },
];
function TrackSelectionScreen({
  selectedTracks,
  trackLevels,
  onToggle,
  onLevelChange,
  onNext,
  onBack,
}) {
  const { language } = useAppSettings();
  const isArabic = language === "ar";

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const stageRef = useRef(null);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const dragOffsetRef = useRef(0);

  const total = TRACKS.length;
  const anglePerCard = 360 / total;
   
  const [stageWidth, setStageWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const node = stageRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setStageWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Card / radius تتغير حسب عرض الحاوية الفعلي (وليس عرض النافذة)
const isCompact = stageWidth <= 480;
const radius = isCompact ? 230 : stageWidth <= 820 ? 320 : 430;
const cardWidth = isCompact ? 280 : 340;
const cardHeight = isCompact ? 540 : 560;
const stageHeight = isCompact ? 580 : 600;

  // Drag / swipe handling (mouse + touch)
  const onPointerDown = (clientX) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startRotationRef.current = -activeIndex * anglePerCard;
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const onPointerMove = (clientX) => {
    if (!isDragging) return;
    const dx = clientX - startXRef.current;
    const delta = dx * 0.4; // drag sensitivity
    dragOffsetRef.current = delta;
    setDragOffset(delta);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    const delta = dragOffsetRef.current;
    const steps = Math.round(-delta / (anglePerCard * 0.6));
    const next = ((activeIndex + steps) % total + total) % total;
    setActiveIndex(next);
    setIsDragging(false);
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const goPrev = () =>
    setActiveIndex((i) => ((i - 1) % total + total) % total);

  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  const goTo = (i) => setActiveIndex(((i % total) + total) % total);

  const rotation = -activeIndex * anglePerCard + dragOffset;

  const canContinue =
  selectedTracks.length === 0 ||
  selectedTracks.every((trackId) => trackLevels[trackId]);  
  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 20px 30px",
        background: C.bg,
      }}
    >
     
<TopBar
  title={isArabic ? "اختر وضع التعلّم" : "Choose Your Learning Mode"}
  subtitle={
    isArabic
      ? "ثلاث مسارات، هدف واحد: بناء العقلية والمهارات والثقة لتحويل المعرفة إلى فعل."
      : "Three paths. One goal: build the mindset, skills, and confidence to turn knowledge into action."
  }
  onBack={onBack}
/>

<div
  style={{
    textAlign: "center",
    marginTop: 6,
    marginBottom: 4,
    fontSize: 12.5,
    fontWeight: 700,
    color: C.royal,
    letterSpacing: 0.2,
  }}
>
  {isArabic
    ? "فكّر بالمال. ابنِ بالأعمال. اصنع بالتقنية."
    : "Think with money. Build with business. Create with technology."}
</div>

      {/* ==================== 3D CAROUSEL ==================== */}
      <div
        ref={stageRef}
        className={`mf-carousel-stage ${isDragging ? "is-dragging" : ""}`}
        style={{ marginTop: 18, height: stageHeight }}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseUp={onPointerUp}
        onMouseLeave={() => isDragging && onPointerUp()}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
        onTouchEnd={onPointerUp}
        role="listbox"
        aria-label={isArabic ? "مسارات التعلّم" : "Learning tracks"}
      >
        <div
          className="mf-carousel-wheel"
          style={{ transform: `translateZ(-${radius}px) rotateY(${rotation}deg)` }}
        >
          {TRACKS.map((track, index) => {
            const Icon = track.icon;
            const isSelected = selectedTracks.includes(track.id);
            const modeDetails = MODE_DETAILS.find((m) => m.id === track.id);
            const isCenter = index === activeIndex;

            // Each card sits at its own angle around the circle
            const cardAngle = index * anglePerCard;

            return (
              <div
                key={track.id}
                className={`mf-carousel-card ${isCenter ? "is-center" : ""}`}
                role="option"
                aria-selected={isCenter}
                tabIndex={0}
                onMouseEnter={() => !isDragging && setActiveIndex(index)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCenter) onToggle(track.id);
                  else setActiveIndex(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (isCenter) onToggle(track.id);
                    else setActiveIndex(index);
                  }
                }}
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  border: isCenter
                    ? `2px solid ${track.color}`
                    : `1px solid ${C.border}`,
                  background: isCenter ? track.bg : "#fff",
                  width: cardWidth,
                  height: cardHeight,
                  marginLeft: -cardWidth / 2,
                  marginTop: -cardHeight / 2,
                }}
              >
                {/* DECORATIVE BLOBS */}
<div
  className="mf-decor"
  style={{
    position: "absolute",
    top: -36,
    right: -36,
    width: 130,
    height: 130,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${track.color}22, transparent 70%)`,
    pointerEvents: "none",
  }}
/>
<div
  className="mf-decor"
  style={{
    position: "absolute",
    bottom: -50,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${track.color}14, transparent 70%)`,
    pointerEvents: "none",
  }}
/>
{/* ICON */}
<div
  style={{
    width: 40,
    height: 40,
    borderRadius: 13,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginBottom: 0,        // كانت 4 أو 6 — خليها صفر
    boxShadow: `0 6px 16px ${track.color}22`,
    position: "relative",
  }}
>
  <Icon size={19} color={track.color} />
</div>

{/* MODE TITLE */}
<div
  style={{
    fontFamily: FONT_DISPLAY,
    fontWeight: 900,
    fontSize: 19,
    letterSpacing: 0.5,
    color: track.color,
    marginTop: -10,          // سحب فعلي لفوق، أقوى من المرة اللي فاتت
    marginBottom: 6,
    textTransform: "uppercase",
    position: "relative",
    lineHeight: 1.1,
  }}
>
  {modeDetails?.title?.[isArabic ? "ar" : "en"] || `${track.title} Mode`}
</div>

{/* SUBTITLE */}
<div
  style={{
    fontFamily: FONT_DISPLAY,
    fontWeight: 900,
    fontSize: 13.5,
    lineHeight: 1.28,
    color: C.navy,
    marginBottom: 10,
    position: "relative",
  }}
>
  {modeDetails?.subtitle?.[isArabic ? "ar" : "en"]}
</div>

{/* DESCRIPTION */}
<div
  style={{
    fontSize: 11.5,
    lineHeight: 1.6,
    color: C.sub,
    marginBottom: 12,
    position: "relative",
  }}
>
  {modeDetails?.description?.[isArabic ? "ar" : "en"]}
</div>

{/* WHAT YOU'LL LEARN — pills */}
<div className="mf-carousel-inner-box" style={{ position: "relative" }}>
  <div
    style={{
      fontSize: 10,
      fontWeight: 900,
      letterSpacing: 0.5,
      color: C.navy,
      textTransform: "uppercase",
      marginBottom: 9,
    }}
  >
    {isArabic ? "هتتعلم إيه" : "WHAT YOU'LL LEARN"}
  </div>

  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {(modeDetails?.skills?.[isArabic ? "ar" : "en"] || []).map((skill, i) => (
      <span
        key={i}
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          color: track.color,
          background: "#fff",
          border: `1px solid ${track.color}33`,
          padding: "5px 11px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        {skill}
      </span>
    ))}
  </div>
</div>

{/* AI AGENT */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 11,
    fontSize: 11,
    color: C.navy,
    fontWeight: 700,
    position: "relative",
  }}
>
  <Sparkles size={13} color={track.color} />
  <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.4, color: track.color }}>
    {isArabic ? "المساعد الذكي" : "AI AGENT"}
  </span>
  <span>{modeDetails?.aiAgent?.[isArabic ? "ar" : "en"] || ""}</span>
</div>
                {/* LEVEL PICKER — only inside the centered card */}
                {isCenter && (
                  <div
                    style={{
                      marginTop: 10,
                      paddingTop: 10,
                      borderTop: `1px dashed ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 900,
                        color: track.color,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      {isArabic ?  "من فضلك اختر مستواك:" : " PLEASE CHOSEE YOUR LEVEL :"}
                    </div>

                    <div
                      role="radiogroup"
                      aria-label={`${track.title} level`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 6,
                        padding: 4,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {LEVELS.map((levelItem) => {
                        const levelSelected =
                          trackLevels[track.id] === levelItem.id;

                        return (
                          <button
                            key={levelItem.id}
                            type="button"
                            className="mf-tap"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLevelChange(track.id, levelItem.id);
                            }}
                            role="radio"
                            aria-checked={levelSelected}
                            style={{
                              border: levelSelected
                                ? `1.5px solid ${track.color}`
                                : "1.5px solid transparent",
                              borderRadius: 9,
                              padding: "8px 4px",
                              background: levelSelected
                                ? "#fff"
                                : "transparent",
                              color: levelSelected
                                ? track.color
                                : C.sub,
                              fontWeight: 800,
                              fontSize: 10.5,
                              cursor: "pointer",
                            }}
                          >
                            {levelItem.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* EXPLORE BUTTON */}
                   <button
  type="button"
  className="mf-carousel-explore-btn"
  onClick={(e) => {
    e.stopPropagation();
    setActiveIndex(index);
  }}
  style={{ color: track.color }}
>
  {modeDetails?.exploreCta?.[isArabic ? "ar" : "en"] || `Explore ${track.title}`}
  {isArabic ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
</button>

                {/* SELECTED BADGE */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: track.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 900,
                    }}
                    aria-label={isArabic ? "محدد" : "Selected"}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== ARROWS ==================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          marginTop: 0,
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          className="mf-carousel-arrow"
          onClick={isArabic ? goNext : goPrev}
          aria-label={isArabic ? "التالي" : "Previous"}
        >
          {isArabic ? (
            <ChevronRight size={18} color={C.navy} />
          ) : (
            <ChevronLeft size={18} color={C.navy} />
          )}
        </button>

        <div style={{ display: "flex", gap: 6 }}>
          {TRACKS.map((track, i) => (
            <button
              key={track.id}
              type="button"
              aria-label={track.title}
              onClick={() => goTo(i)}
              style={{
                width: i === activeIndex ? 22 : 8,
                height: 8,
                borderRadius: 99,
                border: "none",
                padding: 0,
                background:
                  i === activeIndex ? track.color : C.border,
                cursor: "pointer",
                transition: "width .25s ease, background .25s ease",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className="mf-carousel-arrow"
          onClick={isArabic ? goPrev : goNext}
          aria-label={isArabic ? "السابق" : "Next"}
        >
          {isArabic ? (
            <ChevronLeft size={18} color={C.navy} />
          ) : (
            <ChevronRight size={18} color={C.navy} />
          )}
        </button>
      </div>

     

      {selectedTracks.length === 0 && (
        <div
          style={{
            fontSize: 11.5,
            color: C.sub,
            marginBottom: 12,
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          {isArabic
            ? "مش اخترت؟ ولا يهمك — هنعرّفك بكل المسارات."
            : "Didn't pick any? No problem — we'll show you everything."}
        </div>
      )}

      <Btn
        variant="primary"
        full
        disabled={!canContinue}
        onClick={onNext}
        style={{ marginTop: 8 }}
      >
        {isArabic ? "متابعة" : "Continue"}
      </Btn>
</div>
  );
}

/* =========================================================
   PERSONALIZED SETUP
========================================================= */

function Chip({
  label,
  selected,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="mf-tap"
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        padding:
          "10px 15px",
        borderRadius: 12,
        cursor:
          "pointer",
        fontSize: 12.5,
        fontWeight: 700,
        border: `1.5px solid ${
          selected
            ? C.royal
            : C.border
        }`,
        background:
          selected
            ? C.blueBg
            : "#fff",
        color:
          selected
            ? C.royal
            : C.text,
      }}
    >
      {label}
    </div>
  );
}

const GOALS = [
  "Understand investing",
  "Start a business",
  "Improve financial skills",
  "Become an entrepreneur",
  "Build better money habits",
];

const TIMES = [
  "5–10 min",
  "10–20 min",
  "20–30 min",
  "30+ min",
];

const STYLES = [
  {
    id: "videos",
    label: "Videos",
    icon: Video,
  },

  {
    id: "reading",
    label: "Reading",
    icon: BookOpenCheck,
  },

  {
    id: "quizzes",
    label: "Quizzes",
    icon: Brain,
  },

  {
    id: "sim",
    label: "Simulations",
    icon: FlaskConical,
  },

  {
    id: "ai",
    label: "AI Learning",
    icon: Sparkles,
  },
];

function PersonalizedSetup({
  onBuildPlan,
  onBack,
}) {
  const [goals, setGoals] =
    useState([]);

  const [time, setTime] =
    useState(null);

  const [styles, setStyles] =
    useState([]);

  const toggleGoal = (
    goal
  ) => {
    setGoals(
      (previous) =>
        previous.includes(goal)
          ? previous.filter(
              (item) =>
                item !== goal
            )
          : [
              ...previous,
              goal,
            ]
    );
  };

  const toggleStyle = (
    style
  ) => {
    setStyles(
      (previous) =>
        previous.includes(style)
          ? previous.filter(
              (item) =>
                item !== style
            )
          : [
              ...previous,
              style,
            ]
    );
  };

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding:
          "0 20px 30px",
        background: C.bg,
      }}
    >
      <TopBar
        title="A few more details"
        subtitle="Last step — let's build your personalized learning plan."
        onBack={onBack}
      />

      <div
        style={{
          marginTop: 20,
        }}
      >
        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap: 6,
            fontWeight: 700,
            fontSize: 14,
            color: C.navy,
            marginBottom: 10,
          }}
        >
          <Target
            size={16}
            color={C.royal}
          />
          What's your goal?
        </div>

        <div
          role="group"
          aria-label="What's your goal?"
          style={{
            display:
              "flex",
            flexWrap:
              "wrap",
            gap: 8,
          }}
        >
          {GOALS.map(
            (goal) => (
              <Chip
                key={goal}
                label={goal}
                selected={goals.includes(
                  goal
                )}
                onClick={() =>
                  toggleGoal(
                    goal
                  )
                }
              />
            )
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
        }}
      >
        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap: 6,
            fontWeight: 700,
            fontSize: 14,
            color: C.navy,
            marginBottom: 10,
          }}
        >
          <Clock
            size={16}
            color={C.royal}
          />
          Available learning time
        </div>

        <div
          role="radiogroup"
          aria-label="Available learning time"
          style={{
            display:
              "flex",
            flexWrap:
              "wrap",
            gap: 8,
          }}
        >
          {TIMES.map(
            (timeOption) => (
              <Chip
                key={
                  timeOption
                }
                label={
                  timeOption
                }
                selected={
                  time ===
                  timeOption
                }
                onClick={() =>
                  setTime(
                    timeOption
                  )
                }
              />
            )
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap: 6,
            fontWeight: 700,
            fontSize: 14,
            color: C.navy,
            marginBottom: 6,
          }}
        >
          <Sparkles
            size={16}
            color={C.royal}
          />
          Preferred learning style
        </div>

        <div
          style={{
            fontSize: 11.5,
            color: C.sub,
            lineHeight: 1.5,
            marginBottom: 10,
          }}
        >
          Pick at least one — the app will only show you content in these formats. You can change this later in Settings.
        </div>

        <div
          role="group"
          aria-label="Preferred learning style"
          style={{
            display:
              "flex",
            flexDirection:
              "column",
            gap: 8,
          }}
        >
          {STYLES.map(
            (styleItem) => {
              const Icon =
                styleItem.icon;

              const selected =
                styles.includes(
                  styleItem.id
                );

              return (
                <Card
                  key={
                    styleItem.id
                  }
                  onClick={() =>
                    toggleStyle(
                      styleItem.id
                    )
                  }
                  role="checkbox"
                  ariaLabel={styleItem.label}
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 10,
                    padding: 13,
                    border: selected
                      ? `1.5px solid ${C.royal}`
                      : `1px solid ${C.border}`,
                  }}
                >
                  <Icon
                    size={17}
                    color={
                      selected
                        ? C.royal
                        : C.sub
                    }
                  />

                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 13.5,
                      color:
                        selected
                          ? C.royal
                          : C.text,
                    }}
                  >
                    {
                      styleItem.label
                    }
                  </span>

                  {selected && (
                    <CheckCircle2
                      size={16}
                      color={
                        C.royal
                      }
                      style={{
                        marginLeft:
                          "auto",
                      }}
                    />
                  )}
                </Card>
              );
            }
          )}
        </div>
      </div>

      <Btn
        variant="ai"
        full
        onClick={() =>
          onBuildPlan({
            goals,
            time,
            styles,
          })
        }
        style={{
          marginTop: 24,
        }}
        icon={Sparkles}
      >
        Build My Plan
      </Btn>
    </div>
  );
}


/* =========================================================
   AI LEARNING EXPERIENCE
   GenAI-powered personalized lesson, adaptive quiz,
   real-world simulation, and recommendation flow.
========================================================= */
function AILearningScreen({
  preferences,
  goBack,
  recordActivity,
}) {
  const { language } = useAppSettings();
  const isArabic = language === "ar";

  const [phase, setPhase] = useState("plan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [simulationChoice, setSimulationChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const goal =
    preferences?.goals?.[0] || "Improve financial skills";

  const time =
    preferences?.time || "10–20 min";

  useEffect(() => {
    generatePlan();
    // The plan is intentionally generated once when this screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generatePlan() {
    setLoading(true);
    setError("");

    try {
      const prompt = `
You are the AI Learning Engine inside TRIMIND.

Create a short personalized learning experience for a student.

User goal: ${goal}
Available learning time: ${time}
Learning styles: ${preferences?.styles?.join(", ") || "ai"}
Track levels: ${Object.entries(preferences?.trackLevels || {})
        .map(([track, level]) => `${track}: ${level}`)
        .join(", ") || "not specified"}

Return ONLY valid JSON. Do not use markdown or code fences.

{
  "title": "string",
  "description": "string",
  "lesson": {
    "title": "string",
    "explanation": "string",
    "estimatedTime": 7
  },
  "quiz": {
    "question": "string",
    "options": ["string", "string", "string"],
    "correctIndex": 0,
    "explanation": "string"
  },
  "simulation": {
    "title": "string",
    "scenario": "string",
    "options": ["string", "string", "string"]
  },
  "recommendation": "string"
}

Requirements:
- Match the lesson to the user's goal.
- Match the depth and difficulty to the selected track level.
- If a track has no selected level, keep the content accessible and educational.
- Keep the lesson short enough for the available time.
- Make the quiz test the lesson rather than unrelated knowledge.
- Make the simulation a safe educational scenario.
- Do not give personalized financial, investment, trading, legal, or medical advice.
- Do not recommend specific stocks, brokers, financial products, or real-money actions.
- Use plain English because this screen currently uses the English UI.
`;

      const result = await callClaudeAI(prompt, 1200);

      const clean = result
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(clean);

      if (
        !parsed?.lesson ||
        !parsed?.quiz ||
        !parsed?.simulation
      ) {
        throw new Error("Invalid AI learning plan");
      }

      setPlan(parsed);
    } catch (err) {
      console.error("AI Learning error:", err);
      setError(
        isArabic
          ? "تعذر إنشاء خطة التعلم بالذكاء الاصطناعي حاليًا."
          : "We couldn't generate your AI learning plan right now."
      );
    } finally {
      setLoading(false);
    }
  }

  function checkQuiz() {
    if (selectedAnswer === null) return;

    const correct =
      selectedAnswer === Number(plan.quiz.correctIndex);

    setQuizResult(correct);

    if (correct) {
      recordActivity();
    }
  }

  function finishSimulation() {
    if (simulationChoice === null) return;

    const messages = [
      "Good thinking. You considered the trade-offs behind your decision.",
      "Interesting choice. Think about both the benefits and the risks before making a decision.",
      "Nice attempt. This scenario helps you practice making informed decisions.",
    ];

    setFeedback(messages[simulationChoice] || messages[0]);
    recordActivity();
  }

  if (loading) {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "0 20px 30px",
          background: C.bg,
        }}
      >
        <TopBar
          title="AI Learning"
          subtitle="Creating your personalized learning experience..."
          onBack={goBack}
        />

        <Card
          style={{
            marginTop: 20,
            textAlign: "center",
            padding: 35,
          }}
        >
          <Sparkles
            size={38}
            color={C.royal}
            style={{
              animation: "aiFloat 1.5s ease-in-out infinite",
            }}
          />

          <div
            style={{
              marginTop: 16,
              fontWeight: 800,
              color: C.navy,
            }}
          >
            AI is building your plan...
          </div>

          <div
            style={{
              marginTop: 7,
              fontSize: 12,
              color: C.sub,
              lineHeight: 1.5,
            }}
          >
            Matching your goal, available time and learning style.
          </div>
        </Card>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "0 20px 30px",
          background: C.bg,
        }}
      >
        <TopBar
          title="AI Learning"
          subtitle="Personalized learning"
          onBack={goBack}
        />

        <AIInsightCard
          eyebrow="AI Learning"
          text={error || "Unable to create your plan."}
          style={{ marginTop: 16 }}
        />

        <Btn
          variant="ai"
          full
          icon={RotateCcw}
          onClick={generatePlan}
          style={{ marginTop: 16 }}
        >
          Try Again
        </Btn>
      </div>
    );
  }

  if (phase === "plan") {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "0 20px 30px",
          background: C.bg,
        }}
      >
        <TopBar
          title="Your AI Learning Plan"
          subtitle={`Personalized for ${goal} • ${time}`}
          onBack={goBack}
        />

        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 20,
            background: aiGrad,
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <Sparkles size={15} />
            AI PERSONALIZED
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 21,
              fontWeight: 800,
              fontFamily: FONT_DISPLAY,
            }}
          >
            {plan.title}
          </div>

          <div
            style={{
              marginTop: 7,
              fontSize: 13,
              lineHeight: 1.5,
              opacity: 0.92,
            }}
          >
            {plan.description}
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 13,
            fontWeight: 800,
            color: C.navy,
          }}
        >
          TODAY'S AI PLAN
        </div>

        <Card style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: C.blueBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Lightbulb size={21} color={C.royal} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 800,
                  color: C.navy,
                }}
              >
                AI Lesson
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: C.sub,
                  marginTop: 3,
                }}
              >
                {plan.lesson.title}
              </div>
            </div>

            <Pill>{plan.lesson.estimatedTime} min</Pill>
          </div>

          <Btn
            variant="ai"
            full
            style={{ marginTop: 15 }}
            onClick={() => setPhase("lesson")}
          >
            Start Learning
            <ChevronRight size={16} />
          </Btn>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: C.purpleBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Brain size={21} color={C.purple} />
            </div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  color: C.navy,
                }}
              >
                AI Practice
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: C.sub,
                  marginTop: 3,
                }}
              >
                Adaptive quiz based on your learning
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: C.greenBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FlaskConical size={21} color={C.emerald} />
            </div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  color: C.navy,
                }}
              >
                Real-World Simulation
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: C.sub,
                  marginTop: 3,
                }}
              >
                Apply what you just learned
              </div>
            </div>
          </div>
        </Card>

        <AIInsightCard
          eyebrow="AI Recommendation"
          text={plan.recommendation}
          style={{ marginTop: 14 }}
        />
      </div>
    );
  }

  if (phase === "lesson") {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "0 20px 30px",
          background: C.bg,
        }}
      >
        <TopBar
          title="AI Lesson"
          subtitle={plan.lesson.title}
          onBack={() => setPhase("plan")}
        />

        <Card style={{ marginTop: 15 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              color: C.royal,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <Sparkles size={15} />
            AI TUTOR
          </div>

          <div
            style={{
              marginTop: 15,
              fontSize: 18,
              fontWeight: 800,
              color: C.navy,
            }}
          >
            Let's learn together.
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              lineHeight: 1.8,
              color: C.text,
              whiteSpace: "pre-line",
            }}
          >
            {plan.lesson.explanation}
          </div>
        </Card>

        <Btn
          variant="ai"
          full
          style={{ marginTop: 16 }}
          onClick={() => setPhase("quiz")}
        >
          Quick Check
          <ChevronRight size={16} />
        </Btn>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "0 20px 30px",
          background: C.bg,
        }}
      >
        <TopBar
          title="AI Practice"
          subtitle="Let's check your understanding."
          onBack={() => setPhase("lesson")}
        />

        <Card style={{ marginTop: 15 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              lineHeight: 1.5,
              color: C.navy,
            }}
          >
            {plan.quiz.question}
          </div>

          <div style={{ marginTop: 18 }}>
            {plan.quiz.options.map((option, index) => {
              const selected = selectedAnswer === index;
              const correct =
                quizResult !== null &&
                index === Number(plan.quiz.correctIndex);
              const wrong =
                quizResult === false && selected;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (quizResult === null) {
                      setSelectedAnswer(index);
                    }
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: `1.5px solid ${
                      correct
                        ? C.emerald
                        : wrong
                        ? C.red
                        : selected
                        ? C.royal
                        : C.border
                    }`,
                    background: correct
                      ? C.greenBg
                      : wrong
                      ? C.redBg
                      : selected
                      ? C.blueBg
                      : C.card,
                    color: C.text,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 9,
                    cursor:
                      quizResult === null
                        ? "pointer"
                        : "default",
                    fontWeight: 600,
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              );
            })}
          </div>

          {quizResult === null && (
            <Btn
              variant="ai"
              full
              disabled={selectedAnswer === null}
              onClick={checkQuiz}
            >
              Submit Answer
            </Btn>
          )}

          {quizResult !== null && (
            <div style={{ marginTop: 15 }}>
              <AIInsightCard
                eyebrow={
                  quizResult
                    ? "Great work!"
                    : "Let's learn from this"
                }
                text={
                  quizResult
                    ? "Correct! You're ready for the real-world simulation."
                    : plan.quiz.explanation
                }
              />

              <Btn
                variant="primary"
                full
                style={{ marginTop: 0 }}
                onClick={() => setPhase("simulation")}
              >
                Continue
                <ChevronRight size={16} />
              </Btn>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (phase === "simulation") {
    return (
      <div
        className="mf-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "0 20px 30px",
          background: C.bg,
        }}
      >
        <TopBar
          title="AI Simulation"
          subtitle="Apply what you learned."
          onBack={() => setPhase("quiz")}
        />

        <Card style={{ marginTop: 15 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              color: C.emerald,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <FlaskConical size={15} />
            REAL-WORLD SCENARIO
          </div>

          <div
            style={{
              marginTop: 15,
              fontWeight: 800,
              fontSize: 17,
              color: C.navy,
            }}
          >
            {plan.simulation.title}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: C.text,
            }}
          >
            {plan.simulation.scenario}
          </div>

          <div style={{ marginTop: 17 }}>
            {plan.simulation.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!feedback) setSimulationChoice(index);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: `1.5px solid ${
                    simulationChoice === index
                      ? C.emerald
                      : C.border
                  }`,
                  background:
                    simulationChoice === index
                      ? C.greenBg
                      : C.card,
                  color: C.text,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 9,
                  cursor: feedback ? "default" : "pointer",
                  fontWeight: 600,
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>

          {!feedback && (
            <Btn
              variant="primary"
              full
              disabled={simulationChoice === null}
              onClick={finishSimulation}
            >
              Make Decision
            </Btn>
          )}

          {feedback && (
            <>
              <AIInsightCard
                eyebrow="AI Feedback"
                text={feedback}
                style={{ marginTop: 14 }}
              />

              <Btn
                variant="ai"
                full
                style={{ marginTop: 12 }}
                onClick={() => setPhase("complete")}
              >
                See My Progress
                <ChevronRight size={16} />
              </Btn>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div
      className="mf-scroll"
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "0 20px 30px",
        background: C.bg,
      }}
    >
      <TopBar
        title="Learning Complete"
        subtitle="Your AI learning session is complete."
        onBack={goBack}
      />

      <Card
        style={{
          marginTop: 15,
          textAlign: "center",
          padding: 25,
        }}
      >
        <div
          style={{
            width: 65,
            height: 65,
            margin: "0 auto",
            borderRadius: "50%",
            background: C.greenBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircle2
            size={34}
            color={C.emerald}
          />
        </div>

        <div
          style={{
            marginTop: 15,
            fontSize: 20,
            fontWeight: 800,
            color: C.navy,
          }}
        >
          Great work!
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: C.sub,
            lineHeight: 1.6,
          }}
        >
          AI analyzed your learning activity and prepared
          your next recommendation.
        </div>
      </Card>

      <AIInsightCard
        eyebrow="AI Recommendation"
        text={plan.recommendation}
        style={{ marginTop: 14 }}
      />

      <Btn
        variant="ai"
        full
        style={{ marginTop: 14 }}
        onClick={() => {
          setPhase("plan");
          setSelectedAnswer(null);
          setQuizResult(null);
          setSimulationChoice(null);
          setFeedback(null);
          generatePlan();
        }}
      >
        Continue with AI
        <ChevronRight size={16} />
      </Btn>
      <TRIMINDFooter language={language} />
</div>
  );
}

/* =========================================================
   APP SHELL
========================================================= */

export default function App() {
  const [stage, setStage] =
    useState("splash");

  const [authMode, setAuthMode] =
    useState("signup");

  const [studentName, setStudentName] =
    useState("");

  const [tab, setTab] =
    useState("home");

  const [screen, setScreen] =
    useState(null);

  const [screenData, setScreenData] =
    useState({});

  const [quizScores, setQuizScores] =
    useState({});

  const [completedLessons, setCompletedLessons] =
    useState({});

  const [investmentSimDone, setInvestmentSimDone] =
    useState(false);

  const [businessSimDone, setBusinessSimDone] =
    useState(false);
    const [builderSimDone, setBuilderSimDone] =
    useState(false);  

  // Learning streak: counts distinct calendar days on which the
  // student completed at least one lesson or quiz, computed from
  // actual activity instead of a fixed placeholder number. Since
  // this prototype has no persistence, this naturally resets each
  // session — the number always reflects what happened in it.
  const [activityDates, setActivityDates] = useState([]);
  const [sessionReady, setSessionReady] = useState(false);

  const recordActivity = () => {
    const today = new Date().toDateString();
    setActivityDates((previous) =>
      previous.includes(today) ? previous : [...previous, today]
    );
  };


  const streakDays = Math.max(1, activityDates.length);

  // App preferences
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  // Learning-style preferences, picked during onboarding and
  // editable later from Profile → Settings. Defaults to "every
  // format" so students who log in directly (skipping onboarding)
  // never see anything hidden.
  const [preferredStyles, setPreferredStyles] = useState(ALL_STYLE_IDS);

  // Preferred learning tracks (Investment / Founder / Builder),
  // picked during onboarding and editable later in Settings. An
  // empty array means "no preference" — Practice then shows every
  // simulator, matching the fallback pattern used for
  // preferredStyles above.
  const [preferredTracks, setPreferredTracks] = useState([]);

  // Each track keeps its own level so the learning path can be
  // personalized independently for Investment, Founder, and Builder.
  const [trackLevels, setTrackLevels] = useState({});

  const toggleTrackPreference = (trackId) => {
    setPreferredTracks((previous) => {
      const isSelected = previous.includes(trackId);

      if (isSelected) {
        setTrackLevels((levels) => {
          const next = { ...levels };
          delete next[trackId];
          return next;
        });
        return previous.filter((id) => id !== trackId);
      }

      return [...previous, trackId];
    });
  };

  const setTrackLevel = (trackId, level) => {
    setTrackLevels((previous) => ({
      ...previous,
      [trackId]: level,
    }));
  };


  const [learningPreferences, setLearningPreferences] = useState({
    goals: [],
    time: null,
    styles: ALL_STYLE_IDS,
  });

  useEffect(() => {
    let active = true;
    api.me().then(async ({ user }) => {
      if (!active || !user) return;
      setStudentName(user.name || "");
      const saved = await api.progress();
      if (!active) return;
      setCompletedLessons(saved.completedLessons || {});
      setQuizScores(saved.quizScores || {});
      setActivityDates((saved.activities || []).map((item) => new Date(item.createdAt).toDateString()).filter((date, index, all) => all.indexOf(date) === index));
      const preferences = user.preferences || {};
      setPreferredTracks(preferences.preferredTracks || []);
      setTrackLevels(preferences.trackLevels || {});
      setPreferredStyles(preferences.styles || ALL_STYLE_IDS);
      setLearningPreferences(preferences);
      setFocusMode(Boolean(preferences.focusMode));
      setDarkMode(Boolean(preferences.darkMode));
      setLanguage(preferences.language || "en");
      setStage("app");
    }).catch(() => {}).finally(() => active && setSessionReady(true));
    return () => { active = false; };
  }, []);

  // Lightweight toast for prototype actions that aren't wired to
  // real functionality yet (Notifications, Forgot Password, etc.)
  // so tapping them gives honest feedback instead of doing nothing.
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2600);
  };

  const firstName = (
    studentName || ""
  )
    .trim()
    .split(" ")[0];

  /*
    Central navigation
  */

  const go = (
    destination,
    data = {}
  ) => {
    const tabs = [
      "home",
      "learn",
      "practice",
      "ai",
      "profile",
    ];

    if (
      tabs.includes(
        destination
      )
    ) {
      setTab(destination);
      setScreen(null);
      setScreenData({});
      return;
    }

    setScreen(destination);
    setScreenData(data);
  };

  const handleQuizComplete = (
    quizId,
    score,
    answers
  ) => {
    setQuizScores(
      (previous) => ({
        ...previous,
        [quizId]: score,
      })
    );
    api.submitQuiz(quizId, answers || [], score).catch((error) => showToast(error.message));
    recordActivity();
  };

  const handleCompleteLesson = (
    lessonId
  ) => {
    setCompletedLessons(
      (previous) => ({
        ...previous,
        [lessonId]: true,
      })
    );
    api.completeLesson(lessonId).catch((error) => showToast(error.message));
    recordActivity();
  };

  let content = null;

  /*
    SUB-SCREENS
  */

  if (screen === "aiLearning") {
    content = (
      <AILearningScreen
        preferences={learningPreferences}
        goBack={() => setScreen(null)}
        recordActivity={recordActivity}
      />
    );
  } else if (
    screen ===
    "investmentSim"
  ) {
    content = (
      <InvestmentSimulator
        goBack={() =>
          setScreen(null)
        }
        onSimComplete={() => {
          setInvestmentSimDone(true);
          recordActivity();
        }}
      />
    );
  } else if (
    screen ===
    "businessSim"
  ) {
    content = (
      <BusinessSimulator
        goBack={() =>
          setScreen(null)
        }
        onSimComplete={() => {
          setBusinessSimDone(true);
          recordActivity();
        }}
      />
    );
      } else if (
    screen === "builderSim"
  ) {
    content = (
      <BuilderSimulator
        goBack={() =>
          setScreen(null)
        }
        onSimComplete={() => {
          setBuilderSimDone(true);
          recordActivity();
        }}
      />
    );
  } else if (screen === "modeSelect") {
    content = (
      <ModeSelectionScreen
        go={go}
        goBack={() => setScreen(null)}
      />
    );
  } else if (
    screen === "track"
  ) {
    content = (
      <TrackScreen
        trackId={
          screenData.trackId
        }
        goBack={() =>
          setScreen(null)
        }
        go={go}
        completedLessons={completedLessons}
        quizScores={quizScores}
      />
    );
  } else if (
    screen === "course"
  ) {
    content = (
      <CourseScreen
        trackId={
          screenData.trackId
        }
        courseId={
          screenData.courseId
        }
        goBack={() =>
          setScreen(null)
        }
        go={go}
        completedLessons={completedLessons}
        quizScores={quizScores}
      />
    );
  } else if (
    screen === "lesson"
  ) {
    content = (
      <LessonScreen
        trackId={
          screenData.trackId
        }
        courseId={
          screenData.courseId
        }
        lessonId={
          screenData.lessonId
        }
        goBack={() =>
          setScreen(null)
        }
        go={go}
        completedLessons={completedLessons}
        onCompleteLesson={handleCompleteLesson}
      />
    );
  } else if (
    screen === "quiz"
  ) {
    content = (
      <QuizScreen
        quizId={
          screenData.quizId
        }
        goBack={() =>
          setScreen(null)
        }
        go={go}
        onQuizComplete={
          handleQuizComplete
        }
      />
    );
  } else if (
    screen === "settings"
  ) {
    content = (
      <SettingsScreen
        goBack={() =>
          setScreen(null)
        }
      />
    );
  }

  /*
    MAIN TABS
  */

  else if (
    tab === "home"
  ) {
    content = (
      <HomeScreen
        go={go}
        name={firstName}
        completedLessons={completedLessons}
        quizScores={quizScores}
        streakDays={streakDays}
      />
    );
  } else if (
    tab === "learn"
  ) {
    content = (
      <LearnScreen
        go={go}
      />
    );
  } else if (
    tab === "practice"
  ) {
    content = (
      <PracticeHub
        go={go}
      />
    );
  } else if (
    tab === "ai"
  ) {
    content = (
      <AIMentor
        go={go}
      />
    );
  } else if (
    tab === "profile"
  ) {
    content = (
      <ProfileScreen
        go={go}
        quizScores={
          quizScores
        }
        completedLessons={completedLessons}
        investmentSimDone={investmentSimDone}
        businessSimDone={businessSimDone}
        builderSimDone={builderSimDone}
        streakDays={streakDays}
        onLogout={async () => {
          await api.logout().catch(() => {});
          setStudentName("");
          setCompletedLessons({});
          setQuizScores({});
          setActivityDates([]);
          setStage(
            "landing"
          );
          setTab("home");
          setScreen(null);
          setScreenData({});
        }}
      />
    );
  }

  return (
    <SettingsContext.Provider
      value={{
        focusMode,
        setFocusMode,
        darkMode,
        setDarkMode,
        language,
        setLanguage,
      }}
    >
      <PreferencesContext.Provider
        value={{
          preferredStyles,
          setPreferredStyles,
          preferredTracks,
          setPreferredTracks,
        }}
      >
      <ToastContext.Provider value={showToast}>
        <NavigationContext.Provider value={{ go }}>
        <div
          className="mf-shell-wrapper"
          style={{ background: darkMode ? "#17243A" : "#E2E8F0" }}
        >
          <GlobalStyle />

          <div
            className={`mf-shell ${focusMode ? "focus-mode" : ""} ${darkMode ? "dark-mode" : ""}`}
            dir={language === "ar" ? "rtl" : "ltr"}
            lang={language}
            style={{
              background: C.bg,
              colorScheme: darkMode ? "dark" : "light",
              "--mf-navy": darkMode ? "#F8FAFC" : "#0B1F3A",
              "--mf-royal": darkMode ? "#60A5FA" : "#2563EB",
              "--mf-electric": darkMode ? "#38BDF8" : "#38BDF8",
              "--mf-purple": darkMode ? "#A78BFA" : "#8B5CF6",
              "--mf-emerald": darkMode ? "#34D399" : "#10B981",
              "--mf-amber": darkMode ? "#FBBF24" : "#F59E0B",
              "--mf-red": darkMode ? "#FB7185" : "#EF4444",
              "--mf-bg": darkMode ? "#0B1220" : "#F8FAFC",
              "--mf-card": darkMode ? "#111C2E" : "#FFFFFF",
              "--mf-bg2": darkMode ? "#17243A" : "#F1F5F9",
              "--mf-text": darkMode ? "#F1F5F9" : "#0F172A",
              "--mf-sub": darkMode ? "#A8B5C8" : "#64748B",
              "--mf-border": darkMode ? "#263853" : "#E2E8F0",
              "--mf-blueBg": darkMode ? "#142747" : "#EFF6FF",
              "--mf-purpleBg": darkMode ? "#251B47" : "#F5F3FF",
              "--mf-amberBg": darkMode ? "#3A2C10" : "#FFFBEB",
              "--mf-greenBg": darkMode ? "#123B35" : "#ECFDF5",
              "--mf-redBg": darkMode ? "#421D2A" : "#FEF2F2",
            }}
          >
            <StatusBar />
            <ArabicContentLocalizer language={language} />

            <div className="mf-shell-inner">
              {/* SPLASH */}

              {stage ===
                "splash" && (
                <Splash
                  onDone={() =>
                    setStage(
                      "landing"
                    )
                  }
                />
              )}

              {/* LANDING */}

              {stage ===
                "landing" && (
                <LandingPage
                  onStart={() => {
                    setAuthMode(
                      "signup"
                    );
                    setStage(
                      "auth"
                    );
                  }}
                  onLogin={() => {
                    setAuthMode(
                      "login"
                    );
                    setStage(
                      "auth"
                    );
                  }}
                />
              )}

              {/* AUTH */}

              {stage === "auth" && (
                <AuthPage
                  initialMode={
                    authMode
                  }
                  onBack={() =>
                    setStage(
                      "landing"
                    )
                  }
                  onDone={async (
                    name,
                    credentials
                  ) => {
                    if (credentials) {
                      try {
                        const result = authMode === "signup"
                          ? await api.register({ ...credentials, name })
                          : await api.login(credentials);
                        setStudentName(result.user.name || name || "");
                        const saved = await api.progress();
                        setCompletedLessons(saved.completedLessons || {});
                        setQuizScores(saved.quizScores || {});
                      } catch (error) {
                        showToast(error.message);
                        return;
                      }
                    } else if (name) {
                      setStudentName(name);
                    }

                    if (
                      authMode ===
                      "signup"
                    ) {
                      setStage(
                        "tracks"
                      );
                    } else {
                      setStage(
                        "app"
                      );
                    }
                  }}
                />
              )}

              {/* PREFERRED TRACKS + PER-TRACK LEVEL */}

              {stage === "tracks" && (
                <TrackSelectionScreen
                  selectedTracks={preferredTracks}
                  trackLevels={trackLevels}
                  onToggle={toggleTrackPreference}
                  onLevelChange={setTrackLevel}
                  onBack={() =>
                    setStage(
                      "auth"
                    )
                  }
                  onNext={() =>
                    setStage(
                      "setup"
                    )
                  }
                />
              )}

              {/* SETUP */}

              {stage === "setup" && (
                <PersonalizedSetup
                  onBack={() =>
                    setStage(
                      "tracks"
                    )
                  }
                  onBuildPlan={(preferences) => {
                    const styles =
                      preferences?.styles && preferences.styles.length
                        ? preferences.styles
                        : ALL_STYLE_IDS;

                    setPreferredStyles(styles);
                    const savedPreferences = {
                      goals: preferences?.goals || [],
                      time: preferences?.time || null,
                      styles,
                      trackLevels,
                      preferredTracks,
                      language,
                      darkMode,
                      focusMode,
                    };
                    setLearningPreferences(savedPreferences);
                    api.savePreferences({ preferences: savedPreferences, onboardingComplete: true, name: studentName }).catch((error) => showToast(error.message));
                    setTab("home");
                    setScreen("aiLearning");
                    setScreenData({});
                    setStage("app");
                  }}
                />
              )}

              {/* APP */}

              {stage === "app" && (
                <>
                  {/* Content wrapper takes the remaining flexible
                      space above BottomNav. BottomNav is now a
                      normal in-flow element (not an absolute
                      overlay), so it always renders directly
                      below whatever this wrapper holds — including
                      right under the AI Mentor's mic/input
                      composer — instead of floating on top of the
                      screen's content. */}
                  <div
                    style={{
                      flex: 1,
                      minHeight: 0,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    {content}
                  </div>

                  <BottomNav
                    tab={tab}
                    setTab={(newTab) => {
                      setTab(
                        newTab
                      );
                      setScreen(
                        null
                      );
                      setScreenData(
                        {}
                      );
                    }}
                  />
                </>
              )}

              <ToastHost toast={toastMessage} />
            </div>
          </div>
        </div>
        </NavigationContext.Provider>
      </ToastContext.Provider>
      </PreferencesContext.Provider>
    </SettingsContext.Provider>
  );
}
