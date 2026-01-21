
import React, { useState } from 'react';
import { ArrowLeft, Settings, Users, CreditCard, PieChart, Repeat, X } from 'lucide-react';
import { Group, Expense } from '../types';
import { CATEGORY_ICONS, MOCK_USERS } from '../constants';

interface GroupDetailProps {
  group: Group;
  expenses: Expense[];
  onBack: () => void;
  onSettleUp: () => void;
  onAddExpense: () => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ group, expenses, onBack, onSettleUp, onAddExpense }) => {
  const [showMembers, setShowMembers] = useState(false);
  const groupExpenses = expenses.filter(e => e.targetId === group.id);
  
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getDay = (dateStr: string) => new Date(dateStr).getDate();
  const getMonthShort = (dateStr: string) => new Date(dateStr).toLocaleString('default', { month: 'short' });

  // Get full member objects
  const members = MOCK_USERS.filter(u => group.members.includes(u.id));

  return (
    <div className="flex flex-col h-full bg-white relative animate-in fade-in slide-in-from-right duration-300">
      {/* Header section - native emerald color */}
      <div className="relative pt-14 pb-10 px-6 bg-[#00695c] text-white">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <button onClick={onBack} className="p-1 -ml-2">
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <button className="p-1">
            <Settings size={28} strokeWidth={2} />
          </button>
        </div>

        <div className="relative z-10">
          <h1 className="text-[34px] font-extrabold tracking-tight mb-2 leading-tight">{group.name}</h1>
          <button 
            onClick={() => setShowMembers(true)}
            className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10"
          >
            <Users size={16} strokeWidth={2.5} />
            <span className="text-sm font-bold tracking-tight">{group.members.length} people</span>
          </button>
        </div>
      </div>

      {/* Net Balance Summary Bar */}
      <div className="px-6 py-5 border-b border-slate-50 bg-white">
        <p className={`text-[17px] font-bold ${group.balance > 0 ? 'text-[#10b981]' : 'text-orange-500'}`}>
          {group.balance > 0 
            ? `Someone owes you ₹${Math.abs(group.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` 
            : `You owe someone ₹${Math.abs(group.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
        </p>
      </div>

      {/* Utility Actions */}
      <div className="px-6 py-5 flex gap-3 overflow-x-auto no-scrollbar">
        <button 
          onClick={onSettleUp}
          className="flex-shrink-0 bg-[#ff9f0a] text-white px-7 py-2.5 rounded-xl font-bold text-[15px] shadow-lg shadow-orange-100 active:scale-95 transition-all"
        >
          Settle up
        </button>
        <button className="flex-shrink-0 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold text-[15px] flex items-center gap-2 border border-slate-200 shadow-sm active:bg-slate-50">
          <Repeat size={18} className="text-indigo-500" strokeWidth={2.5} />
          Convert to GBP
        </button>
        <button className="flex-shrink-0 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold text-[15px] flex items-center gap-2 border border-slate-200 shadow-sm active:bg-slate-50">
          <PieChart size={18} className="text-indigo-500" strokeWidth={2.5} />
          Charts
        </button>
      </div>

      {/* Expenses List */}
      <div className="flex-1 overflow-y-auto px-5 pb-40 no-scrollbar bg-white">
        {groupExpenses.length > 0 && (
          <h3 className="text-[15px] font-bold text-slate-400 mt-6 mb-4">
            {formatDateHeader(groupExpenses[0].date)}
          </h3>
        )}

        <div className="space-y-0.5">
          {groupExpenses.map(exp => (
            <div key={exp.id} className="flex items-center gap-4 py-4 px-2 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
              <div className="flex flex-col items-center justify-center min-w-[44px]">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-tight">{getMonthShort(exp.date)}</span>
                <span className="text-[22px] font-bold text-slate-900 leading-none">{getDay(exp.date)}</span>
              </div>

              <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-600">
                {CATEGORY_ICONS[exp.category] || CATEGORY_ICONS['General']}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-[17px] truncate tracking-tight">{exp.description}</h4>
                <p className="text-[13px] text-slate-400 font-bold">
                  {exp.payerId === 'u1' ? 'You' : 'Someone'} paid ₹{exp.amount.toFixed(2)}
                </p>
              </div>

              <div className="text-right">
                <p className={`text-[11px] font-bold uppercase tracking-tight ${exp.payerId === 'u1' ? 'text-[#10b981]' : 'text-orange-400'}`}>
                  {exp.payerId === 'u1' ? 'you lent' : 'you owe'}
                </p>
                <p className={`text-[19px] font-bold ${exp.payerId === 'u1' ? 'text-[#10b981]' : 'text-orange-500'}`}>
                  ₹{(exp.amount / group.members.length).toFixed(0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apple-style FAB: refined position above bottom nav */}
      <button 
        onClick={onAddExpense}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-[#10b981] text-white w-[180px] py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-[0.97] transition-all z-30 font-bold text-[17px] tracking-tight"
      >
        <CreditCard size={20} strokeWidth={2.5} />
        Add expense
      </button>

      {/* Members Modal */}
      {showMembers && (
        <div className="absolute inset-0 z-[110] bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
          <div className="px-5 pt-14 pb-3 flex justify-between items-center border-b border-slate-50 bg-white">
            <button onClick={() => setShowMembers(false)} className="p-1 -ml-2 text-slate-500"><X size={28} /></button>
            <h2 className="text-[17px] font-bold text-slate-900">Group members</h2>
            <div className="w-10"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white no-scrollbar">
             {members.map(member => (
               <div key={member.id} className="flex items-center gap-5">
                  <img src={member.avatar} alt={member.name} className="w-[60px] h-[60px] rounded-full border border-slate-100 shadow-sm" />
                  <div className="flex-1 border-b border-slate-50 pb-5">
                    <p className="text-[19px] font-bold text-slate-900 tracking-tight">{member.name} {member.id === 'u1' && '(You)'}</p>
                    <p className="text-[14px] text-slate-400 font-bold">Joined Dec 2023</p>
                  </div>
               </div>
             ))}
          </div>
          <div className="p-8 bg-white border-t border-slate-50">
             <button className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-bold text-[17px] shadow-lg active:scale-95 transition-all">Add more people</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
