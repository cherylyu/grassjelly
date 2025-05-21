import { Schema, model, models } from 'mongoose';

const SubcategorySchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const CategorySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  subcategories: {
    type: [SubcategorySchema],
    default: []
  }
}, {
  timestamps: true // Automatically manage createdAt & updatedAt
});

// Avoid hot-reloading issues in dev mode
export const Category = models.Category || model('Category', CategorySchema);
