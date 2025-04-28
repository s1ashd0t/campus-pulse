import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminHomepage.css';
import { getAllEvents } from '../services/eventService';

const AdminHomepage = () => {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                
                // Fetch pending events
                const pendingResult = await getAllEvents("pending");
                if (pendingResult.success) {
                    setPendingEvents(pendingResult.events.slice(0, 3)); // Show only 3 most recent
                }
                
                // Fetch recent approved events
                const approvedResult = await getAllEvents("approved");
                if (approvedResult.success) {
                    // Sort by date and get most recent
                    const sorted = [...approvedResult.events].sort((a, b) => 
                        new Date(b.date) - new Date(a.date)
                    );
                    setRecentEvents(sorted.slice(0, 3));
                }
                
                setError("");
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("An error occurred while fetching events");
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvents();
    }, []);
    
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };
    
    return (
        <div className="admin-homepage-container">
            <h1>Admin Dashboard</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="admin-homepage-content">
                <div className="admin-left-column">
                    <section className="admin-quick-links">
                        <h2>Management</h2>
                        <div className="admin-links-grid">
                            <Link to="/admin-events" className="admin-quick-link">
                                <span>Event Management</span>
                            </Link>
                            <Link to="/admin-dashboard" className="admin-quick-link">
                                <span>Analytics Dashboard</span>
                            </Link>
                            <Link to="/reward-management" className="admin-quick-link">
                                <span>Reward Management</span>
                            </Link>
                            <Link to="/notifications" className="admin-quick-link">
                                <span>Notifications</span>
                            </Link>
                        </div>
                    </section>
                </div>
                
                <div className="admin-right-column">
                    <section className="pending-events">
                        <h2>Pending Events</h2>
                        {loading ? (
                            <div className="loading">Loading events...</div>
                        ) : pendingEvents.length === 0 ? (
                            <div className="no-events">No pending events</div>
                        ) : (
                            <div className="admin-events-list">
                                {pendingEvents.map(event => (
                                    <div key={event.id} className="admin-event-card">
                                        <div className="admin-event-details">
                                            <h3>{event.title}</h3>
                                            <p><strong>Date:</strong> {formatDate(event.date)}</p>
                                            <p><strong>Location:</strong> {event.location}</p>
                                        </div>
                                        <Link to="/admin-events" className="review-button">
                                            Review
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Link to="/admin-events" className="view-all-link">View All Events</Link>
                    </section>
                    
                    <section className="recent-events">
                        <h2>Recent Events</h2>
                        {loading ? (
                            <div className="loading">Loading events...</div>
                        ) : recentEvents.length === 0 ? (
                            <div className="no-events">No recent events</div>
                        ) : (
                            <div className="admin-events-list">
                                {recentEvents.map(event => (
                                    <div key={event.id} className="admin-event-card">
                                        <div className="admin-event-details">
                                            <h3>{event.title}</h3>
                                            <p><strong>Date:</strong> {formatDate(event.date)}</p>
                                            <p><strong>Location:</strong> {event.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminHomepage;
