import React, { useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import './Scanner.css';

function QRScannerComponent() {
  const [scanResult, setScanResult] = useState('');
  const [qrScanner, setQrScanner] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [error, setError] = useState("Accessing location...");

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
    const scannerWrapper = document.querySelector('.scanner-wrapper');
    scannerWrapper.appendChild(videoElement);


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
      scannerWrapper.removeChild(videoElement);
    };
  };

  const checkLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Bottom left corner of the campus: 41.114346, -85.114388
          // Top right corner of the campus: 41.122330, -85.102813
          if (position.coords.longitude >= -85.114388 && 
              position.coords.longitude <= -85.102813 &&
              position.coords.latitude >= 41.114346 && 
              position.coords.latitude <= 41.122330) {
            setLocationAllowed(true);
          } else {
            setError("You must be on campus to scan QR codes.");
          }
        },
        (error) => {
          console.error('Location access denied:', error);
          setError("Please enable location services to use the scanner.");
        }
      );
    } else {
      setError("Your browser doesn't support geolocation.");
    }
  };

  useEffect(() => {
    checkLocation();
  }, []);

  useEffect(() => {
    if (locationAllowed) {
      const cleanup = startScan();
      return cleanup;
    }
  }, [locationAllowed]);

  return (
    <div className="scanner-container">
      {locationAllowed ? (
        <>
          <div className="scanner-wrapper">
            <div className="scan-line"></div>
          </div>
          {scanResult && (
            <div className="scan-result">
              <p>Scan Result:</p>
              <p>{scanResult}</p>
            </div>
          )}
        </>
      ) : (
        <div className="status-message">{error}</div>
      )}

    </div>
  );
}

export default QRScannerComponent;
