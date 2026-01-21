
import React, { useState } from 'react';
import { X, Users, Check } from 'lucide-react';
import { Friend } from '../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, memberIds: string[]) => void;
  friends: Friend[];
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreate, friends }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleFriend = (id: string) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;
    onCreate(groupName, selectedFriends);
    setGroupName('');
    setSelectedFriends([]);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full rounded-t-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[95%] flex flex-col">
        <div className="px-6 pt-10 pb-4 border-b flex justify-between items-center bg-white">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-400">
            <X size={28} />
          </button>
          <h2 className="text-[18px] font-bold text-slate-900">Create a group</h2>
          <button 
            onClick={handleCreate}
            disabled={!groupName.trim()}
            className="text-[#10b981] font-bold px-2 disabled:opacity-30"
          >
            Done
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-100">
              <Users size={36} />
            </div>
            <div className="flex-1">
              <input
                autoFocus
                type="text"
                placeholder="Group name"
                className="w-full text-2xl font-bold border-b-2 border-slate-100 focus:border-[#10b981] outline-none py-2 transition-all"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Select members</h3>
              <span className="text-[10px] font-bold text-[#10b981] bg-[#effaf6] px-3 py-1 rounded-full uppercase tracking-tighter">
                {selectedFriends.length} selected
              </span>
            </div>
            
            <div className="space-y-2">
              {friends.map(friend => (
                <button
                  key={friend.id}
                  onClick={() => toggleFriend(friend.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] border-2 transition-all ${
                    selectedFriends.includes(friend.id)
                      ? 'bg-[#effaf6] border-[#10b981]/20'
                      : 'bg-white border-slate-50 hover:border-slate-100'
                  }`}
                >
                  <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full border border-white shadow-sm" />
                  <span className="flex-1 text-left font-bold text-slate-900">{friend.name}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    selectedFriends.includes(friend.id)
                      ? 'bg-[#10b981] border-[#10b981] text-white'
                      : 'border-slate-200'
                  }`}>
                    {selectedFriends.includes(friend.id) && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
