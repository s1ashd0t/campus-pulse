import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, orderBy('points', 'desc'), limit(10));
                const querySnapshot = await getDocs(q);
                
                const leaderboardData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: `${doc.data().firstName} ${doc.data().lastName}`,
                    points: doc.data().points || 0,
                    avatar: doc.data().avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
                    level: Math.floor((doc.data().points || 0) / 100) + 1,
                    events: doc.data().eventsAttended || 0
                }));

                setLeaders(leaderboardData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError('Failed to load leaderboard data');
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="container">
                <div className="loading">Loading leaderboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error">{error}</div>
            </div>
        );
    }

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
