'use client';

import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

function DashboardWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (!isAuthenticated) {
    // Redirect to login
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardWrapper>
        {children}
      </DashboardWrapper>
    </AuthProvider>
  );
}
