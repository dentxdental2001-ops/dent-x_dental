"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { useCertificates, useImageUpload } from '@/hooks/useApi';
import { ArrowLeft, Upload, Award } from 'lucide-react';

export default function EditCertificatePage() {
  const router = useRouter();
  const params = useParams();
  const certificateId = params.id as string;
  
  const { getCertificate, updateCertificate } = useCertificates();
  const { uploadImage } = useImageUpload();
  
  const [formData, setFormData] = useState({
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load existing certificate data
  useEffect(() => {
    const loadCertificate = async () => {
      try {
        const response = await getCertificate(certificateId);
        if (response.data) {
          setFormData({
            image: response.data.image
          });
          setImagePreview(response.data.image);
        }
      } catch (error) {
        console.error('Error loading certificate:', error);
        alert('Failed to load certificate data');
        router.push('/admin/certificates');
      } finally {
        setPageLoading(false);
      }
    };

    if (certificateId) {
      loadCertificate();
    }
  }, [certificateId, getCertificate, router]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setLoading(true);
      const uploadedImage = await uploadImage(file, 'certificates');
      setFormData(prev => ({
        ...prev,
        image: uploadedImage.url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setImagePreview(formData.image); // Revert to original image
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      alert('Please upload a certificate image');
      return;
    }

    try {
      setLoading(true);
      await updateCertificate(certificateId, formData);
      router.push('/admin/certificates');
    } catch (error) {
      console.error('Error updating certificate:', error);
      alert('Failed to update certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
            <span className="text-gray-600">Loading certificate...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/admin/certificates"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Certificate</h1>
          </div>
          <p className="text-gray-600">Update the certificate image</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Image *
              </label>
              
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] max-w-md mx-auto border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Certificate preview"
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </div>
                  <div className="flex justify-center">
                    <label
                      htmlFor="image-input"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Change Image
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="image-input"
                  className="cursor-pointer block w-full max-w-md mx-auto"
                >
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2FA4C5] transition-colors">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload certificate image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              )}
              
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || !formData.image}
                className="flex-1 bg-[#2FA4C5] text-white py-2 px-4 rounded-md hover:bg-[#248DA8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Updating...' : 'Update Certificate'}
              </button>
              <Link
                href="/admin/certificates"
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
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