import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import PointsSummary from './PointsSummary';

const Homepage = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [userPoints, setUserPoints] = useState(120);

    useEffect(() => {
        // Sample upcoming events data
        const dummyEvents = [
            {
                id: 1,
                title: 'Tech Career Fair',
                date: '2025-04-15',
                time: '10:00 AM - 3:00 PM',
                location: 'Student Union',
                points: 20
            },
            {
                id: 2,
                title: 'Entrepreneurship Workshop',
                date: '2025-04-18',
                time: '2:00 PM - 4:00 PM',
                location: 'Business Building, Room 302',
                points: 15
            },
            {
                id: 3,
                title: 'Campus Cleanup Day',
                date: '2025-04-22',
                time: '9:00 AM - 12:00 PM',
                location: 'Main Quad',
                points: 25
            }
        ];
        
        setUpcomingEvents(dummyEvents);
    }, []);

    return (
        <div className="homepage-container">


            <div className="homepage-content">
            <div className="right-column">
                    {/* Add the Points Summary Component */}
                    
                    <section className="quick-links">
                        <h2>Quick Links</h2>
                        <div className="links-grid">
                            <Link to="/scanner" className="quick-link">
                                <span>Scan QR Code</span>
                            </Link>
                            <Link to="/leaderboard" className="quick-link">
                                <span>Leaderboard</span>
                            </Link>
                            <Link to="/notifications" className="quick-link">
                                <span>Notifications</span>
                            </Link>
                            <Link to="/profile" className="quick-link">
                                <span>My Profile</span>
                            </Link>
                        </div>
                    </section>
                    <PointsSummary points={userPoints} />

                </div>
                <div className="left-column">
                    <section className="upcoming-events">
                        <h2>Upcoming Events</h2>
                        <div className="events-list">
                            {upcomingEvents.map(event => (
                                <div key={event.id} className="event-card">
                                    <div className="event-details">
                                        <h3>{event.title}</h3>
                                        <p><strong>Date:</strong> {event.date}</p>
                                        <p><strong>Time:</strong> {event.time}</p>
                                        <p><strong>Location:</strong> {event.location}</p>
                                    </div>
                                    <div className="event-points">
                                        <span>{event.points}</span>
                                        <small>points</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="/search" className="view-all-link">View All Events</Link>
                    </section>
                </div>

                
            </div>
        </div>
    );
};

export default Homepage;