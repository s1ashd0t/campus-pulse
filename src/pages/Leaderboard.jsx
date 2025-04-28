import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const usersRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersRef);
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Filter points > 0 and sort descending
                const filteredSortedUsers = usersList
                    .filter(user => (user.points ?? 0) > 0)
                    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

                setLeaders(filteredSortedUsers);
            } catch (error) {
                console.error("Error fetching users for leaderboard:", error);
            }
        };

        fetchLeaders();
    }, [db]);

    const getMedal = (index) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return "";
    };

    return (
        <div className="container">
            {/* Leaderboard Table */}
            <div className="playerslist">
                <div className="table" style={{ overflowX: 'auto' }}>
                    <div></div><div>Name</div><div>Points</div><div>Badges</div><div>Events</div> {/* 👈 Changed */}
                </div>
                <div className="list">
                    {leaders.map((leader, index) => (
                        <div className="player hover-card" key={leader.id}>
                            <span>{getMedal(index)} {index + 1}</span>
                            <span>{leader.firstName || leader.email}</span>
                            <span>{leader.points}</span>
                            <span>{leader.badges ? leader.badges.length : 0}</span> {/* 👈 Badge count */}
                            <span>{leader.eventsAttended ?? '-'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
