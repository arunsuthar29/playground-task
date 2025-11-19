
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
