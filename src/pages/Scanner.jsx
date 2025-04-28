import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { markEventAttendance } from '../services/rsvpService';
import QrScanner from 'qr-scanner';
import './Scanner.css';

function QRScannerComponent() {
  const [scanResult, setScanResult] = useState('');
  const [qrScanner, setQrScanner] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Check if we came from an event page
  const fromEvent = location.state?.fromEvent;
  const eventId = location.state?.eventId;

  const handleScan = async (result) => {
    if (processing) return; // Prevent multiple scans while processing
    
    setProcessing(true);
    setScanResult(result);
    setScanSuccess(true);
    setError(null);
    
    try {
      // The QR code should contain the event ID
      // If we came from an event page, use that event ID
      // Otherwise, try to parse the QR code content as the event ID
      const scannedEventId = fromEvent ? eventId : result.data || result;
      
      if (!scannedEventId) {
        setError("Invalid QR code. No event ID found.");
        return;
      }
      
      if (!user) {
        setError("You must be logged in to check in to an event.");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      // Mark the user as having attended the event
      const attendanceResult = await markEventAttendance(user.uid, scannedEventId);
      
      if (attendanceResult.success) {
        // Redirect to the events page with "my" filter after successful check-in
        setTimeout(() => {
          navigate('/events', { state: { filter: 'my' } });
        }, 2000);
      } else {
        setError(attendanceResult.error || "Failed to check in to the event.");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      setError("An error occurred while processing the QR code.");
    } finally {
      setProcessing(false);
    }
  };

  const handleError = (error) => {
    console.error('QR code scanning error:', error);
  };

  const startScan = () => {
    const videoElement = document.createElement('video');
    const scan = document.querySelector('.scanner');
    
    if (scan) {
      scan.appendChild(videoElement);

      const scanner = new QrScanner(
        videoElement,
        handleScan,
        {
          onDecodeError: handleError,
          highlightCodeOutline: true,
        },
      );

      setQrScanner(scanner);
      scanner.start();

      return () => {
        scanner.stop();
        scanner.destroy();
        if (scan.contains(videoElement)) {
          scan.removeChild(videoElement);
        }
      };
    }
    
    return () => {};
  };

  useEffect(() => {
    const cleanup = startScan();
    return cleanup;
  }, []);

  const handleBackToEvents = () => {
    navigate('/events');
  };

  return (
    <div className='scanner-container'>
      <div className='scanner-header'>
        <h2>QR Code Scanner</h2>
        {fromEvent && (
          <p className='scanner-instruction'>
            Scan the QR code at the event to check in
          </p>
        )}
      </div>
      
      <div className='scanner'>
        {error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : scanSuccess ? (
          <div id='result'>
            <p>Scan Successful!</p>
            <p>{scanResult.data || scanResult}</p>
            <p>Redirecting to My Events...</p>
          </div>
        ) : (
          <p id='status'>{processing ? 'Processing...' : 'Scanning...'}</p>
        )}
      </div>
      
      <div className='scanner-actions'>
        <button 
          onClick={handleBackToEvents}
          className='back-button'
        >
          Back to Events
        </button>
      </div>
    </div>
  );
}

export default QRScannerComponent;
