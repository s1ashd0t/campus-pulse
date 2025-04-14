// src/QRCodeGenerator.jsx
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = () => {

  const url = "https://localhost:5173/qrcode"
  const token = "1234567890"
  const inputText = `${url}/${token}`;

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  const generateQRCode = async () => {
    // post request to backend to authenticate user
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    
    try {
      const qrCode = await QRCode.toDataURL(inputText);
      setQrCodeDataUrl(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleKeyPress = useEffect(() => {
        generateQRCode();
  }
  , []);

  return (
    <div className='qr-code'>
      <h2>QR Code</h2>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text for QR code"
      />
      <button onClick={generateQRCode}>Generate QR Code</button>
      {qrCodeDataUrl && (
        <div>
          <img src={qrCodeDataUrl} alt="QR Code" width={200} height={200} />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
