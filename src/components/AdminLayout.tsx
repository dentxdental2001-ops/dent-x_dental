"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ImageIcon, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      
      if (!data.authenticated) {
        router.push('/admin');
        return;
      }
    } catch (error) {
      router.push('/admin');
      return;
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Testimonials',
      href: '/admin/testimonials',
      icon: MessageSquare,
    },
    {
      name: 'Before & After',
      href: '/admin/before-after',
      icon: ImageIcon,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FBFE] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
          <span className="text-[#5E6E7E]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7FBFE]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E6EEF3] transform transition-transform lg:translate-x-0 lg:relative lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#E6EEF3] flex-shrink-0">
          <Link href="/admin/dashboard" className="text-xl font-bold text-[#0F2A3B]">
            Dent<span className="text-[#2FA4C5]">-X</span> Admin
          </Link>
          <button
            className="lg:hidden text-[#5E6E7E] hover:text-[#2FA4C5]"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2FA4C5]/10 text-[#2FA4C5] font-medium'
                    : 'text-[#5E6E7E] hover:bg-[#F7FBFE] hover:text-[#0F2A3B]'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Exit & Logout Buttons */}
        <div className="p-4 border-t border-[#E6EEF3] flex-shrink-0 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-3 py-2 text-[#5E6E7E] hover:bg-[#F7FBFE] hover:text-[#2FA4C5] rounded-lg transition-colors"
          >
            <Home size={20} />
            Exit to Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#E6EEF3] flex items-center justify-between px-6 flex-shrink-0">
          <button
            className="lg:hidden text-[#5E6E7E] hover:text-[#2FA4C5]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-auto">
            <span className="text-sm text-[#5E6E7E]">
              Welcome, Admin
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}