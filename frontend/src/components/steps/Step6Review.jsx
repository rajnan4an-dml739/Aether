import React, { useEffect, useRef, useState } from "react";
import { Edit3, ChevronDown, User, MapPin, CheckCircle2, Download, RotateCcw } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

const TERMS = [
  {
    t: "1 · Application of Terms",
    b: "By submitting this application, you (\"the Applicant\") agree to be bound by Aether Capital's Master Services Agreement, Privacy Notice, and any product-specific terms referenced therein. These documents together constitute the complete agreement between you and Aether Capital and supersede any prior negotiations or representations.",
  },
  {
    t: "2 · Information Accuracy",
    b: "You warrant that all information provided in this application — including identity documents, financial disclosures, and beneficial ownership data — is true, complete, and current. You agree to notify Aether Capital in writing within 30 days of any material change.",
  },
  {
    t: "3 · KYC and AML Compliance",
    b: "You authorize Aether Capital to verify your identity through public and proprietary databases, perform sanctions and PEP screening, and monitor account activity in compliance with applicable AML, BSA, and FATF regulations. Onboarding may be paused or rejected based on risk findings.",
  },
  {
    t: "4 · Data Processing",
    b: "Personal data is processed pursuant to our Privacy Notice. You consent to cross-border transfers necessary for service provision and regulatory reporting. You retain rights of access, correction, and erasure as provided under applicable law.",
  },
  {
    t: "5 · Termination",
    b: "Either party may terminate the relationship with 30 days' written notice. Aether Capital may terminate immediately upon material breach, regulatory directive, or fraud determination. Termination does not relieve obligations accrued prior to the effective date.",
  },
];

const Row = ({ label, value }) => (
  <div className="min-w-0">
    <div className="mono text-[10px] tracking-[0.2em] text-slate-500 dark:text-purple-300/55">{label}</div>
    <div className="text-[14px] text-(--text) mt-1 truncate">{value || <span className="text-slate-400 dark:text-purple-400/40">—</span>}</div>
  </div>
);

const Section = ({ num, title, onEdit, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="card-dark rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="mono text-[11px] text-slate-500 dark:text-purple-300/60 tracking-[0.18em]">{num}</span>
          <span className="mono text-[11.5px] tracking-[0.2em] text-slate-800 dark:text-purple-50 font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] mono tracking-[0.2em] rounded-full border border-violet-300/55 dark:border-purple-500/40 text-violet-800 dark:text-purple-200 hover:bg-violet-500/10 dark:hover:bg-purple-500/10 hover:border-violet-400 dark:hover:border-purple-400 transition-colors">
            <Edit3 size={11} /> EDIT
          </button>
          <button onClick={() => setOpen(!open)} className="h-7 w-7 rounded-full border border-violet-300/55 dark:border-purple-800/50 flex items-center justify-center text-violet-700 dark:text-purple-300 hover:border-violet-400 dark:hover:border-purple-500/50">
            <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {open && <div className="border-t border-violet-200 dark:border-purple-900/30 px-5 py-5 grid grid-cols-2 gap-5">{children}</div>}
    </div>
  );
};

const SignaturePad = ({ value, onChange }) => {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }
  }, [value]);

  const start = (e) => {
    drawingRef.current = true;
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    ctx.beginPath();
    const p = getPoint(e, r);
    ctx.moveTo(p.x, p.y);
    ctx.strokeStyle =
      typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark"
        ? "#e9d5ff"
        : "#5b21b6";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
  };
  const getPoint = (e, r) => {
    const t = e.touches?.[0];
    return { x: (t ? t.clientX : e.clientX) - r.left, y: (t ? t.clientY : e.clientY) - r.top };
  };
  const move = (e) => {
    if (!drawingRef.current) return;
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    const p = getPoint(e, r);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    onChange(canvasRef.current.toDataURL("image/png"));
  };
  const clear = () => {
    const c = canvasRef.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
    onChange(null);
  };

  return (
    <div className="card-dark rounded-xl p-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={140}
        className="w-full rounded-lg bg-violet-100/80 dark:bg-purple-950/30 border border-violet-300/60 dark:border-purple-900/40 cursor-crosshair"
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      />
      <div className="flex items-center justify-between mt-2">
        <span className="mono text-[10px] tracking-[0.18em] text-slate-500 dark:text-purple-300/50">Sign with your mouse or touch</span>
        <button onClick={clear} className="text-[11px] text-violet-700 dark:text-purple-300/70 hover:text-(--text) dark:hover:text-white">Clear</button>
      </div>
    </div>
  );
};

const Step6Review = () => {
  const { state, update, setStep, riskScore, reset } = useOnboarding();
  const s1 = state.step1, s2 = state.step2, s3 = state.step3, s4 = state.step4;
  const submitted = state.submitted;
  const riskTier = riskScore < 30 ? "LOW" : riskScore < 60 ? "MODERATE" : riskScore < 85 ? "ELEVATED" : "CRITICAL";

  const onDownloadReceipt = () => {
    if (!submitted) return;
    const data = JSON.stringify(submitted, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${submitted.reference || "application-receipt"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onStartOver = () => {
    reset();
    setStep(1);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-155 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-linear-to-br from-[#8b5cf6] to-[#d946ef] flex items-center justify-center shadow-[0_0_42px_rgba(139,92,246,0.45)]">
            <CheckCircle2 className="text-white" size={34} />
          </div>
          <h2 className="mt-6 text-[42px] leading-tight font-semibold tracking-tight text-(--text)">
            Application submitted.
          </h2>
          <p className="mt-3 text-[14px] text-(--muted)">
            We received your information. Our team will reach out within 2 business days.
          </p>

          <div className="mt-8 card-dark rounded-2xl p-5 text-left">
            <div className="grid grid-cols-2 gap-y-3 text-[12.5px]">
              <span className="mono tracking-[0.14em] text-(--muted)">REFERENCE</span>
              <span className="mono justify-self-end text-(--text)">{submitted.reference}</span>
              <span className="mono tracking-[0.14em] text-(--muted)">APP START</span>
              <span className="mono justify-self-end text-(--text)">01</span>
              <span className="mono tracking-[0.14em] text-(--muted)">TYPE</span>
              <span className="justify-self-end text-(--text)">{s1.accountType}</span>
              <span className="mono tracking-[0.14em] text-(--muted)">SUBMITTED</span>
              <span className="justify-self-end text-(--text)">
                {new Date(submitted.submittedAt).toLocaleString()}
              </span>
              {submitted.serverId ? (
                <>
                  <span className="mono tracking-[0.14em] text-(--muted)">RECORD</span>
                  <span className="mono justify-self-end text-(--text) text-[11px] truncate max-w-50">{String(submitted.serverId)}</span>
                </>
              ) : null}
              <span className="mono tracking-[0.14em] text-(--muted)">RISK TIER</span>
              <span className="mono justify-self-end text-(--text)">{riskTier}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onDownloadReceipt}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-(--border) text-[13px] text-(--text) hover:bg-(--panel-2) transition-colors"
            >
              <Download size={14} /> Download receipt
            </button>
            <button
              onClick={onStartOver}
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium"
            >
              <RotateCcw size={14} /> Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
  
      <div className="card-dark rounded-xl p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-violet-500/15 dark:bg-purple-500/15 border border-violet-400/35 dark:border-purple-500/40 flex items-center justify-center overflow-hidden">
          {s1.profilePhoto?.url ? (
            <img src={s1.profilePhoto.url} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <User className="text-violet-600 dark:text-purple-300" size={22} />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-[20px] font-semibold text-(--text) truncate">{s2.legalName || "Your Company"}</div>
          <div className="mono text-[10.5px] tracking-[0.24em] text-slate-500 dark:text-purple-300/60 mt-1">
            {s1.accountType.toUpperCase()} · APP-PENDING
          </div>
        </div>
      </div>

      <Section num="01" title="ACCOUNT & IDENTITY" onEdit={() => setStep(1)}>
        <Row label="Account Type" value={s1.accountType} />
        <Row label="Profile Photo" value={s1.profilePhoto ? s1.profilePhoto.name : "Not uploaded"} />
        <Row label="ID Front" value={s1.idFront ? s1.idFront.name : "Not uploaded"} />
        <Row label="ID Back" value={s1.idBack ? s1.idBack.name : "Not uploaded"} />
      </Section>

      <Section num="02" title="ORGANIZATION INFO" onEdit={() => setStep(2)}>
        <Row label="Legal Name" value={s2.legalName} />
        <Row label="Trade Name" value={s2.tradeName} />
        <Row label="Registration #" value={s2.registrationNumber} />
        <Row label="Industry" value={s2.industry} />
      </Section>

      <Section num="03" title="ADDRESS & LOCATION" onEdit={() => setStep(3)}>
        <Row label="Country" value={s3.country} />
        <Row label="Time Zone" value={s3.timezone} />
        <div className="col-span-2 rounded-lg border border-violet-300/60 dark:border-purple-900/40 bg-violet-100/50 dark:bg-purple-950/30 p-4 flex items-start gap-3">
          <MapPin size={16} className="text-pink-400 mt-0.5" />
          <div className="text-[13px] leading-relaxed">
            <div>{s3.line1 || "—"}</div>
            <div>{[s3.city, s3.state].filter(Boolean).join(", ")} {s3.zip}</div>
            <div className="text-slate-600 dark:text-purple-300/60">{s3.country}</div>
          </div>
        </div>
      </Section>

      <Section num="04" title="ROLES & PERMISSIONS" onEdit={() => setStep(4)}>
        <Row label="Roles" value={s4.roles.join(", ")} />
        <Row label="Departments" value={null} />
        <Row label="2FA" value={`${s4.twoFA ? "Enabled" : "Disabled"} · ${s4.twoFAMethod}`} />
        <Row label="Permissions" value={Object.entries(s4.permissions).filter(([_, v]) => v !== "NONE").map(([k, v]) => `${k}:${v.charAt(0) + v.slice(1).toLowerCase()}`).join(" · ") || "—"} />
      </Section>

      <Section num="05" title="COMPLIANCE & RISK" onEdit={() => setStep(5)}>
        <Row label="Risk Tier" value={riskScore < 30 ? `LOW \u00a0 ${riskScore}/100` : riskScore < 60 ? `MODERATE \u00a0 ${riskScore}/100` : riskScore < 85 ? `ELEVATED \u00a0 ${riskScore}/100` : `CRITICAL \u00a0 ${riskScore}/100`} />
        <Row label="Compliance Officer" value={null} />
      </Section>

      
      <div className="card-dark rounded-xl p-6">
        <div className="label-xs mb-4">Terms & Conditions</div>
        <div className="space-y-5 max-h-65 overflow-y-auto pr-2">
          {TERMS.map((t) => (
            <div key={t.t}>
              <div className="mono text-[11px] tracking-[0.2em] text-violet-800 dark:text-purple-300/70 mb-1.5">{t.t.toUpperCase()}</div>
              <p className="text-[13px] text-slate-600 dark:text-purple-100/70 leading-relaxed">{t.b}</p>
            </div>
          ))}
        </div>
        <label className="flex items-center gap-3 mt-5 cursor-pointer">
          <input type="checkbox" checked={state.step6.agreedTerms} onChange={(e) => update("step6", { agreedTerms: e.target.checked })} />
          <span className="text-[13.5px] text-slate-800 dark:text-purple-100/85">I have read and agree to the Terms of Service and Privacy Policy.</span>
        </label>
      </div>

      <div>
        <div className="label-xs mb-3">E-Signature<span className="text-pink-400 ml-0.5">*</span></div>
        <SignaturePad value={state.step6.signature} onChange={(v) => update("step6", { signature: v })} />
      </div>
    </div>
  );
};

export default Step6Review;
