"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page immediately
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Redirecting to Dashboard...</h1>
        <p className="text-gray-700">You are being redirected...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
