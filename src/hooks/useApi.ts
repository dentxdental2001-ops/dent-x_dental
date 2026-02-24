import { useState, useEffect } from 'react';
import type {
  TestimonialResponse,
  BeforeAfterResponse,
  TeamResponse,
  GalleryResponse,
  CreateTestimonialRequest,
  CreateBeforeAfterRequest,
  CreateTeamRequest,
  CreateGalleryRequest,
  UpdateTestimonialRequest,
  UpdateBeforeAfterRequest,
  UpdateTeamRequest,
  UpdateGalleryRequest,
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

// Team API hook
export function useTeam() {
  const { apiRequest, loading, error } = useApi();
  const [team, setTeam] = useState<TeamResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchTeam = async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await apiRequest<PaginationResponse<TeamResponse>>(
        `/team?${queryParams.toString()}`
      );
      
      setTeam(response.data.team);
      setPagination(response.data.pagination);
      return response;
    } catch (err) {
      console.error('Error fetching team members:', err);
      throw err;
    }
  };

  const createTeamMember = async (data: CreateTeamRequest) => {
    try {
      const response = await apiRequest<TeamResponse>('/team', 'POST', data);
      // Refresh the list after creating
      await fetchTeam();
      return response;
    } catch (err) {
      console.error('Error creating team member:', err);
      throw err;
    }
  };

  const updateTeamMember = async (id: string, data: UpdateTeamRequest) => {
    try {
      const response = await apiRequest<TeamResponse>(`/team/${id}`, 'PUT', data);
      // Refresh the list after updating
      await fetchTeam();
      return response;
    } catch (err) {
      console.error('Error updating team member:', err);
      throw err;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const response = await apiRequest(`/team/${id}`, 'DELETE');
      // Refresh the list after deleting
      await fetchTeam();
      return response;
    } catch (err) {
      console.error('Error deleting team member:', err);
      throw err;
    }
  };

  const getTeamMember = async (id: string) => {
    try {
      const response = await apiRequest<TeamResponse>(`/team/${id}`);
      return response;
    } catch (err) {
      console.error('Error fetching team member:', err);
      throw err;
    }
  };

  return {
    team,
    pagination,
    loading,
    error,
    fetchTeam,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMember
  };
}

// Gallery hook
export function useGallery() {
  const { apiRequest, loading, error } = useApi();
  const [gallery, setGallery] = useState<GalleryResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchGallery = async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/gallery?${queryString}` : '/gallery';
      
      const response = await apiRequest<{
        gallery: GalleryResponse[];
        pagination: typeof pagination;
      }>(endpoint);

      if (response.data) {
        setGallery(response.data.gallery);
        setPagination(response.data.pagination);
      }

      return response;
    } catch (err) {
      console.error('Error fetching gallery:', err);
      throw err;
    }
  };

  const createGalleryItem = async (data: CreateGalleryRequest) => {
    try {
      const response = await apiRequest<GalleryResponse>('/gallery', 'POST', data);

      if (response.data) {
        setGallery(prev => [...prev, response.data]);
      }

      return response;
    } catch (err) {
      console.error('Error creating gallery item:', err);
      throw err;
    }
  };

  const updateGalleryItem = async (id: string, data: UpdateGalleryRequest) => {
    try {
      const response = await apiRequest<GalleryResponse>(`/gallery/${id}`, 'PUT', data);

      if (response.data) {
        setGallery(prev => 
          prev.map(item => item._id === id ? response.data : item)
        );
      }

      return response;
    } catch (err) {
      console.error('Error updating gallery item:', err);
      throw err;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const response = await apiRequest<GalleryResponse>(`/gallery/${id}`, 'DELETE');

      if (response.success) {
        setGallery(prev => prev.filter(item => item._id !== id));
      }

      return response;
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      throw err;
    }
  };

  const getGalleryItem = async (id: string) => {
    try {
      const response = await apiRequest<GalleryResponse>(`/gallery/${id}`);
      return response;
    } catch (err) {
      console.error('Error fetching gallery item:', err);
      throw err;
    }
  };

  return {
    gallery,
    pagination,
    loading,
    error,
    fetchGallery,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    getGalleryItem
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