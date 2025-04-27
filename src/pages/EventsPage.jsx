import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllEvents } from "../services/eventService";
import { useNavigate, Navigate } from "react-router-dom";
import "./EventsPage.css";

const EventsPage = () => {
  const { userRole, user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();

  if (userRole === "admin") {
    return <Navigate to="/admin-events" />;
  }

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      
      // For student view, we only want to show approved events
      const result = await getAllEvents("approved");

      if (result.success) {
        const now = new Date();
        let filteredEvents = [...result.events];

        // Adding dummy events for testing if no real events exist
        if (filteredEvents.length === 0) {
          filteredEvents = [
            {
              id: 1,
              title: 'Tech Career Fair',
              date: '2025-04-15',
              time: '10:00 AM - 3:00 PM',
              location: 'Student Union',
              points: 20,
              description: 'Meet top tech employers and explore career opportunities.',
              status: 'approved',
              signedUpUsers: user?.uid ? [user.uid] : []
            },
            {
              id: 2,
              title: 'Entrepreneurship Workshop',
              date: '2025-04-18',
              time: '2:00 PM - 4:00 PM',
              location: 'Business Building, Room 302',
              points: 15,
              description: 'Learn startup essentials and pitch your ideas.',
              status: 'approved'
            },
            {
              id: 3,
              title: 'Campus Cleanup Day',
              date: '2025-04-22',
              time: '9:00 AM - 12:00 PM',
              location: 'Main Quad',
              points: 25,
              description: 'Help keep our campus clean and green.',
              status: 'approved',
              attended: user?.uid ? [user.uid] : []
            }
          ];
        }

        if (filter === "upcoming") {
          filteredEvents = filteredEvents.filter(event => {
            // Handle both date formats (string or Date object)
            const eventDate = event.dateTime ? new Date(event.dateTime) : 
                            event.date ? new Date(event.date) : 
                            null;
            return eventDate && eventDate >= now;
          });
        } else if (filter === "past") {
          filteredEvents = filteredEvents.filter(event => {
            const eventDate = event.dateTime ? new Date(event.dateTime) : 
                            event.date ? new Date(event.date) : 
                            null;
            return eventDate && eventDate < now;
          });
        } else if (filter === "my") {
          filteredEvents = filteredEvents.filter(event => {
            // Check if user is signed up
            return user?.uid && 
                  (event.signedUpUsers?.includes(user.uid) || 
                   event.attended?.includes(user.uid));
          });
        }

        setEvents(filteredEvents);
      } else {
        setError("Failed to load events. Please try again later.");
        console.error("Error in result:", result.error);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("An error occurred while fetching events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderMyEvents = () => {
    // Events the user has signed up for
    const signedUp = events.filter(event =>
      event.signedUpUsers?.includes(user.uid) && !event.attended?.includes(user.uid)
    );
    
    // Events the user has attended but not completed the survey
    const pending = events.filter(event =>
      event.attended?.includes(user.uid) && !event.surveys?.[user.uid]
    );

    // Events the user has completed the survey for
    const completed = events.filter(event =>
      event.attended?.includes(user.uid) && event.surveys?.[user.uid]
    );

    return (
      <div className="my-events-columns">
        <div className="signed-up-column">
          <h2>Registered Events</h2>
          {signedUp.length === 0 ? (
            <p>You haven't registered for any events yet.</p>
          ) : (
            signedUp.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {formatDate(event.date || event.dateTime)}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <div className="event-actions">
                  <button 
                    className="view-details-button" 
                    onClick={() => navigate(`/survey/${event.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="pending-column">
          <h2>Pending Surveys</h2>
          {pending.length === 0 ? (
            <p>No pending surveys.</p>
          ) : (
            pending.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {formatDate(event.date || event.dateTime)}</p>
                <div className="event-actions">
                  <button 
                    onClick={() => navigate(`/survey/${event.id}`)} 
                    className="rsvp-button"
                  >
                    Complete Survey
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="completed-column">
          <h2>Completed Surveys</h2>
          {completed.length === 0 ? (
            <p>No completed surveys yet.</p>
          ) : (
            completed.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {formatDate(event.date || event.dateTime)}</p>
                <p className="survey-status">✅ Survey Completed</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Updated method to handle redirect to survey page for confirming attendance
  const handleViewDetails = (eventId) => {
    if (filter === "upcoming") {
      navigate(`/event/${eventId}`);
    } else {
      // For past events, redirect to survey page
      navigate(`/survey/${eventId}`);
    }
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
      ) : filter === "my" ? (
        renderMyEvents()
      ) : (
        <div className="events-list">
          {events.length === 0 ? (
            <p className="no-events">No events found.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {formatDate(event.date || event.dateTime)}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Points:</strong> {event.points}</p>
                <div className="event-description">
                  <p>{event.description}</p>
                </div>
                <div className="event-actions">
                  <button 
                    className="view-details-button" 
                    onClick={() => handleViewDetails(event.id)}
                  >
                    {filter === "upcoming" ? "View Details & Register" : "View Details"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
