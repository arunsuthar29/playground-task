const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const { calculatePrice, hasConflict, validateBookingTime } = require('./config/helper');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// API Routes
// ============================================

// Get all rooms
app.get('/api/rooms', (req, res) => {
  res.json(db.rooms);
});

// Get room by ID
app.get('/api/rooms/:id', (req, res) => {
  const room = db.rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

// Create a booking
app.post('/api/bookings', (req, res) => {
  const { roomId, userName, startTime, endTime } = req.body;
  
  // Validation
  if (!roomId || !userName || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields: roomId, userName, startTime, endTime' });
  }
  
  // Validate room exists
  const room = db.rooms.find(r => r.id === roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  // Validate time constraints
  const timeValidation = validateBookingTime(startTime, endTime);
  if (!timeValidation.valid) {
    return res.status(400).json({ error: timeValidation.error });
  }
  
  // Check for conflicts
  const conflictCheck = hasConflict(roomId, startTime, endTime);
  if (conflictCheck.conflict) {
    return res.status(409).json({ error: conflictCheck.message });
  }
  
  // Calculate price
  const totalPrice = calculatePrice(room, startTime, endTime);
  
  // Create booking
  const booking = {
    bookingId: `b${Date.now()}`,
    roomId,
    roomName: room.name,
    userName,
    startTime,
    endTime,
    totalPrice,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  };
  
  db.bookings.push(booking);
  
  res.status(201).json({
    bookingId: booking.bookingId,
    roomId: booking.roomId,
    userName: booking.userName,
    totalPrice: booking.totalPrice,
    status: booking.status
  });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  const { status, roomId } = req.query;
  
  let bookings = [...db.bookings];
  
  if (status) {
    bookings = bookings.filter(b => b.status === status);
  }
  if (roomId) {
    bookings = bookings.filter(b => b.roomId === roomId);
  }
  
  // Sort by start time
  bookings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  res.json(bookings);
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
  const booking = db.bookings.find(b => b.bookingId === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

// Cancel a booking
app.post('/api/bookings/:id/cancel', (req, res) => {
  const bookingId = req.params.id;
  const booking = db.bookings.find(b => b.bookingId === bookingId);
  
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  if (booking.status === 'CANCELLED') {
    return res.status(400).json({ error: 'Booking already cancelled' });
  }
  
  // Check if cancellation is allowed (> 2 hours before startTime)
  const now = new Date();
  const startTime = new Date(booking.startTime);
  const hoursUntilStart = (startTime - now) / (1000 * 60 * 60);
  
  if (hoursUntilStart <2) {
    return res.status(400).json({ 
      error: 'Cancellation not allowed. Must cancel at least 2 hours before booking start time' 
    });
  }
  
  // Cancel booking
  booking.status = 'CANCELLED';
  booking.cancelledAt = new Date().toISOString();
  
  res.json({
    message: 'Booking cancelled successfully',
    bookingId: booking.bookingId,
    status: booking.status
  });
});

// Get analytics
app.get('/api/analytics', (req, res) => {
  const { from, to } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing required query parameters: from, to' });
  }
  
  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999); // Include entire end date
  
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }
  
  // Filter CONFIRMED bookings within date range
  const relevantBookings = db.bookings.filter(b => {
    if (b.status !== 'CONFIRMED') return false;
    
    const bookingStart = new Date(b.startTime);
    return bookingStart >= fromDate && bookingStart <= toDate;
  });
  
  // Group by room and calculate totals
  const roomStats = {};
  
  relevantBookings.forEach(booking => {
    if (!roomStats[booking.roomId]) {
      roomStats[booking.roomId] = {
        roomId: booking.roomId,
        roomName: booking.roomName,
        totalHours: 0,
        totalRevenue: 0
      };
    }
    
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    
    roomStats[booking.roomId].totalHours += hours;
    roomStats[booking.roomId].totalRevenue += booking.totalPrice;
  });
  
  // Convert to array and round values
  const analytics = Object.values(roomStats).map(stat => ({
    ...stat,
    totalHours: Math.round(stat.totalHours * 10) / 10, // Round to 1 decimal
    totalRevenue: Math.round(stat.totalRevenue)
  }));
  
  // Sort by revenue (descending)
  analytics.sort((a, b) => b.totalRevenue - a.totalRevenue);
  
  res.json(analytics);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    bookings: db.bookings.length,
    rooms: db.rooms.length
  });
});

// Seed data endpoint (for testing)
app.post('/api/seed', (req, res) => {
  // Reset bookings
  db.bookings = [];
  
  // Add sample bookings
  const sampleBookings = [
    {
      roomId: '101',
      userName: 'Priya',
      startTime: '2025-11-20T10:00:00.000Z',
      endTime: '2025-11-20T12:30:00.000Z'
    },
    {
      roomId: '102',
      userName: 'Rahul',
      startTime: '2025-11-20T14:00:00.000Z',
      endTime: '2025-11-20T16:00:00.000Z'
    },
    {
      roomId: '103',
      userName: 'Anjali',
      startTime: '2025-11-21T09:00:00.000Z',
      endTime: '2025-11-21T11:00:00.000Z'
    }
  ];
  
  sampleBookings.forEach(booking => {
    const room = db.rooms.find(r => r.id === booking.roomId);
    if (room) {
      const totalPrice = calculatePrice(room, booking.startTime, booking.endTime);
      db.bookings.push({
        bookingId: `b${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...booking,
        roomName: room.name,
        totalPrice,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
      });
    }
  });
  
  res.json({ 
    message: 'Database seeded successfully',
    bookings: db.bookings.length 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET    /api/rooms`);
  console.log(`   POST   /api/bookings`);
  console.log(`   GET    /api/bookings`);
  console.log(`   POST   /api/bookings/:id/cancel`);
  console.log(`   GET    /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD`);
  console.log(`   POST   /api/seed (for testing)`);
  console.log(`💾 Using in-memory database`);
  console.log(`📝 ${db.rooms.length} rooms available`);
});