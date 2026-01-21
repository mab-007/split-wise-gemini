
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BalanceHeader from './components/BalanceHeader';
import GroupList from './components/GroupList';
import FriendsList from './components/FriendsList';
import AddExpenseModal from './components/AddExpenseModal';
import SettleUpModal from './components/SettleUpModal';
import CreateGroupModal from './components/CreateGroupModal';
import GroupDetail from './components/GroupDetail';
import SpendingTrend from './components/SpendingTrend';
import { View, Group, Expense, Friend } from './types';
import { MOCK_GROUPS, MOCK_FRIENDS, CATEGORY_ICONS, MOCK_USERS } from './constants';
import { getSpendingAdvice } from './services/geminiService';
import { Sparkles, Plus, Clock, BrainCircuit, CreditCard, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('Analyzing your spending patterns...');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Initialize with some mock expenses for the first group to show something in the detail view
  useEffect(() => {
    const initialExpenses: Expense[] = [
      {
        id: 'e1',
        description: 'Grocerry',
        amount: 500,
        date: new Date(2023, 11, 16).toISOString(),
        payerId: 'u1',
        targetId: 'g1',
        targetType: 'group',
        splits: [],
        category: 'Food'
      },
      {
        id: 'e2',
        description: 'Nov electricity bill',
        amount: 1450,
        date: new Date(2023, 11, 16).toISOString(),
        payerId: 'u1',
        targetId: 'g1',
        targetType: 'group',
        splits: [],
        category: 'Utilities'
      },
      {
        id: 'e3',
        description: 'Newspaper',
        amount: 447,
        date: new Date(2023, 11, 14).toISOString(),
        payerId: 'u1',
        targetId: 'g1',
        targetType: 'group',
        splits: [],
        category: 'General'
      }
    ];
    setExpenses(initialExpenses);
  }, []);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      try {
        const advice = await getSpendingAdvice([...groups, ...friends]);
        setAiAdvice(advice || 'Your finances are looking sharp!');
      } catch (e) {
        setAiAdvice('Split smarter, live better with SplitSmart.');
      } finally {
        setLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [expenses]);

  const totalOwed = 
    groups.reduce((acc, g) => g.balance > 0 ? acc + g.balance : acc, 0) + 
    friends.reduce((acc, f) => f.balance > 0 ? acc + f.balance : acc, 0);

  const totalOwe = 
    groups.reduce((acc, g) => g.balance < 0 ? acc + Math.abs(g.balance) : acc, 0) + 
    friends.reduce((acc, f) => f.balance < 0 ? acc + Math.abs(f.balance) : acc, 0);

  const handleAddExpense = (newExpense: any) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
      splits: [],
    };
    
    setExpenses(prev => [expense, ...prev]);

    // Simple split logic for demo
    if (newExpense.targetType === 'group') {
      const group = groups.find(g => g.id === newExpense.targetId);
      const memberCount = group?.members.length || 2;
      const amountPerPerson = expense.amount / memberCount;
      
      // If you paid, group owes you (total - your share)
      // If someone else paid, you owe them your share
      const balanceDelta = newExpense.payerId === 'u1' 
        ? (expense.amount - amountPerPerson)
        : -amountPerPerson;

      setGroups(prev => prev.map(g => 
        g.id === newExpense.targetId 
          ? { ...g, balance: g.balance + balanceDelta } 
          : g
      ));
    }
  };

  const handleSettleUp = (targetId: string, type: 'friend' | 'group', amount: number) => {
    if (type === 'group') {
      setGroups(prev => prev.map(g => g.id === targetId ? { ...g, balance: 0 } : g));
    } else {
      setFriends(prev => prev.map(f => f.id === targetId ? { ...f, balance: 0 } : f));
    }
    setIsSettleModalOpen(false);
  };

  const handleCreateGroup = (name: string, memberIds: string[]) => {
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      members: ['u1', ...memberIds],
      image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000000)}?w=200&h=200&fit=crop`,
      balance: 0,
    };
    setGroups(prev => [...prev, newGroup]);
    setIsCreateGroupModalOpen(false);
    setActiveView(View.GROUPS);
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedGroupId(group.id);
    setActiveView(View.GROUP_DETAIL);
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const renderDashboard = () => {
    const net = totalOwed - totalOwe;
    return (
      <div className="space-y-6 pb-20 animate-in fade-in duration-500">
        <BalanceHeader totalOwed={totalOwed} totalOwe={totalOwe} />
        
        {/* Settlement Summary Pill matches user screenshot */}
        <div className="px-6 flex justify-center -mt-8">
           <div className="bg-white px-8 py-3 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-3">
              <span className={`text-[17px] font-bold ${net >= 0 ? 'text-[#10b981]' : 'text-orange-500'}`}>
                {net >= 0 ? 'Someone owes you' : 'You owe someone'} ₹{Math.abs(net).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
           </div>
        </div>

        {/* AI Insight Card */}
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
            <button onClick={() => setActiveView(View.ACTIVITY)} className="text-[13px] font-bold text-[#10b981] hover:underline">View all</button>
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

  return (
    <Layout activeView={activeView} setView={setActiveView}>
      {activeView === View.DASHBOARD && renderDashboard()}
      {activeView === View.GROUPS && (
        <GroupList 
          groups={groups} 
          onSelect={handleGroupSelect} 
          onCreateGroup={() => setIsCreateGroupModalOpen(true)}
        />
      )}
      {activeView === View.GROUP_DETAIL && selectedGroupId && (
        <GroupDetail
          group={selectedGroup!}
          expenses={expenses}
          onBack={() => setActiveView(View.GROUPS)}
          onSettleUp={() => setIsSettleModalOpen(true)}
          onAddExpense={() => setIsAddModalOpen(true)}
        />
      )}
      {activeView === View.FRIENDS && <FriendsList friends={friends} onSelect={() => {}} />}
      {activeView === View.ACTIVITY && (
        <div className="p-6">
          <h2 className="text-[28px] font-extrabold tracking-tight mb-8 text-slate-900">Activity</h2>
          <div className="space-y-4">
            {expenses.map(exp => (
               <div key={exp.id} className="bg-white p-5 rounded-[28px] flex items-center gap-4 shadow-sm border border-slate-50">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                    {CATEGORY_ICONS[exp.category] || CATEGORY_ICONS['General']}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] text-slate-600 leading-tight">
                       <span className="font-bold text-slate-900">You</span> added 
                       <span className="font-bold text-slate-900"> "{exp.description}"</span>
                    </p>
                    <p className="text-[12px] text-slate-400 mt-1 font-medium">{new Date(exp.date).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#10b981] text-[15px]">+₹{(exp.amount / 2).toFixed(0)}</p>
                  </div>
               </div>
            ))}
          </div>
        </div>
      )}
      {activeView === View.ACCOUNT && (
        <div className="p-8">
           <div className="flex flex-col items-center py-12">
              <div className="relative">
                <img src={MOCK_USERS[0].avatar} alt="Profile" className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-xl mb-4" />
                <div className="absolute bottom-4 right-1 bg-[#10b981] w-7 h-7 rounded-full border-4 border-white" />
              </div>
              <h2 className="text-[24px] font-extrabold tracking-tight text-slate-900">{MOCK_USERS[0].name}</h2>
              <p className="text-slate-400 text-[15px] font-medium">felix@splitsmart.ai</p>
           </div>
           <div className="space-y-3">
              {['Privacy', 'Notifications', 'Currency', 'Help & Support'].map(item => (
                <button key={item} className="w-full flex justify-between items-center px-6 py-5 bg-white rounded-3xl text-slate-700 font-bold text-[16px] border border-slate-50 hover:bg-slate-50 transition-all active:scale-[0.98]">
                  {item} <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Primary Dashboard FAB - refined design */}
      {activeView !== View.GROUP_DETAIL && (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-[110px] right-6 bg-[#10b981] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl active:scale-[0.92] hover:bg-[#059669] transition-all z-20 group"
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
        onSettle={handleSettleUp}
        friends={friends}
        groups={groups}
      />

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreate={handleCreateGroup}
        friends={friends}
      />
    </Layout>
  );
};

export default App;