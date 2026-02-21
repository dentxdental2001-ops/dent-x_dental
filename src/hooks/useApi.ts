import { useState, useEffect } from 'react';
import type {
  TestimonialResponse,
  BeforeAfterResponse,
  CreateTestimonialRequest,
  CreateBeforeAfterRequest,
  UpdateTestimonialRequest,
  UpdateBeforeAfterRequest,
  ApiResponse,
  PaginationResponse,
  CloudinaryResponse
} from '@/types/api';

const BASE_URL = '/api';

// Generic API hook
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { apiRequest, loading, error };
}

// Testimonials API hook
export function useTestimonials() {
  const { apiRequest, loading, error } = useApi();
  const [testimonials, setTestimonials] = useState<TestimonialResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchTestimonials = async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await apiRequest<PaginationResponse<TestimonialResponse>>(
        `/testimonials?${queryParams.toString()}`
      );
      
      setTestimonials(response.data.testimonials);
      setPagination(response.data.pagination);
      return response;
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      throw err;
    }
  };

  const createTestimonial = async (data: CreateTestimonialRequest) => {
    try {
      const response = await apiRequest<TestimonialResponse>('/testimonials', 'POST', data);
      // Refresh the list after creating
      await fetchTestimonials();
      return response;
    } catch (err) {
      console.error('Error creating testimonial:', err);
      throw err;
    }
  };

  const updateTestimonial = async (id: string, data: UpdateTestimonialRequest) => {
    try {
      const response = await apiRequest<TestimonialResponse>(`/testimonials/${id}`, 'PUT', data);
      // Refresh the list after updating
      await fetchTestimonials();
      return response;
    } catch (err) {
      console.error('Error updating testimonial:', err);
      throw err;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const response = await apiRequest(`/testimonials/${id}`, 'DELETE');
      // Refresh the list after deleting
      await fetchTestimonials();
      return response;
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      throw err;
    }
  };

  return {
    testimonials,
    pagination,
    loading,
    error,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
}

// Before/After API hook
export function useBeforeAfter() {
  const { apiRequest, loading, error } = useApi();
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfterResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchBeforeAfters = async (params?: {
    page?: number;
    limit?: number;
    treatment?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.treatment) queryParams.append('treatment', params.treatment);

      const response = await apiRequest<PaginationResponse<BeforeAfterResponse>>(
        `/before-after?${queryParams.toString()}`
      );
      
      setBeforeAfters(response.data.beforeAfters);
      setPagination(response.data.pagination);
      return response;
    } catch (err) {
      console.error('Error fetching before/after records:', err);
      throw err;
    }
  };

  const createBeforeAfter = async (data: CreateBeforeAfterRequest) => {
    try {
      const response = await apiRequest<BeforeAfterResponse>('/before-after', 'POST', data);
      // Refresh the list after creating
      await fetchBeforeAfters();
      return response;
    } catch (err) {
      console.error('Error creating before/after record:', err);
      throw err;
    }
  };

  const updateBeforeAfter = async (id: string, data: UpdateBeforeAfterRequest) => {
    try {
      const response = await apiRequest<BeforeAfterResponse>(`/before-after/${id}`, 'PUT', data);
      // Refresh the list after updating
      await fetchBeforeAfters();
      return response;
    } catch (err) {
      console.error('Error updating before/after record:', err);
      throw err;
    }
  };

  const deleteBeforeAfter = async (id: string) => {
    try {
      const response = await apiRequest(`/before-after/${id}`, 'DELETE');
      // Refresh the list after deleting
      await fetchBeforeAfters();
      return response;
    } catch (err) {
      console.error('Error deleting before/after record:', err);
      throw err;
    }
  };

  return {
    beforeAfters,
    pagination,
    loading,
    error,
    fetchBeforeAfters,
    createBeforeAfter,
    updateBeforeAfter,
    deleteBeforeAfter
  };
}

// Image upload hook
export function useImageUpload() {
  const { apiRequest, loading, error } = useApi();

  const uploadImage = async (
    imageFile: File | string,
    folder?: string,
    publicId?: string
  ): Promise<CloudinaryResponse> => {
    try {
      let imageData: string;
      
      if (typeof imageFile === 'string') {
        imageData = imageFile;
      } else {
        // Convert File to base64
        imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const response = await apiRequest<CloudinaryResponse>('/upload', 'POST', {
        image: imageData,
        folder,
        publicId
      });

      return response.data;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  };

  const deleteImage = async (urlOrPublicId: string) => {
    try {
      const isUrl = urlOrPublicId.startsWith('http');
      const response = await apiRequest('/upload', 'DELETE', {
        [isUrl ? 'url' : 'publicId']: urlOrPublicId
      });

      return response;
    } catch (err) {
      console.error('Error deleting image:', err);
      throw err;
    }
  };

  return {
    uploadImage,
    deleteImage,
    loading,
    error
  };
}

// Utility function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};