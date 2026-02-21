import mongoose, { Schema, Document } from 'mongoose';

export interface IBeforeAfter extends Document {
  beforeImage: string; // Cloudinary URL
  afterImage: string; // Cloudinary URL
  treatment: string;
  createdAt: Date;
  updatedAt: Date;
}

const BeforeAfterSchema: Schema = new Schema({
  beforeImage: {
    type: String,
    required: [true, 'Before image is required']
  },
  afterImage: {
    type: String,
    required: [true, 'After image is required']
  },
  treatment: {
    type: String,
    required: [true, 'Treatment type is required'],
    trim: true,
    maxlength: [100, 'Treatment cannot be more than 100 characters']
  }
}, {
  timestamps: true
});

export default mongoose.models.BeforeAfter || mongoose.model<IBeforeAfter>('BeforeAfter', BeforeAfterSchema);