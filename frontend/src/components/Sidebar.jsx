import React from "react";
import { Check, Sun, Moon } from "lucide-react";
import { useOnboarding } from "../context/OnboardingContext";

const STEPS = [
  { n: 1, title: "Account & Identity" },
  { n: 2, title: "Personal Info" },
  { n: 3, title: "Address & Location" },
  { n: 4, title: "Roles & Permissions" },
  { n: 5, title: "Compliance & Risk" },
  { n: 6, title: "Review & Submit" },
];

const Sidebar = () => {
  const { state, setStep, progress, setTheme, canAccessStep } = useOnboarding();
  const current = state.currentStep;
  const theme = state.theme;

  return (
    <aside className="fixed left-0 top-0 z-30 h-dvh w-[320px] shrink-0 border-r border-(--divider) bg-(--panel) text-(--text) flex flex-col overflow-hidden">
      <div className="px-6 pt-5 pb-4 flex-1 min-h-0 flex flex-col">


        <div className="flex items-center gap-3 mb-7">
          <div className="relative h-11 w-11 rounded-xl bg-linear-to-br from-[#8b5cf6] to-[#7c3aed] shadow-[0_6px_20px_-4px_rgba(139, 92, 246,0.5)] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white"><path fill="currentColor" d="M12 4 L20 19 L4 19 Z" /></svg>
          </div>
          <div>
            <div className="text-[17px] font-semibold leading-tight">Aether Capital</div>
            <div className="mono text-[10px] tracking-[0.2em] text-[#8b5cf6]/80 mt-1">ONBOARDING · 2026</div>
          </div>
        </div>



        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="mono text-[10px] tracking-[0.24em] text-(--muted)">APPLICATION</span>
            <span className="mono text-[11px] text-(--accent-label)">{progress}%</span>
          </div>
          <div className="h-0.75 w-full bg-(--progress-track) rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#8b5cf6] to-[#d946ef] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>



        <nav className="space-y-1">
          {STEPS.map((s) => {
            const isCurrent = s.n === current;
            const isDone = s.n < current;
            const isLocked = !canAccessStep(s.n);
            return (
              <button
                key={s.n}
                disabled={isLocked}
                onClick={() => setStep(s.n)}
                className={`group w-full text-left relative pl-0 pr-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors border ${
                  isLocked
                    ? "cursor-not-allowed opacity-45 border-transparent"
                    : "cursor-pointer"
                } ${isCurrent
                    ? "bg-(--surface-elevated) border-(--border-strong)"
                    : isLocked
                      ? ""
                      : "border-transparent hover:bg-(--surface-hover)"
                  }`}
              >
                {isCurrent && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-linear-to-b from-[#8b5cf6] to-[#d946ef]" />
                )}
                <span
                  className={`ml-3 shrink-0 flex items-center justify-center h-7 w-7 rounded-full mono text-[11px] font-semibold transition-all ${isDone
                      ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/35"
                      : isCurrent
                        ? "bg-linear-to-br from-[#8b5cf6] to-[#d946ef] text-white shadow-[0_4px_14px_-4px_rgba(139, 92, 246,0.7)]"
                        : "bg-(--surface-elevated) text-(--muted) border border-(--line-strong)"
                    }`}
                >
                  {isDone ? <Check size={14} strokeWidth={3} /> : String(s.n).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="mono text-[10px] tracking-[0.24em] text-(--muted)">STEP {String(s.n).padStart(2, "0")}</div>
                  <div className={`text-[14px] ${isCurrent ? "text-(--text) font-medium" : "text-(--text-secondary)"}`}>{s.title}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>


      <div className="p-5 border-t border-(--divider) flex items-center justify-between text-[12px] bg-(--panel)">
        <div className="flex items-center gap-2 text-(--muted)">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
          <span>Need help? </span>
          <a href="mailto:help@aether.com" className="underline decoration-[#8b5cf6]/40 underline-offset-2 hover:text-(--text)">help@aether.com</a>
        </div>
        <div className="flex items-center gap-1 bg-(--surface-elevated) border border-(--line-strong) rounded-full p-0.75">
          <button
            onClick={() => setTheme("light")}
            aria-label="Light mode"
            className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors ${theme === "light" ? "bg-violet-600 text-white shadow-sm dark:bg-white dark:text-[#07080d]" : "text-(--muted) hover:text-(--text)"}`}
          >
            <Sun size={13} />
          </button>
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark mode"
            className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors ${theme === "dark" ? "bg-linear-to-br from-[#8b5cf6] to-[#d946ef] text-white" : "text-(--muted) hover:text-(--text)"}`}
          >
            <Moon size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
