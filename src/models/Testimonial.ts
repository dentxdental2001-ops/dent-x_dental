import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  description: string;
  name: string;
  role: string;
  createdAt: Date;
}

const TestimonialSchema: Schema = new Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [50, 'Role cannot be more than 50 characters']
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);