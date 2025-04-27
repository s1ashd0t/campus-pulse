import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllEvents, reviewEvent, deleteEvent } from "../../services/eventService";

const EventManagement = () => {
  const { user, userRole } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Only allow admin access
  if (userRole !== "admin") {
    return (
      <div className="event-management-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const result = await getAllEvents();
      if (result.success) {
        setEvents(result.events);
      } else {
        setError("Failed to load events");
      }
    } catch (err) {
      setError("An error occurred while fetching events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (eventId, status) => {
    setActionLoading(true);
    setSuccessMessage("");

    try {
      const result = await reviewEvent(eventId, status, user.uid, reviewNotes);

      if (result.success) {
        setSuccessMessage(`Event ${status === "approved" ? "approved" : "rejected"} successfully`);
        setReviewNotes("");
        setSelectedEvent(null);
        fetchEvents();
      } else {
        setError(result.error || "Failed to update event status");
      }
    } catch (err) {
      setError("An error occurred");
      console.error("Error reviewing event:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    setSuccessMessage("");

    try {
      const result = await deleteEvent(eventId);

      if (result.success) {
        setSuccessMessage("Event deleted successfully");
        fetchEvents();
      } else {
        setError(result.error || "Failed to delete event");
      }
    } catch (err) {
      setError("An error occurred");
      console.error("Error deleting event:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Group events by status
  const pendingEvents = events.filter(event => !event.status || event.status === "pending");
  const approvedEvents = events.filter(event => event.status === "approved");
  const rejectedEvents = events.filter(event => event.status === "rejected");

  // Render an event card
  const renderEventCard = (event) => (
    <div key={event.id} className={`event-card ${event.status || "pending"}`}>
      <div className="event-header">
        <h3>{event.title}</h3>
        <span className="event-status">{event.status || "pending"}</span>
      </div>

      <div className="event-details">
        <p><strong>Date:</strong> {formatDate(event.dateTime || event.date)}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Category:</strong> {event.category}</p>
        <p><strong>Points:</strong> {event.points}</p>
        {event.organizer && <p><strong>Organizer:</strong> {event.organizer}</p>}
        <p><strong>Created:</strong> {formatDate(event.createdAt?.toDate())}</p>
        {event.reviewedAt && (
          <p><strong>Reviewed:</strong> {formatDate(event.reviewedAt.toDate())}</p>
        )}
        {event.reviewNotes && (
          <p><strong>Review Notes:</strong> {event.reviewNotes}</p>
        )}
      </div>

      <div className="event-description">
        <p>{event.description}</p>
      </div>

      <div className="event-actions">
        <button className="approve-button" onClick={() => setSelectedEvent(event)} disabled={actionLoading}>
          Review
        </button>
        <button className="delete-button" onClick={() => handleDelete(event.id)} disabled={actionLoading}>
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="event-management-container">
      <h2>Event Management</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <button className="refresh-button" onClick={fetchEvents} disabled={loading}>
        Refresh
      </button>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="no-events">No events found</div>
      ) : (
        <div className="events-sections">
          <div className="events-section pending-section">
            <h3>Pending Events ({pendingEvents.length})</h3>
            {pendingEvents.length === 0 ? (
              <p>No pending events</p>
            ) : (
              <div className="events-list">
                {pendingEvents.map(renderEventCard)}
              </div>
            )}
          </div>

          <div className="events-section approved-section">
            <h3>Approved Events ({approvedEvents.length})</h3>
            {approvedEvents.length === 0 ? (
              <p>No approved events</p>
            ) : (
              <div className="events-list">
                {approvedEvents.map(renderEventCard)}
              </div>
            )}
          </div>

          <div className="events-section rejected-section">
            <h3>Rejected Events ({rejectedEvents.length})</h3>
            {rejectedEvents.length === 0 ? (
              <p>No rejected events</p>
            ) : (
              <div className="events-list">
                {rejectedEvents.map(renderEventCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="review-modal">
          <div className="review-modal-content">
            <h3>Review Event: {selectedEvent.title}</h3>

            <div className="review-form">
              <div className="form-group">
                <label htmlFor="reviewNotes">Review Notes (optional):</label>
                <textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                />
              </div>

              <div className="review-actions">
                <button className="approve-button" onClick={() => handleReview(selectedEvent.id, "approved")} disabled={actionLoading}>
                  {actionLoading ? "Processing..." : "Approve"}
                </button>

                <button className="reject-button" onClick={() => handleReview(selectedEvent.id, "rejected")} disabled={actionLoading}>
                  {actionLoading ? "Processing..." : "Reject"}
                </button>

                <button className="cancel-button" onClick={() => { setSelectedEvent(null); setReviewNotes(""); }} disabled={actionLoading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
