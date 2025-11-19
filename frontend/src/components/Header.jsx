import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = ({ currentUser }) => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Book Room", path: "/book-room" },
    { name: "My Bookings", path: "/my-bookings" },
    { name: "Analytics", path: "/analytics" },
  ];

  return (
    <header
      style={{
        background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
        padding: "1.5rem 2rem",
        borderRadius: "1rem",
        color: "white",
        marginBottom: "2rem",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Logo / Title */}
        <div>
          <h1 style={{ fontSize: "1.8rem", margin: 0 }}>🏢 Room Booking System</h1>
          <p style={{ fontSize: "0.95rem", opacity: 0.85 }}> API response handling on free-tier
 hosting—the first request may take 30-40 sec
 onds due to Render cold start, but all subse
 quent requests perform smoothly.</p>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "bold",
                backgroundColor: location.pathname === item.path ? "rgba(255,255,255,0.3)" : "transparent",
                color: "white",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = location.pathname === item.path ? "rgba(255,255,255,0.3)" : "transparent")
              }
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {currentUser && (
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              textAlign: "center",
              minWidth: "120px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.9 }}>Welcome back,</p>
            <p style={{ fontWeight: "bold", margin: 0, fontSize: "1rem" }}>{currentUser}</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
