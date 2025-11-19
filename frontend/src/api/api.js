const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  getRooms: async () => {
    const res = await fetch(`${API_BASE_URL}/rooms`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
  },

  getBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/bookings${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  createBooking: async (data) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create booking');
    return result;
  },

  cancelBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to cancel booking');
    return result;
  },

  getAnalytics: async (from, to) => {
    const res = await fetch(`${API_BASE_URL}/analytics?from=${from}&to=${to}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to fetch analytics');
    return result;
  }
};
