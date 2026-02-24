import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  image: string; // Cloudinary URL
  priority: number; // Display order (lower number = higher priority)
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema({
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  priority: {
    type: Number,
    required: [true, 'Priority is required'],
    min: [1, 'Priority must be at least 1'],
    default: 1
  }
}, {
  timestamps: true
});

// Index for efficient querying by priority
GallerySchema.index({ priority: 1 });

// Ensure priority is unique
GallerySchema.index({ priority: 1 }, { unique: true });

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);