
import React from 'react';
import { X, CheckCircle2, ChevronRight } from 'lucide-react';
import { Friend, Group } from '../types';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettle: (targetId: string, type: 'friend' | 'group', amount: number) => void;
  friends: Friend[];
  groups: Group[];
}

const SettleUpModal: React.FC<SettleUpModalProps> = ({ isOpen, onClose, onSettle, friends, groups }) => {
  if (!isOpen) return null;

  const settleableFriends = friends.filter(f => f.balance !== 0);
  const settleableGroups = groups.filter(g => g.balance !== 0);

  return (
    <div className="absolute inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full rounded-t-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90%] flex flex-col">
        <div className="px-6 pt-10 pb-4 border-b flex justify-between items-center bg-white">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-400">
            <X size={28} />
          </button>
          <h2 className="text-[18px] font-bold text-slate-900">Settle Up</h2>
          <div className="w-10" />
        </div>

        <div className="overflow-y-auto p-6 space-y-6 no-scrollbar flex-1 pb-20">
          {settleableFriends.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Friends</h3>
              {settleableFriends.map(friend => (
                <button
                  key={friend.id}
                  onClick={() => onSettle(friend.id, 'friend', -friend.balance)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-[24px] hover:bg-[#effaf6] border border-transparent hover:border-[#10b981]/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full border border-white shadow-sm" />
                    <div className="text-left">
                      <p className="font-bold text-slate-900">{friend.name}</p>
                      <p className={`text-[13px] font-bold ${friend.balance > 0 ? 'text-[#10b981]' : 'text-orange-500'}`}>
                        {friend.balance > 0 ? 'Owes you' : 'You owe'} ₹{Math.abs(friend.balance).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </button>
              ))}
            </div>
          )}

          {settleableGroups.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Groups</h3>
              {settleableGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => onSettle(group.id, 'group', -group.balance)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-[24px] hover:bg-[#effaf6] border border-transparent hover:border-[#10b981]/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={group.image} alt={group.name} className="w-12 h-12 rounded-[18px] border border-white shadow-sm" />
                    <div className="text-left">
                      <p className="font-bold text-slate-900">{group.name}</p>
                      <p className={`text-[13px] font-bold ${group.balance > 0 ? 'text-[#10b981]' : 'text-orange-500'}`}>
                        {group.balance > 0 ? 'Group owes you' : 'You owe group'} ₹{Math.abs(group.balance).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </button>
              ))}
            </div>
          )}

          {settleableFriends.length === 0 && settleableGroups.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-[#effaf6] text-[#10b981] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <p className="text-slate-900 font-bold text-lg">All settled up!</p>
              <p className="text-slate-400 text-sm font-bold">No outstanding balances found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettleUpModal;
