// src/pages/components/CreateEvent.jsx
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createEvent } from "../../services/eventService";
import "./CreateEvent.css";

export default function CreateEvent() {
  const { user, userRole } = useContext(AuthContext);
  const isAdmin = userRole === "admin";
  
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    category: "academic",
    points: 10,
    maxAttendees: 0,
    imageUrl: "",
    organizer: "",
    contactEmail: "",
    status: "pending" // Default to pending for non-admins
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Set default status based on role
  useEffect(() => {
    if (isAdmin) {
      setEventData(prev => ({
        ...prev,
        status: "approved" // Admins can create pre-approved events
      }));
    }
  }, [isAdmin]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.title.trim()) newErrors.title = "Title is required";
    if (!eventData.date) newErrors.date = "Date is required";
    if (!eventData.startTime) newErrors.startTime = "Start time is required";
    if (!eventData.endTime) newErrors.endTime = "End time is required";
    if (!eventData.location.trim()) newErrors.location = "Location is required";
    if (!eventData.description.trim()) newErrors.description = "Description is required";
    if (isNaN(eventData.points) || eventData.points < 0) {
      newErrors.points = "Points must be a positive number";
    }
    if (eventData.maxAttendees && (isNaN(eventData.maxAttendees) || eventData.maxAttendees < 0)) {
      newErrors.maxAttendees = "Max attendees must be a positive number";
    }
    if (eventData.contactEmail && !/\S+@\S+\.\S+/.test(eventData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setSuccess(false);
    
    try {
      // Format date and time
      const formattedEvent = {
        ...eventData,
        points: Number(eventData.points),
        maxAttendees: eventData.maxAttendees ? Number(eventData.maxAttendees) : 0,
        // Combine date and time for database
        dateTime: new Date(`${eventData.date}T${eventData.startTime}`).toISOString()
      };
      
      const result = await createEvent(formattedEvent, user.uid, isAdmin);
      
      if (result.success) {
        setSuccess(true);
        // Reset form
        setEventData({
          title: "",
          date: "",
          startTime: "",
          endTime: "",
          location: "",
          description: "",
          category: "academic",
          points: 10,
          maxAttendees: 0,
          imageUrl: "",
          organizer: "",
          contactEmail: "",
          status: isAdmin ? "approved" : "pending"
        });
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
      console.error("Error adding event: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  return (
    <div className="create-event-container">
      <h2>{isAdmin ? "Create New Event" : "Propose New Event"}</h2>
      
      {success && (
        <div className="success-message">
          {isAdmin 
            ? "Event created successfully! It is now visible to all users." 
            : "Event submitted successfully! It will be reviewed by an administrator."}
        </div>
      )}
      
      {errors.submit && <div className="error-message">{errors.submit}</div>}
      
      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
            {errors.date && <div className="error-message">{errors.date}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="startTime">Start Time*</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
              required
            />
            {errors.startTime && <div className="error-message">{errors.startTime}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">End Time*</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
              required
            />
            {errors.endTime && <div className="error-message">{errors.endTime}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location*</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
          {errors.location && <div className="error-message">{errors.location}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={eventData.category}
              onChange={handleChange}
              required
            >
              <option value="academic">Academic</option>
              <option value="social">Social</option>
              <option value="career">Career</option>
              <option value="volunteer">Volunteer</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts & Culture</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="points">Points*</label>
            <input
              type="number"
              id="points"
              name="points"
              value={eventData.points}
              onChange={handleChange}
              min="0"
              required
            />
            {errors.points && <div className="error-message">{errors.points}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="maxAttendees">Max Attendees (0 for unlimited)</label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              value={eventData.maxAttendees}
              onChange={handleChange}
              min="0"
            />
            {errors.maxAttendees && <div className="error-message">{errors.maxAttendees}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="organizer">Organizer/Host</label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={eventData.organizer}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={eventData.contactEmail}
              onChange={handleChange}
            />
            {errors.contactEmail && <div className="error-message">{errors.contactEmail}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={eventData.imageUrl}
            onChange={handleChange}
          />
        </div>
        
        {isAdmin && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={eventData.status}
              onChange={handleChange}
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}
        
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : isAdmin ? "Create Event" : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
}
