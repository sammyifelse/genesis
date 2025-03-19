import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import csvParser from 'csv-parser';
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agents.js';
import taskRoutes from './routes/tasks.js';

dotenv.config(); // Load .env file

const app = express();

// ✅ Check if MONGODB_URI is Loaded
if (!process.env.MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in .env file");
  process.exit(1);
} else {
  console.log("✅ MONGODB_URI loaded successfully");
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 🔹 Configure Multer to Store File in Memory
const upload = multer({ storage: multer.memoryStorage() });

// 🔹 File Upload Route (Without Storing Files)
app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log('📂 Received file upload request.');

    // ✅ Check if a File is Received
    if (!req.file) {
        console.error('❌ No file received by Multer');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('✅ Uploaded file details:', req.file);

    const results = [];
    const fileBuffer = req.file.buffer.toString(); // Convert Buffer to String

    // 🔹 Read and Parse CSV Data
    const rows = fileBuffer.split('\n'); // Split by new lines

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        const values = row.split(','); // Split by comma
        results.push(values);
        console.log(`🟢 CSV Row ${index}:`, values);
    });

    console.log('✅ CSV parsing completed:', results);
    res.json({ message: 'File uploaded successfully', data: results });
});

// 🔹 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/tasks', taskRoutes);

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
