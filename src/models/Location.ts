import { Schema, model, models } from 'mongoose';

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
});

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    ref: 'Category' // Associate with Category model
  },
  description: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  },
  glink: {
    type: String,
    default: ""
  },
  location: {
    type: PointSchema,
    required: true,
    index: '2dsphere' // For geospatial queries
  }
}, {
  timestamps: true // Automatically manage createdAt & updatedAt
});

// Avoid hot-reloading issues in dev mode
export const Location = models.Location || model('Location', LocationSchema);
