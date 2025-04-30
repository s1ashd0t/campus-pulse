// src/components/CreateEvent.jsx
import { useState, useContext } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import QRCode from 'qrcode';
import "../../styles/components.css";
import { AuthContext } from "../../context/AuthContext";

const CAMPUS_LOCATIONS = ["Walb Union", "Kettler Hall", "Music Center"];

export default function CreateEvent({ onSuccess }) {
  const { user, userRole } = useContext(AuthContext);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: CAMPUS_LOCATIONS[0], // Default to first location
    description: "",
    points: 10,
    time: ""
  });
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateEventQRCode = async (eventId) => {
    try {
      const eventRegistrationUrl = `${window.location.origin}/register/${eventId}`;
      const qrCode = await QRCode.toDataURL(eventRegistrationUrl);
      return qrCode;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Add event to Firestore with status "approved" since it's created by admin
      const eventRef = await addDoc(collection(db, "events"), {
        ...eventData,
        status: "approved", // Explicitly setting status to approved
        createdBy: user.uid,
        createdAt: new Date(),
        registeredUsers: [],
        maxCapacity: 100,
        isActive: true
      });

      const qrCode = await generateEventQRCode(eventRef.id);
      
      if (qrCode) {
        await updateDoc(eventRef, {
          qrCodeUrl: qrCode
        });
        setQrCodeUrl(qrCode);
      }

      if (onSuccess) {
        onSuccess();
      }

      setEventData({
        title: "",
        date: "",
        location: CAMPUS_LOCATIONS[0],
        description: "",
        points: 10,
        time: ""
      });
    } catch (error) {
      console.error("Error adding event: ", error);
      setError("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="event-details-container">
      <h2>Create Event</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="event-info">
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Title:</strong>
            <input
              type="text"
              placeholder="Event Title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </p>
          
          <p>
            <strong>Date:</strong>
            <input
              type="datetime-local"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </p>
          
          <p>
            <strong>Location:</strong>
            <select
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
              className="form-select"
            >
              {CAMPUS_LOCATIONS.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </p>
          
          <p>
            <strong>Points:</strong>
            <input
              type="number"
              name="points"
              value={eventData.points}
              onChange={handleChange}
              required
              className="form-input"
            />
          </p>
          
          <p>
            <strong>Description:</strong>
            <textarea
              placeholder="Description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
              className="form-textarea"
            />
          </p>
          
          <div className="event-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
      
      {qrCodeUrl && (
        <div className="qr-code-preview">
          <h3>Event QR Code</h3>
          <img src={qrCodeUrl} alt="Event QR Code" />
          <p>This QR code can be used for event check-in.</p>
        </div>
      )}
    </div>
  );
}
