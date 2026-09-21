import { createAppModel, Mixed } from './appModel.js';

// Technicians (mistris) listed on the platform.
const Mistri = createAppModel('Mistri', {
  collection: 'mistris',
  fields: {
    fullName: { type: String, trim: true },
    profession: Mixed,
    specializations: [Mixed],
    experienceYears: Mixed,
    hourlyRate: Mixed,
    city: Mixed,
    serviceAreas: [Mixed],
    rating: Mixed,
    jobsCompleted: Mixed,
    isVerified: Mixed,
    isAvailable: Mixed,
    phone: Mixed,
    avatar: Mixed,
    bio: Mixed,
  },
});

export default Mistri;
