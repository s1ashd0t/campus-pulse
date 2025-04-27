import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserNotifications, markNotificationAsRead } from '../services/notificationService';
import './Notifications.css';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) {
                console.warn("No user detected in AuthContext.");
                return;
            }

            try {
                setLoading(true);
                console.log("Fetching notifications for user ID:", user.uid);

                const result = await getUserNotifications(user.uid);

                if (result.success) {
                    setNotifications(result.notifications);
                    setError("");
                } else {
                    setError("An error fetching notifications. Please try again later.");
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setError("An error fetching notifications. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        // Explicitly wait for user to be defined
        if (user !== undefined) {
            fetchNotifications();
        }
    }, [user]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            const result = await markNotificationAsRead(notificationId);

            if (result.success) {
                setNotifications(notifications.map(notif => 
                    notif.id === notificationId ? { ...notif, read: true } : notif
                ));
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const getNotificationEmoji = (type) => {
        switch (type) {
            case 'event': return '🎉';
            case 'points': return '🎁';
            case 'admin': return '📢';
            case 'rsvp': return '✅';
            default: return '🔔';
        }
    };

    if (loading) return <div className="loading">Loading notifications...</div>;

    if (error) return (
        <div className="error">
            <p>{error}</p>
            {user ? (
                <p>Check if your notifications exist in the database for user ID: <code>{user.uid}</code></p>
            ) : (
                <p>Waiting for user to be loaded...</p>
            )}
        </div>
    );

    return (
        <div className="notifications-container">
            <h1>🔔 Notifications</h1>
            {notifications.length === 0 ? (
                <p className="no-notifications">No notifications yet</p>
            ) : (
                <ul>
                    {notifications.map((notif) => (
                        <li
                            key={notif.id}
                            className={`hover-card ${notif.read ? 'read' : 'unread'}`}
                            onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                        >
                            <div className="notification-content">
                                <strong>{getNotificationEmoji(notif.type)} {notif.message}</strong>
                                <span className="notification-date">{notif.date}</span>
                            </div>
                            {!notif.read && <span className="unread-indicator"></span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
