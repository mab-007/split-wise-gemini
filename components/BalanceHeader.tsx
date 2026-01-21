
import React from 'react';
import { Search, Filter } from 'lucide-react';

interface BalanceHeaderProps {
  totalOwed: number;
  totalOwe: number;
}

const BalanceHeader: React.FC<BalanceHeaderProps> = ({ totalOwed, totalOwe }) => {
  const net = totalOwed - totalOwe;
  const isPositive = net >= 0;

  return (
    <div className="bg-white px-6 pt-16 pb-12 rounded-b-[48px] shadow-sm relative overflow-hidden">
      <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-[0.15] ${isPositive ? 'bg-[#10b981]' : 'bg-orange-500'}`} />
      
      <div className="flex justify-between items-center mb-10 relative z-10">
        <button className="p-2.5 bg-slate-50 rounded-2xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all">
          <Search size={22} strokeWidth={2.5} />
        </button>
        <button className="p-2.5 bg-slate-50 rounded-2xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all">
          <Filter size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative z-10 px-1">
        <p className="text-[#64748b] font-semibold text-[15px] mb-1 tracking-tight">
          Overall, {net < 0 ? 'you owe' : 'you are owed'}
        </p>
        <h1 className={`text-[46px] font-[800] tracking-tight leading-none ${net < 0 ? 'text-[#f97316]' : 'text-[#10b981]'}`}>
          ₹{Math.abs(net).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </h1>
      </div>

      <div className="flex gap-10 mt-10 relative z-10 px-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] font-extrabold text-slate-300 mb-1.5">You owe</p>
          <p className="text-[20px] font-bold text-orange-400 tracking-tight">₹{totalOwe.toFixed(0)}</p>
        </div>
        <div className="w-[1.5px] h-10 bg-slate-100" />
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] font-extrabold text-slate-300 mb-1.5">You are owed</p>
          <p className="text-[20px] font-bold text-[#10b981] tracking-tight">₹{totalOwed.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceHeader;