import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { rsvpToEvent, getUserRsvpStatus, cancelRsvp } from '../services/rsvpService';
import { sendRsvpConfirmation } from '../services/rsvpService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        //an event from Firestore
        const eventRef = doc(db, "events", id);
        const eventDoc = await getDoc(eventRef);
        
        if (eventDoc.exists()) {
          const eventData = {
            id: eventDoc.id,
            ...eventDoc.data()
          };
          setEvent(eventData);
          
          //checking if user has already RSVPed
          if (user) {
            try {
              const result = await getUserRsvpStatus(user.uid, id);
              if (result.success) {
                setRsvpStatus(result.status);
              }
            } catch (error) {
              console.error("Error checking RSVP status:", error);
            }
          }
        } else {
          setError("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Error loading event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleRSVP = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await rsvpToEvent(user.uid, id);
      
      if (result.success) {
        setRsvpStatus('going');
        setMessage({ type: 'success', text: 'You have successfully registered for this event!' });
        
        //sending confirmation of the RSVP
        await sendRsvpConfirmation(user.uid, id, event.title);
      } else {
        setMessage({ type: 'error', text: 'Failed to register. Please try again.' });
      }
    } catch (error) {
      console.error("Error during RSVP:", error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = () => {
    navigate('/scanner', { state: { fromEvent: true, eventId: id } });
  };

  const handleCancelRSVP = async () => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await cancelRsvp(user.uid, id);
      
      if (result.success) {
        setRsvpStatus(null);
        setMessage({ type: 'success', text: 'Your registration has been canceled.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to cancel registration. Please try again.' });
      }
    } catch (error) {
      console.error("Error canceling RSVP:", error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="event-details-container">
        <p>Loading event details...</p>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="event-details-container">
        <p>{error || "Event not found"}</p>
        <button 
          onClick={() => navigate('/events')}
          className="back-button"
        >
          Back to Events
        </button>
      </div>
    );
  }

  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="event-details-container">
      <h2>{event.title}</h2>
      
      <div className="event-info">
        <p><strong>Date:</strong> {formatDate(event.date || event.dateTime)}</p>
        <p><strong>Time:</strong> {event.time || "N/A"}</p>
        <p><strong>Location:</strong> {event.location || "N/A"}</p>
        <p><strong>Points:</strong> {event.points || 0}</p>
        <p><strong>Description:</strong> {event.description || "No description available."}</p>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="event-actions">
        {rsvpStatus === 'going' ? (
          <>

            
            <button 
              onClick={handleScanQR}
              className="scan-qr-button"
            >
              Scan QR Code
            </button>


            <button 
              onClick={handleCancelRSVP} 
              disabled={loading}
              className="cancel-rsvp-button"
            >
              {loading ? 'Processing...' : 'Cancel Registration'}
            </button>
          </>
        ) : (
          <button 
            onClick={handleRSVP} 
            disabled={loading}
            className="rsvp-button"
          >
            {loading ? 'Processing...' : 'Register for Event'}
          </button>
        )}
        
        <button 
          onClick={() => navigate('/events')}
          className="back-button"
        >
          Back to Events
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
