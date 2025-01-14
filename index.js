import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { connectDB, UserModel } from './db.js';

const JWT_SECRET = "aayush";

// Connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware for Authentication
const auth = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token!" });
  }
};

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { username, name, email, password, dob, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const newUser = await UserModel.create({ username, name, email, password, dob, role });
    res.status(201).json({ message: "Signup successful!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username, password });
    if (!user) {
      return res.status(403).json({ message: "Incorrect credentials!" });
    }

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful!", token });
  } catch (err) {
    res.status(500).json({ message: "Error during login", error: err.message });
  }
});

// Get User Info Endpoint (Protected)
app.get('/me', auth, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data", error: err.message });
  }
});

// 404 Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found!" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
