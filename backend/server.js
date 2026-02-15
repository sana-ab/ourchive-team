const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ===== SETUP =====
// Ensure required directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir('./data');
ensureDir('./uploads');

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// ===== DATABASE HELPERS =====
const DB_FILE = './data/database.json';

function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      memories: [],
      users: [],
      stats: {
        totalMemories: 0,
        totalUsers: 0,
        createdAt: new Date().toISOString()
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readDB() {
  initDB();
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ===== ROUTES =====

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all memories
app.get('/api/memories', (req, res) => {
  try {
    const db = readDB();
    res.json(db.memories);
  } catch (error) {
    console.error('Error reading memories:', error);
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

// Get single memory
app.get('/api/memories/:id', (req, res) => {
  try {
    const db = readDB();
    const memory = db.memories.find(m => m.id === parseInt(req.params.id));
    
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    res.json(memory);
  } catch (error) {
    console.error('Error reading memory:', error);
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
});

// Create new memory
app.post('/api/memories', upload.single('image'), (req, res) => {
  try {
    const db = readDB();
    
    const newMemory = {
      id: Date.now(),
      emotion: req.body.emotion || 'Calm',
      intensity: parseInt(req.body.intensity) || 50,
      location: req.body.location || 'Unknown',
      latitude: parseFloat(req.body.latitude) || null,
      longitude: parseFloat(req.body.longitude) || null,
      timestamp: req.body.timestamp || 'Just now',
      heartRate: parseInt(req.body.heartRate) || 70,
      privacy: req.body.privacy || 'Private',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      biometrics: req.body.biometrics ? JSON.parse(req.body.biometrics) : null,
      createdAt: new Date().toISOString()
    };
    
    db.memories.unshift(newMemory);
    db.stats.totalMemories = db.memories.length;
    
    writeDB(db);
    
    res.status(201).json(newMemory);
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

// Update memory
app.put('/api/memories/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.memories.findIndex(m => m.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    db.memories[index] = {
      ...db.memories[index],
      ...req.body,
      id: parseInt(req.params.id), // Don't allow ID changes
      updatedAt: new Date().toISOString()
    };
    
    writeDB(db);
    
    res.json(db.memories[index]);
  } catch (error) {
    console.error('Error updating memory:', error);
    res.status(500).json({ error: 'Failed to update memory' });
  }
});

// Delete memory
app.delete('/api/memories/:id', (req, res) => {
  try {
    const db = readDB();
    const memory = db.memories.find(m => m.id === parseInt(req.params.id));
    
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    // Delete associated image file if exists
    if (memory.imageUrl) {
      const imagePath = path.join(__dirname, memory.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    db.memories = db.memories.filter(m => m.id !== parseInt(req.params.id));
    db.stats.totalMemories = db.memories.length;
    
    writeDB(db);
    
    res.json({ success: true, message: 'Memory deleted' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

// Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const db = readDB();
    
    const emotionCounts = {};
    let totalHeartRate = 0;
    let totalIntensity = 0;
    
    db.memories.forEach(memory => {
      emotionCounts[memory.emotion] = (emotionCounts[memory.emotion] || 0) + 1;
      totalHeartRate += memory.heartRate;
      totalIntensity += memory.intensity;
    });
    
    const stats = {
      totalMemories: db.memories.length,
      emotionBreakdown: emotionCounts,
      avgHeartRate: db.memories.length > 0 
        ? Math.round(totalHeartRate / db.memories.length) 
        : 0,
      avgIntensity: db.memories.length > 0 
        ? Math.round(totalIntensity / db.memories.length) 
        : 0,
      publicMemories: db.memories.filter(m => m.privacy === 'Public').length,
      privateMemories: db.memories.filter(m => m.privacy === 'Private').length,
      friendsMemories: db.memories.filter(m => m.privacy === 'Friends').length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

// Get memories by location (nearby)
app.get('/api/memories/nearby/:lat/:lng', (req, res) => {
  try {
    const db = readDB();
    const { lat, lng } = req.params;
    const radius = parseFloat(req.query.radius) || 10; // km
    
    const nearby = db.memories.filter(memory => {
      if (!memory.latitude || !memory.longitude) return false;
      
      // Simple distance calculation (not accurate for large distances)
      const latDiff = memory.latitude - parseFloat(lat);
      const lngDiff = memory.longitude - parseFloat(lng);
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough km
      
      return distance <= radius;
    });
    
    res.json(nearby);
  } catch (error) {
    console.error('Error finding nearby memories:', error);
    res.status(500).json({ error: 'Failed to find nearby memories' });
  }
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
  🚀 Ourchive Backend is running!
  
  📍 Local:   http://localhost:${PORT}
  📊 Health:  http://localhost:${PORT}/health
  🗄️  API:     http://localhost:${PORT}/api/memories
  
  Press Ctrl+C to stop
  `);
});
