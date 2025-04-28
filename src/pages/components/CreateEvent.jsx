// src/components/CreateEvent.jsx
import { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import QRCode from 'qrcode';
import "./CreateEvent.css";

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: ""
  });
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

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
    try {
      // Add event to Firestore
      const eventRef = await addDoc(collection(db, "events"), {
        ...eventData,
        createdAt: new Date(),
        registeredUsers: [],
        maxCapacity: 100, // Default capacity
        isActive: true
      });

      // Generate QR code for the event
      const qrCode = await generateEventQRCode(eventRef.id);
      
      // Update event with QR code URL
      if (qrCode) {
        await updateDoc(eventRef, {
          qrCodeUrl: qrCode
        });
        setQrCodeUrl(qrCode);
      }

      alert("Event created successfully!");
      setEventData({ title: "", date: "", location: "", description: "" });
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Error creating event. Please try again.");
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
    <div className="create-event">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Title"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Location"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          required
        />
        <textarea
          placeholder="Description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Event</button>
      </form>
      
      {qrCodeUrl && (
        <div className="qr-code-preview">
          <h3>Event QR Code</h3>
          <img src={qrCodeUrl} alt="Event QR Code" />
          <p>Share this QR code with attendees for easy registration</p>
        </div>
      )}
    </div>
  );
}