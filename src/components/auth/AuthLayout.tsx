'use client';

import { AuthLeftPanel } from './AuthLeftPanel';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hidden on mobile */}
      <AuthLeftPanel />

      {/* Right Panel - Form Content */}
      <div className="flex-1 flex flex-col lg:w-1/2">
        {/* Mobile Header with gradient */}
        <div className="lg:hidden bg-gradient-to-br from-[#642DFC] via-[#5526d4] to-[#4318a8] px-6 py-8">
          <h1 className="text-3xl font-bold text-white text-center">rapid</h1>
          <p className="text-white/80 text-center text-sm mt-1">Hire your remote team rapidly</p>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
