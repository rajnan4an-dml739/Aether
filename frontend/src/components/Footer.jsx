import React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useOnboarding } from "../context/OnboardingContext";

const WizardFooter = () => {
  const { state, back, next, submit, isStepValid } = useOnboarding();
  const isLast = state.currentStep === 6;
  const isFirst = state.currentStep === 1;
  const isSubmitted = Boolean(state.submitted);
  const isCurrentStepValid = isStepValid(state.currentStep);

  const onSubmit = async () => {
    if (!state.step6.agreedTerms || !state.step6.signature) {
      return;
    }
    await submit();
  };

  if (isLast && isSubmitted) return null;

  return (
    <div className="wizard-footer sticky bottom-0 left-0 right-0">
      <div className="max-w-3xl mx-auto px-8 lg:px-14 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] text-emerald-400/90">
          <Check size={14} strokeWidth={2.5} />
          <span className="mono tracking-wide">Draft saved</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={isFirst}
            onClick={back}
            className="h-11 min-w-32 inline-flex items-center justify-center gap-1.5 px-5 rounded-full text-[14px] border border-(--line-strong) bg-(--surface-elevated) text-(--muted) hover:text-(--text) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {isLast ? (
            <div className="flex flex-col items-end gap-2">
              {state.submitUi?.error ? (
                <p className="text-[12px] text-red-400 max-w-xs text-right">{state.submitUi.error}</p>
              ) : null}
              <button
                type="button"
                disabled={state.submitUi?.loading}
                onClick={onSubmit}
                className="btn-primary h-11 min-w-44 inline-flex items-center justify-center gap-2 px-6 rounded-full text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.submitUi?.loading ? "Submitting…" : "Submit application"} <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={next}
                disabled={!isCurrentStepValid}
                className="btn-primary h-11 min-w-44 inline-flex items-center justify-center gap-2 px-6 rounded-full text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardFooter;
