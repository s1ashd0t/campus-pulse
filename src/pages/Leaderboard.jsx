import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const dummyData = [
            { id: 1, name: 'Alice', points: 1200, avatar: 'https://i.pravatar.cc/150?img=10', level: 10, xp: 500, coins: 200, likes: 30, passes: 2, resources: 150 },
            { id: 2, name: 'Bob', points: 1100, avatar: 'https://i.pravatar.cc/150?img=6', level: 9, xp: 480, coins: 150, likes: 25, passes: 3, resources: 140 },
            { id: 3, name: 'Charlie', points: 1000, avatar: 'https://i.pravatar.cc/150?img=8', level: 8, xp: 450, coins: 120, likes: 20, passes: 1, resources: 130 },
            { id: 4, name: 'Diana', points: 950, avatar: 'https://i.pravatar.cc/150?img=4', level: 7, xp: 400, coins: 100, likes: 15, passes: 2, resources: 100 },
            { id: 5, name: 'Eve', points: 900, avatar: 'https://i.pravatar.cc/150?img=11', level: 7, xp: 390, coins: 95, likes: 14, passes: 1, resources: 90 },
            { id: 6, name: 'Frank', points: 850, avatar: 'https://i.pravatar.cc/150?img=12', level: 6, xp: 380, coins: 85, likes: 12, passes: 3, resources: 80 },
            { id: 7, name: 'Grace', points: 800, avatar: 'https://i.pravatar.cc/150?img=13', level: 6, xp: 370, coins: 80, likes: 11, passes: 2, resources: 75 },
            { id: 8, name: 'Hank', points: 750, avatar: 'https://i.pravatar.cc/150?img=14', level: 5, xp: 360, coins: 75, likes: 10, passes: 1, resources: 70 },
            { id: 9, name: 'Ivy', points: 700, avatar: 'https://i.pravatar.cc/150?img=15', level: 5, xp: 350, coins: 70, likes: 9, passes: 2, resources: 65 },
            { id: 10, name: 'Jack', points: 650, avatar: 'https://i.pravatar.cc/150?img=16', level: 4, xp: 340, coins: 65, likes: 8, passes: 1, resources: 60 },
            { id: 11, name: 'Kara', points: 600, avatar: 'https://i.pravatar.cc/150?img=17', level: 4, xp: 330, coins: 60, likes: 7, passes: 3, resources: 55 },
            { id: 12, name: 'Leo', points: 550, avatar: 'https://i.pravatar.cc/150?img=18', level: 3, xp: 320, coins: 55, likes: 6, passes: 1, resources: 50 },
            { id: 13, name: 'Mia', points: 500, avatar: 'https://i.pravatar.cc/150?img=19', level: 3, xp: 310, coins: 50, likes: 5, passes: 2, resources: 45 },
            { id: 14, name: 'Noah', points: 450, avatar: 'https://i.pravatar.cc/150?img=20', level: 2, xp: 300, coins: 45, likes: 4, passes: 1, resources: 40 },
        ];
        setLeaders(dummyData);
    }, []);

    return (
        <div className="container">
            <div className="topLeadersList">
                {leaders.slice(0, 3).map((leader, index) => (
                    <div className={`leader leader-${index + 1}`} key={leader.id}>
                        <img src={leader.avatar} className="image" alt={leader.name} />
                        <div className="leaderName">{leader.name}</div>
                    </div>
                ))}
            </div>

            <div className="playerslist">
                <div className="table"  style={{ overflowX: 'auto' }}>
                    <div>#</div><div>Name</div><div>LVL</div><div>XP</div><div>Coins</div><div>Likes</div><div>Pass</div><div>Resources</div>
                </div>
                <div className="list">
                    {leaders.map((leader, index) => (
                        <div className="player hover-card" key={leader.id}>
                            <span>{index + 1}</span>
                            <div className="user">
                                <img src={leader.avatar} className="image" alt={leader.name} />
                                <span>{leader.name}</span>
                            </div>
                            <span>{leader.level}</span>
                            <span>{leader.xp}</span>
                            <span>{leader.coins}</span>
                            <span>{leader.likes}</span>
                            <span>{leader.passes}</span>
                            <span>{leader.resources}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
