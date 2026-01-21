
import React from 'react';
import { 
  Coffee, 
  Home, 
  Plane, 
  Utensils, 
  Zap,
  Tag,
  CreditCard
} from 'lucide-react';
import { User, Group, Friend } from './types';

export const CURRENT_USER_ID = 'u1';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: 'u2', name: 'Earl E.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Earl' },
  { id: 'u3', name: 'Stompy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stompy' },
  { id: 'u4', name: 'Hathee P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hathee' },
  { id: 'u5', name: 'Honey P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Honey' },
];

export const MOCK_FRIENDS: Friend[] = [
  { ...MOCK_USERS[1], balance: -42.50 },
  { ...MOCK_USERS[2], balance: 15.00 },
  { ...MOCK_USERS[3], balance: 0 },
  { ...MOCK_USERS[4], balance: -120.00 },
];

export const MOCK_GROUPS: Group[] = [
  { 
    id: 'g1', 
    name: 'Apartment stuff', 
    members: ['u1', 'u2', 'u3'], 
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop',
    balance: -80.89 
  },
  { 
    id: 'g2', 
    name: "Ski Trip 2024", 
    members: ['u1', 'u4', 'u5'], 
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=100&h=100&fit=crop',
    balance: 137.07
  },
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Food': <Utensils size={20} className="text-orange-500" />,
  'Drinks': <Coffee size={20} className="text-blue-400" />,
  'Housing': <Home size={20} className="text-purple-500" />,
  'Travel': <Plane size={20} className="text-emerald-500" />,
  'Utilities': <Zap size={20} className="text-yellow-500" />,
  'General': <Tag size={20} className="text-gray-400" />,
  'Settle': <CreditCard size={20} className="text-emerald-600" />,
};
