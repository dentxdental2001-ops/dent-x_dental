"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { useGallery, useImageUpload } from '@/hooks/useApi';
import { Plus, Edit3, Trash2, Image as ImageIcon, MoveUp, MoveDown } from 'lucide-react';
import type { GalleryResponse } from '@/types/api';

export default function AdminGalleryPage() {
  const router = useRouter();
  const { gallery, loading, error, fetchGallery, deleteGalleryItem, updateGalleryItem } = useGallery();
  const { deleteImage } = useImageUpload();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpdate = async (id: string, updates: { priority: number }) => {
    try {
      await updateGalleryItem(id, updates);
      await fetchGallery(); // Refresh the list to show new ordering
    } catch (error) {
      console.error('Error updating gallery item:', error);
    }
  };

  const handleDelete = async (item: GalleryResponse) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) {
      return;
    }

    setDeleteLoading(item._id);
    try {
      // First delete from Cloudinary if it's a Cloudinary URL
      if (item.image.includes('cloudinary.com')) {
        const publicId = item.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await deleteImage(publicId);
        }
      }

      await deleteGalleryItem(item._id);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
    setDeleteLoading(null);
  };

  const handlePriorityChange = async (item: GalleryResponse, direction: 'up' | 'down') => {
    const currentIndex = gallery.findIndex(g => g._id === item._id);
    if (currentIndex === -1) return;

    let newPriority: number;
    if (direction === 'up' && currentIndex > 0) {
      // Move up means lower priority number (closer to 1)
      newPriority = item.priority - 1;
    } else if (direction === 'down' && currentIndex < gallery.length - 1) {
      // Move down means higher priority number 
      newPriority = item.priority + 1;
    } else {
      return; // Can't move
    }

    try {
      // Update just this item's priority - the backend will handle shifting others
      await updateGalleryItem(item._id, { priority: newPriority });
      
      // Refresh the list to show new ordering
      await fetchGallery();
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">Error loading gallery</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchGallery()}
              className="px-4 py-2 bg-[#2FA4C5] text-white rounded-md hover:bg-[#248DA8] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600">Manage clinic photos with drag-and-drop priority ordering</p>
          </div>
          <Link
            href="/admin/gallery/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-md hover:bg-[#248DA8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
              <span className="text-gray-600">Loading gallery...</span>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && (
          <>
            {gallery.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No images yet</h3>
                <p className="text-gray-600 mb-4">Start building your gallery by adding some clinic photos</p>
                <Link
                  href="/admin/gallery/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-md hover:bg-[#248DA8] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add First Image
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item, index) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* Image */}
                    <div className="aspect-video relative">
                      <img
                        src={item.image}
                        alt={`Gallery image ${item.priority}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                        #{item.priority}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        {/* Priority Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handlePriorityChange(item, 'up')}
                            disabled={index === 0}
                            className="p-2 text-gray-600 hover:text-[#2FA4C5] hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePriorityChange(item, 'down')}
                            disabled={index === gallery.length - 1}
                            className="p-2 text-gray-600 hover:text-[#2FA4C5] hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Edit/Delete */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deleteLoading === item._id}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleteLoading === item._id ? (
                              <div className="w-4 h-4 border border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}