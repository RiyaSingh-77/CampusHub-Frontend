const express  = require('express');
const cors     = require('cors');
require('dotenv').config();
const eventRoutes = require('./routes/events');
const messRoutes = require('./routes/mess');
const productRoutes = require('./routes/products');
const lostFoundRoutes = require('./routes/lostFound');

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/events', eventRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/products', productRoutes);
app.use('/api/lost-found', lostFoundRoutes);
// Health check
app.get('/', (req, res) => res.json({ message: 'CampusHub API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));