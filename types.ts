
export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Friend extends User {
  balance: number; // Positive: they owe you, negative: you owe them
}

export interface Split {
  userId: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  payerId: string;
  targetId: string; // Group ID or Friend User ID
  targetType: 'group' | 'friend';
  splits: Split[];
  category: string;
  isPayment?: boolean; // True if this is a "Settle Up" transaction
  selectedTargets?: { id: string; type: 'friend' | 'group' }[];
}

export interface Group {
  id: string;
  name: string;
  members: string[]; // User IDs
  image: string;
  balance: number;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  GROUPS = 'GROUPS',
  FRIENDS = 'FRIENDS',
  ACTIVITY = 'ACTIVITY',
  ACCOUNT = 'ACCOUNT',
  GROUP_DETAIL = 'GROUP_DETAIL'
}
