import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserNotifications, markNotificationAsRead, updateNotification } from '../services/notificationService';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const result = await getUserNotifications(user.uid);
                
                if (result.success) {
                    const notifs = result.notifications || [];
                    setNotifications(notifs);
                    setFilteredNotifications(notifs);
                } else {
                    setError("Failed to load notifications");
                    console.error("Error fetching notifications:", result.error);
                    
                    //Fallback dummy data if real data fails
                    const dummyNotifs = [
                        { id: 'dummy1', type: 'event', message: '🎉 New Event: Tech Meetup', date: '2025-03-15', read: false },
                        { id: 'dummy2', type: 'points', message: '🏆 You earned 50 points for attending the workshop!', date: '2025-03-10', read: false },
                        { id: 'dummy3', type: 'admin', message: '📢 Important: Campus closure this weekend', date: '2025-03-12', read: true },
                        { id: 'dummy4', type: 'event', message: '🎮 Gaming Night on Friday!', date: '2025-03-14', read: false },
                        { id: 'dummy5', type: 'rsvp', message: '✅ Your RSVP for Career Development Seminar is confirmed', date: '2025-03-11', read: true },
                    ];
                    setNotifications(dummyNotifs);
                    setFilteredNotifications(dummyNotifs);
                }
            } catch (err) {
                console.error("Error in fetchNotifications:", err);
                setError("An error occurred while fetching notifications");
            } finally {
                setLoading(false);
            }
        };
        
        fetchNotifications();
    }, [user]);

   
    useEffect(() => {
        let filtered = [...notifications];
        
        //applying filters 
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(notif => 
                notif.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (showStarredOnly) {
            filtered = filtered.filter(notif => notif.important);
        }
        
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
        
        setFilteredNotifications(filtered);
    }, [searchTerm, notifications, sortOrder, showStarredOnly]);

    const handleNotificationClick = async (notificationId) => {
        if (!notificationId || notificationId.startsWith('dummy')) return;
        
        try {
            const result = await markNotificationAsRead(notificationId);
            if (result.success) {
                //updating local state notification as read
                setNotifications(prev => 
                    prev.map(notif => 
                        notif.id === notificationId ? {...notif, read: true} : notif
                    )
                );
                setFilteredNotifications(prev => 
                    prev.map(notif => 
                        notif.id === notificationId ? {...notif, read: true} : notif
                    )
                );
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const toggleImportant = async (e, notificationId) => {
        e.stopPropagation(); //Prevent the notification click handler from firing
        
        if (!notificationId || notificationId.startsWith('dummy')) {
            //update the local state cuz its dummy data
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId ? {...notif, important: !notif.important} : notif
                )
            );
            setFilteredNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId ? {...notif, important: !notif.important} : notif
                )
            );
            return;
        }
        
        try {
            const notif = notifications.find(n => n.id === notificationId);
            const result = await updateNotification(notificationId, {
                important: !notif.important
            });
            
            if (result.success) {
                //updating the local state
                setNotifications(prev => 
                    prev.map(notif => 
                        notif.id === notificationId ? {...notif, important: !notif.important} : notif
                    )
                );
                setFilteredNotifications(prev => 
                    prev.map(notif => 
                        notif.id === notificationId ? {...notif, important: !notif.important} : notif
                    )
                );
            }
        } catch (err) {
            console.error("Error toggling important flag:", err);
        }
    };

    const toggleSelectNotification = (notificationId) => {
        if (selectedNotifications.includes(notificationId)) {
            setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
        } else {
            setSelectedNotifications(prev => [...prev, notificationId]);
        }
    };

    const handleDeleteSelected = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        //call API to delete the selected notifications & remove them from the local state
        setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
        setFilteredNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
        setSelectedNotifications([]);
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const getNotificationTypeClass = (type) => {
        switch (type) {
            case 'rsvp': return 'notification-rsvp';
            case 'admin': return 'notification-admin';
            case 'points': return 'notification-points';
            case 'event': return 'notification-event';
            default: return '';
        }
    };

    return (
        <div className="notifications-container">
            <h1>🔔 Notifications</h1>
            
            <div className="notification-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                
                <div className="sort-container">
                    <button 
                        className={`sort-button ${sortOrder === 'newest' ? 'active' : ''}`}
                        onClick={() => setSortOrder('newest')}
                    >
                        Newest First
                    </button>
                    <button 
                        className={`sort-button ${sortOrder === 'oldest' ? 'active' : ''}`}
                        onClick={() => setSortOrder('oldest')}
                    >
                        Oldest First
                    </button>
                    <button 
                        className={`sort-button ${showStarredOnly ? 'active' : ''}`}
                        onClick={() => setShowStarredOnly(!showStarredOnly)}
                        title={showStarredOnly ? "Show all notifications" : "Show starred notifications only"}
                    >
                        {showStarredOnly ? "All Notifications" : "⭐ Starred Only"}
                    </button>
                </div>
                
                {selectedNotifications.length > 0 && (
                    <div className="bulk-actions">
                        <span>{selectedNotifications.length} selected</span>
                        <button 
                            className="delete-button"
                            onClick={handleDeleteSelected}
                        >
                            Delete Selected
                        </button>
                    </div>
                )}
            </div>
            
            {showDeleteConfirm && (
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete {selectedNotifications.length} notification(s)?</p>
                    <div className="confirmation-buttons">
                        <button onClick={cancelDelete} className="cancel-button">Cancel</button>
                        <button onClick={confirmDelete} className="confirm-button">Delete</button>
                    </div>
                </div>
            )}
            
            {loading ? (
                <div className="loading">Loading notifications...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : filteredNotifications.length === 0 ? (
                <div className="no-notifications">
                    {searchTerm ? "No notifications match your search" : "You have no notifications"}
                </div>
            ) : (
                <ul className="notifications-list">
                    {filteredNotifications.map((notif, index) => (
                        <li 
                            key={notif.id || index} 
                            className={`hover-card ${notif.read ? 'read' : 'unread'} ${getNotificationTypeClass(notif.type)}`}
                            onClick={() => handleNotificationClick(notif.id)}
                        >
                            <div className="notification-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={selectedNotifications.includes(notif.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleSelectNotification(notif.id);
                                    }}
                                />
                            </div>
                            <div className="notification-content">
                                <strong>{notif.message}</strong>
                                <span className="notification-date">{notif.date}</span>
                            </div>
                            <div className="notification-actions">
                                <button 
                                    className={`star-button ${notif.important ? 'important' : ''}`}
                                    onClick={(e) => toggleImportant(e, notif.id)}
                                    title={notif.important ? "Unmark as important" : "Mark as important"}
                                >
                                    {notif.important ? '⭐' : '☆'}
                                </button>
                                {!notif.read && <div className="unread-indicator"></div>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
