# Dent-X Dental Backend API Documentation

This document outlines all the available API endpoints for the Dent-X Dental application backend.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required for these endpoints. In production, you should add proper authentication and authorization.

## Common Response Format

All API responses follow this structure:
```json
{
  "success": boolean,
  "data": any, // Only present on success
  "error": string, // Only present on errors
  "message": string // Optional additional message
}
```

## Pagination Format

For endpoints that support pagination:
```json
{
  "success": true,
  "data": {
    "items": [...], // Array of items
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

## Testimonials API

### 1. Get All Testimonials
**GET** `/api/testimonials`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `approved` (optional): Filter by approval status ("true" or "false")

**Example:**
```
GET /api/testimonials?page=1&limit=5&approved=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "testimonials": [
      {
        "_id": "65f1234567890abcdef12345",
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Amazing service!",
        "rating": 5,
        "avatar": "https://res.cloudinary.com/...",
        "approved": true,
        "createdAt": "2024-02-21T10:30:00.000Z",
        "updatedAt": "2024-02-21T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 15,
      "pages": 3
    }
  }
}
```

### 2. Create New Testimonial
**POST** `/api/testimonials`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", // optional
  "message": "Amazing dental service! Highly recommended.",
  "rating": 5,
  "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..." // optional base64 image
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Amazing dental service! Highly recommended.",
    "rating": 5,
    "avatar": "https://res.cloudinary.com/dch7lgd9k/image/upload/v1234567890/testimonials/avatars/avatar_1234567890.jpg",
    "approved": false,
    "createdAt": "2024-02-21T10:30:00.000Z",
    "updatedAt": "2024-02-21T10:30:00.000Z"
  }
}
```

### 3. Get Single Testimonial
**GET** `/api/testimonials/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    // ... other testimonial fields
  }
}
```

### 4. Update Testimonial
**PUT** `/api/testimonials/{id}`

**Request Body:**
```json
{
  "name": "John Smith", // optional
  "message": "Updated message", // optional
  "approved": true, // optional - for admin approval
  "avatar": "data:image/jpeg;base64,..." // optional - new avatar
}
```

### 5. Delete Testimonial
**DELETE** `/api/testimonials/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Testimonial deleted successfully"
}
```

---

## Before/After Pictures API

### 1. Get All Before/After Pictures
**GET** `/api/before-after`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `published` (optional): Filter by published status ("true" or "false")
- `treatment` (optional): Filter by treatment type

**Example:**
```
GET /api/before-after?page=1&limit=5&published=true&treatment=whitening
```

**Response:**
```json
{
  "success": true,
  "data": {
    "beforeAfters": [
      {
        "_id": "65f1234567890abcdef12346",
        "title": "Teeth Whitening Transformation",
        "description": "Patient saw amazing results after 2 weeks",
        "beforeImage": "https://res.cloudinary.com/dch7lgd9k/image/upload/...",
        "afterImage": "https://res.cloudinary.com/dch7lgd9k/image/upload/...",
        "treatment": "Teeth Whitening",
        "patientAge": 35,
        "treatmentDuration": "2 weeks",
        "published": true,
        "createdAt": "2024-02-21T10:30:00.000Z",
        "updatedAt": "2024-02-21T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 8,
      "pages": 2
    }
  }
}
```

### 2. Create Before/After Record
**POST** `/api/before-after`

**Request Body:**
```json
{
  "title": "Teeth Whitening Results",
  "description": "Patient achieved amazing results", // optional
  "beforeImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...", // base64 image
  "afterImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...", // base64 image
  "treatment": "Teeth Whitening",
  "patientAge": 35, // optional
  "treatmentDuration": "2 weeks" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12346",
    "title": "Teeth Whitening Results",
    "description": "Patient achieved amazing results",
    "beforeImage": "https://res.cloudinary.com/dch7lgd9k/image/upload/v1234567890/before-after/before/before_1234567890.jpg",
    "afterImage": "https://res.cloudinary.com/dch7lgd9k/image/upload/v1234567890/before-after/after/after_1234567890.jpg",
    "treatment": "Teeth Whitening",
    "patientAge": 35,
    "treatmentDuration": "2 weeks",
    "published": false,
    "createdAt": "2024-02-21T10:30:00.000Z",
    "updatedAt": "2024-02-21T10:30:00.000Z"
  }
}
```

### 3. Get Single Before/After Record
**GET** `/api/before-after/{id}`

### 4. Update Before/After Record
**PUT** `/api/before-after/{id}`

**Request Body:**
```json
{
  "title": "Updated Title", // optional
  "published": true, // optional
  "beforeImage": "data:image/jpeg;base64,....." // optional - new before image
  // ... other optional fields
}
```

### 5. Delete Before/After Record
**DELETE** `/api/before-after/{id}`

---

## Image Upload API

### 1. Upload Single Image
**POST** `/api/upload`

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "folder": "custom-folder", // optional
  "publicId": "custom-id" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/dch7lgd9k/image/upload/v1234567890/uploads/image.jpg",
    "publicId": "uploads/image",
    "format": "jpg",
    "width": 800,
    "height": 600,
    "bytes": 45620
  }
}
```

### 2. Delete Image
**DELETE** `/api/upload`

**Request Body:**
```json
{
  "url": "https://res.cloudinary.com/dch7lgd9k/image/upload/v1234567890/uploads/image.jpg"
}
```

OR

```json
{
  "publicId": "uploads/image"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "ok"
  },
  "message": "Image deleted successfully"
}
```

---

## Health Check API

### Check System Health
**GET** `/api/health`

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-02-21T10:30:00.000Z",
  "services": {
    "mongodb": "connected",
    "cloudinary": "connected"
  },
  "environment": {
    "node_env": "development",
    "mongodb_configured": true,
    "cloudinary_configured": true
  }
}
```

---

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created successfully
- `400`: Bad request (validation error)
- `404`: Resource not found
- `500`: Internal server error
- `503`: Service unavailable (health check)

---

## Image Format Requirements

**Supported formats:** JPEG, PNG, GIF, WebP
**Maximum file size:** 10MB (configurable in Cloudinary)
**Recommended resolution:** 
- Avatars: 300x300px
- Before/After images: 800x600px or higher

**Base64 format:**
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
```

---

## Testing the APIs

You can test these APIs using:
1. **Postman** - Import the endpoints and test with sample data
2. **curl** commands
3. **Frontend forms** - Create React components to interact with these APIs

Example curl command:
```bash
# Get all testimonials
curl -X GET "http://localhost:3000/api/testimonials?page=1&limit=5"

# Create a new testimonial
curl -X POST "http://localhost:3000/api/testimonials" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "message": "Great service!",
    "rating": 5
  }'
```

---

## Next Steps

1. **Authentication**: Add JWT-based authentication for admin operations
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Validation**: Add comprehensive input validation and sanitization
4. **File Size Limits**: Configure appropriate file size limits
5. **Caching**: Add Redis caching for frequently accessed data
6. **Logging**: Implement comprehensive logging and monitoring