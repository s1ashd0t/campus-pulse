import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { createPointsNotification } from '../services/notificationService';
import './Survey.css';

const Survey = () => {
    const { eventId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [responses, setResponses] = useState({
        rating: 5,
        feedback: '',
        improvements: ''
    });

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId || !user) {
                setError('Missing event information or user not logged in');
                setLoading(false);
                return;
            }

            try {
                const eventRef = doc(db, 'events', eventId);
                const eventDoc = await getDoc(eventRef);
                
                if (!eventDoc.exists()) {
                    setError('Event not found');
                    setLoading(false);
                    return;
                }
                
                const eventData = eventDoc.data();
                
                // Check if user is registered for this event
                if (!eventData.signedUpUsers?.includes(user.uid)) {
                    setError('You are not registered for this event');
                    setLoading(false);
                    return;
                }
                
                // Check if user has already completed the survey
                if (eventData.attended?.includes(user.uid)) {
                    setError('You have already completed the survey for this event');
                    setLoading(false);
                    return;
                }
                
                // Check if user has checked in
                if (eventData.registrationStatus?.[user.uid] !== 'checked-in') {
                    setError('You need to check in to the event before completing the survey');
                    setLoading(false);
                    return;
                }
                
                setEvent(eventData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Error loading event information');
                setLoading(false);
            }
        };
        
        fetchEvent();
    }, [eventId, user]);

    const handleOptionSelect = (field, value) => {
        setResponses({
            ...responses,
            [field]: value
        });
    };

    const handleTextChange = (field, value) => {
        setResponses({
            ...responses,
            [field]: value
        });
    };

    const handleRatingSelect = (rating) => {
        setResponses({
            ...responses,
            rating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const eventRef = doc(db, 'events', eventId);
            const userRef = doc(db, 'users', user.uid);
            
            // Get current event data
            const eventDoc = await getDoc(eventRef);
            const eventData = eventDoc.data();
            
            // Store survey response
            await updateDoc(eventRef, {
                attended: arrayUnion(user.uid),
                surveys: {
                    ...eventData.surveys,
                    [user.uid]: {
                        ...responses,
                        submittedAt: new Date().toISOString()
                    }
                }
            });

            // Award points
            const pointsAwarded = 10;
            await updateDoc(userRef, {
                points: increment(pointsAwarded),
                attendedEvents: arrayUnion({
                    eventId,
                    eventTitle: event.title,
                    attendedAt: new Date().toISOString(),
                    pointsEarned: pointsAwarded
                })
            });
            
            // Send notification about points earned
            await createPointsNotification(
                user.uid, 
                pointsAwarded, 
                `attending ${event.title}`
            );

            setSubmitted(true);
            
            setTimeout(() => {
                navigate('/my-events'); //Redirects to My Events
              }, 3000);
              
        } catch (err) {
            console.error('Error submitting survey:', err);
            setError('Error submitting survey. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) return <div className="loading">Loading survey...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!event) return <div className="error">Event not found</div>;

    return (
        <div className="survey-container">
            <h2>📋 Event Survey</h2>
            
            {submitted ? (
                <div className="survey-success">
                    <h3>Thank you for your feedback!</h3>
                    <p>Your responses have been recorded and you've earned 10 points!</p>
                    <p>Redirecting to dashboard...</p>
                </div>
            ) : (
                <div className="survey-card">
                    <div className="survey-header">
                        <h3>{event.title}</h3>
                        <p>Please share your feedback about this event</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="survey-question">
                            <label>How would you rate this event? (1-10)</label>
                            <div className="rating-container">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                                    <button
                                        key={rating}
                                        type="button"
                                        className={`rating-btn ${responses.rating === rating ? 'selected' : ''}`}
                                        onClick={() => handleRatingSelect(rating)}
                                    >
                                        {rating}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="survey-question">
                            <label>What did you like most about this event?</label>
                            <textarea
                                value={responses.feedback}
                                onChange={(e) => handleTextChange('feedback', e.target.value)}
                                className="survey-textarea"
                                placeholder="Share your thoughts..."
                            />
                        </div>
                        
                        <div className="survey-question">
                            <label>How could we improve this event in the future?</label>
                            <textarea
                                value={responses.improvements}
                                onChange={(e) => handleTextChange('improvements', e.target.value)}
                                className="survey-textarea"
                                placeholder="Your suggestions are valuable to us..."
                            />
                        </div>
                        
                        <button type="submit" className="survey-submit-btn">Submit Survey & Earn Points</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Survey;
