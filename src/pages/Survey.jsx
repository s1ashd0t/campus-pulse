import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { createNotification } from '../services/notificationService';
import './Survey.css';

const Survey = () => {
    const { eventId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [responses, setResponses] = useState({});

    // Default survey template
    const defaultSurvey = {
        title: "Event Feedback",
        description: "Help us improve our campus events!",
        questions: [
            {
                id: 'q1',
                text: "How would you rate this event overall?",
                type: "rating",
            },
            {
                id: 'q2',
                text: "What did you like most about this event?",
                type: "select",
                options: ["Content/Topic", "Speakers/Presenters", "Networking Opportunities", "Location/Venue", "Food/Refreshments"]
            },
            {
                id: 'q3',
                text: "Any suggestions for improving future events?",
                type: "text"
            }
        ]
    };

    useEffect(() => {
        const fetchEvent = async () => {
            if (!user) {
                setError("You must be logged in to complete a survey");
                setLoading(false);
                return;
            }
            
            if (!eventId) {
                setError("No event specified");
                setLoading(false);
                return;
            }
            
            try {
                const eventRef = doc(db, "events", eventId);
                const eventDoc = await getDoc(eventRef);
                
                if (!eventDoc.exists()) {
                    setError("Event not found");
                    setLoading(false);
                    return;
                }
                
                const eventData = {
                    id: eventDoc.id,
                    ...eventDoc.data()
                };
                
                // Check if user attended this event
                if (!eventData.attended?.includes(user.uid)) {
                    setError("You must attend this event to complete the survey");
                    setLoading(false);
                    return;
                }
                
                // Check if user already completed the survey
                if (eventData.surveys && eventData.surveys[user.uid]) {
                    setError("You have already completed the survey for this event");
                    setLoading(false);
                    return;
                }
                
                setEvent(eventData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event:", error);
                setError("Error loading event details");
                setLoading(false);
            }
        };
        
        fetchEvent();
    }, [eventId, user]);

    const handleOptionSelect = (questionId, value) => {
        setResponses({
            ...responses,
            [questionId]: value
        });
    };

    const handleTextChange = (questionId, value) => {
        setResponses({
            ...responses,
            [questionId]: value
        });
    };

    const handleRatingSelect = (questionId, rating) => {
        setResponses({
            ...responses,
            [questionId]: rating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user || !eventId || !event) {
            setError("Unable to submit survey");
            return;
        }
        
        try {
            setLoading(true);
            
            // Get the event document
            const eventRef = doc(db, "events", eventId);
            
            // Update the event document with the survey responses
            await updateDoc(eventRef, {
                [`surveys.${user.uid}`]: {
                    responses,
                    submittedAt: new Date()
                }
            });
            
            // Send a notification to the user
            try {
                await createNotification(
                    user.uid,
                    "survey",
                    `Thank you for completing the survey for ${event.title}!`,
                    eventId
                );
            } catch (notifError) {
                console.error("Failed to send survey notification:", notifError);
                // Continue even if notification fails
            }
            
            setSubmitted(true);
            
            // Redirect to events page after 3 seconds
            setTimeout(() => {
                navigate('/events', { state: { filter: 'my' } });
            }, 3000);
        } catch (error) {
            console.error("Error submitting survey:", error);
            setError("Failed to submit survey. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Use the event's survey if available, otherwise use the default survey
    const activeSurvey = event?.survey || defaultSurvey;

    const renderQuestion = (question) => {
        switch(question.type) {
            case 'rating':
                return (
                    <div className="rating-container">
                        {[1, 2, 3, 4, 5].map(rating => (
                            <button
                                key={rating}
                                type="button"
                                className={`rating-btn ${responses[question.id] === rating ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect(question.id, rating)}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                );
            case 'select':
                return (
                    <select 
                        value={responses[question.id] || ''} 
                        onChange={(e) => handleOptionSelect(question.id, e.target.value)}
                        className="survey-select"
                    >
                        <option value="" disabled>Select an option</option>
                        {question.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
            case 'text':
                return (
                    <textarea
                        value={responses[question.id] || ''}
                        onChange={(e) => handleTextChange(question.id, e.target.value)}
                        className="survey-textarea"
                        placeholder="Type your answer here..."
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="survey-container">
                <h2>📋 Event Survey</h2>
                <div className="loading">Loading survey...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="survey-container">
                <h2>📋 Event Survey</h2>
                <div className="error-message">{error}</div>
                <button 
                    onClick={() => navigate('/events')}
                    className="back-button"
                >
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className="survey-container">
            <h2>📋 Event Survey: {event?.title}</h2>
            
            {submitted ? (
                <div className="survey-success">
                    <h3>Thank you for your feedback!</h3>
                    <p>Your responses have been recorded.</p>
                    <p>Redirecting to My Events...</p>
                </div>
            ) : (
                <div className="survey-card">
                    <div className="survey-header">
                        <h3>{activeSurvey.title}</h3>
                        <p>{activeSurvey.description}</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        {activeSurvey.questions.map((question) => (
                            <div key={question.id} className="survey-question">
                                <label>{question.text}</label>
                                {renderQuestion(question)}
                            </div>
                        ))}
                        
                        <button 
                            type="submit" 
                            className="survey-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Survey'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Survey;
