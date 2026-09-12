import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initialServices, initialMistris } from '../utils/mockData.js';
import Service from '../models/Service.js';
import Mistri from '../models/Mistri.js';
import User from '../models/User.js';

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mistri_db');

    console.log('🧹 Clearing existing collections...');
    await Service.deleteMany();
    await Mistri.deleteMany();

    console.log('🌱 Seeding services...');
    await Service.insertMany(
      initialServices.map((s) => {
        const { _id, ...rest } = s;
        return rest;
      })
    );

    console.log('✅ Services seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mistri_db');

    await Service.deleteMany();
    await Mistri.deleteMany();
    await User.deleteMany();

    console.log('🗑️ Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data destroy: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
