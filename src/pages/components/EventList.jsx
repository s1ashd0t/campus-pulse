import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "./EventList.css";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const { isAdmin } = useAuth();

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

  // Add effect to handle body scrolling when modal is open
  useEffect(() => {
    if (showQRModal) {
      document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQRModal]);

  const handleEdit = (event) => {
    setEditingEvent({
      ...event,
      date: new Date(event.date).toISOString().slice(0, 16)
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const eventRef = doc(db, "events", editingEvent.id);
      await updateDoc(eventRef, {
        title: editingEvent.title,
        date: new Date(editingEvent.date).toISOString(),
        location: editingEvent.location,
        description: editingEvent.description
      });
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await deleteDoc(doc(db, "events", eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowQR = (event) => {
    setSelectedQR(event);
    setShowQRModal(true);
  };

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
      <h2>Upcoming Events</h2>
      <div className="events-list">
      {events.map(event => (
        <div key={event.id} className="event-item">
          {editingEvent?.id === event.id ? (
            <form onSubmit={handleUpdate} className="edit-form">
              <input
                type="text"
                name="title"
                value={editingEvent.title}
                onChange={handleChange}
                required
              />
              <input
                type="datetime-local"
                name="date"
                value={editingEvent.date}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="location"
                value={editingEvent.location}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                value={editingEvent.description}
                onChange={handleChange}
                required
              />
              <div className="edit-actions">
                <button type="submit" className="save-button">Save</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
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
                {isAdmin && (
                  <div className="event-actions">
                    {event.qrCodeUrl && (
                      <button 
                        className="qr-button"
                        onClick={() => handleShowQR(event)}
                      >
                        Show QR
                      </button>
                    )}
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedQR && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{selectedQR.title} - QR Code</h3>
            <div className="modal-qr-code">
              <img src={selectedQR.qrCodeUrl} alt="Event QR Code" />
            </div>
            <p>Share this QR code with attendees for easy registration</p>
            <button className="close-modal-button" onClick={() => setShowQRModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
