import mongoose from 'mongoose';

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/newark_dashboard';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    role: { type: String, enum: ['Government', 'ServiceProvider', 'Participant'], required: true },
  },
  { timestamps: true }
);

// User Model
export const UserModel = mongoose.model('User', userSchema);
