import React, { useState } from 'react';
import QrScanner from 'qr-scanner';
import './Scanner.css'

function QRScannerComponent() {
  const [scanResult, setScanResult] = useState('');
  const [qrScanner, setQrScanner] = useState(null);

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

  React.useEffect(() => {
    const cleanup = startScan();
    return cleanup;
  }, []);

  console.log(scanResult.data)

  return (
    <div className='scanner'>
      {scanResult ? (
        <div id='result'>
          <p>Scan Result:</p>
          <p>{scanResult}</p>
        </div>
      ) : (
        false
      )}
        <p id='status'>Scanning for QR code...</p>

    </div>
  );
}

export default QRScannerComponent;