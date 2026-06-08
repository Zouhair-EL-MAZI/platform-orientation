import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, RefreshCw, AlertCircle, Briefcase, TrendingUp,
  DollarSign, Lock, FileQuestion, CheckCircle, ChevronDown,
  ChevronUp, BookOpen, Target, Clock, WifiOff,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import {
  getRecommendations, generateRecommendations, getTests,
  type Recommendation, type OrientationTest,
} from "@/services/studentApi";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const CHART_COLORS   = ["#0EA5E9", "#A78BFA", "#34D399", "#F59E0B"];
const TOTAL_TESTS    = 3;
const CACHE_KEY      = "massarek_recs_cache";
const CACHE_TTL_MS   = 30 * 60 * 1000; // 30 min
const RETRY_DELAY_MS = 3000;
const MAX_RETRIES    = 1;

// ─────────────────────────────────────────────────────────────────────────────
// Cache helpers — sessionStorage, safe, never throws
// ─────────────────────────────────────────────────────────────────────────────
interface RecsCache {
  data: Recommendation[];
  savedAt: number; // epoch ms
}

function readCache(): RecsCache | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: RecsCache = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: Recommendation[]): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: Date.now() }));
  } catch { /* storage full — ignore */ }
}

function clearCache(): void {
  try { sessionStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Error extractor — no external dependency
// ─────────────────────────────────────────────────────────────────────────────
function extractError(e: unknown): { msg: string; isRateLimit: boolean; isNetwork: boolean } {
  const err = e as any;
  const status = err?.response?.status;
  const msg =
    err?.response?.data?.message ||
    (err?.code === "ECONNABORTED" ? "Request timed out." : null) ||
    (!err?.response ? "Network error. Check your connection." : null) ||
    err?.message ||
    "An unexpected error occurred.";
  return {
    msg,
    isRateLimit: status === 429,
    isNetwork: !err?.response,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Match score color by range
// ─────────────────────────────────────────────────────────────────────────────
function scoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#0EA5E9";
  if (score >= 40) return "#F59E0B";
  return "#A78BFA";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Fair Match";
  return "Possible Match";
}

// ─────────────────────────────────────────────────────────────────────────────
// LockedGate — premium locked state
// ─────────────────────────────────────────────────────────────────────────────
function LockedGate({ tests }: { tests: OrientationTest[] }) {
  const completed = tests.filter(t => t.is_completed).length;
  const total     = tests.length || TOTAL_TESTS;

  return (
    <div className="max-w-2xl mx-auto ms-page-enter">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)" }}>
            <Sparkles size={18} className="text-white" />
          </span>
          AI Recommendations
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Complete all orientation tests to unlock your personalized AI career matches.
        </p>
      </div>

      <div className="rounded-2xl relative overflow-hidden"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>

        {/* Top accent */}
        <div className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #1E40AF, #0E7490, var(--ms-accent-cyan))" }} />

        <div className="p-8 md:p-10 text-center">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,211,238,0.05), transparent)" }} />

          {/* Lock icon */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10"
            style={{
              background: "linear-gradient(135deg, rgba(30,64,175,0.12), rgba(14,116,144,0.10))",
              border: "1px solid var(--ms-border-glow)",
            }}>
            <Lock size={32} style={{ color: "var(--ms-accent-cyan)" }} />
          </div>

          <h2 className="text-xl font-bold mb-2 relative z-10">
            Complete all orientation tests first
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-7 leading-relaxed relative z-10">
            You need to finish all{" "}
            <span className="font-bold" style={{ color: "var(--ms-accent-sky)" }}>
              {total} orientation tests
            </span>{" "}
            before AI can generate your personalized career recommendations.
          </p>

          {/* Test progress pills */}
          <div className="flex items-center justify-center gap-2.5 mb-7 flex-wrap relative z-10">
            {(tests.length > 0 ? tests : Array(TOTAL_TESTS).fill(null)).map((t, i) => {
              const done   = t?.is_completed ?? false;
              const inProg = !done && (t?.answered_count ?? 0) > 0;
              return (
                <div key={i}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                  style={done ? {
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.30)",
                    color: "#059669",
                  } : inProg ? {
                    background: "rgba(245,158,11,0.10)",
                    border: "1px solid rgba(245,158,11,0.28)",
                    color: "#D97706",
                  } : {
                    background: "var(--ms-bg-layer3)",
                    border: "1px solid var(--ms-border-subtle)",
                    color: "var(--ms-accent-sky)",
                  }}
                >
                  {done
                    ? <CheckCircle size={12} />
                    : <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px]"
                        style={{ borderColor: inProg ? "#D97706" : "var(--ms-border-subtle)" }}>
                        {i + 1}
                      </span>}
                  {t?.title?.split(" ")[0] ?? `Test ${i + 1}`}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto mb-7 relative z-10">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progress</span>
              <span className="font-bold tabular-nums" style={{ color: "var(--ms-accent-sky)" }}>
                {completed}/{total} completed
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden"
              style={{ background: "var(--ms-bg-layer3)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                  background: "linear-gradient(90deg, #1E40AF, var(--ms-accent-cyan))",
                  boxShadow: "0 0 8px rgba(34,211,238,0.35)",
                }} />
            </div>
          </div>

          <Link
            to="/test"
            className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl text-white transition-all hover:opacity-90 relative z-10"
            style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)", boxShadow: "0 6px 20px rgba(14,116,144,0.35)" }}>
            <FileQuestion size={16} />
            {completed === 0 ? "Start Tests" : "Continue Tests"}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GeneratingState — animated AI thinking card
// ─────────────────────────────────────────────────────────────────────────────
function GeneratingState() {
  const steps = [
    "Analyzing your test responses…",
    "Matching with career database…",
    "Computing compatibility scores…",
    "Crafting personalized insights…",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
      style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-glow)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,211,238,0.06), transparent)" }} />

      <div className="flex items-center gap-4 relative z-10">
        {/* Animated orb */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1E40AF22, #0E749022)", border: "1px solid var(--ms-border-glow)" }}>
            <Sparkles size={22} style={{ color: "var(--ms-accent-cyan)" }} className="animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-xl animate-ping opacity-15"
            style={{ background: "var(--ms-accent-cyan)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm mb-0.5">AI is analyzing your profile</p>
          <p className="text-xs text-muted-foreground transition-all duration-500 min-h-[16px]">
            {steps[step]}
          </p>
        </div>

        <RefreshCw size={16} className="animate-spin flex-shrink-0" style={{ color: "var(--ms-accent-cyan)" }} />
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-5 relative z-10">
        {steps.map((_, i) => (
          <div key={i}
            className="h-1 rounded-full transition-all duration-500 flex-1"
            style={{
              background: i <= step
                ? "linear-gradient(90deg, #1E40AF, var(--ms-accent-cyan))"
                : "var(--ms-bg-layer3)",
            }} />
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground mt-3 text-center relative z-10">
        This usually takes 10–20 seconds
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RecommendationCard — rich expandable card
// ─────────────────────────────────────────────────────────────────────────────
function RecommendationCard({
  rec, index, expanded, onToggle,
}: {
  rec: Recommendation; index: number; expanded: boolean; onToggle: () => void;
}) {
  const score  = Math.round(rec.match_score);
  const sColor = scoreColor(score);
  const sLabel = scoreLabel(score);
  const skills = rec.career.required_skills ?? [];

  // Split AI analysis into "Why this matches" and "Future" segments if possible
  const analysis = rec.ai_analysis ?? "";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        background: "var(--ms-bg-card)",
        border: `1px solid ${expanded ? "var(--ms-border-glow)" : "var(--ms-border-subtle)"}`,
        boxShadow: expanded ? "0 8px 32px rgba(14,116,144,0.12)" : "none",
      }}
      onClick={onToggle}
    >
      {/* Category color top strip */}
      <div className="h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${CHART_COLORS[index % CHART_COLORS.length]}aa, transparent)` }} />

      <div className="p-5 md:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            {/* Rank + title */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                style={{ background: `${CHART_COLORS[index % CHART_COLORS.length]}22`, color: CHART_COLORS[index % CHART_COLORS.length], border: `1px solid ${CHART_COLORS[index % CHART_COLORS.length]}44` }}>
                {index + 1}
              </span>
              <h3 className="text-base md:text-lg font-bold leading-tight truncate">
                {rec.career.title}
              </h3>
            </div>

            {/* Category badge */}
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
              {rec.career.category}
            </span>
          </div>

          {/* Score badge */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-base tabular-nums"
              style={{
                background: `${sColor}15`,
                border: `2px solid ${sColor}50`,
                color: sColor,
                boxShadow: `0 0 14px ${sColor}20`,
              }}>
              {score}%
            </div>
            <span className="text-[9px] font-bold mt-1 text-center leading-tight"
              style={{ color: sColor }}>
              {sLabel}
            </span>
          </div>
        </div>

        {/* Match bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Compatibility</span>
            <span className="font-bold" style={{ color: sColor }}>{score}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--ms-bg-layer3)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${score}%`,
                background: `linear-gradient(90deg, #1E40AF, ${sColor})`,
                boxShadow: `0 0 8px ${sColor}40`,
              }}
            />
          </div>
        </div>

        {/* AI Analysis preview */}
        <p className={`text-sm text-muted-foreground leading-relaxed mb-4 ${expanded ? "" : "line-clamp-2"}`}>
          {analysis}
        </p>

        {/* Skills tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(expanded ? skills : skills.slice(0, 5)).map(s => (
              <span key={s}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }}>
                {s}
              </span>
            ))}
            {!expanded && skills.length > 5 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }}>
                +{skills.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Quick meta row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          {rec.career.salary_range && (
            <span className="flex items-center gap-1">
              <DollarSign size={11} /> {rec.career.salary_range}
            </span>
          )}
          {rec.career.future_scope && (
            <span className="flex items-center gap-1 flex-1 min-w-0">
              <TrendingUp size={11} className="flex-shrink-0" />
              <span className="truncate">{rec.career.future_scope}</span>
            </span>
          )}
        </div>

        {/* Expand toggle */}
        <div className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
          <span className="text-xs font-semibold" style={{ color: "var(--ms-accent-sky)" }}>
            {expanded ? "Show less" : "Show details"}
          </span>
          {expanded
            ? <ChevronUp size={15} style={{ color: "var(--ms-accent-sky)" }} />
            : <ChevronDown size={15} style={{ color: "var(--ms-accent-sky)" }} />}
        </div>

        {/* Expanded section */}
        {expanded && (
          <div className="mt-4 space-y-4" onClick={e => e.stopPropagation()}>

            {/* Career description */}
            {rec.career.description && (
              <div className="rounded-xl p-4"
                style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Target size={13} style={{ color: "var(--ms-accent-cyan)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--ms-accent-cyan)" }}>About this career</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rec.career.description}
                </p>
              </div>
            )}

            {/* Future scope */}
            {rec.career.future_scope && (
              <div className="rounded-xl p-4"
                style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={13} style={{ color: "#34D399" }} />
                  <span className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#34D399" }}>Future Opportunities</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rec.career.future_scope}
                </p>
              </div>
            )}

            {/* All skills */}
            {skills.length > 0 && (
              <div className="rounded-xl p-4"
                style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <BookOpen size={13} style={{ color: "#A78BFA" }} />
                  <span className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#A78BFA" }}>Required Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => (
                    <span key={s}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(167,139,250,0.10)", border: "1px solid rgba(167,139,250,0.25)", color: "#A78BFA" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Why this matches */}
            <div className="rounded-xl p-4"
              style={{ background: `${sColor}08`, border: `1px solid ${sColor}25` }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={13} style={{ color: sColor }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: sColor }}>
                  Why this matches you
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
                {analysis}
              </p>
            </div>

            {/* CTA */}
            <Link to="/careers"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
              <Briefcase size={14} /> Explore in Career Explorer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GenErrorBanner — retry-aware error display
// ─────────────────────────────────────────────────────────────────────────────
function GenErrorBanner({
  msg, isRateLimit, isNetwork, retryCount, onRetry,
}: {
  msg: string; isRateLimit: boolean; isNetwork: boolean;
  retryCount: number; onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl p-4 md:p-5 relative overflow-hidden"
      style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.20)" }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)" }}>
          {isNetwork
            ? <WifiOff size={16} style={{ color: "#EF4444" }} />
            : <AlertCircle size={16} style={{ color: "#EF4444" }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm mb-0.5" style={{ color: "#EF4444" }}>
            {isRateLimit ? "Rate limit reached" : isNetwork ? "Network error" : "Generation failed"}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">{msg}</p>

          {isRateLimit && (
            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#D97706" }}>
              <Clock size={11} /> You can try again after a short wait.
            </p>
          )}
        </div>

        {retryCount < MAX_RETRIES && !isRateLimit && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all hover:opacity-90"
            style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>
            <RefreshCw size={12} /> Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Recommendations page
// ─────────────────────────────────────────────────────────────────────────────
const Recommendations = () => {
  const [recs, setRecs]             = useState<Recommendation[]>([]);
  const [tests, setTests]           = useState<OrientationTest[]>([]);
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState(false);
  const [loadError, setLoadError]   = useState<string | null>(null);
  const [genError, setGenError]     = useState<{ msg: string; isRateLimit: boolean; isNetwork: boolean } | null>(null);
  const [expanded, setExpanded]     = useState<number | null>(null);
  const [locked, setLocked]         = useState(false);
  const [fromCache, setFromCache]   = useState(false);
  const retryCountRef               = useRef(0);

  // ── Load tests status + recommendations (cache-first) ──────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [testsRes, recsRes] = await Promise.all([
        getTests(),
        getRecommendations(),
      ]);

      const testsData: OrientationTest[] = testsRes.data.data;
      setTests(testsData);

      const allDone = testsData.length > 0 && testsData.every(t => t.is_completed);
      setLocked(!allDone);

      const freshRecs: Recommendation[] = recsRes.data.data;

      if (freshRecs.length > 0) {
        setRecs(freshRecs);
        writeCache(freshRecs);
        setFromCache(false);
      } else {
        // Try to show cached recommendations while DB is empty
        const cached = readCache();
        if (cached) {
          setRecs(cached.data);
          setFromCache(true);
        }
      }
    } catch (e) {
      const { msg } = extractError(e);
      // On load failure, try cache as fallback
      const cached = readCache();
      if (cached) {
        setRecs(cached.data);
        setFromCache(true);
        const testsFromCache = tests; // keep existing tests state
        void testsFromCache;
        toast.warning("Showing cached recommendations (offline)");
      } else {
        setLoadError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Generate with retry + cache fallback ──────────────────────────────────
  const generate = useCallback(async (isRetry = false) => {
    if (!isRetry) retryCountRef.current = 0;
    setGenerating(true);
    setGenError(null);
    try {
      const res  = await generateRecommendations();
      const data: Recommendation[] = res.data.data;
      setRecs(data);
      writeCache(data);          // update cache with fresh data
      setFromCache(false);
      setExpanded(null);
      toast.success("AI recommendations generated!");
      retryCountRef.current = 0;
    } catch (e: unknown) {
      const err = extractError(e);

      // Auto-retry once after delay (not for rate limits)
      if (!isRetry && !err.isRateLimit && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        toast.info("Retrying in 3 seconds…");
        setTimeout(() => generate(true), RETRY_DELAY_MS);
        return; // keep generating=true during delay
      }

      // Exhausted retries — show error, fall back to cache if possible
      setGenError(err);
      toast.error(err.msg);

      const cached = readCache();
      if (cached && cached.data.length > 0 && recs.length === 0) {
        setRecs(cached.data);
        setFromCache(true);
        toast.info("Showing previously cached recommendations.");
      }
    } finally {
      if (isRetry || retryCountRef.current === 0) {
        setGenerating(false);
      }
    }
  }, [recs.length]);

  useEffect(() => { load(); }, [load]);

  const handleRetry = () => generate(false);

  const chartData = recs.map((r, i) => ({
    name:  r.career.title.length > 16 ? r.career.title.slice(0, 16) + "…" : r.career.title,
    value: Math.round(r.match_score),
    fill:  CHART_COLORS[i % CHART_COLORS.length],
  }));

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="skeleton h-14 rounded-2xl" />
        <div className="skeleton h-56 rounded-2xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // ── Load error ────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}>
          <AlertCircle size={24} style={{ color: "#EF4444" }} />
        </div>
        <div className="text-center">
          <p className="font-bold mb-1">Failed to load</p>
          <p className="text-sm text-muted-foreground">{loadError}</p>
        </div>
        <button onClick={() => load()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
          <RefreshCw size={14} /> Try again
        </button>
      </div>
    );
  }

  // ── Locked ────────────────────────────────────────────────────────────────
  if (locked) return <LockedGate tests={tests} />;

  // ── Unlocked ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-5 ms-page-enter">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5">
            <Sparkles size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            AI Recommendations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personalized career matches based on your profile and test results.
          </p>
        </div>

        {/* Regenerate button — only visible when recommendations already exist */}
        {(recs.length > 0 || generating) && (
          <button
            onClick={() => { clearCache(); generate(false); }}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)", boxShadow: "0 4px 14px rgba(14,116,144,0.28)" }}>
            {generating
              ? <><RefreshCw size={15} className="animate-spin" /> Generating…</>
              : <><RefreshCw size={15} /> Regenerate</>}
          </button>
        )}
      </div>

      {/* Cache notice */}
      {fromCache && recs.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)", color: "#D97706" }}>
          <Clock size={13} className="flex-shrink-0" />
          <span>Showing cached recommendations. Click "Regenerate" to get fresh results.</span>
        </div>
      )}

      {/* Generation error banner */}
      {genError && !generating && (
        <GenErrorBanner
          msg={genError.msg}
          isRateLimit={genError.isRateLimit}
          isNetwork={genError.isNetwork}
          retryCount={retryCountRef.current}
          onRetry={handleRetry}
        />
      )}

      {/* Generating animation */}
      {generating && <GeneratingState />}

      {/* Empty state */}
      {!generating && recs.length === 0 && (
        <div className="rounded-2xl relative overflow-hidden"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
          <div className="h-1"
            style={{ background: "linear-gradient(90deg, #1E40AF, #0E7490, var(--ms-accent-cyan))" }} />
          <div className="p-12 md:p-16 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)" }}>
              <Sparkles size={28} style={{ color: "var(--ms-accent-cyan)", opacity: 0.6 }} />
            </div>
            <h2 className="font-bold text-lg mb-2">Ready to generate!</h2>
            <p className="text-sm text-muted-foreground mb-7 max-w-sm mx-auto leading-relaxed">
              All orientation tests complete. Let AI analyze your profile and match you with the best career paths.
            </p>
            <button
              onClick={() => generate(false)}
              className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)", boxShadow: "0 6px 24px rgba(14,116,144,0.35)" }}>
              <Sparkles size={16} /> Generate with AI
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {!generating && recs.length > 0 && (
        <>
          {/* Compatibility chart */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
            <div className="h-1"
              style={{ background: "linear-gradient(90deg, #0EA5E9, #A78BFA, #34D399)" }} />
            <div className="p-5 md:p-6">
              <h2 className="font-bold mb-4 text-sm md:text-base flex items-center gap-2">
                <Target size={15} style={{ color: "var(--ms-accent-cyan)" }} />
                Compatibility Overview
              </h2>
              <div style={{ height: Math.max(120, recs.length * 52) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }}
                      tickFormatter={v => `${v}%`}
                      stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={130}
                      stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      formatter={(v: number) => [`${v}%`, "Match Score"]}
                      contentStyle={{
                        background: "var(--ms-bg-card)",
                        border: "1px solid var(--ms-border-glow)",
                        borderRadius: 10,
                        color: "hsl(var(--foreground))",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      }}
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendation cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {recs.map((r, i) => (
              <RecommendationCard
                key={r.id}
                rec={r}
                index={i}
                expanded={expanded === r.id}
                onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
              />
            ))}
          </div>

          {/* Footer meta */}
          <p className="text-xs text-center text-muted-foreground pb-2">
            {fromCache ? "Cached results" : `Generated on ${new Date(recs[0]?.created_at).toLocaleDateString()}`}
            {" · "}Click any card to expand full details
          </p>
        </>
      )}
    </div>
  );
};

export default Recommendations;
