"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useTestimonials } from '@/hooks/useApi';
import { ArrowLeft, Save, User } from 'lucide-react';
import Link from 'next/link';

export default function NewTestimonialPage() {
  const router = useRouter();
  const { createTestimonial } = useTestimonials();
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await createTestimonial({
        name: formData.name.trim(),
        role: formData.role,
        description: formData.description.trim()
      });
      
      router.push('/admin/testimonials');
    } catch (error) {
      console.error('Error creating testimonial:', error);
      alert('Failed to create testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: '', label: 'Select role...' },
    { value: 'Patient', label: 'Patient' },
    { value: 'Doctor', label: 'Doctor' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/testimonials"
            className="p-2 text-[#5E6E7E] hover:text-[#2FA4C5] hover:bg-[#F7FBFE] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#0F2A3B]">Add New Testimonial</h1>
            <p className="text-[#5E6E7E] mt-2">
              Create a new patient or doctor testimonial
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-[#E6EEF3] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#2FA4C5]/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[#2FA4C5]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0F2A3B]">Testimonial Information</h2>
              <p className="text-sm text-[#5E6E7E]">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0F2A3B] mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2FA4C5] focus:border-[#2FA4C5] transition-colors text-[#0F2A3B] placeholder-[#5E6E7E] ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-[#E6EEF3]'
                }`}
                placeholder="Enter person's name"
                disabled={loading}
                maxLength={100}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-[#5E6E7E]">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#0F2A3B] mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2FA4C5] focus:border-[#2FA4C5] transition-colors text-[#0F2A3B] ${
                  errors.role ? 'border-red-300 bg-red-50' : 'border-[#E6EEF3]'
                }`}
                disabled={loading}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#0F2A3B] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2FA4C5] focus:border-[#2FA4C5] transition-colors text-[#0F2A3B] placeholder-[#5E6E7E] resize-vertical ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-[#E6EEF3]'
                }`}
                placeholder="Enter the testimonial description..."
                disabled={loading}
                maxLength={1000}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-[#5E6E7E]">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2FA4C5] hover:bg-[#2389A7] disabled:bg-[#E6EEF3] disabled:text-[#5E6E7E] text-white font-medium rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Testimonial
                  </>
                )}
              </button>
              
              <Link
                href="/admin/testimonials"
                className="inline-flex items-center justify-center px-6 py-3 bg-white border border-[#E6EEF3] text-[#0F2A3B] font-medium rounded-lg hover:bg-[#F7FBFE] transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}