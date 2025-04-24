import React, { useState } from 'react';
import './Survey.css';

const Survey = () => {
    const [currentSurvey, setCurrentSurvey] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [responses, setResponses] = useState({});

    const surveys = [
        {
            id: 1,
            title: "Campus Events Feedback",
            description: "Help us improve our campus events!",
            questions: [
                {
                    id: 'q1',
                    text: "How would you rate our recent campus events?",
                    type: "rating",
                },
                {
                    id: 'q2',
                    text: "Which types of events would you like to see more of?",
                    type: "select",
                    options: ["Academic", "Social", "Career", "Cultural", "Sports"]
                },
                {
                    id: 'q3',
                    text: "Any suggestions for improving campus events?",
                    type: "text"
                }
            ]
        },
        {
            id: 2,
            title: "Student Engagement Survey",
            description: "Tell us how we can better engage with students",
            questions: [
                {
                    id: 'q1',
                    text: "How connected do you feel to campus activities?",
                    type: "rating",
                },
                {
                    id: 'q2',
                    text: "What would motivate you to attend more events?",
                    type: "select",
                    options: ["Free food", "Career opportunities", "Meeting new people", "Learning new skills", "Earning points/rewards"]
                },
                {
                    id: 'q3',
                    text: "How can we better communicate about upcoming events?",
                    type: "text"
                }
            ]
        }
    ];

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally send the data to your backend
        console.log("Survey responses:", responses);
        setSubmitted(true);
        
        // Reset after 3 seconds to show another survey
        setTimeout(() => {
            setSubmitted(false);
            setResponses({});
            setCurrentSurvey((currentSurvey + 1) % surveys.length);
        }, 3000);
    };

    const activeSurvey = surveys[currentSurvey];

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

    return (
        <div className="survey-container">
            <h2>📋 Campus Surveys</h2>
            
            {submitted ? (
                <div className="survey-success">
                    <h3>Thank you for your feedback!</h3>
                    <p>Your responses have been recorded.</p>
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
                        
                        <button type="submit" className="survey-submit-btn">Submit Survey</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Survey;