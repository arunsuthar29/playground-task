// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, DollarSign, Users, TrendingUp, AlertCircle, CheckCircle, XCircle, Home } from 'lucide-react';

// // API Configuration
// const API_BASE_URL = 'http://localhost:3000/api';

// // API Service
// const api = {
//   async getRooms() {
//     const response = await fetch(`${API_BASE_URL}/rooms`);
//     if (!response.ok) throw new Error('Failed to fetch rooms');
//     return response.json();
//   },
  
//   async getBookings(params = {}) {
//     const query = new URLSearchParams(params).toString();
//     const response = await fetch(`${API_BASE_URL}/bookings${query ? `?${query}` : ''}`);
//     if (!response.ok) throw new Error('Failed to fetch bookings');
//     return response.json();
//   },
  
//   async createBooking(data) {
//     const response = await fetch(`${API_BASE_URL}/bookings`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     const result = await response.json();
//     if (!response.ok) throw new Error(result.error || 'Failed to create booking');
//     return result;
//   },
  
//   async cancelBooking(bookingId) {
//     const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' }
//     });
//     const result = await response.json();
//     if (!response.ok) throw new Error(result.error || 'Failed to cancel booking');
//     return result;
//   },
  
//   async getAnalytics(from, to) {
//     const response = await fetch(`${API_BASE_URL}/analytics?from=${from}&to=${to}`);
//     const result = await response.json();
//     if (!response.ok) throw new Error(result.error || 'Failed to fetch analytics');
//     return result;
//   }
// };

// const WorkspaceBookingSystem = () => {
//   const [currentView, setCurrentView] = useState('home');
//   const [currentUser, setCurrentUser] = useState('');
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [bookingData, setBookingData] = useState({
//     date: '',
//     startTime: '09:00',
//     endTime: '11:00'
//   });
//   const [allBookings, setAllBookings] = useState([]);
//   const [userBookings, setUserBookings] = useState([]);
//   const [analytics, setAnalytics] = useState([]);
//   const [analyticsRange, setAnalyticsRange] = useState({
//     from: new Date().toISOString().split('T')[0],
//     to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
//   });
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadRooms();
//   }, []);

//   useEffect(() => {
//     if (currentView === 'bookings') loadAllBookings();
//     if (currentView === 'mybookings' && currentUser) loadUserBookings();
//     if (currentView === 'analytics') loadAnalytics();
//   }, [currentView, currentUser]);

//   const loadRooms = async () => {
//     try {
//       const data = await api.getRooms();
//       setRooms(data);
//     } catch (error) {
//       showMessage('Failed to load rooms: ' + error.message, 'error');
//     }
//   };

//   const loadAllBookings = async () => {
//     try {
//       const data = await api.getBookings();
//       setAllBookings(data);
//     } catch (error) {
//       showMessage('Failed to load bookings: ' + error.message, 'error');
//     }
//   };

//   const loadUserBookings = async () => {
//     try {
//       const data = await api.getBookings();
//       const filtered = data.filter(b => b.userName.toLowerCase() === currentUser.toLowerCase());
//       setUserBookings(filtered);
//     } catch (error) {
//       showMessage('Failed to load your bookings: ' + error.message, 'error');
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       const data = await api.getAnalytics(analyticsRange.from, analyticsRange.to);
//       setAnalytics(data);
//     } catch (error) {
//       showMessage('Failed to load analytics: ' + error.message, 'error');
//     }
//   };

//   const showMessage = (text, type) => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 5000);
//   };

//   const handleCreateBooking = async () => {
//     if (!currentUser.trim()) {
//       showMessage('⚠️ Please enter your name on the Home page first!', 'error');
//       setCurrentView('home');
//       return;
//     }
    
//     if (!selectedRoom || !bookingData.date || !bookingData.startTime || !bookingData.endTime) {
//       showMessage('⚠️ Please fill all booking fields', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const startTime = new Date(`${bookingData.date}T${bookingData.startTime}:00.000Z`).toISOString();
//       const endTime = new Date(`${bookingData.date}T${bookingData.endTime}:00.000Z`).toISOString();

//       const result = await api.createBooking({
//         roomId: selectedRoom.id,
//         userName: currentUser,
//         startTime,
//         endTime
//       });

//       showMessage(`✅ Booking confirmed! Room: ${selectedRoom.name} | Total: ₹${result.totalPrice}`, 'success');
      
//       // Reset form
//       setSelectedRoom(null);
//       setBookingData({ date: '', startTime: '09:00', endTime: '11:00' });
      
//       // Redirect to My Bookings after 1 second
//       setTimeout(() => {
//         setCurrentView('mybookings');
//       }, 1500);
      
//     } catch (error) {
//       showMessage('❌ ' + error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelBooking = async (booking) => {
//     if (!window.confirm(`Cancel booking for ${booking.roomName}?`)) return;

//     setLoading(true);
//     try {
//       await api.cancelBooking(booking.bookingId);
//       showMessage('Booking cancelled successfully', 'success');
//       loadUserBookings();
//     } catch (error) {
//       showMessage(error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return {
//       date: date.toLocaleDateString('en-IN'),
//       time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
//     };
//   };

//   const getTodayBookings = () => {
//     const today = new Date().toISOString().split('T')[0];
//     return allBookings.filter(b => {
//       const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
//       return bookingDate === today && b.status === 'CONFIRMED';
//     });
//   };

//   const renderHomeView = () => {
//     const todayBookings = getTodayBookings();
    
//     return (
//       <div className="space-y-8">
//         <div className="text-center py-12">
//           <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//             <Home className="text-blue-600" size={56} />
//           </div>
//           <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Welcome to Room Booking System
//           </h2>
//           <p className="text-gray-600 text-xl mb-8">Book meeting rooms with intelligent dynamic pricing</p>
          
//           {!currentUser ? (
//             <div className="max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border-2 border-blue-200 shadow-xl">
//               <label className="block text-lg font-bold mb-3 text-left text-gray-700">Enter Your Name</label>
//               <input
//                 type="text"
//                 placeholder="Your full name"
//                 value={currentUser}
//                 onChange={(e) => setCurrentUser(e.target.value)}
//                 className="w-full p-4 border-2 border-blue-300 rounded-xl mb-5 text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
//               />
//               <button
//                 onClick={() => currentUser.trim() && setCurrentView('bookings')}
//                 disabled={!currentUser.trim()}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-300 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none"
//               >
//                 🚀 Get Started
//               </button>
//             </div>
//           ) : (
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl inline-block border-2 border-blue-200 shadow-lg">
//               <p className="text-lg text-gray-600">Logged in as:</p>
//               <p className="text-2xl font-bold text-blue-600 mb-3">{currentUser}</p>
//               <button
//                 onClick={() => setCurrentUser('')}
//                 className="text-sm text-blue-600 hover:text-blue-800 font-semibold underline"
//               >
//                 Change User
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border-2 border-gray-200 shadow-xl">
//           <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
//             <span className="bg-blue-100 p-2 rounded-lg">📅</span>
//             Today's Bookings ({todayBookings.length})
//           </h3>
//           {todayBookings.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-400 text-xl">No bookings for today</p>
//               <p className="text-gray-400 text-sm mt-2">All rooms are available!</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {todayBookings.map(booking => {
//                 const { time: startTime } = formatDateTime(booking.startTime);
//                 const { time: endTime } = formatDateTime(booking.endTime);
//                 return (
//                   <div key={booking.bookingId} className="flex justify-between items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
//                     <div className="flex items-center gap-4">
//                       <div className="bg-blue-100 p-3 rounded-lg">
//                         <Users size={24} className="text-blue-600" />
//                       </div>
//                       <div>
//                         <span className="font-bold text-lg text-gray-800">{booking.roomName}</span>
//                         <p className="text-gray-600">Booked by: {booking.userName}</p>
//                       </div>
//                     </div>
//                     <div className="text-right bg-blue-50 px-4 py-2 rounded-lg">
//                       <p className="text-sm text-gray-600">Time</p>
//                       <p className="font-semibold text-blue-600">{startTime} - {endTime}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <div>
//           <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
//             <span className="bg-purple-100 p-2 rounded-lg">🏢</span>
//             Available Rooms
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {rooms.slice(0, 3).map(room => (
//               <div key={room.id} className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
//                 <h4 className="font-bold text-xl mb-4 text-gray-800">{room.name}</h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
//                     <Users size={20} className="text-blue-500" />
//                     <span className="text-gray-700">Capacity: <strong>{room.capacity}</strong></span>
//                   </div>
//                   <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
//                     <DollarSign size={20} className="text-green-500" />
//                     <span className="text-gray-700">₹<strong>{room.baseHourlyRate}</strong>/hour</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderBookingsView = () => (
//     <div className="space-y-8">
//       {!selectedRoom && (
//         <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl border-2 border-blue-300 shadow-lg">
//           <p className="text-center text-blue-900 font-bold text-xl">
//             👇 Click on a room below to start booking
//           </p>
//         </div>
//       )}
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {rooms.map(room => (
//           <div
//             key={room.id}
//             onClick={() => setSelectedRoom(room)}
//             className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform ${
//               selectedRoom?.id === room.id
//                 ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl scale-105'
//                 : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl hover:scale-105'
//             }`}
//           >
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="font-bold text-xl text-gray-800">{room.name}</h3>
//               {selectedRoom?.id === room.id && (
//                 <CheckCircle size={28} className="text-blue-500" />
//               )}
//             </div>
//             <div className="space-y-3 mb-4">
//               <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
//                 <Users size={20} className="text-blue-500" />
//                 <span className="text-gray-700">Capacity: <strong>{room.capacity}</strong> people</span>
//               </div>
//               <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
//                 <DollarSign size={20} className="text-green-500" />
//                 <span className="text-gray-700">₹<strong>{room.baseHourlyRate}</strong>/hour (base)</span>
//               </div>
//               <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
//                 <p className="text-xs text-orange-700 font-semibold">⚡ Peak hours: 1.5× rate</p>
//               </div>
//             </div>
//             {selectedRoom?.id !== room.id && (
//               <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all">
//                 Select Room →
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       {selectedRoom && (
//         <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border-2 border-blue-300 shadow-2xl">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-3xl font-bold text-gray-800">📅 Book {selectedRoom.name}</h3>
//             <button
//               onClick={() => setSelectedRoom(null)}
//               className="text-gray-400 hover:text-red-500 font-bold text-2xl bg-gray-100 hover:bg-red-50 w-10 h-10 rounded-full transition-all"
//             >
//               ✕
//             </button>
//           </div>
          
//           {!currentUser && (
//             <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 p-5 rounded-xl mb-6 shadow-md">
//               <p className="text-red-700 font-bold text-lg flex items-center gap-2">
//                 <AlertCircle size={24} />
//                 ⚠️ Please enter your name on the Home page first!
//               </p>
//             </div>
//           )}
          
//           <div className="space-y-6">
//             <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-xl border border-gray-200">
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="flex items-center gap-3">
//                   <Users size={24} className="text-blue-500" />
//                   <div>
//                     <p className="text-sm text-gray-600">Capacity</p>
//                     <p className="font-bold text-lg text-gray-800">{selectedRoom.capacity} people</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <DollarSign size={24} className="text-green-500" />
//                   <div>
//                     <p className="text-sm text-gray-600">Base Rate</p>
//                     <p className="font-bold text-lg text-gray-800">₹{selectedRoom.baseHourlyRate}/hour</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-lg font-bold mb-2 text-gray-700 flex items-center gap-2">
//                 <Calendar size={20} className="text-blue-500" />
//                 Date *
//               </label>
//               <input
//                 type="date"
//                 value={bookingData.date}
//                 onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
//                 min={new Date().toISOString().split('T')[0]}
//                 className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-bold mb-2 text-gray-700 flex items-center gap-2">
//                   <Clock size={20} className="text-blue-500" />
//                   Start Time *
//                 </label>
//                 <input
//                   type="time"
//                   value={bookingData.startTime}
//                   onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
//                   className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-lg font-bold mb-2 text-gray-700 flex items-center gap-2">
//                   <Clock size={20} className="text-blue-500" />
//                   End Time *
//                 </label>
//                 <input
//                   type="time"
//                   value={bookingData.endTime}
//                   onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
//                   className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {bookingData.date && bookingData.startTime && bookingData.endTime && (
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-300 shadow-md">
//                 <p className="text-green-800 font-semibold text-lg flex items-center gap-2">
//                   <CheckCircle size={24} className="text-green-600" />
//                   ✓ Booking details: <strong>{bookingData.date}</strong> from <strong>{bookingData.startTime}</strong> to <strong>{bookingData.endTime}</strong>
//                 </p>
//               </div>
//             )}

//             <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-xl border-2 border-yellow-300">
//               <h4 className="font-bold mb-3 text-lg text-yellow-800 flex items-center gap-2">
//                 💰 Pricing Rules
//               </h4>
//               <ul className="space-y-2 text-sm text-gray-700">
//                 <li className="flex items-start gap-2">
//                   <span className="text-yellow-600 font-bold">•</span>
//                   <span>Peak hours (10 AM–1 PM, 4 PM–7 PM, Mon–Fri): <strong>1.5× base rate</strong></span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-yellow-600 font-bold">•</span>
//                   <span>Off-peak hours & weekends: <strong>base rate</strong></span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-yellow-600 font-bold">•</span>
//                   <span>Maximum duration: <strong>12 hours</strong></span>
//                 </li>
//               </ul>
//             </div>

//             <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-300">
//               <h4 className="font-bold mb-3 text-lg text-blue-800 flex items-center gap-2">
//                 📋 Cancellation Policy
//               </h4>
//               <p className="text-sm text-gray-700">
//                 Cancellation allowed only if more than <strong>2 hours</strong> before booking start time
//               </p>
//             </div>

//             <button
//               onClick={handleCreateBooking}
//               disabled={loading || !currentUser || !bookingData.date || !bookingData.startTime || !bookingData.endTime}
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 disabled:transform-none"
//             >
//               {loading ? '⏳ Processing...' : '✓ Confirm Booking'}
//             </button>
            
//             {(!bookingData.date || !bookingData.startTime || !bookingData.endTime) && (
//               <p className="text-center text-sm text-gray-500 italic">
//                 Please fill all fields to enable booking
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const renderMyBookingsView = () => (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold">My Bookings</h2>
      
//       {!currentUser ? (
//         <div className="text-center py-12 text-gray-500">
//           Please enter your name on the home page first
//         </div>
//       ) : userBookings.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           No bookings yet. Book a room to get started!
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {userBookings.map(booking => {
//             const { date: startDate, time: startTime } = formatDateTime(booking.startTime);
//             const { time: endTime } = formatDateTime(booking.endTime);
//             const canCancel = new Date(booking.startTime) - new Date() > 2 * 60 * 60 * 1000;
            
//             return (
//               <div key={booking.bookingId} className={`p-4 border-2 rounded-lg ${
//                 booking.status === 'CANCELLED' ? 'bg-gray-50 border-gray-300' : 'bg-white border-blue-200'
//               }`}>
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <h3 className="font-bold text-lg">{booking.roomName}</h3>
//                     <div className="mt-2 space-y-1 text-sm text-gray-600">
//                       <div className="flex items-center gap-2">
//                         <Calendar size={16} />
//                         <span>{startDate}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Clock size={16} />
//                         <span>{startTime} - {endTime}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <DollarSign size={16} />
//                         <span>₹{booking.totalPrice}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {booking.status === 'CONFIRMED' ? (
//                           <><CheckCircle size={16} className="text-green-500" /> <span className="text-green-600 font-semibold">Confirmed</span></>
//                         ) : (
//                           <><XCircle size={16} className="text-red-500" /> <span className="text-red-600 font-semibold">Cancelled</span></>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   {booking.status === 'CONFIRMED' && (
//                     <div className="text-right">
//                       <button
//                         onClick={() => handleCancelBooking(booking)}
//                         disabled={loading || !canCancel}
//                         className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 text-sm"
//                       >
//                         Cancel
//                       </button>
//                       {!canCancel && (
//                         <div className="mt-2 text-xs text-red-600">
//                           Cannot cancel (&lt;2hrs)
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );

//   const renderAnalyticsView = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
//       <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
//         <h3 className="font-semibold mb-3">Date Range</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm mb-1">From</label>
//             <input
//               type="date"
//               value={analyticsRange.from}
//               onChange={(e) => setAnalyticsRange({ ...analyticsRange, from: e.target.value })}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm mb-1">To</label>
//             <input
//               type="date"
//               value={analyticsRange.to}
//               onChange={(e) => setAnalyticsRange({ ...analyticsRange, to: e.target.value })}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         </div>
//         <button
//           onClick={loadAnalytics}
//           className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//         >
//           Load Analytics
//         </button>
//       </div>

//       {analytics.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           No confirmed bookings in selected date range
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
//               <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
//               <div className="text-3xl font-bold text-blue-600">
//                 ₹{analytics.reduce((sum, r) => sum + r.totalRevenue, 0)}
//               </div>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
//               <div className="text-sm text-gray-600 mb-1">Total Hours Booked</div>
//               <div className="text-3xl font-bold text-green-600">
//                 {analytics.reduce((sum, r) => sum + r.totalHours, 0).toFixed(1)}h
//               </div>
//             </div>
//             <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
//               <div className="text-sm text-gray-600 mb-1">Rooms Used</div>
//               <div className="text-3xl font-bold text-purple-600">
//                 {analytics.length}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
//             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <TrendingUp size={20} />
//               Room Performance
//             </h3>
//             <div className="space-y-3">
//               {analytics.map((room, idx) => (
//                 <div key={room.roomId} className="flex items-center gap-4">
//                   <div className="text-2xl font-bold text-gray-400 w-8">#{idx + 1}</div>
//                   <div className="flex-1">
//                     <div className="font-semibold">{room.roomName}</div>
//                     <div className="text-sm text-gray-600">
//                       {room.totalHours}h booked • ₹{room.totalRevenue} revenue
//                     </div>
//                   </div>
//                   <div className="w-32 bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-500 h-2 rounded-full"
//                       style={{
//                         width: `${(room.totalRevenue / analytics[0].totalRevenue) * 100}%`
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold mb-2">🏢 Room Booking System</h1>
//               <p className="text-blue-100 text-lg">Smart workspace management with dynamic pricing</p>
//             </div>
//             {currentUser && (
//               <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
//                 <p className="text-sm text-blue-100">Welcome back,</p>
//                 <p className="text-xl font-bold">{currentUser}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {message.text && (
//           <div className={`mb-6 p-5 rounded-xl flex items-center gap-3 shadow-lg animate-pulse ${
//             message.type === 'success' 
//               ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-300' 
//               : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-300'
//           }`}>
//             {message.type === 'success' ? <CheckCircle size={24} className="text-green-600" /> : <AlertCircle size={24} className="text-red-600" />}
//             <span className="font-semibold text-lg">{message.text}</span>
//           </div>
//         )}

//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//           <div className="flex flex-wrap border-b-2 border-gray-100">
//             <button
//               onClick={() => setCurrentView('home')}
//               className={`flex-1 min-w-[150px] px-8 py-5 font-bold text-lg transition-all duration-300 ${
//                 currentView === 'home' 
//                   ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105' 
//                   : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
//               }`}
//             >
//               🏠 Home
//             </button>
//             <button
//               onClick={() => setCurrentView('bookings')}
//               className={`flex-1 min-w-[150px] px-8 py-5 font-bold text-lg transition-all duration-300 ${
//                 currentView === 'bookings' 
//                   ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105' 
//                   : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
//               }`}
//             >
//               📅 Book Room
//             </button>
//             <button
//               onClick={() => setCurrentView('mybookings')}
//               className={`flex-1 min-w-[150px] px-8 py-5 font-bold text-lg transition-all duration-300 ${
//                 currentView === 'mybookings' 
//                   ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105' 
//                   : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
//               }`}
//             >
//               📋 My Bookings
//             </button>
//             <button
//               onClick={() => setCurrentView('analytics')}
//               className={`flex-1 min-w-[150px] px-8 py-5 font-bold text-lg transition-all duration-300 ${
//                 currentView === 'analytics' 
//                   ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105' 
//                   : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
//               }`}
//             >
//               📊 Analytics
//             </button>
//           </div>

//           <div className="p-8">
//             {currentView === 'home' && renderHomeView()}
//             {currentView === 'bookings' && renderBookingsView()}
//             {currentView === 'mybookings' && renderMyBookingsView()}
//             {currentView === 'analytics' && renderAnalyticsView()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkspaceBookingSystem;


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import BookRoomPage from './pages/BookRoomPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const [currentUser, setCurrentUser] = useState('');
  const [analyticsRange, setAnalyticsRange] = useState({ from: "", to: "" });

  return (
    <Router>
      {/* HEADER */}
      <Header currentUser={currentUser} />

      {/* MAIN CENTERED LAYOUT */}
      <main className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />

            <Route
              path="/book-room"
              element={<BookRoomPage currentUser={currentUser} />}
            />

            <Route
              path="/my-bookings"
              element={<MyBookingsPage currentUser={currentUser} />}
            />

            <Route
              path="/analytics"
              element={
                <AnalyticsPage
                  analyticsRange={analyticsRange}
                  setAnalyticsRange={setAnalyticsRange}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
