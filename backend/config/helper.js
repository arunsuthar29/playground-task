const db = require("../db/db");

// Helper: Check if time is in peak hours (10 AM–1 PM, 4 PM–7 PM Mon–Fri)
const isPeakHour = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) return false; // Weekend
  
  const hour = date.getHours();
  return (hour >= 10 && hour < 13) || (hour >= 16 && hour < 19);
};

// Helper: Calculate total price with dynamic pricing
const calculatePrice = (room, startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  let totalPrice = 0;
  let currentTime = new Date(start);
  
  // Calculate price for each hour slot
  while (currentTime < end) {
    const nextHour = new Date(currentTime);
    nextHour.setHours(nextHour.getHours() + 1);
    
    // Calculate fraction of hour if end time is mid-hour
    const slotEnd = nextHour > end ? end : nextHour;
    const hoursInSlot = (slotEnd - currentTime) / (1000 * 60 * 60);
    
    // Apply peak/off-peak pricing
    const rate = isPeakHour(currentTime) ? room.baseHourlyRate * 1.5 : room.baseHourlyRate;
    totalPrice += rate * hoursInSlot;
    
    currentTime = nextHour;
  }
  
  return Math.round(totalPrice); // Round to nearest integer
};

// Helper: Check for booking conflicts
const hasConflict = (roomId, startTime, endTime, excludeBookingId = null) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  for (const booking of db.bookings) {
    if (booking.status === 'CANCELLED') continue;
    if (booking.roomId !== roomId) continue;
    if (excludeBookingId && booking.bookingId === excludeBookingId) continue;
    
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    
    // Check for overlap
    if (start < bookingEnd && end > bookingStart) {
      return {
        conflict: true,
        message: `Room already booked from ${bookingStart.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        })} to ${bookingEnd.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        })}`
      };
    }
  }
  
  return { conflict: false };
};

// Helper: Validate booking time constraints
const validateBookingTime = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // Check if valid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  // Check startTime < endTime
  if (start >= end) {
    return { valid: false, error: 'startTime must be before endTime' };
  }
  
  // Check duration ≤ 12 hours
  const durationHours = (end - start) / (1000 * 60 * 60);
  if (durationHours > 12) {
    return { valid: false, error: 'Booking duration cannot exceed 12 hours' };
  }
  
  return { valid: true };
};

module.exports = {
  isPeakHour,
  calculatePrice,
  hasConflict,
  validateBookingTime
};
