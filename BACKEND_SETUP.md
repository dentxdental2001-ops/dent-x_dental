# Dent-X Dental Backend Setup

This guide covers the complete backend setup for the Dent-X Dental application, including testimonials and before/after pictures management with Cloudinary integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Git

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd dent-x_dental
   npm install
   ```

2. **Configure environment variables:**
   
   Make sure your `.env.local` file contains:
   ```env
   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_PRESET=saree_demo
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dch7lgd9k
   NEXT_CLOUDINARY_API_KEY=156835821966131
   NEXT_CLOUDINARY_API_SECRET=LEfPY3U0vd2Eu_0ium35Do2AYEw

   # Database Configuration
   MONGODB_URI=mongodb+srv://devpateldp1718_db_user:Dev_Patel_2012@gauravstudio.rj7q9js.mongodb.net/dent-x-dental?retryWrites=true&w=majority
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Test the setup:**
   ```bash
   # Test health check
   curl http://localhost:3000/api/health

   # Or run the comprehensive test script
   npm install node-fetch  # If not already installed
   node test-apis.js
   ```

## 📁 Project Structure

```
src/
├── app/
│   └── api/
│       ├── testimonials/         # Testimonials CRUD endpoints
│       │   ├── route.ts         # GET, POST /testimonials
│       │   └── [id]/
│       │       └── route.ts     # GET, PUT, DELETE /testimonials/:id
│       ├── before-after/        # Before/After pictures CRUD
│       │   ├── route.ts         # GET, POST /before-after
│       │   └── [id]/
│       │       └── route.ts     # GET, PUT, DELETE /before-after/:id
│       ├── upload/              # Image upload/delete utilities
│       │   └── route.ts         # POST, DELETE /upload
│       └── health/              # System health check
│           └── route.ts         # GET /health
├── lib/
│   ├── mongodb.ts              # Database connection utility
│   └── cloudinary.ts           # Cloudinary operations
├── models/
│   ├── Testimonial.ts          # Testimonial model/schema
│   └── BeforeAfter.ts          # Before/After model/schema
├── types/
│   └── api.ts                  # TypeScript type definitions
└── hooks/
    └── useApi.ts               # React hooks for API integration
```

## 🗃️ Database Models

### Testimonial Schema
```typescript
{
  name: string (required, max 100 chars)
  email: string (optional, validated email)
  message: string (required, max 1000 chars)
  rating: number (required, 1-5 range)
  avatar: string (optional, Cloudinary URL)
  approved: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

### Before/After Schema
```typescript
{
  title: string (required, max 200 chars)
  description: string (optional, max 1000 chars)
  beforeImage: string (required, Cloudinary URL)
  afterImage: string (required, Cloudinary URL)
  treatment: string (required, max 100 chars)
  patientAge: number (optional, 1-120 range)
  treatmentDuration: string (optional, max 50 chars)
  published: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

## 🌐 API Endpoints

### Health Check
- **GET** `/api/health` - Check system status

### Testimonials
- **GET** `/api/testimonials` - List testimonials (with pagination)
- **POST** `/api/testimonials` - Create new testimonial
- **GET** `/api/testimonials/:id` - Get single testimonial
- **PUT** `/api/testimonials/:id` - Update testimonial
- **DELETE** `/api/testimonials/:id` - Delete testimonial

### Before/After Pictures
- **GET** `/api/before-after` - List before/after records
- **POST** `/api/before-after` - Create new record
- **GET** `/api/before-after/:id` - Get single record
- **PUT** `/api/before-after/:id` - Update record
- **DELETE** `/api/before-after/:id` - Delete record

### Image Upload
- **POST** `/api/upload` - Upload image to Cloudinary
- **DELETE** `/api/upload` - Delete image from Cloudinary

## 🔧 Usage Examples

### Creating a Testimonial
```bash
curl -X POST http://localhost:3000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Excellent service!",
    "rating": 5
  }'
```

### Uploading Before/After Images
```bash
curl -X POST http://localhost:3000/api/before-after \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teeth Whitening Results",
    "beforeImage": "data:image/jpeg;base64,...",
    "afterImage": "data:image/jpeg;base64,...",
    "treatment": "Professional Whitening"
  }'
```

## 🎨 Frontend Integration

### Using React Hooks
```typescript
import { useTestimonials, useBeforeAfter } from '@/hooks/useApi';

function AdminPanel() {
  const {
    testimonials,
    loading,
    fetchTestimonials,
    approveTestimonial
  } = useTestimonials();

  const {
    beforeAfters,
    createBeforeAfter,
    publishBeforeAfter
  } = useBeforeAfter();

  // Use the hooks in your components
  useEffect(() => {
    fetchTestimonials({ approved: false }); // Get pending testimonials
  }, []);

  return (
    // Your admin UI components
  );
}
```

### File Upload Example
```typescript
import { useImageUpload } from '@/hooks/useApi';

function ImageUploader() {
  const { uploadImage, loading, error } = useImageUpload();

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadImage(file, 'testimonials');
      console.log('Uploaded:', result.url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
      }}
    />
  );
}
```

## 🧪 Testing

### Run API Tests
```bash
# Install test dependencies
npm install node-fetch

# Run comprehensive test suite
node test-apis.js
```

### Manual Testing with curl
```bash
# Health check
curl http://localhost:3000/api/health

# List testimonials
curl "http://localhost:3000/api/testimonials?page=1&limit=5&approved=true"

# List before/after records
curl "http://localhost:3000/api/before-after?published=true"
```

## 📚 Features

### ✅ Implemented
- **CRUD Operations** - Full Create, Read, Update, Delete for both collections
- **Image Upload** - Cloudinary integration with automatic URL generation
- **Image Management** - Delete images from Cloudinary when records are deleted
- **Pagination** - Built-in pagination for all list endpoints
- **Filtering** - Filter by approval status, publication status, treatment type
- **Validation** - Comprehensive input validation and error handling
- **Type Safety** - Full TypeScript support with proper type definitions
- **Error Handling** - Consistent error responses and logging
- **Health Checks** - System health monitoring endpoint

### 🎯 Ready for Admin UI
- **React Hooks** - Pre-built hooks for easy frontend integration
- **File Upload** - Support for drag-and-drop file uploads
- **State Management** - Automatic state updates after API calls
- **Error Handling** - Built-in error states for UI feedback
- **Loading States** - Loading indicators for better UX

## 🔐 Security Considerations (TODO)

For production deployment, consider adding:
- **Authentication** - JWT-based admin authentication
- **Rate Limiting** - Prevent API abuse
- **Input Sanitization** - Additional input cleaning
- **CORS Configuration** - Proper CORS setup
- **File Size Limits** - Enforce upload limits
- **Image Optimization** - Automatic image compression

## 📈 Performance Tips

- Use pagination for large datasets
- Implement caching for frequently accessed data
- Optimize Cloudinary transformations
- Monitor database performance
- Add proper database indexes

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your MONGODB_URI in `.env.local`
   - Ensure IP whitelist includes your current IP

2. **Cloudinary Upload Failed**
   - Verify Cloudinary credentials in `.env.local`
   - Check image format and size limits

3. **API 500 Errors**
   - Check server logs for detailed error messages
   - Run health check endpoint to verify service status

4. **CORS Issues**
   - Ensure Next.js API routes are being called from same domain
   - Check browser network tab for actual error messages

## 📞 Support

For questions or issues:
1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Run the health check endpoint
3. Review server logs
4. Test with the provided test script

---

**Next Steps**: Once you've tested the APIs and confirmed they're working, proceed with building the admin UI components for managing testimonials and before/after pictures.