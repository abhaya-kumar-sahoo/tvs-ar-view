import React, { useState } from "react";
import { WebcamCapture } from "./WebcamCapture";
import { Trainer } from "./Trainer";
import { Predictor } from "./Predictor";
import { Retrainer } from "./Retrainer"; // ✅ NEW
import { PreTrainedPredictor } from "./PreTrainedPredic";

function FoxCon() {
  const [mode, setMode] = useState("capture"); // capture | train | predict | retrain
  const [dataset, setDataset] = useState({});
  const [model, setModel] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">React Teachable Machine Clone</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setMode("capture")}
        >
          Capture
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setMode("train")}
        >
          Train
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => setMode("predict")}
        >
          Predict
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => setMode("pre-trained-predict")}
        >
          Pre Trained Predict
        </button>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded"
          onClick={() => setMode("retrain")}
        >
          Retrain
        </button>
      </div>

      {mode === "capture" && (
        <WebcamCapture dataset={dataset} setDataset={setDataset} />
      )}
      {mode === "train" && <Trainer dataset={dataset} setModel={setModel} />}
      {mode === "predict" && <Predictor model={model} />}
      {mode === "pre-trained-predict" && <PreTrainedPredictor />}
      {mode === "retrain" && <Retrainer setModel={setModel} />}
    </div>
  );
}

export default FoxCon;
