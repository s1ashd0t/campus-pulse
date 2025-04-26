import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { rsvpToEvent, getUserRsvpStatus, sendRsvpConfirmation } from '../services/rsvpService';
import './EventDetails.css';

const dummyEvents = [
  {
    id: 1,
    title: 'Tech Career Fair',
    date: '2025-04-15',
    time: '10:00 AM - 3:00 PM',
    location: 'Student Union',
    points: 20,
    description: 'Meet top tech employers and explore career opportunities.',
  },
  {
    id: 2,
    title: 'Entrepreneurship Workshop',
    date: '2025-04-18',
    time: '2:00 PM - 4:00 PM',
    location: 'Business Building, Room 302',
    points: 15,
    description: 'Learn startup essentials and pitch your ideas.',
  },
  {
    id: 3,
    title: 'Campus Cleanup Day',
    date: '2025-04-22',
    time: '9:00 AM - 12:00 PM',
    location: 'Main Quad',
    points: 25,
    description: 'Help keep our campus clean and green.',
  }
];

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const foundEvent = dummyEvents.find(e => e.id.toString() === id);
    setEvent(foundEvent);
    
    // Fetch RSVP status if user is logged in
    if (user && foundEvent) {
      const fetchRsvpStatus = async () => {
        try {
          const result = await getUserRsvpStatus(user.uid, id);
          if (result.success) {
            setRsvpStatus(result.status);
          }
        } catch (err) {
          console.error("Error fetching RSVP status:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchRsvpStatus();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const handleRsvp = async (status) => {
    if (!user) return;
    
    setRsvpLoading(true);
    try {
      // Update RSVP in database
      const result = await rsvpToEvent(user.uid, id, status);
      
      if (result.success) {
        setRsvpStatus(status);
        
        // Send confirmation notification
        await sendRsvpConfirmation(user.uid, id, event.title, status);
      } else {
        setError("Failed to update RSVP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error updating RSVP:", err);
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-details-container">
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Points:</strong> {event.points}</p>
      <p><strong>Description:</strong> {event.description}</p>
      
      {error && <div className="error-message">{error}</div>}
      
      {user && (
        <div className="rsvp-container">
          <h3>Will you attend?</h3>
          <div className="rsvp-buttons">
            <button 
              className={`rsvp-button ${rsvpStatus === 'going' ? 'active' : ''}`}
              onClick={() => handleRsvp('going')}
              disabled={rsvpLoading}
            >
              Going
            </button>
            <button 
              className={`rsvp-button ${rsvpStatus === 'maybe' ? 'active' : ''}`}
              onClick={() => handleRsvp('maybe')}
              disabled={rsvpLoading}
            >
              Maybe
            </button>
            <button 
              className={`rsvp-button ${rsvpStatus === 'not-going' ? 'active' : ''}`}
              onClick={() => handleRsvp('not-going')}
              disabled={rsvpLoading}
            >
              Not Going
            </button>
          </div>
          {rsvpLoading && <div className="rsvp-loading">Updating...</div>}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
