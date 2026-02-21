import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

/**
 * Upload an image to Cloudinary
 * @param file - The image file (base64 string or buffer)
 * @param folder - The folder to upload to (optional)
 * @param publicId - Custom public ID (optional)
 * @returns Promise with upload result including URL
 */
export const uploadToCloudinary = async (
  file: string | Buffer,
  folder?: string,
  publicId?: string
): Promise<CloudinaryUploadResult> => {
  try {
    const uploadOptions: any = {
      resource_type: 'image',
      folder: folder || 'dent-x-dental',
      quality: 'auto',
      fetch_format: 'auto',
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(file.toString(), uploadOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      created_at: result.created_at,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Upload failed: ${error}`);
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error(`Delete failed: ${error}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public ID
 */
export const extractPublicIdFromUrl = (url: string): string => {
  try {
    // Extract public ID from URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567/folder/image.jpg
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) throw new Error('Invalid Cloudinary URL');
    
    // Get everything after 'upload' and version (if exists)
    let pathAfterUpload = parts.slice(uploadIndex + 1).join('/');
    
    // Remove version if exists (starts with 'v' followed by numbers)
    if (pathAfterUpload.match(/^v\d+\//)) {
      pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
    }
    
    // Remove file extension
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    throw new Error('Failed to extract public ID from URL');
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of image files
 * @param folder - The folder to upload to
 * @returns Promise with array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files: (string | Buffer)[],
  folder?: string
): Promise<CloudinaryUploadResult[]> => {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadToCloudinary(file, folder, `${Date.now()}_${index}`)
    );
    
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw new Error(`Multiple upload failed: ${error}`);
  }
};

export default cloudinary;