import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllEvents } from '../services/eventService';
import './Homepage.css';
import PointsSummary from './PointsSummary';

const Homepage = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [userPoints, setUserPoints] = useState(120);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                
                //approved events
                const result = await getAllEvents("approved");
                
                if (result.success) {
                    const now = new Date();
                    let events = [...result.events];
                    
                    console.log("Events before filtering:", events);
                    
                    if (events.length === 0) {
                        console.log("No events found, adding dummy events");
                        
                
                        const pastDate = new Date();
                        pastDate.setDate(pastDate.getDate() - 15); 
                        
                        const futureDate1 = new Date();
                        futureDate1.setDate(futureDate1.getDate() + 15); 
                        
                        const futureDate2 = new Date();
                        futureDate2.setDate(futureDate2.getDate() + 30); 
    
                        const formatDate = (date) => {
                            return date.toISOString().split('T')[0]; 
                        };
                        
                        events = [
                            {
                                id: "dummy-past-1",
                                title: "Past Event Example",
                                date: formatDate(pastDate),
                                time: "2:00 PM - 4:00 PM",
                                location: "Main Campus",
                                points: 15,
                                description: "This is a past event for testing.",
                                status: "approved"
                            },
                            {
                                id: "dummy-future-1",
                                title: "Future Event Example 1",
                                date: formatDate(futureDate1),
                                time: "10:00 AM - 12:00 PM",
                                location: "Student Center",
                                points: 20,
                                description: "This is a future event for testing.",
                                status: "approved"
                            },
                            {
                                id: "dummy-future-2",
                                title: "Future Event Example 2",
                                date: formatDate(futureDate2),
                                time: "1:00 PM - 3:00 PM",
                                location: "Library",
                                points: 25,
                                description: "This is another future event for testing.",
                                status: "approved"
                            }
                        ];
                        
                        console.log("Added dummy events:", events);
                    }
                    
                    const getEventDate = (event) => {
                        if (event.dateTime?.toDate) {
                            return event.dateTime.toDate();
                        } else if (event.dateTime) {
                            return new Date(event.dateTime);
                        } else if (event.date) {
                            const [year, month, day] = event.date.split("-").map(Number);
                            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                                const dateObj = new Date(year, month - 1, day);
                                
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
                            return new Date(event.date);
                        } else {
                            return null;
                        }
                    };
                    
                    const filteredEvents = events.filter(event => {
                        const eventDate = getEventDate(event);
                        console.log(`Event: ${event.title}, Date: ${event.date}, Parsed Date: ${eventDate}, Is Upcoming: ${eventDate && eventDate >= now}`);
                        return eventDate && eventDate >= now;
                    });
                    
                    filteredEvents.sort((a, b) => {
                        const dateA = getEventDate(a);
                        const dateB = getEventDate(b);
                        return dateA - dateB;
                    });
                    
                    console.log("Filtered upcoming events:", filteredEvents);
                    
                    setUpcomingEvents(filteredEvents.slice(0, 3));
                } else {
                    console.error("Error fetching events:", result.error);
                    const futureDate1 = new Date();
                    futureDate1.setDate(futureDate1.getDate() + 15);
                    
                    const futureDate2 = new Date();
                    futureDate2.setDate(futureDate2.getDate() + 30);
                    
                    const futureDate3 = new Date();
                    futureDate3.setDate(futureDate3.getDate() + 45);
                    
                    const formatDate = (date) => {
                        return date.toISOString().split('T')[0];
                    };
                    
                    const dummyEvents = [
                        {
                            id: 1,
                            title: 'Tech Career Fair',
                            date: formatDate(futureDate1),
                            time: '10:00 AM - 3:00 PM',
                            location: 'Student Union',
                            points: 20
                        },
                        {
                            id: 2,
                            title: 'Entrepreneurship Workshop',
                            date: formatDate(futureDate2),
                            time: '2:00 PM - 4:00 PM',
                            location: 'Business Building, Room 302',
                            points: 15
                        },
                        {
                            id: 3,
                            title: 'Campus Cleanup Day',
                            date: formatDate(futureDate3),
                            time: '9:00 AM - 12:00 PM',
                            location: 'Main Quad',
                            points: 25
                        }
                    ];
                    setUpcomingEvents(dummyEvents);
                }
            } catch (error) {
                console.error("Error in fetchEvents:", error);
                const futureDate1 = new Date();
                futureDate1.setDate(futureDate1.getDate() + 15);
                
                const futureDate2 = new Date();
                futureDate2.setDate(futureDate2.getDate() + 30);
                
                const futureDate3 = new Date();
                futureDate3.setDate(futureDate3.getDate() + 45);
                
                const formatDate = (date) => {
                    return date.toISOString().split('T')[0];
                };
                
                const dummyEvents = [
                    {
                        id: 1,
                        title: 'Tech Career Fair',
                        date: formatDate(futureDate1),
                        time: '10:00 AM - 3:00 PM',
                        location: 'Student Union',
                        points: 20
                    },
                    {
                        id: 2,
                        title: 'Entrepreneurship Workshop',
                        date: formatDate(futureDate2),
                        time: '2:00 PM - 4:00 PM',
                        location: 'Business Building, Room 302',
                        points: 15
                    },
                    {
                        id: 3,
                        title: 'Campus Cleanup Day',
                        date: formatDate(futureDate3),
                        time: '9:00 AM - 12:00 PM',
                        location: 'Main Quad',
                        points: 25
                    }
                ];
                setUpcomingEvents(dummyEvents);
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvents();
    }, [user]);
    
    return (
        <div className="homepage-container">
            <div className="homepage-content">
                <div className="right-column">
                    <section className="quick-links">
                        <h2>Quick Links</h2>
                        <div className="links-grid">
                            <Link to="/scanner" className="quick-link"><span>Scan QR Code</span></Link>
                            <Link to="/leaderboard" className="quick-link"><span>Leaderboard</span></Link>
                            <Link to="/notifications" className="quick-link"><span>Notifications</span></Link>
                            <Link to="/profile" className="quick-link"><span>My Profile</span></Link>
                        </div>
                    </section>
                    <PointsSummary points={userPoints} />
                </div>
                <div className="left-column">
                    <section className="upcoming-events">
                        <h2>Upcoming Events</h2>
                        <div className="events-list">
                            {loading ? (
                                <p className="loading-events">Loading events...</p>
                            ) : upcomingEvents.length === 0 ? (
                                <p className="no-events">No upcoming events found.</p>
                            ) : (
                                upcomingEvents.map(event => (
                                    <Link to={`/event/${event.id}`} key={event.id} className="event-card">
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
                                    </Link>
                                ))
                            )}
                        </div>
                        <Link to="/events" className="view-all-link">View All Events</Link>
                    </section>

                    <div className="survey-link-container">
                        <Link to="/survey" className="quick-link">
                            <span>Take Surveys</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
