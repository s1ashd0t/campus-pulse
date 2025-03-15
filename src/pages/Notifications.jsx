import React, { useEffect, useState } from 'react';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Expanded to 10 dummy notifications
        const dummyNotifs = [
            { message: '🎉 New Event: Tech Meetup', date: '2025-03-15' },
            { message: '🏆 Leaderboard updated!', date: '2025-03-10' },
            { message: '📢 Workshop: Resume Building', date: '2025-03-12' },
            { message: '🎮 Gaming Night on Friday!', date: '2025-03-14' },
            { message: '🎓 Seminar: Career Development', date: '2025-03-11' },
            { message: '🏅 Badge awarded: Top Contributor', date: '2025-03-09' },
            { message: '🚀 Hackathon registration open!', date: '2025-03-08' },
            { message: '👥 New Group Study Session', date: '2025-03-13' },
            { message: '🗓 Reminder: Club meeting tomorrow', date: '2025-03-16' },
            { message: '🎁 Congrats! You earned 500 points!', date: '2025-03-07' },
        ];
        setNotifications(dummyNotifs);
    }, []);

    return (
        <div className="notifications-container">
            <h1>🔔 Notifications</h1>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={index} className="hover-card">
                        <strong>{notif.message}</strong>
                        <span>{notif.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
