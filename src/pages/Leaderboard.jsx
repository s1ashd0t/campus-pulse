import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        // Placeholder data until backend is ready
        const dummyData = [
            { username: 'Alice', points: 1200, badges: ['Top Contributor'] },
            { username: 'Bob', points: 900, badges: ['Event Master'] },
            { username: 'Charlie', points: 850, badges: [] },
        ];
        setLeaders(dummyData);
    }, []);

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            <ul>
                {leaders.map((user, index) => (
                    <li key={index}>
                        <span>{index + 1}. {user.username}</span>
                        <span>Points: {user.points}</span>
                        <span>Badges: {user.badges.join(', ')}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
