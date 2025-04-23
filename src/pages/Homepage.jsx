import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import qrcode from '../assets/scan-icon.svg';
import searchicon from '../assets/search-icon.svg';
import leaderboardicon from '../assets/leaderboard.svg';
import profileicon from '../assets/name-id-icon.svg';
import news1 from '../assets/newapp.jpg';
import news2 from '../assets/careerexpo.jpg';
import news3 from '../assets/volun.jpg';

const newsItems = [
    {
        image: news1,
        title: "New App to Boost Student Engagement at PFW",
        link: "#"
    },
    {
        image: news2,
        title: "Student Engagement Workshops Return This Spring",
        link: "#"
    },
    {
        image: news3,
        title: "Volunteer Fair to Connect Students with Local Non-Profits",
        link: "#"
    },
    {
        image: news2,
        title: "Purdue Fort Wayne Hosts Spring 2025 Clubs & Organizations Fair",
        link: "#"
    },
    {
        image: news3,
        title: "PFW Launches New Mentorship Program for Student Success",
        link: "#"
    },
    {
        image: news1,
        title: "Campus Wellness Week Promotes Health and Well-being",
        link: "#"
    }
];

const quickLinks = [
    {
        icon: qrcode,
        title: "Scan QR",
        path: "/scanner"
    },
    {
        icon: searchicon,
        title: "Search",
        path: "/search"
    },
    {
        icon: leaderboardicon,
        title: "Leaderboard",
        path: "/leaderboard"
    },
    {
        icon: profileicon,
        title: "Profile",
        path: "/profile"
    }
];

const Homepage = () => {
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
                    {newsItems.map((news, index) => (
                        <article className="newscard" key={index}>
                            <img src={news.image} alt={news.title} />
                            <div className="newscard-content">
                                {news.title}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Homepage;