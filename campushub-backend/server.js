const express  = require('express');
const cors     = require('cors');
require('dotenv').config();
const eventRoutes = require('./routes/events');


const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/events', eventRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'CampusHub API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));