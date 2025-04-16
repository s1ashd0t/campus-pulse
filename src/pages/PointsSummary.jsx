import React from 'react';
import { Link } from 'react-router-dom';
import './PointsSummary.css';

const PointsSummary = ({ points = 120 }) => {
    return (
        <div className="points-summary-card">
            <div className="points-header">
                <h2>Your Points</h2>
                <span className="points-badge">{points}</span>
            </div>
            
            <div className="points-info">
                <p>Use your points to redeem rewards like discount coupons, free coffee/snacks, and campus merchandise!</p>
                
                <div className="points-examples">
                    <div className="point-example">
                        <span className="example-name">Discount Coupon</span>
                        <span className="example-points">50pts</span>
                    </div>
                    <div className="point-example">
                        <span className="example-name">Free Coffee</span>
                        <span className="example-points">60pts</span>
                    </div>
                    <div className="point-example">
                        <span className="example-name">Water Bottle</span>
                        <span className="example-points">40pts</span>
                    </div>
                </div>
            </div>
            
            <Link to="/redeem" className="redeem-link">
                Redeem Your Points
            </Link>
        </div>
    );
};

export default PointsSummary;