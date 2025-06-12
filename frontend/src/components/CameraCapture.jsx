import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ onImageCapture }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const confirmImage = () => {
    if (image && onImageCapture) {
      const blob = dataURItoBlob(image);
      onImageCapture(blob);
      setImage(null); // Reset after capture
    }
  };

  const retakeImage = () => {
    setImage(null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {!image ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
            style={{
              borderRadius: '8px',
              border: '2px solid #e5e7eb'
            }}
          />
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              onClick={capture}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Capture Photo
            </button>
          </div>
        </>
      ) : (
        <>
          <img 
            src={image} 
            alt="Captured" 
            style={{
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              maxWidth: '320px',
              height: 'auto'
            }}
          />
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={confirmImage}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Use This Photo
            </button>
            <button
              type="button"
              onClick={retakeImage}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Retake
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;