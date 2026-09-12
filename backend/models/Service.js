import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide service title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Plumbing', 'Electrical', 'Carpentry', 'AC Repair', 'Painting', 'Appliance Repair', 'Cleaning', 'Masonry'],
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide base price in INR'],
    },
    durationHours: {
      type: Number,
      default: 1,
    },
    icon: {
      type: String,
      default: 'Wrench',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    },
    features: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
