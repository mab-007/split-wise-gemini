
import React from 'react';
import { Friend } from '../types';
import { ChevronRight, PlusCircle, UserCircle } from 'lucide-react';
import EmptyState from './EmptyState';

interface FriendsListProps {
  friends: Friend[];
  onSelect: (friend: Friend) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, onSelect }) => {
  if (friends.length === 0) {
    return (
      <EmptyState
        icon={UserCircle}
        title="No friends yet"
        description="Add your contacts to split bills individually without a group."
        actionLabel="Invite a friend"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="px-4 py-6 space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Friends</h3>
        <button className="text-emerald-500 text-xs font-bold hover:underline flex items-center gap-1">
          <PlusCircle size={14} /> Add friend
        </button>
      </div>
      <div className="space-y-2">
        {friends.map((friend) => (
          <button
            key={friend.id}
            onClick={() => onSelect(friend)}
            className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-transparent hover:border-slate-100 transition-all text-left group"
          >
            <div className="relative">
              <img 
                src={friend.avatar} 
                alt={friend.name} 
                className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white" 
              />
              {friend.balance !== 0 && (
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${friend.balance > 0 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{friend.name}</h4>
              <p className={`text-xs font-medium mt-0.5 ${friend.balance > 0 ? 'text-emerald-500' : friend.balance < 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                {friend.balance > 0 
                  ? `owes you ₹${friend.balance.toFixed(0)}` 
                  : friend.balance < 0 
                    ? `you owe ₹${Math.abs(friend.balance).toFixed(0)}` 
                    : 'settled up'}
              </p>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
