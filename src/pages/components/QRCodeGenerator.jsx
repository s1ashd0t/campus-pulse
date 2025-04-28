// src/QRCodeGenerator.jsx
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [inputText, setInputText] = useState("https://localhost:5173/qrcode/1234567890");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  const generateQRCode = async () => {
    try {
      const [url, token] = inputText.split('/').slice(-2);
      
      // post request to backend to authenticate user
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const qrCode = await QRCode.toDataURL(inputText);
      setQrCodeDataUrl(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <div className="qr-code-container">
      <h2>QR Code Generator</h2>
      <div className="qr-code-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text for QR code"
        />
        <button 
          className="generate-button"
          onClick={generateQRCode}
        >
          Generate QR Code
        </button>
      </div>
      {qrCodeDataUrl && (
        <div className="qr-code-image">
          <img src={qrCodeDataUrl} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
