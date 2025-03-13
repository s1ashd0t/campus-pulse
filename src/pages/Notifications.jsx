import React, { useEffect, useState } from 'react';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Placeholder notifications
        const dummyNotifs = [
            { message: 'New Event: Tech Meetup', date: '2025-03-15' },
            { message: 'Leaderboard updated!', date: '2025-03-10' },
        ];
        setNotifications(dummyNotifs);
    }, []);

    return (
        <div className="notifications-container">
            <h1>Notifications</h1>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={index}>
                        <strong>{notif.message}</strong> <span>({notif.date})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
