"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { useTestimonials } from '@/hooks/useApi';
import { Plus, Edit, Trash2, User, Calendar } from 'lucide-react';
import type { TestimonialResponse } from '@/types/api';

export default function TestimonialsPage() {
  const { testimonials, pagination, loading, error, fetchTestimonials, deleteTestimonial } = useTestimonials();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the testimonial by ${name}?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteTestimonial(id);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F2A3B]">Testimonials</h1>
            <p className="text-[#5E6E7E] mt-2">
              Manage patient testimonials and reviews
            </p>
          </div>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors font-medium"
          >
            <Plus size={20} />
            Add Testimonial
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-[#E6EEF3] p-6">
          <h2 className="text-lg font-semibold text-[#0F2A3B] mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">{pagination.total}</p>
              <p className="text-sm text-[#5E6E7E]">Total Testimonials</p>
            </div>
            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">{testimonials.filter(t => t.role === 'Patient').length}</p>
              <p className="text-sm text-[#5E6E7E]">Patient Reviews</p>
            </div>
            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">{testimonials.filter(t => t.role === 'Doctor').length}</p>
              <p className="text-sm text-[#5E6E7E]">Doctor Reviews</p>
            </div>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="bg-white rounded-xl border border-[#E6EEF3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E6EEF3]">
            <h2 className="text-lg font-semibold text-[#0F2A3B]">All Testimonials</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 text-[#5E6E7E]">
                <div className="w-5 h-5 border-2 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
                Loading testimonials...
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Error loading testimonials: {error}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#F7FBFE] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#5E6E7E]" />
              </div>
              <h3 className="text-lg font-medium text-[#0F2A3B] mb-2">No testimonials yet</h3>
              <p className="text-[#5E6E7E] mb-4">Start by adding your first testimonial</p>
              <Link
                href="/admin/testimonials/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors"
              >
                <Plus size={16} />
                Add First Testimonial
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E6EEF3]">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#2FA4C5]/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-[#2FA4C5]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#0F2A3B]">{testimonial.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-[#5E6E7E]">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              testimonial.role === 'Doctor' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {testimonial.role}
                            </span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(testimonial.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[#5E6E7E] leading-relaxed line-clamp-3">
                        "{testimonial.description}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 lg:ml-4">
                      <Link
                        href={`/admin/testimonials/${testimonial._id}/edit`}
                        className="p-2 text-[#5E6E7E] hover:text-[#2FA4C5] hover:bg-[#F7FBFE] rounded-lg transition-colors"
                        title="Edit testimonial"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(testimonial._id, testimonial.name)}
                        disabled={deleteLoading === testimonial._id}
                        className="p-2 text-[#5E6E7E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete testimonial"
                      >
                        {deleteLoading === testimonial._id ? (
                          <div className="w-[18px] h-[18px] border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}