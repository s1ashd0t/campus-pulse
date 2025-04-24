// src/pages/EventDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetails.css'; // Optional: custom styling

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
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const foundEvent = dummyEvents.find(e => e.id.toString() === id);
    setEvent(foundEvent);
  }, [id]);

  if (!event) return <p>Event not found</p>;

  return (
    <div className="event-details-container">
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Points:</strong> {event.points}</p>
      <p><strong>Description:</strong> {event.description}</p>
    </div>
  );
};

export default EventDetails;
