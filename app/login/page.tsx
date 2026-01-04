'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/dashboard/staff');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublicAccess = () => {
    router.push('/calendar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-lg p-3 mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SCI Intranet</h1>
          <p className="text-indigo-100">Events, Communications & Admissions</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Admin Login</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin1@scintranet.edu"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Demo: sam@um6p.ma or maha@um6p.ma
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Demo password: password</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Public Access Button */}
        <button
          onClick={handlePublicAccess}
          className="w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-white"
        >
          View Public Event Calendar
        </button>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-indigo-100 text-sm">
            SCI Intranet for Events, Communications & Admissions
          </p>
        </div>
      </div>
    </div>
  );
}
