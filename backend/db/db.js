// In-memory database
const db = {
  rooms: [
    { id: '101', name: 'Cabin 1', baseHourlyRate: 100, capacity: 4 },
    { id: '102', name: 'Cabin 2', baseHourlyRate: 150, capacity: 6 },
    { id: '103', name: 'Conference Hall', baseHourlyRate: 200, capacity: 10 },
    { id: '104', name: 'Executive Suite', baseHourlyRate: 250, capacity: 8 },
    { id: '105', name: 'Meeting Pod', baseHourlyRate: 80, capacity: 3 }
  ],
  bookings: []
};

module.exports = db;