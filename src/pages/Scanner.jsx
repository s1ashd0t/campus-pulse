import React, { useState } from 'react';
import QrScanner from 'qr-scanner';
import './Scanner.css';

function QRScannerComponent() {
  const [scanResult, setScanResult] = useState('');
  const [qrScanner, setQrScanner] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [error, setError] = useState("Accessing location...")

  const handleScan = (result) => {
    setScanResult(result);
  };

  const handleError = (error) => {
    console.error('QR code scanning error:', error);
  };

  const startScan = () => {
    const videoElement = document.createElement('video');
    const scan = document.querySelector('.scanner');
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
      scan.removeChild(videoElement);
    };
  };

  const checkLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location:', position.coords);
          // Bottom left corner of the campus: 41.114346, -85.114388
          // Top right corner of the campus: 41.122330, -85.102813
          if (position.coords.longitude >= -85.114388 && position.coords.longitude <= -85.102813 &&
              position.coords.latitude >= 41.114346 && position.coords.latitude <= 41.122330) {
            setLocationAllowed(true);
          }
          else {
            console.error('Location is outside the allowed range.');
            setLocationAllowed(false);
            setError("You are not in campus.")
          }
        },
        (error) => {
          console.error('Location access denied:', error);
          setLocationAllowed(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocationAllowed(false);
    }
  };

  React.useEffect(() => {
    checkLocation();
  }, []);

  React.useEffect(() => {
    if (locationAllowed) {
      const cleanup = startScan();
      return cleanup;
    }
  }, [locationAllowed]);

  console.log(scanResult.data);

  return (
    <div className='scanner'>
      {locationAllowed ? (
        scanResult ? (
          <div id='result'>
            <p>Scan Result:</p>
            <p>{scanResult}</p>
          </div>
        ) : (
          <p id='status'>Scanning...</p>
        )
      ) : (
        <p id='status'>{error}</p>
      )}
    </div>
  );
}

export default QRScannerComponent;