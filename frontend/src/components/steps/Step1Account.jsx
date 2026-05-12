import React, { useRef } from "react";
import { Upload, User, Building2, Landmark, Camera, FileImage } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

const TYPES = [
  {
    key: "Individual",
    icon: User,
    desc: "Personal account for solo traders, founders, and self-employed individuals.",
  },
  {
    key: "Business",
    icon: Building2,
    desc: "Registered companies, LLCs, and partnerships up to 200 employees.",
  },
  {
    key: "Enterprise",
    icon: Landmark,
    desc: "Public companies, multi-entity organizations, and regulated institutions.",
  },
];

const FileDrop = ({ label, hint, value, onChange, icon: Icon = FileImage, compact }) => {
  const ref = useRef(null);
  const handle = (f) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    onChange({ name: f.name, url, size: f.size });
  };
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); }}
      onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files?.[0]); }}
      className={`card-dark hover-accent cursor-pointer flex ${compact ? "flex-col items-center justify-center text-center p-5 min-h-39" : "items-center gap-4 p-5 min-h-24"} rounded-xl border-dashed`}
      style={{ borderStyle: "dashed" }}
    >
      <input ref={ref} type="file" hidden accept="image/*,.pdf" onChange={(e) => handle(e.target.files?.[0])} />
      <div className={`h-11 w-11 rounded-lg bg-violet-500/10 dark:bg-purple-500/10 border border-violet-300/55 dark:border-purple-500/30 flex items-center justify-center text-violet-700 dark:text-purple-300 ${compact ? "mb-2" : ""}`}>
        <Icon size={18} />
      </div>
      <div className={compact ? "" : "flex-1 min-w-0"}>
        <div className="text-[14px] font-medium text-slate-800 dark:text-purple-50">
          {value ? value.name : label}
        </div>
        <div className="mono text-[10px] tracking-wider text-slate-500 dark:text-purple-300/50 mt-0.5">{hint}</div>
      </div>
    </label>
  );
};

const Step1Account = () => {
  const { state, update } = useOnboarding();
  const s = state.step1;

  return (
    <div className="space-y-10">
    
      <section>
        <div className="label-xs mb-3">Account Type<span className="text-pink-400 ml-0.5">*</span></div>
        <div className="grid md:grid-cols-3 gap-3">
          {TYPES.map((t) => {
            const Icon = t.icon;
            const active = s.accountType === t.key;
            return (
              <button
                key={t.key}
                onClick={() => update("step1", { accountType: t.key })}
                className={`card-dark hover-accent text-left p-5 rounded-xl relative overflow-hidden h-full min-h-43 flex flex-col ${active ? "border-purple-500/50 dark:border-purple-500/60 bg-linear-to-br from-violet-100 via-fuchsia-50 to-purple-50 dark:from-[#22103f] dark:to-[#150a2a]" : ""}`}
              >
                {active && (
                  <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-linear-to-br from-[#a855f7] to-[#d946ef] flex items-center justify-center text-[10px] font-bold text-white">✓</span>
                )}
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${active ? "bg-linear-to-br from-[#a855f7] to-[#d946ef] text-white" : "bg-violet-500/10 dark:bg-purple-500/10 text-violet-700 dark:text-purple-300 border border-violet-300/45 dark:border-purple-500/25"}`}>
                  <Icon size={18} />
                </div>
                <div className="text-[15px] font-semibold text-slate-900 dark:text-white">{t.key}</div>
                <div className="text-[12.5px] text-slate-600 dark:text-purple-200/55 mt-1.5 leading-relaxed flex-1">{t.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="label-xs mb-3">Profile Photo<span className="text-pink-400 ml-0.5">*</span></div>
        <FileDrop
          label={"Drop a photo or click to upload"}
          hint={"JPG · PNG · MAX 2MB"}
          value={s.profilePhoto}
          onChange={(v) => update("step1", { profilePhoto: v })}
          icon={Camera}
        />
        <div className="text-[11.5px] text-slate-500 dark:text-purple-300/40 mt-2 mono tracking-wide">JPG or PNG · max 2MB · square crop recommended</div>
      </section>

      <section>
        <div className="label-xs mb-3">Government ID<span className="text-pink-400 ml-0.5">*</span></div>
        <div className="grid md:grid-cols-2 gap-3">
          <FileDrop
            label={"Upload front"}
            hint={"JPG · PNG · PDF"}
            value={s.idFront}
            onChange={(v) => update("step1", { idFront: v })}
            icon={Upload}
            compact
          />
          <FileDrop
            label={"Upload back"}
            hint={"JPG · PNG · PDF"}
            value={s.idBack}
            onChange={(v) => update("step1", { idBack: v })}
            icon={Upload}
            compact
          />
        </div>
        <div className="text-[11.5px] text-slate-500 dark:text-purple-300/40 mt-2 mono tracking-wide">Required for KYC verification · JPG, PNG, or PDF</div>
      </section>
    </div>
  );
};

export default Step1Account;
