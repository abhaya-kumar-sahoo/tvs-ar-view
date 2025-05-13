import React, { useRef, useState } from "react";
import * as ml5 from "ml5";
export const LiveTrainer = () => {
  const videoRef = useRef(null);
  const [label, setLabel] = useState("");
  const [classifier, setClassifier] = useState(null);
  const [resultLabel, setResultLabel] = useState("");
  const [statusMessage, setStatusMessage] = useState("Waiting to start...");

  const startWebcam = async () => {
    try {
      setStatusMessage("Starting webcam...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setStatusMessage("Webcam started. Loading model...");

      const featureExtractor = ml5.imageClassifier("MobileNet", () => {
        try {
          const knn = featureExtractor.classifyStart(videoRef.current);
          setClassifier(knn);
          setStatusMessage("Model loaded. Ready to train!");
        } catch (modelErr) {
          console.error("Error setting up classifier:", modelErr);
          setStatusMessage("Error setting up the classifier.");
        }
      });
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setStatusMessage("Error accessing back camera.");
    }
  };

  const addExample = () => {
    if (classifier && label) {
      classifier.addImage(label);
      setStatusMessage(`Added example for label: "${label}"`);
    } else {
      setStatusMessage("Please enter a label and start webcam first.");
    }
  };

  const startPredicting = () => {
    if (!classifier) {
      setStatusMessage("Classifier not initialized yet.");
      return;
    }

    setStatusMessage("Starting prediction...");
    const predictLoop = () => {
      classifier.classify((err, result) => {
        if (err) {
          console.error(err);
          setStatusMessage("Prediction error.");
          return;
        }

        if (result && result.label) {
          setResultLabel(result.label);
          setStatusMessage(`Predicting: ${result.label}`);
        }
        requestAnimationFrame(predictLoop);
      });
    };
    predictLoop();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">
          🎥 Live Webcam Trainer
        </h2>

        <input
          type="text"
          placeholder="Enter label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between space-x-2">
          <button
            onClick={startWebcam}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Start Webcam
          </button>
          <button
            onClick={addExample}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          >
            Add Example
          </button>
          <button
            onClick={startPredicting}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
          >
            Start Predicting
          </button>
        </div>

        <video
          ref={videoRef}
          width="300"
          height="200"
          autoPlay
          muted
          className="rounded mx-auto border border-gray-400"
        />

        <div className="text-center mt-4">
          <p className="text-lg font-medium text-gray-600">Prediction:</p>
          <p className="text-xl font-bold text-blue-600">{resultLabel}</p>

          <p className="text-sm text-gray-500 mt-2 italic">{statusMessage}</p>
        </div>
      </div>
    </div>
  );
};
