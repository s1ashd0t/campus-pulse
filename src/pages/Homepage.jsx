import React from 'react'
import './Homepage.css'
import qrcode from '../assets/scan-icon.svg'
import searchicon from '../assets/search-icon.svg'
import leaderboardicon from '../assets/leaderboard.svg'
import profileicon from '../assets/name-id-icon.svg'

const Homepage = () => {
    return(
        <>
        <div className="homepage">
        <h1>Homepage</h1>
        <div className="cards">
            <div className="card">
                <a href="./scanner">
                    <img src={qrcode} alt="" />
                    Scan QR
                </a>
                </div>
            <div className="card">
                <a href="./search">
                    <img src={searchicon} alt="" />
                    Search
                </a>
                </div>
            <div className="card">
                <a href="">
                    <img src={leaderboardicon} alt="" />
                    Leaderboard
                </a>
                </div>
            <div className="card">
                <a href="./profile">
                <img src={profileicon} alt="" />
                    Profile
                </a>
            </div>
        </div>
        </div>
        </>
    )
}

export default Homepage