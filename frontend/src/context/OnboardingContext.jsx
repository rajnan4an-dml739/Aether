import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";

const OnboardingContext = createContext(null);

const INITIAL = {
  currentStep: 1,
  completedSteps: [],
  submitted: null,
  submitUi: { loading: false, error: null },
  theme: "dark",
  step1: {
    accountType: "Business", 
    profilePhoto: null,
    idFront: null,
    idBack: null,
  },
  step2: {
    legalName: "",
    tradeName: "",
    registrationNumber: "",
    registrationDate: "",
    industry: "",
    employees: "11–50",
  },
  step3: {
    country: "United States",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    mailingSame: true,
    timezone: "America/New_York",
    days: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
    hours: {
      Mon: ["09:00", "17:00"],
      Tue: ["09:00", "17:00"],
      Wed: ["09:00", "17:00"],
      Thu: ["09:00", "17:00"],
      Fri: ["09:00", "17:00"],
      Sat: ["09:00", "17:00"],
      Sun: ["09:00", "17:00"],
    },
  },
  step4: {
    roles: ["Admin"],
    permissions: {
      Dashboard: "READ",
      Reports: "READ",
      Users: "NONE",
      Billing: "NONE",
      Settings: "NONE",
      API: "NONE",
    },
    twoFA: true,
    twoFAMethod: "Authenticator App",
  },
  step5: {
    answers: {
      regulated: null,
      minors: null,
      intlPayments: null,
      soc2: null,
      crypto: null,
      sanctioned: null,
      peps: null,
      crossBorder: null,
    },
    documents: {
      "Certificate of Incorporation": "PENDING",
      "Tax Registration": "PENDING",
      "Proof of Address": "PENDING",
      "Beneficial Owner Declaration": "PENDING",
    },
  },
  step6: {
    agreedTerms: false,
    signature: null,
  },
};

const STORAGE_KEY = "aether_onboarding_v1";

function resolveApiBase() {
  const raw = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/$/, "");
  if (!raw) return "";
  // Production build on a real host: ignore localhost API URLs (bad bake from dev .env).
  // Keep localhost when the page itself is served from localhost (e.g. vite preview → API on :5000).
  if (typeof window !== "undefined" && import.meta.env.PROD) {
    try {
      const u = new URL(raw);
      const pageIsLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      if (
        !pageIsLocal &&
        (u.hostname === "localhost" || u.hostname === "127.0.0.1")
      ) {
        return "";
      }
    } catch (_) {
      /* ignore */
    }
  }
  if (typeof window === "undefined") return raw;
  try {
    if (new URL(raw).origin === window.location.origin) return "";
  } catch (_) {
    return raw;
  }
  return raw;
}

export const OnboardingProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...INITIAL, ...JSON.parse(raw), submitUi: { loading: false, error: null } };
    } catch (_) { }
    return INITIAL;
  });
  const [draftSavedAt, setDraftSavedAt] = useState(Date.now());

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const toStore = { ...state };
        delete toStore.submitUi;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        setDraftSavedAt(Date.now());
      } catch (_) { }
    }, 400);
    return () => clearTimeout(t);
  }, [state]);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const update = (stepKey, patch) => {
    setState((s) => ({ ...s, [stepKey]: { ...s[stepKey], ...patch } }));
  };

  const hasText = (v) => typeof v === "string" && v.trim().length > 0;
  const isStepValid = (stepNumber, snapshot = state) => {
    switch (stepNumber) {
    case 1:
      return Boolean(
        hasText(snapshot.step1.accountType) &&
          snapshot.step1.profilePhoto &&
          snapshot.step1.idFront &&
          snapshot.step1.idBack
      );
    case 2:
      return Boolean(
        hasText(snapshot.step2.legalName) &&
          hasText(snapshot.step2.registrationNumber) &&
          hasText(snapshot.step2.registrationDate) &&
          hasText(snapshot.step2.industry)
      );
    case 3:
      return Boolean(
        hasText(snapshot.step3.country) &&
          hasText(snapshot.step3.line1) &&
          hasText(snapshot.step3.city) &&
          hasText(snapshot.step3.zip)
      );
    case 4:
      return Boolean(snapshot.step4.roles.length > 0 && (!snapshot.step4.twoFA || hasText(snapshot.step4.twoFAMethod)));
    case 5:
      return true;
    case 6:
      return Boolean(snapshot.step6.agreedTerms && snapshot.step6.signature);
    default:
      return false;
    }
  };

  const canAccessStep = (n, snapshot = state) => {
    if (n <= 1) return true;
    for (let step = 1; step < n; step += 1) {
      if (!isStepValid(step, snapshot)) return false;
    }
    return true;
  };

  const setStep = (n) =>
    setState((s) => {
      const target = Math.max(1, Math.min(6, n));
      if (!canAccessStep(target, s)) return s;
      return { ...s, currentStep: target };
    });
  const next = () =>
    setState((s) => {
      if (!isStepValid(s.currentStep, s)) return s;
      const completed = s.completedSteps.includes(s.currentStep) ? s.completedSteps : [...s.completedSteps, s.currentStep];
      return { ...s, completedSteps: completed, currentStep: Math.min(6, s.currentStep + 1) };
    });
  const back = () => setStep(state.currentStep - 1);

  const riskScore = useMemo(() => {
    const a = state.step5.answers;
    const weights = {
      regulated: 8,
      minors: 14,
      intlPayments: 10,
      soc2: -6,
      crypto: 18,
      sanctioned: 30,
      peps: 16,
      crossBorder: 10,
    };
    let score = 0;
    Object.entries(a).forEach(([k, v]) => {
      if (v === true) score += weights[k] || 0;
    });
    return Math.max(0, Math.min(100, score));
  }, [state.step5.answers]);

  const submit = async () => {
    const ref = `AETH-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      reference: ref,
      submittedAt: new Date().toISOString(),
      data: {
        accountAndIdentity: {
          accountType: state.step1.accountType,
          profilePhoto: state.step1.profilePhoto ? { name: state.step1.profilePhoto.name } : null,
          idFront: state.step1.idFront ? { name: state.step1.idFront.name } : null,
          idBack: state.step1.idBack ? { name: state.step1.idBack.name } : null,
        },
        organization: state.step2,
        address: state.step3,
        roles: state.step4,
        compliance: { ...state.step5, riskScore },
        review: { agreedTerms: state.step6.agreedTerms, signed: !!state.step6.signature },
      },
    };

    setState((s) => ({ ...s, submitUi: { loading: true, error: null } }));

    const form = new FormData();
    form.append("payload", JSON.stringify(payload));

    const appendFromObjectUrl = async (fieldName, fileLike) => {
      if (!fileLike?.url) return;
      try {
        const res = await fetch(fileLike.url);
        if (!res.ok) throw new Error(`read ${fieldName}`);
        const blob = await res.blob();
        form.append(fieldName, blob, fileLike.name || `${fieldName}.bin`);
      } catch (_) {
        throw new Error(
          "UPLOAD_EXPIRED: After a page refresh, file previews no longer work. Go back to step 1 and re-select profile photo / ID images, then submit again."
        );
      }
    };

    try {
      await appendFromObjectUrl("profilePhoto", state.step1.profilePhoto);
      await appendFromObjectUrl("idFront", state.step1.idFront);
      await appendFromObjectUrl("idBack", state.step1.idBack);
      if (state.step6.signature) {
        try {
          const sigRes = await fetch(state.step6.signature);
          if (!sigRes.ok) throw new Error("signature");
          const sigBlob = await sigRes.blob();
          form.append("signature", sigBlob, "signature.png");
        } catch (_) {
          throw new Error("Could not read your signature. Clear it and sign again, then submit.");
        }
      }

      const base = resolveApiBase();
      const url = `${base}/api/onboarding`;
      let res;
      try {
        res = await fetch(url, { method: "POST", body: form });
      } catch (netErr) {
        const isProd = import.meta.env.PROD;
        const hint =
          base === "" && !isProd
            ? " For local dev: run the API (npm run dev in /backend), fix MONGODB_URI if it exits on startup, and set VITE_API_URL=http://localhost:5000 in frontend/.env."
            : isProd
              ? " On Netlify: redeploy after setting site env vars (MONGODB_URI, CLOUDINARY_*). The app calls /api/onboarding on the same domain."
              : "";
        throw new Error(
          `API_UNREACHABLE: Cannot reach ${url || "/api/onboarding"}.${hint}`
        );
      }
      if (!res.ok) {
        let msg = "Submission failed";
        try {
          const j = await res.json();
          if (j.message) msg = j.message;
        } catch (_) {
          const t = await res.text();
          if (t) msg = t.slice(0, 200);
        }
        if (res.status === 502 || res.status === 504) {
          msg =
            "Dev server could not reach the backend (502). Start the API on port 5000 or set VITE_API_URL to the correct host.";
        }
        throw new Error(msg);
      }
      const server = await res.json();
      setState((s) => ({
        ...s,
        submitted: { ...payload, serverId: server._id, imageUrls: server.imageUrls },
        completedSteps: [1, 2, 3, 4, 5, 6],
        submitUi: { loading: false, error: null },
      }));
      return { ...payload, serverId: server._id, imageUrls: server.imageUrls };
    } catch (e) {
      let message = e?.message || "Something went wrong.";
      if (message.startsWith("UPLOAD_EXPIRED:")) {
        message = message.replace(/^UPLOAD_EXPIRED:\s*/, "");
      } else if (message.startsWith("API_UNREACHABLE:")) {
        message = message.replace(/^API_UNREACHABLE:\s*/, "");
      } else if (e?.name === "TypeError" || /failed to fetch/i.test(String(message))) {
        message = import.meta.env.PROD
          ? "Could not reach the API. Ensure this site is redeployed with Netlify env vars set (MONGODB_URI and Cloudinary). Submissions use POST /api/onboarding on this host."
          : "Could not reach the API. Start the backend until you see \"API listening on http://localhost:5000\", fix MONGODB_URI if it crashes on startup, and set VITE_API_URL=http://localhost:5000 in frontend/.env.";
      }
      setState((s) => ({ ...s, submitUi: { loading: false, error: message } }));
      return null;
    }
  };

  const reset = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { }
    setState({ ...INITIAL });
  };

  const setTheme = (t) => setState((s) => ({ ...s, theme: t }));

  const progress = useMemo(() => {
    return Math.round((state.completedSteps.length / 6) * 100);
  }, [state.completedSteps]);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setState,
        update,
        setStep,
        next,
        back,
        setTheme,
        riskScore,
        progress,
        draftSavedAt,
        canAccessStep,
        isStepValid,
        submit,
        reset,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
};
