'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomImage } from '@/components/design';
import LoginForm from '@/components/form/login.form';
import TicketForm from '@/components/form/report.form';
import { useAuthStore } from '@/store';
import { Loader } from '@/components/loading/loader';

function LoginPageContent() {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [checking, setChecking] = useState(true);
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
      setChecking(false);
    };
    checkAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!checking && isAuthenticated) {
      const from = searchParams.get('from') || '/';
      router.replace(from);
    }
  }, [checking, isAuthenticated, router, searchParams]);

  if (checking) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen  bg-main flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        {showTicketForm ? (
          <TicketForm onCancel={() => setShowTicketForm(false)} />
        ) : (
          <LoginForm onReportClick={() => setShowTicketForm(true)} />
        )}
      </div>

      {/* Right Side - Info & Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 text-white relative overflow-hidden">
        {/* Background Pattern - Subtle squares */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white"></div>
          <div className="absolute top-32 right-32 w-16 h-16 border-2 border-white"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white"></div>
          <div className="absolute bottom-40 right-20 w-12 h-12 border-2 border-white"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-white"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl space-y-8">
          {/* Analytics Cards */}
          <div className="space-y-4">
            {/* Line Chart Card */}
            <div className="bg-white rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Analytics
                </h3>
                <div className="flex gap-2 text-xs text-gray-500">
                  <button className="px-2 py-1">Weekly</button>
                  <button className="px-2 py-1">Monthly</button>
                  <button className="px-2 py-1 bg-gray-100 rounded">
                    Yearly
                  </button>
                </div>
              </div>
              {/* Simple line chart illustration */}
              <div className="h-32 flex items-end justify-between gap-2">
                <div className="flex-1 relative">
                  <svg viewBox="0 0 300 100" className="w-full h-full">
                    <polyline
                      points="0,80 50,60 100,70 150,40 200,50 250,30 300,35"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <polyline
                      points="0,90 50,75 100,80 150,55 200,60 250,45 300,50"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
              </div>
            </div>

            {/* Donut Chart Card */}
            <div className="bg-white rounded-xl p-6 shadow-2xl w-64 ml-auto">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="12"
                      strokeDasharray="105 251"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      42%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4 mt-12">
            <h2 className="text-2xl font-semibold">
              Very simple way you can engage
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed">
              Welcome to (DAILY) Inventory Management System! Efficiently track
              and manage your inventory with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-main flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
