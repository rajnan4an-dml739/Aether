import React, { useState } from "react";
import { Plus, X, Shield, Smartphone, Key } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

const SUGGESTED = ["Viewer", "Editor", "Billing", "Support", "Developer", "Compliance"];
const MODULES = ["Dashboard", "Reports", "Users", "Billing", "Settings", "API"];
const LEVELS = ["NONE", "READ", "WRITE", "ADMIN"];
const METHODS = [
  { k: "SMS", icon: Smartphone },
  { k: "Authenticator App", icon: Shield },
  { k: "Hardware Key", icon: Key },
];

const Step4Roles = () => {
  const { state, update } = useOnboarding();
  const s = state.step4;
  const [input, setInput] = useState("");

  const addRole = (r) => {
    if (!r || s.roles.includes(r)) return;
    update("step4", { roles: [...s.roles, r] });
  };
  const removeRole = (r) => update("step4", { roles: s.roles.filter((x) => x !== r) });
  const cyclePerm = (m) => {
    const cur = s.permissions[m];
    const idx = LEVELS.indexOf(cur);
    const next = LEVELS[(idx + 1) % LEVELS.length];
    update("step4", { permissions: { ...s.permissions, [m]: next } });
  };
  const setPerm = (m, level) => update("step4", { permissions: { ...s.permissions, [m]: level } });

  return (
    <div className="space-y-9">
  
      <section>
        <div className="label-xs mb-3">Role Assignment<span className="text-pink-400 ml-0.5">*</span></div>
        <div className="card-dark p-4 rounded-xl">
          <div className="flex flex-wrap gap-2 items-center">
            {s.roles.map((r) => (
              <span key={r} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-br from-[#a855f7]/25 to-[#d946ef]/20 border border-purple-700/35 dark:border-purple-500/40 text-[13px] text-violet-950 dark:text-purple-50">
                {r}
                <button onClick={() => removeRole(r)} className="text-violet-700 dark:text-purple-300/70 hover:text-violet-950 dark:hover:text-white"><X size={12} /></button>
              </span>
            ))}
            <input
              className="bg-transparent outline-none flex-1 min-w-30 text-[13px] text-slate-800 dark:text-purple-50 placeholder:text-slate-400 dark:placeholder:text-purple-400/40 px-2"
              placeholder={s.roles.length ? "" : "Type a role and hit enter"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  addRole(input.trim());
                  setInput("");
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTED.filter((r) => !s.roles.includes(r)).map((r) => (
              <button key={r} onClick={() => addRole(r)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] bg-violet-500/10 dark:bg-purple-900/25 border border-violet-300/55 dark:border-purple-800/40 text-violet-800 dark:text-purple-200/70 hover:border-violet-400/60 dark:hover:border-purple-500/40 hover:text-violet-950 dark:hover:text-white transition-colors">
                <Plus size={11} /> {r}
              </button>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-purple-300/45 mt-2 mono">Type to add a custom role or pick from suggestions below</div>
      </section>

      <section>
        <div className="label-xs mb-3">Access Level Matrix</div>
        <div className="card-dark rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1.2fr_repeat(4,1fr)] text-[10px] mono tracking-[0.2em] text-slate-500 dark:text-purple-300/60 border-b border-violet-200 dark:border-purple-900/30">
            <div className="px-5 py-3">MODULE</div>
            {LEVELS.map((l) => <div key={l} className="px-2 py-3 text-center">{l}</div>)}
          </div>
          {MODULES.map((m, idx) => (
            <div key={m} className={`grid grid-cols-[1.2fr_repeat(4,1fr)] items-center ${idx !== MODULES.length - 1 ? "border-b border-violet-200/70 dark:border-purple-900/20" : ""}`}>
              <div className="px-5 py-3.5 text-[13.5px] text-slate-800 dark:text-purple-50">{m}</div>
              {LEVELS.map((l) => {
                const active = s.permissions[m] === l;
                return (
                  <button
                    key={l}
                    onClick={() => setPerm(m, l)}
                    className={`mx-1.5 my-2 py-2 text-[10.5px] mono tracking-wider rounded-md transition-all border ${
                      active
                        ? "bg-linear-to-br from-[#a855f7] to-[#d946ef] text-white border-transparent shadow-[0_4px_14px_-4px_rgba(168,85,247,0.7)]"
                        : "bg-violet-500/10 dark:bg-purple-900/15 border-violet-300/45 dark:border-purple-800/30 text-violet-800/85 dark:text-purple-300/50 hover:border-violet-400/55 dark:hover:border-purple-500/40 hover:text-violet-950 dark:hover:text-white"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-purple-300/45 mt-2 mono">Click each cell to cycle through permission levels</div>
      </section>

      <section className="card-dark p-5 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] font-medium text-slate-900 dark:text-white">Two-factor authentication</div>
            <div className="text-[12.5px] text-slate-600 dark:text-purple-200/55 mt-0.5">Strongly recommended for all accounts</div>
          </div>
          <button
            onClick={() => update("step4", { twoFA: !s.twoFA })}
            className={`relative h-7 w-12 rounded-full transition-colors border ${s.twoFA ? "bg-linear-to-br from-[#a855f7] to-[#d946ef] border-transparent" : "bg-violet-200/70 dark:bg-purple-900/30 border-violet-300/60 dark:border-purple-800/50"}`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${s.twoFA ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
        {s.twoFA && (
          <div className="mt-5">
            <div className="label-xs mb-3">2FA Method<span className="text-pink-400 ml-0.5">*</span></div>
            <div className="grid grid-cols-3 gap-3">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = s.twoFAMethod === m.k;
                return (
                  <button
                    key={m.k}
                    onClick={() => update("step4", { twoFAMethod: m.k })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      active
                        ? "bg-linear-to-br from-violet-100 via-fuchsia-50 to-purple-50 dark:from-[#22103f] dark:to-[#150a2a] border-purple-600/35 dark:border-purple-500/50"
                        : "bg-violet-500/10 dark:bg-purple-900/15 border-violet-300/50 dark:border-purple-800/35 hover:border-violet-400/60 dark:hover:border-purple-500/40"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-pink-600 dark:text-pink-300" : "text-violet-600 dark:text-purple-300/70"} />
                    <div className="text-[13.5px] text-slate-900 dark:text-white mt-3 font-medium">{m.k}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Step4Roles;
