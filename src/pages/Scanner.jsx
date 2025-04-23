import React, { useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import './Scanner.css';

function QRScannerComponent() {
  const [scanResult, setScanResult] = useState('');
  const [qrScanner, setQrScanner] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [error, setError] = useState("Accessing location...");

  const handleScan = (result) => {
    setScanResult(result);
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