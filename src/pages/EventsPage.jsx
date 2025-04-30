import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllEvents } from "../services/eventService";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "../styles/components.css";

const EventsPage = () => {
  const { userRole, user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();
  const location = useLocation();

  //"my" filter based on navigation state
  useEffect(() => {
    if (location.state?.filter === 'my') {
      setFilter('my');
    }
  }, [location.state]);

  if (userRole === "admin") {
    return <Navigate to="/admin-events" />;
  }

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const now = new Date();
      const result = await getAllEvents("approved");
      console.log("Fetched events:", result.events);
      
  
      console.log("Current date:", now);

      if (result.success) {
        let filteredEvents = [...result.events];
        
        //adding dummy events if events if no events at all for testing purposes 
        if (filteredEvents.length === 0) {
          console.log("No events found, adding dummy events");
          
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - 15); //15 days ago
          
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 15);
          
          const formatDate = (date) => {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
          };
          
          filteredEvents = [
            {
              id: "dummy-past-1",
              title: "Past Event Example",
              date: formatDate(pastDate),
              time: "2:00 PM - 4:00 PM",
              location: "Main Campus",
              points: 15,
              description: "This is a past event for testing.",
              status: "approved"
            },
            {
              id: "dummy-future-1",
              title: "Future Event Example",
              date: formatDate(futureDate),
              time: "10:00 AM - 12:00 PM",
              location: "Student Center",
              points: 20,
              description: "This is a future event for testing.",
              status: "approved"
            }
          ];
          
          console.log("Added dummy events:", filteredEvents);
        }

        const getEventDate = (event) => {
          if (event.dateTime?.toDate) {
            return event.dateTime.toDate();
          } else if (event.dateTime) {
            return new Date(event.dateTime);
          } else if (event.date) {
            const [year, month, day] = event.date.split("-").map(Number);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
              const dateObj = new Date(year, month - 1, day);
              
              //if event has a time field, try to parse it
              if (event.time) {
                //trying to extract hours and minutes from time strings like "2:00 PM - 4:00 PM"
                const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
                if (timeMatch) {
                  let hours = parseInt(timeMatch[1]);
                  const minutes = parseInt(timeMatch[2]);
                  const period = timeMatch[3].toUpperCase();
                  
                  //coonverting to 24-hour format
                  if (period === "PM" && hours < 12) hours += 12;
                  if (period === "AM" && hours === 12) hours = 0;
                  
                  dateObj.setHours(hours, minutes, 0, 0);
                }
              }
              
              return dateObj;
            }
            //fallback to direct parsing if it fails
            return new Date(event.date);
          } else {
            return null;
          }
        };

        filteredEvents.forEach(event => {
          const eventDate = getEventDate(event);
          console.log(`Event: ${event.title}, Date: ${event.date || event.dateTime}, Parsed Date: ${eventDate}, Is Upcoming: ${eventDate && eventDate >= now}`);
        });

        if (filter === "upcoming") {
          filteredEvents = filteredEvents.filter((event) => {
            const eventDate = getEventDate(event);
            const isUpcoming = eventDate && eventDate >= now;
            console.log(`Filtering upcoming - Event: ${event.title}, Is Upcoming: ${isUpcoming}`);
            return isUpcoming;
          });
          filteredEvents.sort((a, b) => getEventDate(a) - getEventDate(b));
          console.log("Filtered upcoming events:", filteredEvents);
        } else if (filter === "past") {
          filteredEvents = filteredEvents.filter((event) => {
            const eventDate = getEventDate(event);
            const isPast = eventDate && eventDate < now;
            console.log(`Filtering past - Event: ${event.title}, Is Past: ${isPast}`);
            return isPast;
          });
          filteredEvents.sort((a, b) => getEventDate(b) - getEventDate(a));
          console.log("Filtered past events:", filteredEvents);
        } else if (filter === "my") {
          filteredEvents = filteredEvents.filter((event) => {
            return (
              user?.uid &&
              (event.signedUpUsers?.includes(user.uid) || event.attended?.includes(user.uid))
            );
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
    //user has RSVP'd but not attended yet
    const rsvpEvents = events.filter(
      (event) => 
        event.signedUpUsers?.includes(user.uid) && 
        !event.attended?.includes(user.uid)
    );
    
    //user has attended but not completed the survey
    const pending = events.filter(
      (event) =>
        event.attended?.includes(user.uid) && !event.surveys?.[user.uid]
    );

    //user has attended and completed the survey
    const completed = events.filter(
      (event) =>
        event.attended?.includes(user.uid) && event.surveys?.[user.uid]
    );

    return (
      <div className="my-events-columns">
        {rsvpEvents.length > 0 && (
          <div className="rsvp-column">
            <h2>My RSVPs</h2>
            {rsvpEvents.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>
                  <strong>Date:</strong> {formatDate(event.date || event.dateTime)}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="rsvp-status">✓ Registered</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="pending-column">
          <h2>Pending Surveys</h2>
          {pending.length === 0 ? (
            <p>No pending surveys.</p>
          ) : (
            pending.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>
                  <strong>Date:</strong> {formatDate(event.date || event.dateTime)}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <button
                  onClick={() => navigate(`/survey/${event.id}`)}
                  className="survey-button"
                >
                  Complete Survey
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="completed-column">
          <h2>Completed Surveys</h2>
          {completed.length === 0 ? (
            <p>No completed surveys yet.</p>
          ) : (
            completed.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>
                  <strong>Date:</strong> {formatDate(event.date || event.dateTime)}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="survey-status">✅ Survey Completed</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="events-page-container">
      <h1>Events</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-controls">
        <button
          className={`filter-button ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`filter-button ${filter === "past" ? "active" : ""}`}
          onClick={() => setFilter("past")}
        >
          Past Events
        </button>
        <button
          className={`filter-button ${filter === "my" ? "active" : ""}`}
          onClick={() => setFilter("my")}
        >
          My Events
        </button>
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
                <p>
                  <strong>Date:</strong> {formatDate(event.date || event.dateTime)}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Points:</strong> {event.points}
                </p>
                <div className="event-description">
                  <p>{event.description}</p>
                </div>
                <div className="event-actions">
                  <button
                    className="view-details-button"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    View Details
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
