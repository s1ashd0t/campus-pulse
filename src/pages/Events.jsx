import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllEvents } from '../services/eventService';
import './EventsPage.css';
import EventDetails from './EventDetails';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('upcoming');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError('');
            
            const now = new Date();
            const result = await getAllEvents('approved');
            
            if (result.success) {
                let filteredEvents = [...result.events];
                
                const getEventDate = (event) => {
                    if (event.dateTime?.toDate) {
                        return event.dateTime.toDate();
                    } else if (event.dateTime) {
                        return new Date(event.dateTime);
                    } else if (event.date) {
                        const dateObj = new Date(event.date);
                        if (event.time) {
                            const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
                            if (timeMatch) {
                                let hours = parseInt(timeMatch[1]);
                                const minutes = parseInt(timeMatch[2]);
                                const period = timeMatch[3].toUpperCase();
                                
                                if (period === "PM" && hours < 12) hours += 12;
                                if (period === "AM" && hours === 12) hours = 0;
                                
                                dateObj.setHours(hours, minutes, 0, 0);
                            }
                        }
                        return dateObj;
                    }
                    return null;
                };

                if (filter === 'upcoming') {
                    filteredEvents = filteredEvents.filter((event) => {
                        const eventDate = getEventDate(event);
                        return eventDate && eventDate >= now;
                    });
                    filteredEvents.sort((a, b) => getEventDate(a) - getEventDate(b));
                } else if (filter === 'past') {
                    filteredEvents = filteredEvents.filter((event) => {
                        const eventDate = getEventDate(event);
                        return eventDate && eventDate < now;
                    });
                    filteredEvents.sort((a, b) => getEventDate(b) - getEventDate(a));
                }

                setEvents(filteredEvents);
            } else {
                setError('Failed to load events');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('An error occurred while fetching events');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) {
        return <div className="events-container">Loading events...</div>;
    }

    return (
        <div className="events-container-user">
            <h1>Events</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="filter-buttons">
                <button
                    className={`filter-button ${filter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setFilter('upcoming')}
                >
                    Upcoming Events
                </button>
                <button
                    className={`filter-button ${filter === 'past' ? 'active' : ''}`}
                    onClick={() => setFilter('past')}
                >
                    Past Events
                </button>
            </div>

            <div className="events-list-user">
                {events.length === 0 ? (
                    <p className="no-events">No events found.</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="event-card-user">
                            <h3>{event.title}</h3>
                            <p><strong>Date:</strong> {formatDate(event.date || event.dateTime)}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Points:</strong> {event.points}</p>
                            <div className="event-description">
                                <p>{event.description}</p>
                            </div>
                            <div className="event-actions">
                                <button
                                    className="view-details-button"
                                    onClick={() => navigate(`/event/${event.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Events;