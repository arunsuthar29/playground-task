import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);

  const handleStart = () => {
    if (currentUser && currentUser.trim().length > 1) {
      setIsNameSubmitted(true);
    }
  };

  return (
    <div className="text-center mt-5">
      {!isNameSubmitted ? (
        <div>
          <h2>Enter Your Name</h2>

          <input 
            type="text"
            value={currentUser || ""}
            onChange={e => setCurrentUser(e.target.value)}
            onKeyDown={(e) => { 
              if (e.key === 'Enter') {
                e.preventDefault();
                handleStart();
              }
            }}
            className="form-control mb-3"
            placeholder="Enter your full name"
            style={{ maxWidth: "300px", margin: "0 auto" }}
          />

          <button 
            type="button"
            className="btn btn-primary"
            onClick={handleStart}
            disabled={!currentUser || currentUser.trim().length <= 1}
          >
            Start
          </button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {currentUser}! 👋</h2>
          <button 
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate('/book-room')}
          >
            Book a Room
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;