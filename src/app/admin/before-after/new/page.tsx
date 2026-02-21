"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useBeforeAfter, useImageUpload } from '@/hooks/useApi';
import { ArrowLeft, Save, Upload, X, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface UploadedImage {
  file: File;
  preview: string;
  cloudinaryUrl?: string;
  publicId?: string;
}

export default function NewBeforeAfterPage() {
  const router = useRouter();
  const { createBeforeAfter } = useBeforeAfter();
  const { uploadImage, deleteImage } = useImageUpload();
  
  const [formData, setFormData] = useState({
    treatment: ''
  });
  
  const [beforeImage, setBeforeImage] = useState<UploadedImage | null>(null);
  const [afterImage, setAfterImage] = useState<UploadedImage | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState<'before' | 'after' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelect = async (file: File, type: 'before' | 'after') => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Image size should be less than 10MB');
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    const imageData: UploadedImage = { file, preview };

    if (type === 'before') {
      setBeforeImage(imageData);
      setUploadLoading('before');
    } else {
      setAfterImage(imageData);
      setUploadLoading('after');
    }

    // Upload to Cloudinary immediately
    try {
      const result = await uploadImage(file, `before-after/${type}`);
      
      if (type === 'before') {
        setBeforeImage(prev => prev ? { ...prev, cloudinaryUrl: result.url, publicId: result.publicId } : null);
      } else {
        setAfterImage(prev => prev ? { ...prev, cloudinaryUrl: result.url, publicId: result.publicId } : null);
      }
      
      // Track uploaded images for cleanup
      setUploadedImages(prev => [...prev, result.publicId]);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      
      // Clear the image on upload failure
      if (type === 'before') {
        setBeforeImage(null);
        if (beforeInputRef.current) beforeInputRef.current.value = '';
      } else {
        setAfterImage(null);
        if (afterInputRef.current) afterInputRef.current.value = '';
      }
    } finally {
      setUploadLoading(null);
    }
  };

  const handleImageRemove = async (type: 'before' | 'after') => {
    const image = type === 'before' ? beforeImage : afterImage;
    
    if (image) {
      // Clean up preview
      URL.revokeObjectURL(image.preview);
      
      // Delete from Cloudinary if uploaded
      if (image.publicId) {
        try {
          await deleteImage(image.publicId);
          setUploadedImages(prev => prev.filter(id => id !== image.publicId));
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    if (type === 'before') {
      setBeforeImage(null);
      if (beforeInputRef.current) beforeInputRef.current.value = '';
    } else {
      setAfterImage(null);
      if (afterInputRef.current) afterInputRef.current.value = '';
    }

    // Clear errors
    setErrors(prev => ({ ...prev, [`${type}Image`]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.treatment.trim()) {
      newErrors.treatment = 'Treatment is required';
    } else if (formData.treatment.length > 100) {
      newErrors.treatment = 'Treatment must be 100 characters or less';
    }

    if (!beforeImage || !beforeImage.cloudinaryUrl) {
      newErrors.beforeImage = 'Before image is required';
    }

    if (!afterImage || !afterImage.cloudinaryUrl) {
      newErrors.afterImage = 'After image is required';
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
      await createBeforeAfter({
        beforeImage: beforeImage!.cloudinaryUrl!,
        afterImage: afterImage!.cloudinaryUrl!,
        treatment: formData.treatment.trim()
      });
      
      // Clear uploaded images tracking since they're now saved
      setUploadedImages([]);
      router.push('/admin/before-after');
    } catch (error) {
      console.error('Error creating before/after record:', error);
      alert('Failed to create case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup function for when user leaves without saving
  const handleCancel = async () => {
    // Clean up any uploaded images
    for (const publicId of uploadedImages) {
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error('Error cleaning up image:', error);
      }
    }
    
    router.push('/admin/before-after');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 text-[#5E6E7E] hover:text-[#2FA4C5] hover:bg-[#F7FBFE] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#0F2A3B]">Add New Case</h1>
            <p className="text-[#5E6E7E] mt-2">
              Upload before and after treatment photos
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-[#E6EEF3] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2FA4C5]/10 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[#2FA4C5]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0F2A3B]">Case Information</h2>
                <p className="text-sm text-[#5E6E7E]">Treatment details</p>
              </div>
            </div>

            {/* Treatment */}
            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-[#0F2A3B] mb-2">
                Treatment <span className="text-red-500">*</span>
              </label>
              <input
                id="treatment"
                type="text"
                value={formData.treatment}
                onChange={(e) => handleChange('treatment', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2FA4C5] focus:border-[#2FA4C5] transition-colors text-[#0F2A3B] placeholder-[#5E6E7E] ${
                  errors.treatment ? 'border-red-300 bg-red-50' : 'border-[#E6EEF3]'
                }`}
                placeholder="e.g., Professional Teeth Whitening"
                disabled={loading}
                maxLength={100}
              />
              {errors.treatment && (
                <p className="mt-1 text-sm text-red-600">{errors.treatment}</p>
              )}
              <p className="mt-1 text-xs text-[#5E6E7E]">
                {formData.treatment.length}/100 characters
              </p>
            </div>
          </div>

          {/* Image Uploads */}
          <div className="bg-white rounded-xl border border-[#E6EEF3] p-6">
            <h2 className="text-lg font-semibold text-[#0F2A3B] mb-6">Treatment Photos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before Image */}
              <div>
                <label className="block text-sm font-medium text-[#0F2A3B] mb-2">
                  Before Image <span className="text-red-500">*</span>
                </label>
                
                {beforeImage ? (
                  <div className="relative">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={beforeImage.preview}
                        alt="Before"
                        fill
                        className="object-cover"
                      />
                      {uploadLoading === 'before' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm">Uploading...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageRemove('before')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      disabled={uploadLoading === 'before'}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => beforeInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      errors.beforeImage 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-[#E6EEF3] hover:border-[#2FA4C5] hover:bg-[#F7FBFE]'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-[#5E6E7E] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#0F2A3B] mb-1">Upload Before Image</p>
                    <p className="text-xs text-[#5E6E7E]">Click to select or drag and drop</p>
                  </div>
                )}
                
                <input
                  ref={beforeInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelect(file, 'before');
                  }}
                  className="hidden"
                  disabled={loading || uploadLoading === 'before'}
                />
                
                {errors.beforeImage && (
                  <p className="mt-2 text-sm text-red-600">{errors.beforeImage}</p>
                )}
              </div>

              {/* After Image */}
              <div>
                <label className="block text-sm font-medium text-[#0F2A3B] mb-2">
                  After Image <span className="text-red-500">*</span>
                </label>
                
                {afterImage ? (
                  <div className="relative">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={afterImage.preview}
                        alt="After"
                        fill
                        className="object-cover"
                      />
                      {uploadLoading === 'after' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm">Uploading...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageRemove('after')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      disabled={uploadLoading === 'after'}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => afterInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      errors.afterImage 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-[#E6EEF3] hover:border-[#2FA4C5] hover:bg-[#F7FBFE]'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-[#5E6E7E] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#0F2A3B] mb-1">Upload After Image</p>
                    <p className="text-xs text-[#5E6E7E]">Click to select or drag and drop</p>
                  </div>
                )}
                
                <input
                  ref={afterInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelect(file, 'after');
                  }}
                  className="hidden"
                  disabled={loading || uploadLoading === 'after'}
                />
                
                {errors.afterImage && (
                  <p className="mt-2 text-sm text-red-600">{errors.afterImage}</p>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-[#5E6E7E]">
              Supported formats: JPG, PNG, GIF, WebP. Maximum size: 10MB per image.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading || uploadLoading !== null}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2FA4C5] hover:bg-[#2389A7] disabled:bg-[#E6EEF3] disabled:text-[#5E6E7E] text-white font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Case...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Case
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-[#E6EEF3] text-[#0F2A3B] font-medium rounded-lg hover:bg-[#F7FBFE] transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}