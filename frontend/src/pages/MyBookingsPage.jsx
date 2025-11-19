import React, { useEffect, useState } from "react";
import { Calendar, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { api } from "../api/api";

const MyBookingsPage = ({ currentUser, showMessage }) => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) loadUserBookings();
  }, [currentUser]);

  const loadUserBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getBookings();
      const filtered = data.filter(
        (b) => b.userName?.toLowerCase() === currentUser?.toLowerCase()
      );
      setUserBookings(filtered);
    } catch (error) {
      showMessage?.("Failed to load your bookings: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!window.confirm(`Cancel booking for ${booking.roomName}?`)) return;

    setLoading(true);
    try {
      await api.cancelBooking(booking.bookingId);
      showMessage?.("Booking cancelled successfully", "success");
      loadUserBookings();
    } catch (error) {
      showMessage?.(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString("en-IN"),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">📋 My Bookings</h2>

      {!currentUser ? (
        <div className="text-center text-muted py-5">
          Please enter your name on the Home page to continue.
        </div>
      ) : userBookings.length === 0 ? (
        <div className="text-center text-muted py-5">
          You haven’t booked any rooms yet.
        </div>
      ) : (
        <div className="row g-3">
          {userBookings.map((booking) => {
            const { date: startDate, time: startTime } = formatDateTime(
              booking.startTime
            );
            const { time: endTime } = formatDateTime(booking.endTime);

            const timeDiff = new Date(booking.startTime) - new Date();
            const canCancel = timeDiff > 2 * 60 * 60 * 1000; // > 2 hours

            return (
              <div className="col-12" key={booking.bookingId}>
                <div
                  className={`card shadow-sm border-2 ${
                    booking.status === "CANCELLED"
                      ? "border-secondary bg-light"
                      : "border-primary"
                  }`}
                >
                  <div className="card-body d-flex justify-content-between">
                    {/* Left */}
                    <div>
                      <h5 className="fw-bold">{booking.roomName}</h5>

                      <p className="mb-1">
                        <Calendar size={16} className="me-2 text-secondary" />
                        {startDate}
                      </p>

                      <p className="mb-1">
                        <Clock size={16} className="me-2 text-secondary" />
                        {startTime} – {endTime}
                      </p>

                      <p className="mb-1">
                        <DollarSign size={16} className="me-2 text-secondary" />
                        <strong>₹{booking.totalPrice}</strong>
                      </p>

                      <div className="d-flex align-items-center">
                        {booking.status === "CONFIRMED" ? (
                          <>
                            <CheckCircle size={16} className="text-success me-2" />
                            <span className="text-success fw-semibold">
                              Confirmed
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="text-danger me-2" />
                            <span className="text-danger fw-semibold">
                              Cancelled
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right - Action */}
                    {booking.status === "CONFIRMED" && (
                      <div className="text-end">
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="btn btn-sm btn-danger"
                          disabled={loading || !canCancel}
                        >
                          Cancel
                        </button>

                        {!canCancel && (
                          <p className="text-danger small mt-2">
                            Cannot cancel within 2 hrs
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
