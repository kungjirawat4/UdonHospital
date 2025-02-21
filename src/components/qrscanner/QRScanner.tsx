import React, { useState } from "react";

import jsQR from 'jsqr';
import WebcamCapture from "./WebcamCapture";


const QRScanner = () => {
const [qrCode, setQrCode] = useState("");

const handleScan = (imageSrc: string) => {
    if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code: any = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert"});
            if (code) {
                setQrCode(code.data);
                console.log("code: ", code.data);
            }
        }
    }
}

return (
    <div>
        <WebcamCapture onScan={handleScan} />
    </div>
);
}

export default QRScanner;