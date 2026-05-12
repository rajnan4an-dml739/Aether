import React from "react";
import Sidebar from "./Sidebar";
import Step1Account from "./steps/Step1Account";
import Step2Personal from "./steps/Step2Personal";
import Step3Address from "./steps/Step3Address";
import Step4Roles from "./steps/Step4Roles"; 
import Step5Compliance from "./steps/Step5Compliance";
import Step6Review from "./steps/Step6Review";
import WizardFooter from "./Footer";
import { useOnboarding } from "../context/OnboardingContext";

const stepMeta = [
  { n: 1, kicker: "STEP 01 / 06", title: "Set up your", accent: "account.", desc: "Tell us who you are. We'll tailor the rest of the application to fit." },
  { n: 2, kicker: "STEP 02 / 06", title: "A bit about", accent: "you.", desc: "Personal details we'll use for KYC verification and compliance." },
  { n: 3, kicker: "STEP 03 / 06", title: "Address &", accent: "location.", desc: "Where you operate, where to mail you, and the hours we can reach you." },
  { n: 4, kicker: "STEP 04 / 06", title: "Roles &", accent: "permissions.", desc: "Define team access, permissions, and authentication preferences." },
  { n: 5, kicker: "STEP 05 / 06", title: "Compliance &", accent: "risk.", desc: "Help us assess your regulatory exposure with a few yes/no questions." },
  { n: 6, kicker: "STEP 06 / 06", title: "Review &", accent: "submit.", desc: "Final review. Confirm details, sign, and submit your application." },
];

const OnboardingWizard = () => {
  const { state } = useOnboarding();
  const meta = stepMeta[state.currentStep - 1];
  const isSubmittedView = state.currentStep === 6 && Boolean(state.submitted);

  const renderStep = () => {
    switch (state.currentStep) {
    case 1: return <Step1Account />;
    case 2: return <Step2Personal />;
    case 3: return <Step3Address />;
    case 4: return <Step4Roles />;
    case 5: return <Step5Compliance />;
    case 6: return <Step6Review />;
    default: return <Step1Account />;
    }
  };

  return (
    <div className="relative z-10 h-screen overflow-hidden flex">
      {!isSubmittedView && <Sidebar />}
      <main className={`flex-1 min-w-0 min-h-0 flex flex-col ${isSubmittedView ? "" : "ml-80"}`}>
        <div className={`flex-1 min-h-0 overflow-y-auto px-8 lg:px-14 ${isSubmittedView ? "pt-6 pb-10" : "pt-12 pb-10"}`}>
          <div className={`${isSubmittedView ? "max-w-4xl" : "max-w-3xl"} mx-auto`} key={state.currentStep}>
            {!isSubmittedView && (
              <div className="anim-fade-up">
                <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] text-[#8b5cf6] mono mb-4">
                  <span className="inline-block h-px w-8 bg-[#8b5cf6]/40" />
                  <span>{meta.kicker}</span>
                </div>
                <h1 className="text-[44px] leading-[1.05] font-medium tracking-tight">
                  {meta.title} <span className="gradient-text non-iitalic">{meta.accent}</span>
                </h1>
                <p className="text-[15px] text-(--muted) mt-4 max-w-xl">{meta.desc}</p>
              </div>
            )}

            <div className={`${isSubmittedView ? "" : "mt-10"} anim-fade-up`}>{renderStep()}</div>
          </div>
        </div>
        <WizardFooter />
      </main>
    </div>
  );
};

export default OnboardingWizard;
