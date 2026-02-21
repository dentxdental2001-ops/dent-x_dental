"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useBeforeAfter, useImageUpload } from '@/hooks/useApi';
import { ArrowLeft, Save, Upload, X, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { BeforeAfterResponse } from '@/types/api';

interface UploadedImage {
  file?: File;
  preview: string;
  cloudinaryUrl?: string;
  publicId?: string;
  isExisting?: boolean;
}

export default function EditBeforeAfterPage() {
  const router = useRouter();
  const params = useParams();
  const { updateBeforeAfter } = useBeforeAfter();
  const { uploadImage, deleteImage } = useImageUpload();
  
  const [originalData, setOriginalData] = useState<BeforeAfterResponse | null>(null);
  const [formData, setFormData] = useState({
    treatment: ''
  });
  
  const [beforeImage, setBeforeImage] = useState<UploadedImage | null>(null);
  const [afterImage, setAfterImage] = useState<UploadedImage | null>(null);
  const [newlyUploadedImages, setNewlyUploadedImages] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState<'before' | 'after' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.id) {
      fetchBeforeAfter(params.id as string);
    }
  }, [params.id]);

  const fetchBeforeAfter = async (id: string) => {
    try {
      const response = await fetch(`/api/before-after/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const record = data.data;
        setOriginalData(record);
        setFormData({
          treatment: record.treatment || ''
        });
        
        // Set existing images
        setBeforeImage({
          preview: record.beforeImage,
          cloudinaryUrl: record.beforeImage,
          isExisting: true
        });
        
        setAfterImage({
          preview: record.afterImage,
          cloudinaryUrl: record.afterImage,
          isExisting: true
        });
      } else {
        alert('Failed to load case');
        router.push('/admin/before-after');
      }
    } catch (error) {
      console.error('Error fetching case:', error);
      alert('Failed to load case');
      router.push('/admin/before-after');
    } finally {
      setFetchLoading(false);
    }
  };

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

  const extractPublicIdFromUrl = (url: string): string => {
    try {
      const parts = url.split('/');
      const uploadIndex = parts.findIndex(part => part === 'upload');
      if (uploadIndex === -1) return '';
      
      let pathAfterUpload = parts.slice(uploadIndex + 1).join('/');
      
      // Remove version if exists
      if (pathAfterUpload.match(/^v\d+\//)) {
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
      }
      
      // Remove file extension
      return pathAfterUpload.replace(/\.[^/.]+$/, '');
    } catch (error) {
      return '';
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
      
      // Track newly uploaded images for cleanup
      setNewlyUploadedImages(prev => [...prev, result.publicId]);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      
      // Restore original image on upload failure
      if (originalData) {
        if (type === 'before') {
          setBeforeImage({
            preview: originalData.beforeImage,
            cloudinaryUrl: originalData.beforeImage,
            isExisting: true
          });
          if (beforeInputRef.current) beforeInputRef.current.value = '';
        } else {
          setAfterImage({
            preview: originalData.afterImage,
            cloudinaryUrl: originalData.afterImage,
            isExisting: true
          });
          if (afterInputRef.current) afterInputRef.current.value = '';
        }
      }
    } finally {
      setUploadLoading(null);
    }
  };

  const handleImageRemove = async (type: 'before' | 'after') => {
    const image = type === 'before' ? beforeImage : afterImage;
    
    if (image) {
      // Clean up preview if it's a file URL
      if (image.file && image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
      
      // Delete from Cloudinary if it's a newly uploaded image
      if (image.publicId && !image.isExisting) {
        try {
          await deleteImage(image.publicId);
          setNewlyUploadedImages(prev => prev.filter(id => id !== image.publicId));
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    // Restore original image
    if (originalData) {
      if (type === 'before') {
        setBeforeImage({
          preview: originalData.beforeImage,
          cloudinaryUrl: originalData.beforeImage,
          isExisting: true
        });
        if (beforeInputRef.current) beforeInputRef.current.value = '';
      } else {
        setAfterImage({
          preview: originalData.afterImage,
          cloudinaryUrl: originalData.afterImage,
          isExisting: true
        });
        if (afterInputRef.current) afterInputRef.current.value = '';
      }
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
      await updateBeforeAfter(params.id as string, {
        beforeImage: beforeImage!.cloudinaryUrl!,
        afterImage: afterImage!.cloudinaryUrl!,
        treatment: formData.treatment.trim()
      });
      
      // Clear newly uploaded images tracking since they're now saved
      setNewlyUploadedImages([]);
      router.push('/admin/before-after');
    } catch (error) {
      console.error('Error updating case:', error);
      alert('Failed to update case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    // Clean up any newly uploaded images that weren't saved
    for (const publicId of newlyUploadedImages) {
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error('Error cleaning up image:', error);
      }
    }
    
    router.push('/admin/before-after');
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-[#5E6E7E]">
            <div className="w-6 h-6 border-2 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
            Loading case...
          </div>
        </div>
      </AdminLayout>
    );
  }

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
            <h1 className="text-3xl font-bold text-[#0F2A3B]">Edit Case</h1>
            <p className="text-[#5E6E7E] mt-2">
              Update case information and images
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
                <p className="text-sm text-[#5E6E7E]">Update case details</p>
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
                
                <div className="relative">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={beforeImage?.preview || ''}
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
                  
                  {/* Replace button */}
                  <button
                    type="button"
                    onClick={() => beforeInputRef.current?.click()}
                    className="absolute bottom-2 left-2 px-3 py-1 bg-white/90 text-[#0F2A3B] text-xs rounded font-medium hover:bg-white transition-colors"
                    disabled={uploadLoading === 'before'}
                  >
                    Replace
                  </button>
                  
                  {/* Reset button */}
                  {beforeImage && !beforeImage.isExisting && (
                    <button
                      type="button"
                      onClick={() => handleImageRemove('before')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      disabled={uploadLoading === 'before'}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                
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
                
                <div className="relative">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={afterImage?.preview || ''}
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
                  
                  {/* Replace button */}
                  <button
                    type="button"
                    onClick={() => afterInputRef.current?.click()}
                    className="absolute bottom-2 left-2 px-3 py-1 bg-white/90 text-[#0F2A3B] text-xs rounded font-medium hover:bg-white transition-colors"
                    disabled={uploadLoading === 'after'}
                  >
                    Replace
                  </button>
                  
                  {/* Reset button */}
                  {afterImage && !afterImage.isExisting && (
                    <button
                      type="button"
                      onClick={() => handleImageRemove('after')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      disabled={uploadLoading === 'after'}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                
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
                  Updating Case...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Case
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