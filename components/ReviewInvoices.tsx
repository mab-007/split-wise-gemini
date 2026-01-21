
import React from 'react';
import { Mail, Smartphone, Clock, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import { PendingInvoice } from '../types';
import EmptyState from './EmptyState';

interface ReviewInvoicesProps {
  invoices: PendingInvoice[];
  onAdd: (invoice: PendingInvoice) => void;
  onDismiss: (id: string) => void;
}

const ReviewInvoices: React.FC<ReviewInvoicesProps> = ({ invoices, onAdd, onDismiss }) => {
  const pending = invoices.filter(i => i.status === 'pending');

  if (pending.length === 0) {
    return (
      <EmptyState
        icon={Mail}
        title="Inbox is clear"
        description="We'll automatically surface new bills found in your synced Gmail or SMS."
      />
    );
  }

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">Review Spending</h2>
        <p className="text-slate-400 font-bold mt-1">AI found {pending.length} potential expenses to split.</p>
      </div>

      <div className="space-y-4">
        {pending.map(inv => (
          <div key={inv.id} className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${inv.source === 'sms' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'} rounded-2xl flex items-center justify-center`}>
                {inv.source === 'sms' ? <Smartphone size={24} /> : <Mail size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${inv.source === 'sms' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    Found via {inv.source === 'sms' ? 'SMS' : 'Gmail'}
                  </span>
                </div>
                <h4 className="font-extrabold text-[17px] text-slate-900 mt-1">{inv.merchant}</h4>
                <p className="text-[12px] text-slate-400 font-bold truncate max-w-[150px]">{inv.sourceDetail || inv.source}</p>
              </div>
              <div className="text-right">
                <p className="text-[20px] font-black text-slate-900">₹{inv.amount}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => onAdd(inv)}
                className="flex-1 bg-[#10b981] text-white py-3.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-md shadow-emerald-50"
              >
                <CheckCircle2 size={16} /> Add to split
              </button>
              <button 
                onClick={() => onDismiss(inv.id)}
                className="w-14 bg-slate-50 text-slate-400 py-3.5 rounded-2xl flex items-center justify-center active:scale-[0.97] transition-all hover:bg-red-50 hover:text-red-400"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewInvoices;
