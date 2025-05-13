import React, { useState, useRef } from "react";

import Webcam from "react-webcam";

export const WebcamCapture = ({ dataset, setDataset }) => {
  const webcamRef = useRef(null);
  const [label, setLabel] = useState("");

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc || !label) return;
    const updated = { ...dataset };
    updated[label] = updated[label]
      ? [...updated[label], imageSrc]
      : [imageSrc];
    setDataset(updated);
  };

  return (
    <div className="space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        className="mx-auto rounded shadow"
      />
      <input
        className="border px-2 py-1 text-black"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Enter class label"
      />
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded"
        onClick={capture}
      >
        Capture Image
      </button>
    </div>
  );
};
