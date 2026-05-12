import React from "react";
import { Info, Upload, FileText } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

const QUESTIONS = [
  { k: "regulated", q: "Do you operate in a regulated industry?" },
  { k: "minors", q: "Do you handle PII data of minors?" },
  { k: "intlPayments", q: "Do you process international payments?" },
  { k: "soc2", q: "Are you subject to SOC 2 compliance?" },
  { k: "crypto", q: "Do you accept or hold crypto-assets?" },
  { k: "sanctioned", q: "Operate in or with sanctioned regions?" },
  { k: "peps", q: "Provide services to politically-exposed persons?" },
  { k: "crossBorder", q: "Store data outside primary jurisdiction?" },
];

const DOCS = [
  "Certificate of Incorporation",
  "Tax Registration",
  "Proof of Address",
  "Beneficial Owner Declaration",
];

const tierFor = (score) => {
  if (score < 30) return { label: "Low risk", color: "text-emerald-400", bar: "from-emerald-400 to-teal-400" };
  if (score < 60) return { label: "Moderate risk", color: "text-yellow-400", bar: "from-yellow-400 to-amber-400" };
  if (score < 85) return { label: "Elevated risk", color: "text-orange-400", bar: "from-orange-400 to-pink-400" };
  return { label: "Critical risk", color: "text-red-400", bar: "from-red-500 to-pink-500" };
};

const Step5Compliance = () => {
  const { state, update, riskScore } = useOnboarding();
  const s = state.step5;
  const tier = tierFor(riskScore);

  const setAns = (k, v) => update("step5", { answers: { ...s.answers, [k]: v } });
  const uploadDoc = (k) => update("step5", { documents: { ...s.documents, [k]: "UPLOADED" } });

  return (
    <div className="space-y-8">
     
      <section className="card-dark p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="label-xs">Live Risk Score</div>
            <div className={`text-[22px] font-semibold mt-1 ${tier.color}`}>{tier.label}</div>
          </div>
          <div className="text-right">
            <span className="text-[44px] font-semibold tabular-nums gradient-text">{riskScore}</span>
            <span className="text-violet-600 dark:text-purple-300/50 text-[14px] mono ml-0.5">/100</span>
          </div>
        </div>
        <div className="mt-5">
          <div className="relative h-1.5 rounded-full bg-violet-300/50 dark:bg-purple-900/40 overflow-hidden">
            <div className={`h-full bg-linear-to-r ${tier.bar} transition-all duration-700 ease-out`} style={{ width: `${riskScore}%` }} />
          </div>
          <div className="flex justify-between mono text-[10px] tracking-[0.18em] text-slate-500 dark:text-purple-300/50 mt-2">
            <span>0 LOW</span>
            <span>30</span>
            <span>60</span>
            <span>100 CRITICAL</span>
          </div>
        </div>
      </section>

      <section>
        <div className="label-xs mb-4">Risk Questionnaire (Optional)</div>
        <div className="space-y-2.5">
          {QUESTIONS.map((qq) => {
            const val = s.answers[qq.k];
            return (
              <div key={qq.k} className="card-dark hover-accent rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[14px] text-slate-800 dark:text-purple-50">
                  {qq.q}
                  <span className="h-4 w-4 rounded-full border border-violet-500/45 dark:border-purple-600/50 text-violet-600 dark:text-purple-400/70 flex items-center justify-center" title="Click for more info">
                    <Info size={10} />
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-violet-500/10 dark:bg-purple-900/25 border border-violet-300/50 dark:border-purple-800/50 rounded-full p-0.75">
                  <button
                    onClick={() => setAns(qq.k, false)}
                    className={`px-4 py-1.5 rounded-full text-[11px] mono tracking-[0.2em] font-semibold transition-all ${val === false ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40" : "text-slate-500 dark:text-purple-200/50 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >NO</button>
                  <button
                    onClick={() => setAns(qq.k, true)}
                    className={`px-4 py-1.5 rounded-full text-[11px] mono tracking-[0.2em] font-semibold transition-all ${val === true ? "bg-linear-to-br from-[#a855f7] to-[#d946ef] text-white" : "text-slate-500 dark:text-purple-200/50 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >YES</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="label-xs mb-4">Document Checklist (Optional)</div>
        <div className="card-dark rounded-xl divide-y divide-violet-200 dark:divide-purple-900/30">
          {DOCS.map((d) => {
            const status = s.documents[d];
            return (
              <div key={d} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-violet-500/10 dark:bg-purple-500/10 border border-violet-300/45 dark:border-purple-500/25 flex items-center justify-center text-violet-700 dark:text-purple-300">
                    <FileText size={15} />
                  </div>
                  <div>
                    <div className="text-[14px] text-slate-800 dark:text-purple-50">{d}</div>
                    <div className={`mono text-[10px] tracking-[0.2em] mt-0.5 ${status === "UPLOADED" ? "text-emerald-400" : "text-yellow-500/80"}`}>{status}</div>
                  </div>
                </div>
                <button
                  onClick={() => uploadDoc(d)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-violet-300/55 dark:border-purple-500/40 text-violet-800 dark:text-purple-200 text-[12.5px] hover:bg-violet-500/10 dark:hover:bg-purple-500/10 hover:border-violet-400 dark:hover:border-purple-400 transition-colors"
                >
                  <Upload size={13} /> Upload
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Step5Compliance;
