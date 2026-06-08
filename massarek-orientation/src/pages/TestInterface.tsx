import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, CheckCircle, AlertCircle, FileQuestion,
  Clock, RefreshCw, Sparkles, Lock, ChevronRight, Star,
} from "lucide-react";
import { toast } from "sonner";
import {
  getTests, getTest, submitTest,
  type OrientationTest, type TestQuestion, type SubmitAnswerPayload,
} from "@/services/studentApi";

// ─────────────────────────────────────────────────────────────────────────────
// Error helper — no external dependency
// ─────────────────────────────────────────────────────────────────────────────
function extractError(e: unknown): string {
  const err = e as any;
  if (err?.response?.data?.errors) {
    const first = Object.values(err.response.data.errors)[0];
    return Array.isArray(first) ? first[0] : String(first);
  }
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.status === 429) return "Too many requests. Please wait a moment.";
  if (err?.code === "ECONNABORTED") return "Request timed out. Please try again.";
  if (!err?.response) return "Network error. Please check your connection.";
  return "An unexpected error occurred.";
}

// ─────────────────────────────────────────────────────────────────────────────
// Category config — color + label used consistently everywhere
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES: Record<string, { color: string; label: string }> = {
  aptitude:    { color: "var(--ms-accent-cyan)", label: "Aptitude" },
  personality: { color: "#A78BFA",               label: "Personality" },
  skills:      { color: "#34D399",               label: "Skills" },
};

function getCat(cat: string) {
  return CATEGORIES[cat?.toLowerCase()] ?? { color: "var(--ms-accent-sky)", label: cat };
}

// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge — theme-aware (uses CSS vars, no hardcoded backgrounds)
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ test }: { test: OrientationTest }) {
  if (test.is_completed) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#059669" }}>
        <CheckCircle size={10} /> Completed
      </span>
    );
  }
  if (test.answered_count > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.30)", color: "#D97706" }}>
        <Clock size={10} /> In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
      Not Started
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TestList — overview of all 3 tests
// ─────────────────────────────────────────────────────────────────────────────
function TestList({ onSelect }: { onSelect: (test: OrientationTest) => void }) {
  const [tests, setTests]     = useState<OrientationTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getTests()
      .then(r => setTests(r.data.data))
      .catch(e => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-28 rounded-2xl" />
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}>
          <AlertCircle size={24} style={{ color: "#EF4444" }} />
        </div>
        <p className="font-bold">Failed to load tests</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={load}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
          <RefreshCw size={14} /> Try again
        </button>
      </div>
    );
  }

  const completedCount = tests.filter(t => t.is_completed).length;
  const allDone = completedCount === tests.length && tests.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-4 ms-page-enter">

      {/* Page header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)" }}>
            <FileQuestion size={18} className="text-white" />
          </span>
          Orientation Tests
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 ml-0.5">
          Complete all 3 tests to unlock your personalized AI career recommendations.
        </p>
      </div>

      {/* Journey tracker */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--ms-accent-cyan)" }}>
            Your Journey
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
            {completedCount}/{tests.length || 3} completed
          </span>
        </div>

        {/* Step circles with connectors */}
        <div className="flex items-center">
          {(tests.length > 0 ? tests : Array(3).fill(null)).map((t, i, arr) => {
            const done    = t?.is_completed ?? false;
            const inProg  = !done && (t?.answered_count ?? 0) > 0;
            const cat     = t ? getCat(t.category) : null;
            const dotColor = done ? "#10B981" : inProg ? "#F59E0B" : "var(--ms-border-subtle)";

            return (
              <div key={i} className="flex items-center"
                style={{ flex: i < arr.length - 1 ? 1 : "none" }}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0"
                    style={{
                      background: done
                        ? "rgba(16,185,129,0.15)"
                        : inProg
                          ? "rgba(245,158,11,0.12)"
                          : "var(--ms-bg-layer3)",
                      border: `2px solid ${dotColor}`,
                      color: done ? "#10B981" : inProg ? "#F59E0B" : "var(--ms-accent-sky)",
                    }}
                  >
                    {done ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground text-center hidden sm:block"
                    style={{ color: cat ? cat.color : undefined }}>
                    {t?.category ?? `Test ${i + 1}`}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-700"
                    style={{ background: done ? "rgba(16,185,129,0.45)" : "var(--ms-border-subtle)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Overall bar */}
        <div className="mt-2 h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--ms-bg-layer3)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${tests.length > 0 ? (completedCount / tests.length) * 100 : 0}%`,
              background: "linear-gradient(90deg, #059669, #34D399)",
              boxShadow: "0 0 8px rgba(16,185,129,0.35)",
            }} />
        </div>
      </div>

      {/* All done unlock banner */}
      {allDone && (
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.15)" }}>
            <Sparkles size={18} style={{ color: "#059669" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: "#059669" }}>All tests completed! 🎉</p>
            <p className="text-xs text-muted-foreground">AI recommendations are now unlocked.</p>
          </div>
          <button
            onClick={() => window.location.href = "/recommendations"}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 transition-all hover:scale-105"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.30)", color: "#059669" }}>
            View <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Test cards */}
      {tests.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No active tests available at the moment.
        </div>
      ) : (
        tests.map((test, idx) => {
          const pct   = test.questions_count > 0
            ? Math.round((test.answered_count / test.questions_count) * 100) : 0;
          const cat   = getCat(test.category);

          return (
            <div
              key={test.id}
              className="ms-card-hover rounded-2xl relative overflow-hidden cursor-pointer"
              style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
              onClick={() => onSelect(test)}
            >
              {/* Category color accent — top strip */}
              <div className="h-1 w-full rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent 0%, ${cat.color}80 40%, ${cat.color} 60%, transparent 100%)` }} />

              <div className="p-5 md:p-6">
                <div className="flex items-start gap-4">

                  {/* Step icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 mt-0.5"
                    style={{
                      background: test.is_completed
                        ? "rgba(16,185,129,0.12)"
                        : `${cat.color}15`,
                      border: `1.5px solid ${test.is_completed ? "rgba(16,185,129,0.35)" : `${cat.color}40`}`,
                      color: test.is_completed ? "#059669" : cat.color,
                    }}>
                    {test.is_completed ? <CheckCircle size={18} /> : idx + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h2 className="font-bold text-base leading-tight">{test.title}</h2>
                      <StatusBadge test={test} />
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {test.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <FileQuestion size={11} /> {test.questions_count} questions
                      </span>
                      {test.duration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> ~{test.duration} min
                        </span>
                      )}
                      {test.answered_count > 0 && !test.is_completed && (
                        <span className="flex items-center gap-1 font-semibold"
                          style={{ color: "#D97706" }}>
                          <ChevronRight size={11} />
                          {test.answered_count}/{test.questions_count} — resume
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={e => { e.stopPropagation(); onSelect(test); }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 transition-all hover:scale-105 whitespace-nowrap"
                    style={test.is_completed ? {
                      background: "var(--ms-accent-glow)",
                      border: "1px solid var(--ms-border-glow)",
                      color: "var(--ms-accent-sky)",
                    } : {
                      background: `${cat.color}15`,
                      border: `1.5px solid ${cat.color}50`,
                      color: cat.color,
                    }}
                  >
                    {test.is_completed
                      ? <><RefreshCw size={13} /> Retake</>
                      : test.answered_count > 0
                        ? <><ChevronRight size={13} /> Continue</>
                        : <><ArrowRight size={13} /> Start</>}
                  </button>
                </div>

                {/* Progress bar */}
                {test.questions_count > 0 && (
                  <div className="mt-4 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--ms-bg-layer3)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: test.is_completed
                          ? "linear-gradient(90deg, #059669, #34D399)"
                          : `linear-gradient(90deg, ${cat.color}70, ${cat.color})`,
                        boxShadow: `0 0 6px ${cat.color}40`,
                      }} />
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Lock notice */}
      {!allDone && tests.length > 0 && (
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)" }}>
          <Lock size={15} style={{ color: "var(--ms-accent-cyan)", flexShrink: 0 }} />
          <p className="text-xs leading-relaxed">
            <span className="font-bold" style={{ color: "var(--ms-accent-sky)" }}>
              AI Recommendations are locked
            </span>
            {" "}until you complete all {tests.length} orientation tests.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmSubmit modal — theme-aware
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmSubmitModal({
  onConfirm, onCancel, answeredCount, totalCount, submitting,
}: {
  onConfirm: () => void; onCancel: () => void;
  answeredCount: number; totalCount: number; submitting: boolean;
}) {
  const allAnswered = answeredCount === totalCount;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-glow)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.30)",
        }}>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #1E40AF22, #0E749022)", border: "1px solid var(--ms-border-glow)" }}>
          <CheckCircle size={30} style={{ color: "var(--ms-accent-cyan)" }} />
        </div>

        <h3 className="font-bold text-xl text-center mb-1">Submit test?</h3>
        <p className="text-sm text-center text-muted-foreground mb-4">
          You answered{" "}
          <span className="font-bold" style={{ color: "var(--ms-accent-cyan)" }}>
            {answeredCount}/{totalCount}
          </span>{" "}
          questions.
        </p>

        {!allAnswered && (
          <div className="rounded-xl px-4 py-2.5 text-xs text-center mb-4 flex items-center justify-center gap-1.5"
            style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.25)", color: "#D97706" }}>
            ⚠ {totalCount - answeredCount} question{totalCount - answeredCount > 1 ? "s" : ""} unanswered — will be skipped.
          </div>
        )}

        {/* Primary action — full width, prominent */}
        <button onClick={onConfirm} disabled={submitting}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 mb-2"
          style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)", boxShadow: "0 4px 16px rgba(14,116,144,0.30)" }}>
          {submitting
            ? <><RefreshCw size={14} className="animate-spin" /> Submitting…</>
            : <><CheckCircle size={14} /> Submit Test</>}
        </button>
        {/* Secondary action — smaller, understated */}
        <button onClick={onCancel} disabled={submitting}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{ background: "transparent", color: "var(--ms-accent-sky)" }}>
          ← Keep going
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CompletionScreen — rich result card, fixes the blank layout + button issue
// ─────────────────────────────────────────────────────────────────────────────
function CompletionScreen({
  test, allTestsDone, onComplete, navigate,
}: {
  test: OrientationTest; allTestsDone: boolean;
  onComplete: () => void; navigate: (path: string) => void;
}) {
  const cat = getCat(test.category);

  return (
    <div className="max-w-2xl mx-auto ms-page-enter space-y-5">

      {/* Result hero card */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>

        {/* Colored top banner */}
        <div className="h-2"
          style={{ background: `linear-gradient(90deg, ${cat.color}40, ${cat.color}, ${cat.color}40)` }} />

        <div className="p-8 text-center">
          {/* Animated checkmark */}
          <div className="relative w-24 h-24 mx-auto mb-5">
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1E40AF, #0E7490)",
                boxShadow: "0 0 40px rgba(14,116,144,0.35)",
              }}>
              <CheckCircle size={44} className="text-white" />
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: "var(--ms-accent-cyan)" }} />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">Test Completed! 🎉</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {allTestsDone
              ? "You've completed all 3 orientation tests. Your AI Recommendations are now unlocked!"
              : "Your answers have been saved. Complete the remaining tests to unlock AI recommendations."}
          </p>
        </div>

        {/* Test summary row */}
        <div className="px-6 pb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Category", value: cat.label, color: cat.color },
            { label: "Questions", value: `${test.questions?.length ?? test.questions_count ?? "—"}`, color: "var(--ms-accent-sky)" },
            { label: "Status",    value: "Complete", color: "#10B981" },
          ].map(item => (
            <div key={item.label} className="text-center rounded-xl p-3"
              style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
              <div className="text-base font-extrabold" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All tests done — unlock card */}
      {allTestsDone && (
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.30)" }}>
            <Star size={20} style={{ color: "#10B981" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#10B981" }}>
              🔓 AI Recommendations Unlocked!
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              All 3 tests complete. Generate your personalized career matches now.
            </p>
          </div>
        </div>
      )}

      {/* Action buttons — primary full-width CTA + text-only secondary */}
      <div className="space-y-2">
        {/* PRIMARY — big gradient button */}
        {allTestsDone ? (
          <button
            onClick={() => navigate("/recommendations")}
            className="w-full flex items-center justify-center gap-2.5 font-bold py-4 rounded-xl text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #1E40AF, #0E7490)",
              boxShadow: "0 6px 24px rgba(14,116,144,0.35)",
              fontSize: "1rem",
            }}>
            <Sparkles size={18} /> Get AI Recommendations
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2.5 font-bold py-4 rounded-xl text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #1E40AF, #0E7490)",
              boxShadow: "0 6px 24px rgba(14,116,144,0.30)",
              fontSize: "1rem",
            }}>
            <ArrowRight size={18} /> Continue to Next Test
          </button>
        )}

        {/* SECONDARY — plain text link, clearly subordinate */}
        <button
          onClick={onComplete}
          className="w-full py-2.5 text-sm font-medium transition-all hover:opacity-70"
          style={{ color: "var(--ms-accent-sky)", background: "transparent" }}>
          ← Back to all tests
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TestTaker — question by question experience
// ─────────────────────────────────────────────────────────────────────────────
function TestTaker({ testId, onComplete }: { testId: number; onComplete: () => void }) {
  const navigate  = useNavigate();
  const topRef    = useRef<HTMLDivElement>(null);

  const [test, setTest]               = useState<OrientationTest | null>(null);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [current, setCurrent]         = useState(0);
  const [answers, setAnswers]         = useState<Record<number, string>>({});
  const [done, setDone]               = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [allTestsDone, setAllTestsDone] = useState(false);

  useEffect(() => {
    getTest(testId)
      .then(r => {
        const t = r.data.data;
        setTest(t);
        const prefilled: Record<number, string> = {};
        t.questions?.forEach((q: TestQuestion) => {
          if (q.user_answer) prefilled[q.id] = q.user_answer;
        });
        setAnswers(prefilled);
        // Resume from last answered
        const qs = t.questions ?? [];
        const lastIdx = qs.reduce((last: number, q: TestQuestion, i: number) =>
          q.user_answer ? i : last, -1);
        if (lastIdx >= 0 && lastIdx < qs.length - 1) setCurrent(lastIdx + 1);
      })
      .catch(e => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, [testId]);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const doSubmit = async () => {
    setSubmitting(true);
    setShowConfirm(false);
    setError(null);
    const payload: SubmitAnswerPayload[] = Object.entries(answers).map(([qId, answer]) => ({
      question_id: parseInt(qId), answer,
    }));
    try {
      const res = await submitTest(testId, payload);
      setAllTestsDone((res.data as any).all_tests_completed === true);
      setDone(true);
      toast.success("Test submitted successfully!");
    } catch (e) {
      const msg = extractError(e);
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="skeleton h-8 w-64 rounded-xl" />
        <div className="skeleton h-3 rounded-full" />
        <div className="skeleton h-80 rounded-2xl" />
        <div className="flex justify-between gap-4">
          <div className="skeleton h-12 w-32 rounded-xl" />
          <div className="skeleton h-12 w-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error && !test) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}>
          <AlertCircle size={24} style={{ color: "#EF4444" }} />
        </div>
        <p className="font-bold">Failed to load test</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={onComplete}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
          ← Back to tests
        </button>
      </div>
    );
  }

  const questions: TestQuestion[] = test?.questions ?? [];
  const totalQ = questions.length;

  // Completion screen
  if (done && test) {
    return (
      <CompletionScreen
        test={test}
        allTestsDone={allTestsDone}
        onComplete={onComplete}
        navigate={navigate}
      />
    );
  }

  if (!test || totalQ === 0) return null;

  const q        = questions[current];
  if (!q) return null;

  const progress  = ((current + 1) / totalQ) * 100;
  const hasAnswer = answers[q.id] !== undefined;
  const isLast    = current === totalQ - 1;
  const cat       = getCat(test.category);

  return (
    <>
      {showConfirm && (
        <ConfirmSubmitModal
          answeredCount={Object.keys(answers).length}
          totalCount={totalQ}
          submitting={submitting}
          onConfirm={doSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="max-w-2xl mx-auto ms-page-enter" ref={topRef}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5 text-sm">
          <button onClick={onComplete}
            className="flex items-center gap-1.5 font-semibold transition-all hover:opacity-70"
            style={{ color: "var(--ms-accent-sky)" }}>
            <ArrowLeft size={14} /> Tests
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground truncate">{test.title}</span>
        </div>

        {/* Progress section */}
        <div className="mb-5 rounded-2xl p-4"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}35`, color: cat.color }}>
                {cat.label}
              </span>
              <span className="text-sm font-semibold">
                Question{" "}
                <span className="font-extrabold" style={{ color: cat.color }}>{current + 1}</span>
                <span className="text-muted-foreground"> / {totalQ}</span>
              </span>
            </div>
            <span className="text-xs font-bold tabular-nums px-2 py-0.5 rounded-full"
              style={{ background: `${cat.color}12`, color: cat.color }}>
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full overflow-hidden mb-2"
            style={{ background: "var(--ms-bg-layer3)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})`,
                boxShadow: `0 0 10px ${cat.color}50`,
              }} />
          </div>

          {/* Dot navigator */}
          <div className="flex items-center gap-1 flex-wrap">
            {questions.map((qq, i) => (
              <button
                key={qq.id}
                onClick={() => { setCurrent(i); scrollTop(); }}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === current ? 22 : 8,
                  height: 8,
                  background: answers[qq.id]
                    ? (i === current ? cat.color : `${cat.color}70`)
                    : (i === current ? cat.color : "var(--ms-border-subtle)"),
                }}
                aria-label={`Question ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl mb-4 overflow-hidden"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
          {/* Color strip */}
          <div className="h-1"
            style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }} />

          <div className="p-6 md:p-8">
            {/* Question meta */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold"
                style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}35`, color: cat.color }}>
                {current + 1}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {q.type === "text" ? "Open Answer" : q.type === "scale" ? "Scale Rating" : "Choose One"}
              </span>
            </div>

            <h2 className="text-base md:text-lg font-bold leading-relaxed mb-6">
              {q.question}
            </h2>

            {/* Single choice */}
            {(q.type === "single_choice" || !q.type) && q.options && (
              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button key={i}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className="w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3"
                      style={selected ? {
                        borderColor: cat.color,
                        background: `${cat.color}10`,
                        boxShadow: `0 0 0 1px ${cat.color}25, 0 2px 8px ${cat.color}15`,
                      } : {
                        borderColor: "var(--ms-border-subtle)",
                        background: "transparent",
                      }}>
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-all duration-200"
                        style={{
                          background: selected ? cat.color : "var(--ms-bg-layer3)",
                          color: selected ? "#fff" : "var(--ms-accent-sky)",
                          border: selected ? "none" : "1px solid var(--ms-border-subtle)",
                        }}>
                        {selected ? <CheckCircle size={13} /> : String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm font-medium leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text */}
            {q.type === "text" && (
              <div>
                <textarea
                  value={answers[q.id] ?? ""}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Type your answer here (optional)…"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none focus:outline-none transition-all"
                  style={{
                    background: "var(--ms-bg-layer3)",
                    border: "1.5px solid var(--ms-border-subtle)",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1.5">Optional — you may skip this question.</p>
              </div>
            )}

            {/* Scale */}
            {q.type === "scale" && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-3 px-1">
                  <span>Strongly disagree</span>
                  <span>Strongly agree</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => {
                    const val = String(v);
                    const selected = answers[q.id] === val;
                    return (
                      <button key={v}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                        className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105"
                        style={selected ? {
                          background: `${cat.color}18`,
                          border: `2px solid ${cat.color}`,
                          color: cat.color,
                          boxShadow: `0 0 14px ${cat.color}25`,
                        } : {
                          background: "var(--ms-bg-layer3)",
                          border: "1.5px solid var(--ms-border-subtle)",
                          color: "var(--ms-accent-sky)",
                        }}>
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit error */}
            {error && (
              <div className="mt-4 p-3 rounded-xl text-sm flex items-start gap-2"
                style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.20)", color: "#DC2626" }}>
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  <button onClick={doSubmit} className="text-xs font-bold mt-1 underline">Retry</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => { setCurrent(c => c - 1); setError(null); scrollTop(); }}
            disabled={current === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-35 disabled:cursor-not-allowed"
            style={{ background: "var(--ms-bg-card)", border: "1.5px solid var(--ms-border-subtle)" }}>
            <ArrowLeft size={15} /> Prev
          </button>

          <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">
            {Object.keys(answers).length}/{totalQ} answered
          </span>

          <button
            onClick={() => {
              if (isLast) setShowConfirm(true);
              else { setCurrent(c => c + 1); setError(null); scrollTop(); }
            }}
            disabled={(q.type !== "text" && q.type !== "scale" && !hasAnswer) || submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${cat.color === "var(--ms-accent-cyan)" ? "#0E7490" : cat.color}, #1E40AF)`,
              boxShadow: `0 4px 16px ${cat.color}30`,
            }}>
            {submitting
              ? <><RefreshCw size={14} className="animate-spin" /> Submitting…</>
              : isLast
                ? <><CheckCircle size={14} /> Finish Test</>
                : <><span>Next</span> <ArrowRight size={14} /></>}
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main — state machine preserved exactly
// ─────────────────────────────────────────────────────────────────────────────
const TestInterface = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [key, setKey] = useState(0);

  if (selectedTestId !== null) {
    return (
      <TestTaker
        testId={selectedTestId}
        onComplete={() => { setSelectedTestId(null); setKey(k => k + 1); }}
      />
    );
  }
  return <TestList key={key} onSelect={t => setSelectedTestId(t.id)} />;
};

export default TestInterface;
