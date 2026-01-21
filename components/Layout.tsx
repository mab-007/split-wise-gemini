
import React from 'react';
import { Users, User as UserIcon, Menu, LayoutDashboard, SearchCode } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setView: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  if (activeView === View.ONBOARDING) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center p-0 sm:p-8 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
        <div className="relative w-full max-w-[430px] h-[92vh] sm:h-[844px] bg-white overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] sm:rounded-[54px] border border-slate-200/50 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center p-0 sm:p-8 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
      {/* Phone Frame Container: iPhone 15 Pro Max Aspect Ratio */}
      <div className="relative w-full max-w-[430px] h-[92vh] sm:h-[844px] bg-white overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] sm:rounded-[54px] border border-slate-200/50 flex flex-col">
        
        {/* Dynamic Island Placeholder for Realism */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-b-[20px] z-[100] hidden sm:block"></div>

        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {children}
        </main>

        {/* Apple-style Bottom Tab Bar */}
        <nav className="bg-white/90 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center pt-2 pb-8 px-2 z-40">
          <button 
            onClick={() => setView(View.GROUPS)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeView === View.GROUPS ? 'text-[#10b981]' : 'text-[#8e8e93]'}`}
          >
            <Users size={22} strokeWidth={activeView === View.GROUPS ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Groups</span>
          </button>
          <button 
            onClick={() => setView(View.FRIENDS)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeView === View.FRIENDS ? 'text-[#10b981]' : 'text-[#8e8e93]'}`}
          >
            <UserIcon size={22} strokeWidth={activeView === View.FRIENDS ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Friends</span>
          </button>
          <button 
            onClick={() => setView(View.REVIEW_INVOICES)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeView === View.REVIEW_INVOICES ? 'text-[#10b981]' : 'text-[#8e8e93]'}`}
          >
            <SearchCode size={22} strokeWidth={activeView === View.REVIEW_INVOICES ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Review</span>
          </button>
          <button 
            onClick={() => setView(View.DASHBOARD)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeView === View.DASHBOARD ? 'text-[#10b981]' : 'text-[#8e8e93]'}`}
          >
            <LayoutDashboard size={22} strokeWidth={activeView === View.DASHBOARD ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Activity</span>
          </button>
          <button 
            onClick={() => setView(View.ACCOUNT)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeView === View.ACCOUNT ? 'text-[#10b981]' : 'text-[#8e8e93]'}`}
          >
            <Menu size={22} strokeWidth={activeView === View.ACCOUNT ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">Account</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
