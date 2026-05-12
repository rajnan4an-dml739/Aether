import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";

const INDUSTRIES = [
  "Banking", "Insurance", "Capital markets", "FinTech", "SaaS",
  "AI / ML", "Cybersecurity", "Biotech", "Pharma", "MedTech",
  "E-commerce", "Consumer goods", "Other",
];

const EMP_OPTIONS = ["1–10", "11–50", "51–200", "200+"];

const Step2Personal = () => {
  const { state, update } = useOnboarding();
  const s = state.step2;

  return (
    <div className="space-y-7">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="label-xs mb-2">Company Name<span className="text-pink-400 ml-0.5">*</span></div>
          <input
            className="ae-input"
            placeholder="Legal name"
            value={s.legalName}
            onChange={(e) => update("step2", { legalName: e.target.value })}
          />
          <div className="text-[11px] text-slate-500 dark:text-purple-300/45 mt-1.5 mono">Trade name optional · legal required</div>
          <input
            className="ae-input mt-3"
            placeholder="Trade name (optional)"
            value={s.tradeName}
            onChange={(e) => update("step2", { tradeName: e.target.value })}
          />
        </div>

        <div>
          <div className="label-xs mb-2">Registration<span className="text-pink-400 ml-0.5">*</span></div>
          <input
            className="ae-input"
            placeholder="Registration number"
            value={s.registrationNumber}
            onChange={(e) => update("step2", { registrationNumber: e.target.value })}
          />
          <div className="text-[11px] text-slate-500 dark:text-purple-300/45 mt-1.5 mono">Number and incorporation date</div>
          <input
            type="date"
            className="ae-input mt-3"
            value={s.registrationDate}
            onChange={(e) => update("step2", { registrationDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <div className="label-xs mb-2">Industry<span className="text-pink-400 ml-0.5">*</span></div>
        <div className="relative">
          <select
            className="ae-input appearance-none pr-10"
            value={s.industry}
            onChange={(e) => update("step2", { industry: e.target.value })}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i.toLowerCase()}>{i}</option>
            ))}
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-violet-600 dark:text-purple-400" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>

      <div>
        <div className="label-xs mb-3">Number of employees</div>
        <div className="grid grid-cols-4 gap-2">
          {EMP_OPTIONS.map((e) => {
            const active = s.employees === e;
            return (
              <button
                key={e}
                onClick={() => update("step2", { employees: e })}
                className={`px-4 py-3 rounded-lg text-[13.5px] font-medium transition-all border ${active
                    ? "bg-linear-to-br from-[#a855f7] to-[#d946ef] text-white border-transparent shadow-[0_6px_18px_-6px_rgba(168,85,247,0.7)]"
                    : "bg-violet-500/10 dark:bg-purple-900/15 border-violet-300/55 dark:border-purple-800/40 text-slate-800 dark:text-purple-100/80 hover:border-violet-400/60 dark:hover:border-purple-500/40 hover:bg-violet-500/15 dark:hover:bg-purple-900/25"
                  }`}
              >
                {e}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Step2Personal;
