import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const questions = [
  {
    question: "What type of activities do you enjoy the most?",
    options: ["Building & creating things", "Analyzing data & solving puzzles", "Helping & teaching others", "Designing & artistic expression"],
  },
  {
    question: "Which school subject interests you the most?",
    options: ["Mathematics", "Science", "Language & Literature", "Social Studies"],
  },
  {
    question: "How do you prefer to work?",
    options: ["Independently", "In small teams", "Leading a group", "Collaborating with many people"],
  },
  {
    question: "What matters most in a future career?",
    options: ["High salary", "Work-life balance", "Making an impact", "Creative freedom"],
  },
  {
    question: "Which environment appeals to you?",
    options: ["Office / Corporate", "Laboratory / Research", "Outdoors / Field work", "Remote / Digital"],
  },
];

const TestInterface = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);

  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  const selectAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [current]: optionIndex });
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
    else setCompleted(true);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Test Completed! 🎉</h1>
        <p className="text-muted-foreground mb-8">Your answers have been analyzed by our AI. Check your personalized recommendations now.</p>
        <a href="/recommendations" className="inline-flex items-center gap-2 gradient-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
          View Recommendations <ArrowRight size={18} />
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Question {current + 1} of {questions.length}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-8">
        <h2 className="text-xl font-semibold mb-6">{questions[current].question}</h2>
        <div className="space-y-3">
          {questions[current].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium ${
                answers[current] === i
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border hover:border-primary/30 hover:bg-accent/50"
              }`}
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-xs font-bold mr-3">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={prev} disabled={current === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <ArrowLeft size={16} /> Previous
        </button>
        <button onClick={next} disabled={answers[current] === undefined} className="flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
          {current === questions.length - 1 ? "Finish" : "Next"} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TestInterface;
