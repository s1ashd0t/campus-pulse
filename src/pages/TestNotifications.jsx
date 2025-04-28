import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
    createTestNotification, 
    createMultipleTestNotifications,
    createEventTestNotification,
    createRsvpTestNotification,
    createPointsTestNotification,
    createAdminTestNotification,
    createImportantTestNotification
} from '../services/testService';
import './Notifications.css'; 

const TestNotifications = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const { user } = useContext(AuthContext);

    const handleCreateNotification = async (createFunction, type = '') => {
        if (!user) {
            setResult({ success: false, error: 'You must be logged in to create notifications' });
            return;
        }

        setLoading(true);
        try {
            const response = await createFunction(user.uid);
            setResult({
                ...response,
                message: `Created ${type} notification successfully!`
            });
        } catch (error) {
            setResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notifications-container">
            <h1>🧪 Test Notifications</h1>
            <p>Use this page to test the enhanced notifications functionality.</p>

            <div className="test-buttons">
                <h3>Create Notifications by Type</h3>
                <div className="notification-type-buttons">
                    <button 
                        onClick={() => handleCreateNotification(createEventTestNotification, 'event')}
                        disabled={loading || !user}
                        className="test-button event-button"
                    >
                        Create Event Notification (Blue)
                    </button>
                    
                    <button 
                        onClick={() => handleCreateNotification(createRsvpTestNotification, 'RSVP')}
                        disabled={loading || !user}
                        className="test-button rsvp-button"
                    >
                        Create RSVP Notification (Green)
                    </button>
                    
                    <button 
                        onClick={() => handleCreateNotification(createPointsTestNotification, 'points')}
                        disabled={loading || !user}
                        className="test-button points-button"
                    >
                        Create Points Notification (Gold)
                    </button>
                    
                    <button 
                        onClick={() => handleCreateNotification(createAdminTestNotification, 'admin')}
                        disabled={loading || !user}
                        className="test-button admin-button"
                    >
                        Create Admin Notification (Red)
                    </button>
                </div>
                
                <h3>Special Notifications</h3>
                <button 
                    onClick={() => handleCreateNotification(createImportantTestNotification, 'important')}
                    disabled={loading || !user}
                    className="test-button"
                >
                    Create Important Notification (⭐)
                </button>
                
                <button 
                    onClick={() => handleCreateNotification(createTestNotification, 'single')}
                    disabled={loading || !user}
                    className="test-button"
                >
                    Create Single Test Notification
                </button>
                
                <button 
                    onClick={() => handleCreateNotification(createMultipleTestNotifications, 'multiple')}
                    disabled={loading || !user}
                    className="test-button"
                >
                    Create Multiple Test Notifications
                </button>
            </div>

            {loading && <div className="loading">Creating notifications...</div>}

            {result && (
                <div className={`result ${result.success ? 'success' : 'error'}`}>
                    {result.success ? (
                        <p>✅ Success! {result.message || 'Check the Notifications page to see your new notification(s).'}</p>
                    ) : (
                        <p>❌ Error: {result.error}</p>
                    )}
                </div>
            )}

            <div className="instructions">
                <h2>Enhanced Notification Features:</h2>
                <ol>
                    <li><strong>Color-coded notifications</strong> - Each notification type has a distinct color</li>
                    <li><strong>Mark as Important</strong> - Click the star icon to mark notifications as important</li>
                    <li><strong>Search</strong> - Use the search bar to filter notifications by keyword</li>
                    <li><strong>Sort</strong> - Toggle between newest and oldest notifications</li>
                    <li><strong>Bulk Actions</strong> - Select multiple notifications and delete them with confirmation</li>
                </ol>
                <p>Go to the <a href="/notifications">Notifications page</a> to see and interact with your notifications.</p>
            </div>
        </div>
    );
};

export default TestNotifications;
