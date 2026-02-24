"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { useGallery, useImageUpload } from '@/hooks/useApi';
import { ArrowLeft, Upload, X } from 'lucide-react';
import type { GalleryResponse } from '@/types/api';

interface EditGalleryPageProps {
  params: { id: string };
}

export default function EditGalleryPage({ params }: EditGalleryPageProps) {
  const router = useRouter();
  const { updateGalleryItem, getGalleryItem, loading: galleryLoading } = useGallery();
  const { uploadImage, deleteImage, loading: uploadLoading } = useImageUpload();
  
  const [galleryItem, setGalleryItem] = useState<GalleryResponse | null>(null);
  const [formData, setFormData] = useState({
    priority: 1,
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [hasNewImage, setHasNewImage] = useState(false);
  const [error, setError] = useState<string>('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItem();
  }, [params.id]);

  const fetchGalleryItem = async () => {
    try {
      const response = await getGalleryItem(params.id);
      if (response.data) {
        setGalleryItem(response.data);
        setFormData({
          priority: response.data.priority,
        });
        setImagePreview(response.data.image);
      }
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      setError('Failed to load gallery item');
    }
    setInitialLoading(false);
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setHasNewImage(true);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!galleryItem) return;

    if (!formData.priority || formData.priority < 1) {
      setError('Please enter a valid priority number (1 or higher)');
      return;
    }

    try {
      let imageUrl = galleryItem.image;

      // If user selected a new image, upload it
      if (hasNewImage && selectedImage) {
        // Delete old image from Cloudinary if it exists
        if (galleryItem.image.includes('cloudinary.com')) {
          const publicId = galleryItem.image.split('/').pop()?.split('.')[0];
          if (publicId) {
            await deleteImage(publicId);
          }
        }

        // Upload new image
        const uploadResponse = await uploadImage(selectedImage, 'gallery');
        imageUrl = uploadResponse.url;
      }

      // Update the gallery item
      await updateGalleryItem(params.id, {
        image: imageUrl,
        priority: formData.priority
      });

      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error updating gallery item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update gallery item';
      setError(errorMessage);
    }
  };

  const loading = galleryLoading || uploadLoading;

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!galleryItem) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">Gallery item not found</div>
            <Link
              href="/admin/gallery"
              className="text-[#2FA4C5] hover:underline"
            >
              Return to Gallery
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/gallery"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Gallery Image</h1>
            <p className="text-gray-600">Update image and priority settings</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Image / Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image *
              </label>
              
              <div className="space-y-4">
                {/* Current Image Preview */}
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Current image"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {!hasNewImage && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      Current Image
                    </div>
                  )}
                  {hasNewImage && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                      New Image
                    </div>
                  )}
                </div>

                {/* Upload New Image */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2FA4C5] transition-colors cursor-pointer"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Upload new image
                  </div>
                  <div className="text-xs text-gray-600">
                    Drop image here or click to browse • JPG, PNG, WebP • Max 5MB
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                  />
                </div>

                {hasNewImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(galleryItem.image);
                      setSelectedImage(null);
                      setHasNewImage(false);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel new image and keep current
                  </button>
                )}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <input
                type="number"
                min="1"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2FA4C5] focus:border-transparent"
                placeholder="Enter priority number (1 = highest priority)"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Lower numbers appear first. If another image has this priority, it will be moved down automatically.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#2FA4C5] text-white rounded-md hover:bg-[#248DA8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {uploadLoading ? 'Uploading...' : 'Updating...'}
                  </>
                ) : (
                  'Update Image'
                )}
              </button>
              
              <Link
                href="/admin/gallery"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-center"
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