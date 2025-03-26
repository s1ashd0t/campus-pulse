import React from 'react'
import './Homepage.css'
import qrcode from '../assets/scan-icon.svg'
import searchicon from '../assets/search-icon.svg'
import leaderboardicon from '../assets/leaderboard.svg'
import profileicon from '../assets/name-id-icon.svg'
import news1 from '../assets/newapp.jpg'
import news2 from '../assets/careerexpo.jpg'
import news3 from '../assets/volun.jpg'
import CreateEvent from './components/CreateEvent'


const Homepage = () => {

    // TEMPORARY SWITCH
    const admin = true
    
    return(
        <>
        <div className="homepage">
        <h1>Homepage</h1>
        <div className="cards">
<<<<<<< Updated upstream
=======
            {admin ? <a href='./event'>
            <div className="card">
                <div className="card-image">
                    <img src={qrcode} alt="" />
                </div>
                <div className="card-name">
                    Create Event
                </div>
                </div>
                </a> 
                :
                <a href="./scanner">
>>>>>>> Stashed changes
            <div className="card">
                <a href="./scanner">
                <div className="card-image">
                    <img src={qrcode} alt="" />
                </div>
                <div className="card-name">
                    Scan QR
                </div>
<<<<<<< Updated upstream
                </a>
                </div>
=======
                </div>
                </a>}
            <a href="./search">
>>>>>>> Stashed changes
            <div className="card">
                <a href="./search">
                <div className="card-image">
                    <img src={searchicon} alt="" />
                </div>
                    Search
                </a>
                </div>
            <div className="card">
                <a href="">
                    <div className="card-image">
                    <img src={leaderboardicon} alt="" />
                    </div>
                    Leaderboard
                </a>
                </div>
            <div className="card">
                <a href="./profile">
                <div className="card-image">
                <img src={profileicon} alt="" />
                </div>
                    Profile
                </a>
            </div>
        </div>
        </div>
        <div className="news-container">
            <h1>Updates</h1>
            <div className="news-section">
                <div className="newscard"><img src={news1} alt="" />New App to Boost Student Engagement at PFW  </div>
                <div className="newscard"><img src={news2} alt="" />Student Engagement Workshops Return This Spring</div>
                <div className="newscard"><img src={news3} alt="" />Volunteer Fair to Connect Students with Local Non-Profits</div>
                <div className="newscard"><img src={news2} alt="" />Purdue Fort Wayne Hosts Spring 2025 Clubs & Organizations Fair</div>
                <div className="newscard"><img src={news3} alt="" />PFW Launches New Mentorship Program for Student Success</div>
                <div className="newscard"><img src={news1} alt="" />Campus Wellness Week Promotes Health and Well-being</div>
            </div>
        </div>
        </>
    )
}

export default Homepage