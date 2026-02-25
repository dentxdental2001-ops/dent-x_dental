import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  role: string;
  startYear: number;
  image: string; // Cloudinary URL
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema({
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
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  startYear: {
    type: Number,
    required: [true, 'Start year is required'],
    min: [1980, 'Start year must be after 1980'],
    max: [new Date().getFullYear(), 'Start year cannot be in the future']
  },
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

// Index for efficient querying
TeamSchema.index({ name: 1 });
TeamSchema.index({ role: 1 });
TeamSchema.index({ startYear: 1 });
TeamSchema.index({ priority: 1 });

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);