import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex w-full flex-col gap-3" aria-label="Enquiry progress">
      <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-[#c4883a] text-white'
                    : isActive
                    ? 'bg-[#c4883a] text-white'
                    : 'bg-[#e5e0d8] text-[#9a9490]'
                }`}
              >
                {isCompleted ? <Check size={14} /> : step.number}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap hidden sm:block ${
                  isActive ? 'text-[#1a1a1a] font-semibold' : 'text-[#9a9490]'
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all duration-200 ${
                  isCompleted ? 'bg-[#c4883a]' : 'bg-[#e5e0d8]'
                }`}
              />
            )}
          </div>
        );
      })}
      </div>
      <p className="text-center text-xs font-bold text-[#84571e] sm:hidden" aria-live="polite">
        Step {currentStep} of {steps.length}: {steps.find((step) => step.number === currentStep)?.label}
      </p>
    </div>
  );
}
