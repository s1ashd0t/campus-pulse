import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllEvents } from "../services/eventService";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import "./EventsPage.css";

const EventsPage = () => {
  const { userRole } = useContext(AuthContext);

  if (userRole === "admin") {
    return <Navigate to="/admin-events" />;
  }

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("upcoming");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const result = await getAllEvents("approved");

      if (result.success) {
        let filteredEvents = [...result.events];
        const now = new Date();

        if (filter === "upcoming") {
          filteredEvents = filteredEvents.filter(event => new Date(event.date) >= now);
        } else if (filter === "past") {
          filteredEvents = filteredEvents.filter(event => new Date(event.date) < now);
        }

        setEvents(filteredEvents);
        setError("");
      } else {
        setError("Failed to load events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("An error occurred while fetching events");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (eventId) => {
    if (!user?.uid) {
      alert("Please log in to sign up for events.");
      return;
    }

    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        signedUpUsers: arrayUnion(user.uid),
      });

      alert("✅ Signed up! Redirecting to QR scanner...");
      navigate(`/scanner?eventId=${eventId}`);
    } catch (err) {
      console.error("Error signing up:", err);
      alert("❌ Failed to sign up. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="events-page-container">
      <h1>Events</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="filter-controls">
        <button className={`filter-button ${filter === "upcoming" ? "active" : ""}`} onClick={() => setFilter("upcoming")}>Upcoming Events</button>
        <button className={`filter-button ${filter === "past" ? "active" : ""}`} onClick={() => setFilter("past")}>Past Events</button>
        <button className={`filter-button ${filter === "my" ? "active" : ""}`} onClick={() => setFilter("my")}>My Events</button>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="no-events">No events found</div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                {event.points && (
                  <div className="event-points">
                    <span>{event.points}</span>
                    <small>points</small>
                  </div>
                )}
              </div>

              <div className="event-details">
                <p><strong>Date:</strong> {formatDate(event.date)}</p>
                <p><strong>Location:</strong> {event.location}</p>
                {event.category && <p><strong>Category:</strong> {event.category}</p>}
                <p><strong>Description:</strong> {event.description}</p>
              </div>

              <div className="event-actions">
                <button className="rsvp-button" onClick={() => handleSignUp(event.id)}>Sign Up & Scan QR</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
