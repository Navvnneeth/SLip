import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import styles from './css/webcam.module.css'; // Add this CSS file
import axios from 'axios';

const WebcamCapture = ({handleSubmit}) => {
  const token = localStorage.getItem('token');
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setShowCamera(false);
  }, [webcamRef]);

  return (
    <div className={styles.container}>
      {!image && !showCamera && (
        <button className={styles.openButton} onClick={() => setShowCamera(true)}>
          Open Camera
        </button>
      )}

      {showCamera && (
        <div className={styles.webcamBox}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            className={styles.webcam}
            videoConstraints={{ facingMode: "environment" }}
          />
          <button className={styles.captureButton} onClick={capture}>Capture</button>
        </div>
      )}

      {image && (
        <div className={styles.previewBox}>
          <img src={image} alt="Captured" className={styles.capturedImage} />
          <button className={styles.retakeButton} onClick={() => {
            setImage(null);
            setShowCamera(true);
          }}>
            Retake
          </button>
          <button className={styles.retakeButton} onClick={() => handleSubmit(image)}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
