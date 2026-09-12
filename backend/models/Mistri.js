import mongoose from 'mongoose';

const mistriSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
      enum: ['Master Plumber', 'Senior Electrician', 'Expert Carpenter', 'HVAC & AC Technician', 'House Painter', 'Appliance Specialist', 'General Handyman'],
    },
    specializations: [
      {
        type: String,
      },
    ],
    experienceYears: {
      type: Number,
      required: true,
      default: 3,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Mumbai',
    },
    serviceAreas: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 24,
    },
    jobsCompleted: {
      type: Number,
      default: 120,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
      default: 'Certified professional technician with extensive hands-on experience in residential and commercial repairs.',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
  },
  {
    timestamps: true,
  }
);

const Mistri = mongoose.model('Mistri', mistriSchema);
export default Mistri;
