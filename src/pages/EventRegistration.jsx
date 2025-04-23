import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './EventRegistration.css';

const EventRegistration = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError("Error loading event");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleRegistration = async () => {
    if (!user || !event) return;

    try {
      const eventRef = doc(db, "events", eventId);
      const eventDoc = await getDoc(eventRef);
      const currentEvent = eventDoc.data();

      // Check if user is already registered
      if (currentEvent.registeredUsers.includes(user.uid)) {
        setRegistrationStatus("You're already registered for this event!");
        return;
      }

      // Check event capacity
      if (currentEvent.registeredUsers.length >= currentEvent.maxCapacity) {
        setRegistrationStatus("Sorry, this event is at full capacity");
        return;
      }

      // Register user
      await updateDoc(eventRef, {
        registeredUsers: arrayUnion(user.uid)
      });

      // Update user's points (optional)
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        points: increment(10),
        eventsAttended: increment(1)
      });

      setRegistrationStatus("Successfully registered for the event!");
      setTimeout(() => navigate('/homepage'), 2000);

    } catch (err) {
      setError("Error registering for event");
      console.error(err);
    }
  };

  if (loading) return <div className="event-registration loading">Loading...</div>;
  if (error) return <div className="event-registration error">{error}</div>;
  if (!event) return <div className="event-registration error">Event not found</div>;

  return (
    <div className="event-registration">
      <h1>Event Registration</h1>
      <div className="event-details">
        <h2>{event.title}</h2>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Available Spots:</strong> {event.maxCapacity - event.registeredUsers.length}</p>
      </div>

      {registrationStatus ? (
        <div className="registration-status">{registrationStatus}</div>
      ) : (
        <button onClick={handleRegistration} className="register-button">
          Register for Event
        </button>
      )}
    </div>
  );
};

export default EventRegistration;