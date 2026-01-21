
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 mb-6">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-[15px] text-slate-400 font-medium leading-relaxed max-w-[240px] mb-8">
        {description}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-[#10b981] text-white px-8 py-3.5 rounded-2xl font-bold text-[16px] shadow-lg shadow-emerald-100 active:scale-95 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
