import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import RoomCard from "../components/RoomCard";

const BookRoomPage = ({ currentUser }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Booking Inputs
  const [bookingData, setBookingData] = useState({
    date: "",
    startTime: "09:00",
    endTime: "11:00",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  // Modal State (IMPORTANT)
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await api.getRooms();
      setRooms(data || []);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setBookingData({ date: "", startTime: "09:00", endTime: "11:00" });
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      if (!currentUser) throw new Error("Enter your name first!");
      if (!selectedRoom) throw new Error("No room selected!");
      if (!bookingData.date) throw new Error("Please select date!");
      
      const startIso = `${bookingData.date}T${bookingData.startTime}:00`;
      const endIso = `${bookingData.date}T${bookingData.endTime}:00`;
      const start = new Date(startIso);
      const end = new Date(endIso);
      if (start >= end) throw new Error("Start time must be before end time.");
      const durationHours = (end - start) / (1000 * 60 * 60);
      if (durationHours > 12) throw new Error("Duration cannot exceed 12 hours.");

      await api.createBooking({
        roomId: selectedRoom.id ?? selectedRoom.roomId ?? selectedRoom._id,
        userName: currentUser,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      setMessage({ text: "Booking successful!", type: "success" });
      setShowModal(false);
      setSelectedRoom(null);
    } catch (err) {
      setMessage({ text: err.message || String(err), type: "error" });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setSelectedRoom(null);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="text-center mb-4">🏢 Book a Room</h2>

            {/* Message */}
            

            {/* Room List */}
            <div className="d-flex flex-column gap-3">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id ?? room.roomId ?? room._id}
                  room={room}
                  selected={selectedRoom?.id === room.id || selectedRoom?.roomId === room.roomId}
                  onSelect={(r) => handleRoomSelect(r ?? room)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Using inline styles for proper centering */}
      {showModal && selectedRoom && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050
          }}
        >
          <div
            className="bg-white rounded shadow-lg p-4"
            style={{ width: '90%', maxWidth: '500px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {message.text && (
              <div
                className={`alert ${
                  message.type === "success" ? "alert-success" : "alert-danger"
                } text-center`}
              >
                {message.text}
              </div>
            )}
            <h3 className="text-center mb-3">📅 Select Date & Time</h3>

            <p className="text-center mb-4">
              Booking: <strong>{selectedRoom.name ?? selectedRoom.roomName}</strong>
            </p>

            {/* Date */}
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Time */}
            <div className="row mb-3">
              <div className="col-6">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                />
              </div>

              <div className="col-6">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRoom(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={confirmBooking}
                className="btn btn-primary"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookRoomPage;