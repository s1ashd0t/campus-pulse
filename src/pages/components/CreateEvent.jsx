// src/components/CreateEvent.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createEvent } from "../../services/eventService";

export default function CreateEvent({ onSuccess }) {
  const { user, userRole } = useContext(AuthContext);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    points: 10,
    time: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const isAdmin = userRole === "admin";
      const result = await createEvent(eventData, user.uid, isAdmin);
      
      if (result.success) {
        alert("Event created successfully!");
        setEventData({ 
          title: "", 
          date: "", 
          location: "", 
          description: "",
          points: 10,
          time: ""
        });
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error adding event: ", error);
      setError("An error occurred while creating the event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event">
      <h2>Create New Event</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            id="title"
            type="text"
            placeholder="Event Title"
            value={eventData.title}
            onChange={(e) => setEventData({...eventData, title: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={eventData.date}
            onChange={(e) => setEventData({...eventData, date: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            id="time"
            type="text"
            placeholder="e.g. 2:00 PM - 4:00 PM"
            value={eventData.time}
            onChange={(e) => setEventData({...eventData, time: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="Location"
            value={eventData.location}
            onChange={(e) => setEventData({...eventData, location: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="points">Points</label>
          <input
            id="points"
            type="number"
            min="0"
            placeholder="Points"
            value={eventData.points}
            onChange={(e) => setEventData({...eventData, points: parseInt(e.target.value) || 0})}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Description"
            value={eventData.description}
            onChange={(e) => setEventData({...eventData, description: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
