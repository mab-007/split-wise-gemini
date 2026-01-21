
import React, { useState } from 'react';
import { Chrome, Mail, Users, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "SplitSmart AI",
      desc: "The sophisticated way to split expenses with friends using AI.",
      icon: <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mb-8"><CheckCircle2 size={48} strokeWidth={2.5} /></div>
    },
    {
      title: "Sign in with Google",
      desc: "Connect your account to start managing your debts securely.",
      icon: <div className="w-24 h-24 bg-white border border-slate-100 rounded-[32px] flex items-center justify-center shadow-xl mb-8"><Chrome size={48} className="text-slate-900" /></div>
    },
    {
      title: "Sync Connections",
      desc: "Grant access to your contacts and Gmail to automatically find bills and friends.",
      icon: (
        <div className="flex gap-4 mb-8">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[24px] flex items-center justify-center shadow-sm"><Users size={32} /></div>
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[24px] flex items-center justify-center shadow-sm"><Mail size={32} /></div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white p-8 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {steps[step-1].icon}
        <h1 className="text-[34px] font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          {steps[step-1].title}
        </h1>
        <p className="text-[17px] text-slate-400 font-medium leading-relaxed max-w-[280px]">
          {steps[step-1].desc}
        </p>
      </div>

      <div className="space-y-4 pb-8">
        {step === 2 ? (
          <button 
            onClick={handleNext}
            className="w-full bg-slate-900 text-white h-[60px] rounded-[22px] font-bold text-[17px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Chrome size={20} /> Continue with Google
          </button>
        ) : step === 3 ? (
          <div className="space-y-3">
             <button onClick={handleNext} className="w-full bg-[#10b981] text-white h-[60px] rounded-[22px] font-bold text-[17px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-emerald-50">
               Allow Access <ChevronRight size={18} />
             </button>
             <button onClick={handleNext} className="w-full text-slate-400 h-[50px] font-bold text-[15px]">Maybe later</button>
          </div>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full bg-[#10b981] text-white h-[60px] rounded-[22px] font-bold text-[17px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-emerald-50"
          >
            Get Started <ArrowRight size={20} />
          </button>
        )}
        
        <div className="flex justify-center gap-1.5 pt-4">
          {[1,2,3].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-[#10b981]' : 'w-1.5 bg-slate-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
