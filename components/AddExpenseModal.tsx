
import React, { useState, useMemo } from 'react';
import { X, FileText, IndianRupee, Calendar, Camera, Edit3, Home, Check } from 'lucide-react';
import { Friend, Group } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: any) => void;
  friends: Friend[];
  groups: Group[];
  selectedGroup?: Group | null;
}

type Step = 'input' | 'split_details';

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSave, friends, groups, selectedGroup }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [splitType, setSplitType] = useState<'equal' | 'you_full' | 'them_equal' | 'them_full'>('equal');
  
  const activeGroup = selectedGroup || groups[0];
  const targetName = activeGroup?.members.length > 2 ? "the group" : (friends.find(f => activeGroup?.members.includes(f.id) && f.id !== 'u1')?.name || "Aryan");

  const numericAmount = parseFloat(amount || '0');
  const halfAmount = (numericAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const fullAmount = numericAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!description || !amount) return;
    onSave({
      description,
      amount: numericAmount,
      targetId: activeGroup.id,
      targetType: 'group',
      payerId: splitType === 'equal' || splitType === 'you_full' ? 'u1' : 'other',
      date: new Date().toISOString(),
      category: 'General',
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    onClose();
    setDescription('');
    setAmount('');
    setStep('input');
  };

  const renderInputStep = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Apple-style Header */}
      <div className="px-5 pt-14 pb-3 flex justify-between items-center bg-white border-b border-slate-50">
        <button onClick={resetAndClose} className="p-1 text-slate-500">
          <X size={28} strokeWidth={2} />
        </button>
        <h2 className="text-[17px] font-semibold text-slate-900">Add an expense</h2>
        <button 
          onClick={handleSave}
          disabled={!description || !amount}
          className="text-[#10b981] font-bold text-[17px] disabled:opacity-30"
        >
          Save
        </button>
      </div>

      {/* Context Bar */}
      <div className="px-5 py-4 flex items-center gap-2 border-b border-slate-50">
        <span className="text-[#6b7280] text-[15px]">With <span className="font-semibold text-slate-900">you</span> and:</span>
        <div className="flex items-center gap-2 bg-[#f3f4f6] border border-slate-100 px-3 py-1 rounded-full">
           <div className="w-5 h-5 bg-[#059669] rounded-full flex items-center justify-center text-white">
              <Home size={10} strokeWidth={3} />
           </div>
           <span className="text-[13px] font-bold text-slate-700">{activeGroup?.name}</span>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 flex flex-col pt-20 px-10 space-y-12 bg-white">
        <div className="flex items-center gap-5">
          <div className="w-[56px] h-[56px] flex items-center justify-center border border-slate-100 rounded-xl shadow-sm bg-white text-slate-500">
            <FileText size={32} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter a description"
              className="w-full text-xl text-slate-900 placeholder:text-slate-300 border-b-[1px] border-[#10b981] outline-none py-2 font-medium bg-transparent"
              style={{ appearance: 'none', WebkitAppearance: 'none' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-[56px] h-[56px] flex items-center justify-center border border-slate-100 rounded-xl shadow-sm bg-white text-slate-500">
            <IndianRupee size={32} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="0.00"
              className="w-full text-[40px] font-medium text-slate-900 placeholder:text-slate-200 border-b-[1px] border-slate-100 focus:border-[#10b981] outline-none py-1 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={() => setStep('split_details')}
            className="bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-slate-700 font-bold text-[14px] flex items-center gap-2"
          >
            Paid by <span className="font-extrabold">you</span> and <span className="font-extrabold text-[#10b981]">split equally</span>
          </button>
        </div>
      </div>

      {/* Bottom bar inside modal matches user screenshot */}
      <div className="p-6 pb-12 bg-white border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-slate-500">
          <button className="flex items-center gap-2">
            <Calendar size={20} className="text-[#10b981]" strokeWidth={2} />
            <span className="text-[14px] font-bold text-slate-600">Today</span>
          </button>
          <div className="w-px h-5 bg-slate-100" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#ff9f0a] rounded-full flex items-center justify-center text-white">
               <Home size={10} strokeWidth={3} />
            </div>
            <span className="text-[13px] font-bold text-slate-400 truncate max-w-[120px]">{activeGroup?.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button><Camera size={22} strokeWidth={2} /></button>
          <button className="border-l border-slate-100 pl-4"><Edit3 size={22} strokeWidth={2} /></button>
        </div>
      </div>
    </div>
  );

  const renderSplitStep = () => {
    const splitOptions = [
      { id: 'equal', title: 'You paid, split equally.', balance: `${targetName} owes you ₹${halfAmount}`, type: 'owes_you' },
      { id: 'you_full', title: 'You are owed the full amount.', balance: `${targetName} owes you ₹${fullAmount}`, type: 'owes_you' },
      { id: 'them_equal', title: `${targetName} paid, split equally.`, balance: `You owe ${targetName} ₹${halfAmount}`, type: 'you_owe' },
      { id: 'them_full', title: `${targetName} is owed the full amount.`, balance: `You owe ${targetName} ₹${fullAmount}`, type: 'you_owe' },
    ];

    return (
      <div className="flex flex-col h-full bg-white">
        <div className="px-5 pt-14 pb-3 flex justify-between items-center bg-white border-b border-slate-50">
          <button onClick={() => setStep('input')} className="text-[#10b981] font-bold text-[17px]">Cancel</button>
          <h2 className="text-[17px] font-bold text-slate-900">Expense details</h2>
          <div className="w-12"></div>
        </div>

        <div className="bg-[#f2f4f7] py-4 px-6">
          <p className="text-center text-[#5c5f66] font-bold text-[15px]">How was this expense split?</p>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {splitOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setSplitType(opt.id as any); setStep('input'); }}
              className="w-full flex items-center gap-5 px-5 py-6 border-b border-slate-50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex -space-x-5">
                <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-red-500 shadow-sm overflow-hidden flex items-center justify-center">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Me" className="w-full" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-pink-700 to-purple-900 shadow-sm overflow-hidden flex items-center justify-center">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" alt="Friend" className="w-full" />
                </div>
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-slate-900 text-[16px] font-bold tracking-tight">{opt.title}</p>
                <p className={`text-[15px] font-bold mt-0.5 ${opt.type === 'owes_you' ? 'text-[#10b981]' : 'text-[#f87171]'}`}>
                  {opt.balance}
                </p>
              </div>

              {splitType === opt.id && (
                <Check className="text-[#10b981]" size={22} strokeWidth={3} />
              )}
            </button>
          ))}
          
          <div className="flex justify-center py-10">
            <button className="border border-slate-200 px-6 py-2 rounded-lg text-slate-600 font-bold text-[14px] hover:bg-slate-50 active:scale-95 transition-all">
              More options
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col bg-white animate-in slide-in-from-bottom duration-[400ms] cubic-bezier(0.32, 0.72, 0, 1)">
      {step === 'input' ? renderInputStep() : renderSplitStep()}
    </div>
  );
};

export default AddExpenseModal;
