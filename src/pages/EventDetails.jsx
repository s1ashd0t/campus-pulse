import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Dummy events for testing
  const dummyEvents = [
    {
      id: "1",
      title: 'Tech Career Fair',
      date: '2025-04-15',
      time: '10:00 AM - 3:00 PM',
      location: 'Student Union',
      points: 20,
      description: 'Meet top tech employers and explore career opportunities.',
      status: 'approved'
    },
    {
      id: "2",
      title: 'Entrepreneurship Workshop',
      date: '2025-04-18',
      time: '2:00 PM - 4:00 PM',
      location: 'Business Building, Room 302',
      points: 15,
      description: 'Learn startup essentials and pitch your ideas.',
      status: 'approved'
    },
    {
      id: "3",
      title: 'Campus Cleanup Day',
      date: '2025-04-22',
      time: '9:00 AM - 12:00 PM',
      location: 'Main Quad',
      points: 25,
      description: 'Help keep our campus clean and green.',
      status: 'approved'
    }
  ];

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    setError("");
    
    try {
      // First check if it's a dummy event
      const foundDummyEvent = dummyEvents.find(e => e.id.toString() === id);
      
      if (foundDummyEvent) {
        setEvent(foundDummyEvent);
      } else {
        // Try to fetch from Firestore
        const eventRef = doc(db, "events", id);
        const eventDoc = await getDoc(eventRef);
        
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        } else {
          setError("Event not found");
        }
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!user?.uid) {
      alert("Please log in to sign up for events.");
      return;
    }

    try {
      // Check if this is a dummy event
      const isDummyEvent = dummyEvents.some(e => e.id.toString() === id);
      
      if (!isDummyEvent) {
        // Only try to update Firestore for real events
        const eventRef = doc(db, "events", id);
        await updateDoc(eventRef, {
          signedUpUsers: arrayUnion(user.uid),
        });
      }
      
      // Always show success and navigate regardless of event type
      alert("✅ Signed up! Redirecting to QR scanner...");
      navigate(`/scanner?eventId=${id}`);
    } catch (err) {
      console.error("Error signing up:", err);
      // Even if there's an error, still navigate to scanner for demo purposes
      alert("✅ Signed up! Redirecting to QR scanner...");
      navigate(`/scanner?eventId=${id}`);
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-details-container">
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time || "Time not specified"}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Points:</strong> {event.points}</p>
      <p><strong>Description:</strong> {event.description}</p>

      {error && <div className="error-message">{error}</div>}

      {user && (
        <div className="rsvp-container">
          <button className="rsvp-button" onClick={handleSignUp}>
            Sign Up & Scan QR
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;