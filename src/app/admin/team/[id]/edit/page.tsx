"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { useTeam, useImageUpload } from '@/hooks/useApi';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  name: string;
  role: string;
  startYear: number;
}

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { getTeamMember, updateTeamMember, loading } = useTeam();
  const { uploadImage, loading: imageUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    startYear: new Date().getFullYear()
  });

  const [image, setImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch existing team member data
  useEffect(() => {
    const fetchTeamMember = async () => {
      if (!id) return;
      
      try {
        const response = await getTeamMember(id);
        const member = response.data;
        
        setFormData({
          name: member.name || '',
          role: member.role || '',
          startYear: member.startYear || new Date().getFullYear()
        });
        
        setImage(member.image || '');
        setImagePreview(member.image || '');
        setOriginalImage(member.image || '');
      } catch (error) {
        console.error('Error fetching team member:', error);
        setError('Failed to load team member data');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTeamMember();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'startYear' ? parseInt(value) || new Date().getFullYear() : value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImage(result);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const resetImage = () => {
    setImage(originalImage);
    setImagePreview(originalImage);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.role.trim()) {
      setError('Role is required');
      return;
    }

    if (!image) {
      setError('Profile image is required');
      return;
    }

    try {
      let imageUrl = image;

      // Upload new image to Cloudinary if it's a base64 string (new upload)
      if (image.startsWith('data:')) {
        const uploadResult = await uploadImage(image, 'team');
        imageUrl = uploadResult.url;
      }

      // Update team member
      await updateTeamMember(id, {
        ...formData,
        image: imageUrl
      });

      router.push('/admin/team');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team member');
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
            <span className="text-[#5E6E7E]">Loading team member...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/team"
            className="p-2 text-[#5E6E7E] hover:text-[#2FA4C5] hover:bg-[#F7FBFE] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#0F2A3B]">Edit Team Member</h1>
            <p className="text-[#5E6E7E] mt-2">
              Update {formData.name || 'team member'} information
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E6EEF3] p-6 space-y-6">
          
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#0F2A3B] mb-2">
              Profile Image *
            </label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#2FA4C5]/20">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-[#E6EEF3] rounded-full flex items-center justify-center bg-[#F7FBFE]">
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-[#5E6E7E] mx-auto mb-2" />
                    <span className="text-sm text-[#5E6E7E]">No Image</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 text-sm bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors"
                >
                  Change Image
                </button>
                {image !== originalImage && (
                  <button
                    type="button"
                    onClick={resetImage}
                    className="px-3 py-2 text-sm text-[#5E6E7E] border border-[#E6EEF3] rounded-lg hover:bg-[#F7FBFE] transition-colors"
                  >
                    Reset to Original
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <p className="text-sm text-[#5E6E7E]">
                Upload a professional photo (JPG, PNG, WebP - Max 5MB)
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0F2A3B] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#E6EEF3] rounded-lg focus:border-[#2FA4C5] focus:ring-2 focus:ring-[#2FA4C5]/20 transition-colors"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#0F2A3B] mb-2">
                Professional Role *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#E6EEF3] rounded-lg focus:border-[#2FA4C5] focus:ring-2 focus:ring-[#2FA4C5]/20 transition-colors"
                placeholder="e.g., Chief Dental Surgeon"
                required
              />
            </div>

            <div>
              <label htmlFor="startYear" className="block text-sm font-medium text-[#0F2A3B] mb-2">
                Start Year *
              </label>
              <input
                type="number"
                id="startYear"
                name="startYear"
                value={formData.startYear}
                onChange={handleInputChange}
                min="1980"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-[#E6EEF3] rounded-lg focus:border-[#2FA4C5] focus:ring-2 focus:ring-[#2FA4C5]/20 transition-colors"
                required
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
            <Link
              href="/admin/team"
              className="px-6 py-2 text-[#5E6E7E] border border-[#E6EEF3] rounded-lg hover:bg-[#F7FBFE] transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || imageUploading}
              className="px-6 py-2 bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || imageUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {imageUploading ? 'Uploading Image...' : 'Updating...'}
                </>
              ) : (
                'Update Team Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}