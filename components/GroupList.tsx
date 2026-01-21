
import React from 'react';
import { Group } from '../types';
import { ChevronRight, PlusCircle } from 'lucide-react';

interface GroupListProps {
  groups: Group[];
  onSelect: (group: Group) => void;
  onCreateGroup: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onSelect, onCreateGroup }) => {
  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Groups</h3>
        <button 
          onClick={onCreateGroup}
          className="text-emerald-500 text-xs font-bold hover:underline flex items-center gap-1"
        >
          <PlusCircle size={14} /> Create group
        </button>
      </div>
      <div className="space-y-3">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelect(group)}
            className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-transparent hover:border-slate-100 active:scale-[0.98] transition-all text-left group"
          >
            <div className="relative">
              <img 
                src={group.image} 
                alt={group.name} 
                className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:opacity-90 transition-opacity" 
              />
              {group.balance !== 0 && (
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${group.balance > 0 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">{group.name}</h4>
              <p className={`text-xs font-medium mt-0.5 ${group.balance > 0 ? 'text-emerald-500' : group.balance < 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                {group.balance > 0 
                  ? `You are owed $${group.balance.toFixed(2)}` 
                  : group.balance < 0 
                    ? `You owe $${Math.abs(group.balance).toFixed(2)}` 
                    : 'Settled up'}
              </p>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
        {groups.length === 0 && (
          <div className="bg-white p-8 rounded-3xl text-center border-2 border-dashed border-slate-100">
            <p className="text-slate-400 text-sm">You haven't joined any groups yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
