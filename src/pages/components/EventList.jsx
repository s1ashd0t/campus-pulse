import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./EventList.css";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatLocation = (location) => {
    if (!location) return "No location specified";
    if (typeof location === "string") return location;
    if (location.lat && location.lng) {
      return `${location.lat}, ${location.lng}`;
    }
    return "Invalid location format";
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="events-container">
        <div className="empty-events">
          <h3>No events found</h3>
          <p>Check back later for upcoming events!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      {events.map(event => (
        <div key={event.id} className="event-item">
          <h3>{event.title}</h3>
          <div className="event-info">
            <div className="event-details">
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}</p>
              <p><strong>Location:</strong> {formatLocation(event.location)}</p>
              {event.description && (
                <p><strong>Description:</strong> {event.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
