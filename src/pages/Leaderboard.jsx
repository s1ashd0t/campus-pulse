import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        // Dummy data with avatars
        const dummyData = [
            { username: 'Alice', points: 83, avatar: 'https://i.pravatar.cc/40?img=1' },
            { username: 'Bob', points: 81, avatar: 'https://i.pravatar.cc/40?img=2' },
            { username: 'Charlie', points: 79, avatar: 'https://i.pravatar.cc/40?img=3' },
            { username: 'Diana', points: 75, avatar: 'https://i.pravatar.cc/40?img=4' },
            { username: 'Ethan', points: 72, avatar: 'https://i.pravatar.cc/40?img=5' },
            { username: 'Fiona', points: 68, avatar: 'https://i.pravatar.cc/40?img=6' },
            { username: 'George', points: 65, avatar: 'https://i.pravatar.cc/40?img=7' },
            { username: 'Hannah', points: 63, avatar: 'https://i.pravatar.cc/40?img=8' },
            { username: 'Ivan', points: 60, avatar: 'https://i.pravatar.cc/40?img=9' },
            { username: 'Julia', points: 58, avatar: 'https://i.pravatar.cc/40?img=10' },
        ];
        setLeaders(dummyData);
    }, []);

    return (
        <div className="leaderboard-container">
            <h1>🏆 Leader Board</h1>

            {/* Header Row */}
            <div className="table-header">
                <span>#</span>
                <span>Name</span>
                <span>Points</span>
            </div>

            {/* List */}
            <ul>
                {leaders.map((user, index) => (
                    <li key={index} className="hover-card">
                        <span className="rank">{index + 1}</span>
                        <span className="name-section">
                            {user.username}
                            <img src={user.avatar} alt={user.username} className="avatar" />
                        </span>
                        <span className="points">{user.points}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
