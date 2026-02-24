// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Testimonial Types
export interface CreateTestimonialRequest {
  description: string;
  name: string;
  role: string;
}

export interface UpdateTestimonialRequest {
  description?: string;
  name?: string;
  role?: string;
}

export interface TestimonialResponse {
  _id: string;
  description: string;
  name: string;
  role: string;
  createdAt: string;
}

// Before/After Types
export interface CreateBeforeAfterRequest {
  beforeImage: string; // Base64 image string
  afterImage: string; // Base64 image string
  treatment: string;
}

export interface UpdateBeforeAfterRequest {
  beforeImage?: string; // Base64 image string
  afterImage?: string; // Base64 image string
  treatment?: string;
}

export interface BeforeAfterResponse {
  _id: string;
  beforeImage: string;
  afterImage: string;
  treatment: string;
  createdAt: string;
  updatedAt: string;
}

// Cloudinary Types
export interface UploadImageRequest {
  image: string; // Base64 image string
  folder?: string;
  publicId?: string;
}

export interface DeleteImageRequest {
  url?: string;
  publicId?: string;
}

export interface CloudinaryResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

// Team Types
export interface CreateTeamRequest {
  name: string;
  role: string;
  startYear: number;
  image: string; // Base64 image string or URL
}

export interface UpdateTeamRequest {
  name?: string;
  role?: string;
  startYear?: number;
  image?: string; // Base64 image string or URL
}

export interface TeamResponse {
  _id: string;
  name: string;
  role: string;
  startYear: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Gallery Types
export interface CreateGalleryRequest {
  image: string; // Base64 image string or URL
  priority: number;
}

export interface UpdateGalleryRequest {
  image?: string; // Base64 image string or URL
  priority?: number;
}

export interface GalleryResponse {
  _id: string;
  image: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Health Check Types
export interface HealthCheckResponse {
  success: boolean;
  status: 'healthy' | 'partial' | 'unhealthy';
  timestamp: string;
  services: {
    mongodb: 'connected' | 'disconnected';
    cloudinary: 'connected' | 'disconnected';
  };
  environment: {
    node_env?: string;
    mongodb_configured: boolean;
    cloudinary_configured: boolean;
  };
}

// Query Parameters
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface TestimonialsQuery extends PaginationQuery {
}

export interface BeforeAfterQuery extends PaginationQuery {
  treatment?: string;
}

export interface GalleryQuery extends PaginationQuery {
}