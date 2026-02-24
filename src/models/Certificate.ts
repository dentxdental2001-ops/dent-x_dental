import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  image: string; // Cloudinary URL
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema({
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  priority: {
    type: Number,
    required: [true, 'Priority is required'],
    min: [1, 'Priority must be at least 1']
  }
}, {
  timestamps: true
});

// Index for efficient querying by priority
CertificateSchema.index({ priority: 1 });

export default mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);