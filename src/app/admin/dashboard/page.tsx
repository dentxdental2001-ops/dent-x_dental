"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { MessageSquare, ImageIcon, Plus, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    testimonials: 0,
    beforeAfter: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [testimonialsRes, beforeAfterRes] = await Promise.all([
        fetch('/api/testimonials?limit=1'),
        fetch('/api/before-after?limit=1'),
      ]);

      const [testimonialsData, beforeAfterData] = await Promise.all([
        testimonialsRes.json(),
        beforeAfterRes.json(),
      ]);

      setStats({
        testimonials: testimonialsData.data?.pagination?.total || 0,
        beforeAfter: beforeAfterData.data?.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Testimonials',
      count: stats.testimonials,
      icon: MessageSquare,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      href: '/admin/testimonials',
      addHref: '/admin/testimonials/new',
    },
    {
      title: 'Before & After',
      count: stats.beforeAfter,
      icon: ImageIcon,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      href: '/admin/before-after',
      addHref: '/admin/before-after/new',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F2A3B]">Dashboard</h1>
          <p className="text-[#5E6E7E] mt-2">
            Manage your dental practice content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-xl border border-[#E6EEF3] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${card.lightColor} rounded-lg mb-4`}>
                      <Icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#0F2A3B] mb-2">
                      {card.title}
                    </h3>
                    <p className="text-3xl font-bold text-[#2FA4C5] mb-4">
                      {loading ? '...' : card.count}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={card.href}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors text-sm font-medium"
                  >
                    <Eye size={16} />
                    View All
                  </Link>
                  <Link
                    href={card.addHref}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E6EEF3] text-[#0F2A3B] rounded-lg hover:bg-[#F7FBFE] transition-colors text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add New
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-[#E6EEF3] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0F2A3B] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/testimonials/new"
              className="flex items-center gap-3 p-4 border border-[#E6EEF3] rounded-lg hover:bg-[#F7FBFE] hover:border-[#2FA4C5] transition-colors group"
            >
              <div className="w-10 h-10 bg-[#2FA4C5]/10 rounded-lg flex items-center justify-center group-hover:bg-[#2FA4C5]/20">
                <Plus className="w-5 h-5 text-[#2FA4C5]" />
              </div>
              <div>
                <p className="font-medium text-[#0F2A3B]">Add Testimonial</p>
                <p className="text-sm text-[#5E6E7E]">New review</p>
              </div>
            </Link>

            <Link
              href="/admin/before-after/new"
              className="flex items-center gap-3 p-4 border border-[#E6EEF3] rounded-lg hover:bg-[#F7FBFE] hover:border-[#2FA4C5] transition-colors group"
            >
              <div className="w-10 h-10 bg-[#2FA4C5]/10 rounded-lg flex items-center justify-center group-hover:bg-[#2FA4C5]/20">
                <Plus className="w-5 h-5 text-[#2FA4C5]" />
              </div>
              <div>
                <p className="font-medium text-[#0F2A3B]">Add Before/After</p>
                <p className="text-sm text-[#5E6E7E]">Treatment photos</p>
              </div>
            </Link>

            <Link
              href="/admin/testimonials"
              className="flex items-center gap-3 p-4 border border-[#E6EEF3] rounded-lg hover:bg-[#F7FBFE] hover:border-[#2FA4C5] transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-[#0F2A3B]">Manage Reviews</p>
                <p className="text-sm text-[#5E6E7E]">View & edit</p>
              </div>
            </Link>

            <Link
              href="/admin/before-after"
              className="flex items-center gap-3 p-4 border border-[#E6EEF3] rounded-lg hover:bg-[#F7FBFE] hover:border-[#2FA4C5] transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-[#0F2A3B]">Manage Photos</p>
                <p className="text-sm text-[#5E6E7E]">View & edit</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}