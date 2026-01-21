
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BalanceHeader from './components/BalanceHeader';
import GroupList from './components/GroupList';
import FriendsList from './components/FriendsList';
import AddExpenseModal from './components/AddExpenseModal';
import SettleUpModal from './components/SettleUpModal';
import CreateGroupModal from './components/CreateGroupModal';
import GroupDetail from './components/GroupDetail';
import Onboarding from './components/Onboarding';
import ReviewInvoices from './components/ReviewInvoices';
import EmptyState from './components/EmptyState';
import { View, Group, Expense, Friend, PendingInvoice } from './types';
import { MOCK_GROUPS, MOCK_FRIENDS, CATEGORY_ICONS, MOCK_USERS } from './constants';
import { getSpendingAdvice } from './services/geminiService';
import { Sparkles, Plus, Clock, BrainCircuit, CreditCard, ChevronRight, Activity, Mail, Smartphone, Trash2, PlusCircle, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.ONBOARDING);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<PendingInvoice[]>([]);
  
  // Sync States
  const [syncedEmails, setSyncedEmails] = useState<string[]>(['felix@splitsmart.ai']);
  const [isSmsSynced, setIsSmsSynced] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('Analyzing your spending patterns...');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleOnboardingComplete = () => {
    setGroups(MOCK_GROUPS);
    setFriends(MOCK_FRIENDS);
    setPendingInvoices([
      { id: 'pi1', merchant: 'Zomato', amount: 840, date: new Date().toISOString(), source: 'gmail', sourceDetail: 'felix@splitsmart.ai', status: 'pending' },
      { id: 'pi2', merchant: 'Uber', amount: 320, date: new Date().toISOString(), source: 'gmail', sourceDetail: 'felix@splitsmart.ai', status: 'pending' },
    ]);
    setActiveView(View.GROUPS);
  };

  useEffect(() => {
    if (expenses.length > 0) {
      const fetchAdvice = async () => {
        setLoadingAdvice(true);
        try {
          const advice = await getSpendingAdvice(expenses);
          setAiAdvice(advice || 'Your finances are looking sharp!');
        } catch (e) {
          setAiAdvice('Split smarter, live better with SplitSmart.');
        } finally {
          setLoadingAdvice(false);
        }
      };
      fetchAdvice();
    }
  }, [expenses]);

  const totalOwed = 
    groups.reduce((acc, g) => g.balance > 0 ? acc + g.balance : acc, 0) + 
    friends.reduce((acc, f) => f.balance > 0 ? acc + f.balance : acc, 0);

  const totalOwe = 
    groups.reduce((acc, g) => g.balance < 0 ? acc + Math.abs(g.balance) : acc, 0) + 
    friends.reduce((acc, f) => f.balance < 0 ? acc + Math.abs(f.balance) : acc, 0);

  // Derive the selected group object from selectedGroupId
  const selectedGroup = groups.find(g => g.id === selectedGroupId) || null;

  const handleAddExpense = (newExpense: any) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
      splits: [],
    };
    setExpenses(prev => [expense, ...prev]);
    if (newExpense.targetType === 'group') {
      const group = groups.find(g => g.id === newExpense.targetId);
      const memberCount = group?.members.length || 2;
      const amountPerPerson = expense.amount / memberCount;
      const balanceDelta = newExpense.payerId === 'u1' ? (expense.amount - amountPerPerson) : -amountPerPerson;
      setGroups(prev => prev.map(g => g.id === newExpense.targetId ? { ...g, balance: g.balance + balanceDelta } : g));
    }
  };

  const handleAddEmail = () => {
    const email = prompt("Enter the Gmail address you'd like to sync:");
    if (email && email.includes('@gmail.com') && !syncedEmails.includes(email)) {
      setSyncedEmails([...syncedEmails, email]);
      // Simulate finding a new bill from this email
      setPendingInvoices(prev => [...prev, {
        id: Math.random().toString(),
        merchant: 'Amazon Pay',
        amount: 1250,
        date: new Date().toISOString(),
        source: 'gmail',
        sourceDetail: email,
        status: 'pending'
      }]);
    }
  };

  const handleToggleSms = () => {
    const newValue = !isSmsSynced;
    setIsSmsSynced(newValue);
    if (newValue) {
      // Simulate finding a bill from SMS
      setPendingInvoices(prev => [...prev, {
        id: Math.random().toString(),
        merchant: 'PVR Cinemas',
        amount: 450,
        date: new Date().toISOString(),
        source: 'sms',
        sourceDetail: 'SMS: TX-HDFCBK',
        status: 'pending'
      }]);
    }
  };

  const renderDashboard = () => {
    const net = totalOwed - totalOwe;
    if (expenses.length === 0) {
      return (
        <EmptyState 
          icon={Activity}
          title="No activity yet"
          description="Add an expense or join a group to see your spending activity here."
          actionLabel="Add first expense"
          onAction={() => setIsAddModalOpen(true)}
        />
      );
    }
    return (
      <div className="space-y-6 pb-20 animate-in fade-in duration-500">
        <BalanceHeader totalOwed={totalOwed} totalOwe={totalOwe} />
        <div className="px-6 flex justify-center -mt-8">
           <div className="bg-white px-8 py-3 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-3">
              <span className={`text-[17px] font-bold ${net >= 0 ? 'text-[#10b981]' : 'text-orange-500'}`}>
                {net >= 0 ? 'Someone owes you' : 'You owe someone'} ₹{Math.abs(net).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
           </div>
        </div>
        <div className="mx-6 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform rotate-12">
            <BrainCircuit size={100} />
          </div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Sparkles size={16} className="text-[#fbbf24] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-300">AI Spending Insight</span>
          </div>
          <p className="text-[15px] font-medium leading-relaxed relative z-10 text-slate-100">
            {loadingAdvice ? 'Analyzing your activity...' : aiAdvice}
          </p>
        </div>
        <div className="px-6 pb-10">
          <div className="flex justify-between items-center mb-5 px-1">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <Clock size={15} /> Recent Activity
            </h3>
          </div>
          <div className="space-y-2">
            {expenses.slice(0, 5).map(exp => (
              <div key={exp.id} className="bg-white p-4 rounded-[22px] flex items-center gap-4 shadow-sm border border-slate-50/50">
                <div className={`p-3 rounded-2xl bg-slate-50`}>
                  {CATEGORY_ICONS[exp.category] || CATEGORY_ICONS['General']}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-slate-900 text-[15px] truncate tracking-tight">{exp.description}</p>
                  <p className="text-[12px] text-slate-400 font-medium">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[15px] text-slate-900">₹{exp.amount.toFixed(0)}</p>
                  <p className="text-[11px] text-[#10b981] font-bold uppercase tracking-tight">Lent ₹{(exp.amount/2).toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (activeView === View.ONBOARDING) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <Layout activeView={activeView} setView={setActiveView}>
      {activeView === View.DASHBOARD && renderDashboard()}
      {activeView === View.GROUPS && (
        <GroupList 
          groups={groups} 
          onSelect={(g) => { setSelectedGroupId(g.id); setActiveView(View.GROUP_DETAIL); }} 
          onCreateGroup={() => setIsCreateGroupModalOpen(true)}
        />
      )}
      {activeView === View.GROUP_DETAIL && selectedGroupId && (
        <GroupDetail
          group={groups.find(g => g.id === selectedGroupId)!}
          expenses={expenses}
          onBack={() => setActiveView(View.GROUPS)}
          onSettleUp={() => setIsSettleModalOpen(true)}
          onAddExpense={() => setIsAddModalOpen(true)}
        />
      )}
      {activeView === View.FRIENDS && (
        <FriendsList 
          friends={friends} 
          onSelect={() => {}} 
        />
      )}
      {activeView === View.REVIEW_INVOICES && (
        <ReviewInvoices 
          invoices={pendingInvoices} 
          onAdd={(inv) => {
            setIsAddModalOpen(true);
            setPendingInvoices(prev => prev.map(i => i.id === inv.id ? {...i, status: 'added'} : i));
          }}
          onDismiss={(id) => setPendingInvoices(prev => prev.map(i => i.id === id ? {...i, status: 'dismissed'} : i))}
        />
      )}
      {activeView === View.ACCOUNT && (
        <div className="pb-32 px-6 pt-12 animate-in fade-in slide-in-from-bottom duration-500 no-scrollbar">
           <div className="flex flex-col items-center mb-10">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
                  <img src={MOCK_USERS[0].avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-2xl border-4 border-white shadow-lg text-white">
                  <ShieldCheck size={20} strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-[28px] font-black tracking-tight text-slate-900 leading-none mb-1">{MOCK_USERS[0].name}</h2>
              <p className="text-slate-400 font-bold text-[14px] uppercase tracking-widest">Premium Member</p>
           </div>

           {/* Multiple Gmail Sync Section */}
           <div className="mb-8 space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Connected Accounts</h3>
                <button onClick={handleAddEmail} className="text-[#10b981] font-bold text-[14px] flex items-center gap-1 hover:opacity-70">
                  <PlusCircle size={16} /> Add Gmail
                </button>
              </div>
              <div className="bg-white rounded-[32px] overflow-hidden border border-slate-50 shadow-sm">
                {syncedEmails.map((email, idx) => (
                  <div key={email} className={`flex items-center justify-between p-5 ${idx !== syncedEmails.length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[15px]">{email}</p>
                        <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-tighter">Connected</p>
                      </div>
                    </div>
                    {idx !== 0 && (
                      <button 
                        onClick={() => setSyncedEmails(syncedEmails.filter(e => e !== email))}
                        className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
           </div>

           {/* SMS Sync Section */}
           <div className="mb-8 space-y-4">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Phone Settings</h3>
              <div className="bg-white p-5 rounded-[32px] border border-slate-50 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[15px]">Sync SMS spends</p>
                    <p className="text-[11px] font-bold text-slate-400">Scan messages for transactions</p>
                  </div>
                </div>
                <button 
                  onClick={handleToggleSms}
                  className={`w-12 h-7 rounded-full transition-all relative ${isSmsSynced ? 'bg-[#10b981]' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${isSmsSynced ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
           </div>

           {/* Other Settings */}
           <div className="space-y-3">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">General</h3>
              {['Notifications', 'Security', 'Data & Privacy', 'Log Out'].map(item => (
                <button key={item} className={`w-full flex justify-between items-center px-6 py-5 bg-white rounded-[28px] ${item === 'Log Out' ? 'text-red-500' : 'text-slate-700'} font-bold text-[16px] border border-slate-50 hover:bg-slate-50 transition-all active:scale-[0.98]`}>
                  {item} <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Primary Dashboard FAB */}
      {![View.GROUP_DETAIL, View.ONBOARDING].includes(activeView) && (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-[110px] right-10 bg-[#10b981] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl active:scale-[0.92] hover:bg-[#059669] transition-all z-20"
        >
          <Plus size={32} strokeWidth={2.5} />
        </button>
      )}

      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddExpense}
        friends={friends}
        groups={groups}
        selectedGroup={selectedGroup}
      />

      <SettleUpModal 
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        onSettle={() => setIsSettleModalOpen(false)}
        friends={friends}
        groups={groups}
      />

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreate={(name, ids) => {
          const newGroup = { id: Math.random().toString(), name, members: ['u1', ...ids], balance: 0, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop' };
          setGroups([...groups, newGroup]);
          setIsCreateGroupModalOpen(false);
        }}
        friends={friends}
      />
    </Layout>
  );
};

export default App;
