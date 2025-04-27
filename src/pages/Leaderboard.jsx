import React, { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Leaderboard.css';

const Leaderboard = () => {
    const { userRole } = useContext(AuthContext);
    const [leaders, setLeaders] = useState([]);
    
    // Redirect admins to admin dashboard
    if (userRole === "admin") {
        return <Navigate to="/admin-dashboard" />;
    }

    useEffect(() => {
        const dummyData = [
            { id: 1, name: 'Alice', points: 1200, avatar: 'https://i.pravatar.cc/150?img=10', level: 10, events: 20 },
            { id: 2, name: 'Bob', points: 1100, avatar: 'https://i.pravatar.cc/150?img=6', level: 9, events: 18 },
            { id: 3, name: 'Charlie', points: 1000, avatar: 'https://i.pravatar.cc/150?img=8', level: 8, events: 15 },
            { id: 4, name: 'Diana', points: 950, avatar: 'https://i.pravatar.cc/150?img=4', level: 7, events: 14 },
            { id: 5, name: 'Eve', points: 900, avatar: 'https://i.pravatar.cc/150?img=11', level: 7, events: 13 },
            { id: 6, name: 'Frank', points: 850, avatar: 'https://i.pravatar.cc/150?img=12', level: 6, events: 12 },
            { id: 7, name: 'Grace', points: 800, avatar: 'https://i.pravatar.cc/150?img=13', level: 6, events: 11 },
            { id: 8, name: 'Hank', points: 750, avatar: 'https://i.pravatar.cc/150?img=14', level: 5, events: 10 },
            { id: 9, name: 'Ivy', points: 700, avatar: 'https://i.pravatar.cc/150?img=15', level: 5, events: 9 },
            { id: 10, name: 'Jack', points: 650, avatar: 'https://i.pravatar.cc/150?img=16', level: 4, events: 8 },
        ];
        setLeaders(dummyData);
    }, []);

    return (
        <div className="container">
            {/* Podium */}
            <div className="topLeadersList">
                {leaders.slice(0, 3).map((leader, index) => (
                    <div className={`leader leader-${index + 1}`} key={leader.id}>
                        <img src={leader.avatar} className="image" alt={leader.name} />
                        <div className="leaderName">{leader.name}</div>
                        <div className="leaderPoints">{leader.points} pts</div>
                    </div>
                ))}
            </div>

            {/* Leaderboard Table */}
            <div className="playerslist">
                <div className="table" style={{ overflowX: 'auto' }}>
                    <div>#</div><div>Name</div><div>Points</div><div>Level</div><div>Events</div>
                </div>
                <div className="list">
                    {leaders.map((leader, index) => (
                        <div className="player hover-card" key={leader.id}>
                            <span>{index + 1}</span>
                            <div className="user">
                                <img src={leader.avatar} className="image" alt={leader.name} />
                                <span>{leader.name}</span>
                            </div>
                            <span>{leader.points}</span>
                            <span>{leader.level}</span>
                            <span>{leader.events}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
