
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

export interface PendingInvoice {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  source: 'gmail' | 'sms' | 'manual';
  sourceDetail?: string; // e.g., "personal@gmail.com" or "SMS: +123456"
  status: 'pending' | 'dismissed' | 'added';
}

export interface Group {
  id: string;
  name: string;
  members: string[]; // User IDs
  image: string;
  balance: number;
}

export enum View {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  GROUPS = 'GROUPS',
  FRIENDS = 'FRIENDS',
  ACTIVITY = 'ACTIVITY',
  REVIEW_INVOICES = 'REVIEW_INVOICES',
  ACCOUNT = 'ACCOUNT',
  GROUP_DETAIL = 'GROUP_DETAIL'
}
