import React from "react";
import { MapPin, Clock, Plus } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

const TIMEZONES = [
  "America/New_York", "America/Toronto", "Europe/London", "Europe/Berlin",
  "Europe/Paris", "Asia/Tokyo", "Asia/Singapore", "Asia/Dubai",
  "Australia/Sydney", "Asia/Kolkata", "UTC", "America/Los_Angeles", "America/Chicago",
];
const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Germany", "France",
  "Japan", "Singapore", "UAE", "Australia", "India",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Select = ({ value, onChange, options }) => (
  <div className="relative">
    <select className="ae-input appearance-none pr-10" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-violet-600 dark:text-purple-400" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

const Step3Address = () => {
  const { state, update } = useOnboarding();
  const s = state.step3;

  const toggleDay = (d) => update("step3", { days: { ...s.days, [d]: !s.days[d] } });
  const setHours = (d, i, v) => {
    const next = [...s.hours[d]];
    next[i] = v;
    update("step3", { hours: { ...s.hours, [d]: next } });
  };

  const hasAddr = s.line1 || s.city || s.zip;

  return (
    <div className="space-y-9">
      <section>
        <div className="label-xs mb-3">Primary Address</div>
        <div className="space-y-4">
          <div>
            <div className="label-xs mb-2">Country<span className="text-pink-400 ml-0.5">*</span></div>
            <Select value={s.country} onChange={(v) => update("step3", { country: v })} options={COUNTRIES} />
          </div>
          <div>
            <div className="label-xs mb-2">Address Line 1<span className="text-pink-400 ml-0.5">*</span></div>
            <input className="ae-input" placeholder="Street number and street name" value={s.line1} onChange={(e) => update("step3", { line1: e.target.value })} />
          </div>
          <div>
            <div className="label-xs mb-2">Address Line 2</div>
            <input className="ae-input" placeholder="Apt 4B" value={s.line2} onChange={(e) => update("step3", { line2: e.target.value })} />
            <div className="text-[11px] text-slate-500 dark:text-purple-300/45 mt-1.5 mono">Apartment, suite, floor — optional</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="label-xs mb-2">City<span className="text-pink-400 ml-0.5">*</span></div>
              <input className="ae-input" value={s.city} onChange={(e) => update("step3", { city: e.target.value })} />
            </div>
            <div>
              <div className="label-xs mb-2">State</div>
              <input className="ae-input" value={s.state} onChange={(e) => update("step3", { state: e.target.value })} />
            </div>
            <div>
              <div className="label-xs mb-2">Zip<span className="text-pink-400 ml-0.5">*</span></div>
              <input className="ae-input" placeholder="10001" value={s.zip} onChange={(e) => update("step3", { zip: e.target.value })} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="card-dark p-0 grid md:grid-cols-2 overflow-hidden">
          <div className="relative h-45 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.25),transparent_60%)] border-r border-violet-200 dark:border-purple-900/30 flex items-center justify-center">
            <div className="absolute inset-0 opacity-60 dark:opacity-100" style={{ backgroundImage: "linear-gradient(rgba(168,85,247,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#ec4899] to-[#a855f7] flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.6)] pulse-glow">
                <MapPin size={16} className="text-white" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 h-2 w-2 rounded-full bg-purple-400/60 blur-[2px]" />
            </div>
          </div>
          <div className="p-6">
            <div className="label-xs mb-3 text-violet-800 dark:text-purple-300">Address Verification</div>
            {hasAddr ? (
              <div className="space-y-1 text-[14px]">
                {s.line1 && <div>{s.line1}</div>}
                {(s.city || s.state || s.zip) && <div>{[s.city, s.state].filter(Boolean).join(", ")} {s.zip}</div>}
                {s.country && <div className="text-slate-600 dark:text-purple-200/60">{s.country}</div>}
                <div className="text-[11px] text-emerald-400/80 mono pt-2">We'll verify this address</div>
              </div>
            ) : (
              <div className="text-[13.5px] text-slate-500 dark:text-purple-300/60">Enter an address to preview the location.</div>
            )}
          </div>
        </div>

        <label className="flex items-center gap-3 mt-4 cursor-pointer">
          <input type="checkbox" checked={s.mailingSame} onChange={(e) => update("step3", { mailingSame: e.target.checked })} />
          <span className="text-[14px] text-slate-800 dark:text-purple-100/80">Mailing address is the same as primary</span>
        </label>
      </section>

      <section>
        <div className="label-xs mb-2">Time Zone</div>
        <Select value={s.timezone} onChange={(v) => update("step3", { timezone: v })} options={["Select…", ...TIMEZONES]} />
        <div className="text-[11px] text-slate-500 dark:text-purple-300/45 mt-1.5 mono">Auto-detected from country — editable</div>
      </section>

      <section>
        <div className="label-xs mb-3">Operating Hours</div>
        <div className="flex flex-wrap gap-2 mb-5">
          {DAYS.map((d) => {
            const active = s.days[d];
            return (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={`px-5 py-2 rounded-md text-[11px] tracking-[0.18em] font-semibold mono transition-all border ${active
                    ? "bg-linear-to-br from-[#a855f7] to-[#d946ef] text-white border-transparent shadow-[0_4px_14px_-4px_rgba(168,85,247,0.7)]"
                    : "bg-violet-500/10 dark:bg-purple-900/15 border-violet-300/55 dark:border-purple-800/40 text-slate-700 dark:text-purple-200/55 hover:border-violet-400/60 dark:hover:border-purple-500/40"
                  }`}
              >
                {d.toUpperCase()}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {DAYS.filter((d) => s.days[d]).map((d) => (
            <div key={d} className="flex items-center gap-3">
              <div className="w-10 text-[13px] text-slate-600 dark:text-purple-200/60">{d}</div>
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <input type="time" value={s.hours[d][0]} onChange={(e) => setHours(d, 0, e.target.value)} className="ae-input mono pr-9" />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500/70 dark:text-purple-400/60" size={14} />
                </div>
                <div className="relative flex-1">
                  <input type="time" value={s.hours[d][1]} onChange={(e) => setHours(d, 1, e.target.value)} className="ae-input mono pr-9" />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500/70 dark:text-purple-400/60" size={14} />
                </div>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-violet-300/50 dark:border-purple-800/40 text-violet-700 dark:text-purple-300/70 hover:bg-violet-500/10 dark:hover:bg-purple-900/25 hover:text-(--text) dark:hover:text-white transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-purple-300/45 mt-3 mono">Toggle days of operation, then set hours per day</div>
      </section>
    </div>
  );
};

export default Step3Address;
