import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onScan }) => {
    const webcamRef = useRef<any>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            capture();
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const videoConstraints = {
        width: 580,
        height: 320,
        facingMode: "environment"
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        onScan(imageSrc);
    }

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.8}
                videoConstraints={videoConstraints}
                onClick={() => capture() }
            />
            {/* <button onClick={capture}>Capture photo</button> */}
        </div>
    );
}

export default WebcamCapture;