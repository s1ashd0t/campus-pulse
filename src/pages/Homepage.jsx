import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './homepage.css';
import qrcode from '../assets/scan-icon.svg';
import searchicon from '../assets/search-icon.svg';
import eventsicon from '../assets/leaderboard.svg';
import profileicon from '../assets/name-id-icon.svg';

const quickLinks = [
    {
        icon: qrcode,
        title: "Scan QR",
        path: "/scanner"
    },
    {
        icon: eventsicon,
        title: "Events",
        path: "/events"
    },
    {
        icon: searchicon,
        title: "Search",
        path: "/search"
    },
    {
        icon: profileicon,
        title: "Profile",
        path: "/profile"
    }
];

const Homepage = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsRef = collection(db, 'news');
                const q = query(newsRef, orderBy('createdAt', 'desc'), limit(6));
                const querySnapshot = await getDocs(q);
                
                const newsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setNewsItems(newsData);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Failed to load news items');

            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <main className="homepage">
            <h1>Quick Actions</h1>
            <section className="cards">
                {quickLinks.map((link, index) => (
                    <Link to={link.path} key={index}>
                        <div className="card-image">
                            <img src={link.icon} alt={link.title} />
                        </div>
                        {link.title}
                    </Link>
                ))}
            </section>

            <section className="news-container">
                <h1>Updates</h1>
                <div className="news-section">
                    {loading ? (
                        <div className="loading">Loading updates...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : newsItems.length > 0 ? (
                        newsItems.map((news) => (
                            <article className="newscard" key={news.id}>
                                <img src={news.image} alt={news.title} />
                                <div className="newscard-content">
                                    {news.title}
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="no-news">No updates available</div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Homepage;
