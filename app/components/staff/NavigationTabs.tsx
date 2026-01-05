"use client";

import { Calendar, MessageSquare, Briefcase, Award, Key } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const { user } = useAuth();

  const tabs: Array<{ id: string; label: string; icon: any }> = [
      { id: 'events-calendar', label: 'Events Calendar', icon: Calendar },
    { id: 'events', label: 'Events List', icon: Calendar },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'admissions', label: 'Admissions 2026', icon: Award }
  ];

  // Show superadmins tab only for users with role 'super_admin'
  if (user && user.role === 'super_admin') {
    tabs.push({ id: 'superadmins', label: 'User Approvals', icon: Key });
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex gap-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
