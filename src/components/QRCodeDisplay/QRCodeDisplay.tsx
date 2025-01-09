/**
 * QRCodeDisplay component handles the display of the qr code
 */
import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Logger } from "@/Utils/Logger";

interface QRCodeDisplayProps {
  value: string; 
  className?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (value && canvasRef.current) {
      // Generate the QR code and render it on the canvas
      QRCode.toCanvas(canvasRef.current, value, { width: 200 })
        .then(() => Logger.info("QR Code generated successfully"))
        .catch((error) => Logger.error("Error generating QR Code:", error));
    }
  }, [value]);

  return (
    <div style={{ textAlign: "center"}} className={className}>
      {value ? (
        <canvas ref={canvasRef} />
      ) : (
        <p>No QR code value provided</p>
      )}
    </div>
  );
};

export default QRCodeDisplay;
