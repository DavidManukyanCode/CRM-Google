export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  labels: Label[];
  location: string;
  joinDate: string;
}

export interface Label {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray';
}

export const mockLabels: Label[] = [
  { id: '1', name: 'VIP Client', color: 'purple' },
  { id: '2', name: 'Hot Lead', color: 'red' },
  { id: '3', name: 'Enterprise', color: 'blue' },
  { id: '4', name: 'SMB', color: 'green' },
  { id: '5', name: 'Follow Up', color: 'yellow' },
  { id: '6', name: 'Cold Lead', color: 'gray' },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    role: 'CTO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'active',
    lastContact: '2024-01-15',
    location: 'San Francisco, CA',
    joinDate: '2023-08-15',
    labels: [mockLabels[0], mockLabels[2]],
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@innovate.io',
    phone: '+1 (555) 234-5678',
    company: 'Innovate.io',
    role: 'Product Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'active',
    lastContact: '2024-01-12',
    location: 'Seattle, WA',
    joinDate: '2023-11-20',
    labels: [mockLabels[1], mockLabels[3]],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@startup.dev',
    phone: '+1 (555) 345-6789',
    company: 'Startup.dev',
    role: 'Founder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'pending',
    lastContact: '2024-01-10',
    location: 'Austin, TX',
    joinDate: '2024-01-05',
    labels: [mockLabels[1], mockLabels[4]],
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@enterprise.com',
    phone: '+1 (555) 456-7890',
    company: 'Enterprise Systems',
    role: 'VP Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'active',
    lastContact: '2024-01-08',
    location: 'New York, NY',
    joinDate: '2023-05-12',
    labels: [mockLabels[0], mockLabels[2]],
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@growth.co',
    phone: '+1 (555) 567-8901',
    company: 'Growth.co',
    role: 'Marketing Director',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    status: 'inactive',
    lastContact: '2023-12-20',
    location: 'Chicago, IL',
    joinDate: '2023-09-30',
    labels: [mockLabels[5], mockLabels[3]],
  },
  {
    id: '6',
    name: 'Robert Wilson',
    email: 'robert.wilson@fintech.app',
    phone: '+1 (555) 678-9012',
    company: 'FinTech App',
    role: 'CEO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    status: 'active',
    lastContact: '2024-01-14',
    location: 'Boston, MA',
    joinDate: '2023-07-08',
    labels: [mockLabels[0], mockLabels[2]],
  },
];