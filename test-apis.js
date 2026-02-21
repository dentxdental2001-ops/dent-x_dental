// Test utility for API endpoints
// Run this file with: node test-apis.js

const BASE_URL = 'http://localhost:3000/api';

// Sample base64 image (1x1 pixel PNG for testing)
const SAMPLE_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// Test data
const sampleTestimonial = {
  description: 'Very friendly staff and painless treatment. Highly recommended clinic in Rajkot.',
  name: 'Rohit Patel',
  role: 'Patient'
};

const sampleBeforeAfter = {
  title: 'Teeth Whitening Results - Test Case',
  description: 'Patient achieved excellent results after professional whitening treatment.',
  beforeImage: SAMPLE_IMAGE,
  afterImage: SAMPLE_IMAGE,
  treatment: 'Professional Teeth Whitening'
};

// HTTP request helper
async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      status: response.status,
      data,
      ok: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message,
      ok: false
    };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing Health Check...');
  const result = await apiRequest('/health');
  
  if (result.ok) {
    console.log('✅ Health check passed');
    console.log('   Status:', result.data.status);
    console.log('   MongoDB:', result.data.services.mongodb);
    console.log('   Cloudinary:', result.data.services.cloudinary);
  } else {
    console.log('❌ Health check failed:', result.data.error || result.error);
  }
  console.log('');
}

async function testTestimonials() {
  console.log('🔍 Testing Testimonials API...');
  
  // Test CREATE
  console.log('   Creating testimonial...');
  const createResult = await apiRequest('/testimonials', 'POST', sampleTestimonial);
  if (createResult.ok) {
    console.log('   ✅ Testimonial created successfully');
    const testimonialId = createResult.data.data._id;
    
    // Test READ
    console.log('   Reading testimonials...');
    const readResult = await apiRequest('/testimonials?limit=5');
    if (readResult.ok) {
      console.log(`   ✅ Found ${readResult.data.data.testimonials.length} testimonials`);
    } else {
      console.log('   ❌ Failed to read testimonials:', readResult.data.error);
    }
    
    // Test UPDATE
    console.log('   Updating testimonial...');
    const updateData = { role: 'Long-term Patient' };
    const updateResult = await apiRequest(`/testimonials/${testimonialId}`, 'PUT', updateData);
    if (updateResult.ok) {
      console.log('   ✅ Testimonial updated successfully');
    } else {
      console.log('   ❌ Failed to update testimonial:', updateResult.data.error);
    }
    
    // Test DELETE
    console.log('   Deleting testimonial...');
    const deleteResult = await apiRequest(`/testimonials/${testimonialId}`, 'DELETE');
    if (deleteResult.ok) {
      console.log('   ✅ Testimonial deleted successfully');
    } else {
      console.log('   ❌ Failed to delete testimonial:', deleteResult.data.error);
    }
    
  } else {
    console.log('   ❌ Failed to create testimonial:', createResult.data.error || createResult.error);
  }
  console.log('');
}

async function testBeforeAfter() {
  console.log('🔍 Testing Before/After API...');
  
  // Test CREATE
  console.log('   Creating before/after record...');
  const createResult = await apiRequest('/before-after', 'POST', sampleBeforeAfter);
  if (createResult.ok) {
    console.log('   ✅ Before/After record created successfully');
    const recordId = createResult.data.data._id;
    
    // Test READ
    console.log('   Reading before/after records...');
    const readResult = await apiRequest('/before-after?limit=5');
    if (readResult.ok) {
      console.log(`   ✅ Found ${readResult.data.data.beforeAfters.length} before/after records`);
    } else {
      console.log('   ❌ Failed to read before/after records:', readResult.data.error);
    }
    
    // Test UPDATE
    console.log('   Updating before/after record...');
    const updateData = { title: 'Updated Whitening Results' };
    const updateResult = await apiRequest(`/before-after/${recordId}`, 'PUT', updateData);
    if (updateResult.ok) {
      console.log('   ✅ Before/After record updated successfully');
    } else {
      console.log('   ❌ Failed to update before/after record:', updateResult.data.error);
    }
    
    // Test DELETE
    console.log('   Deleting before/after record...');
    const deleteResult = await apiRequest(`/before-after/${recordId}`, 'DELETE');
    if (deleteResult.ok) {
      console.log('   ✅ Before/After record deleted successfully');
    } else {
      console.log('   ❌ Failed to delete before/after record:', deleteResult.data.error);
    }
    
  } else {
    console.log('   ❌ Failed to create before/after record:', createResult.data.error || createResult.error);
  }
  console.log('');
}

async function testImageUpload() {
  console.log('🔍 Testing Image Upload API...');
  
  // Test UPLOAD
  console.log('   Uploading image...');
  const uploadData = {
    image: SAMPLE_IMAGE,
    folder: 'test-uploads'
  };
  const uploadResult = await apiRequest('/upload', 'POST', uploadData);
  if (uploadResult.ok) {
    console.log('   ✅ Image uploaded successfully');
    console.log('   URL:', uploadResult.data.data.url);
    
    // Test DELETE
    console.log('   Deleting image...');
    const deleteData = {
      publicId: uploadResult.data.data.publicId
    };
    const deleteResult = await apiRequest('/upload', 'DELETE', deleteData);
    if (deleteResult.ok) {
      console.log('   ✅ Image deleted successfully');
    } else {
      console.log('   ❌ Failed to delete image:', deleteResult.data.error);
    }
    
  } else {
    console.log('   ❌ Failed to upload image:', uploadResult.data.error || uploadResult.error);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  await testHealthCheck();
  await testTestimonials();
  await testBeforeAfter();
  await testImageUpload();
  
  console.log('✨ All tests completed!');
}

// Check if running directly
if (typeof window === 'undefined' && require.main === module) {
  // Add fetch polyfill for Node.js
  global.fetch = require('node-fetch');
  runAllTests();
}

module.exports = {
  testHealthCheck,
  testTestimonials,
  testBeforeAfter,
  testImageUpload,
  runAllTests,
  sampleTestimonial,
  sampleBeforeAfter
};