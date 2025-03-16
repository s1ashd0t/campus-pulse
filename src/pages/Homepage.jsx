import React from 'react'
import './Homepage.css'

const Homepage = () => {
    return(
        <>
        <div className="homepage">
        <h1>Homepage</h1>
        <div className="cards">
            <div className="card">
                <a href="./scanner">
                    Scan QR
                </a>
                </div>
            <div className="card">
                <a href="">
                    Search
                </a>
                </div>
            <div className="card">
                <a href="">
                    Leaderboard
                </a>
                </div>
            <div className="card">
                <a href="./profile">
                    Profile
                </a>
            </div>
        </div>
        </div>
        </>
    )
}

export default Homepage