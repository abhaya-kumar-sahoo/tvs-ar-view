import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 224,
  height: 224,
  facingMode: "environment",
};

function TeachableMachine() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [predictions, setPredictions] = useState<
    { className: string; probability: number }[]
  >([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);

  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  // Load the Teachable Machine model
  const loadModel = async () => {
    const modelURL = "/model/model.json";
    const metadataURL = "/model/metadata.json";

    try {
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    if (!model) return;

    const file = event.target.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.width = 224;
    img.height = 224;

    setImage(img.src);
    setPredictions([]);
    setLoading(true);

    img.onload = async () => {
      try {
        const predictions = await model.predict(img);
        const threshold = 0.7; // 70% confidence threshold
        const filtered = predictions.filter((p) => p.probability >= threshold);

        if (filtered.length === 0) {
          setPredictions([{ className: "Unknown", probability: 1 }]);
        } else {
          setPredictions(filtered);
        }
        console.log({ filtered });
        console.log({ predictions });

        // setPredictions(predictions);
      } catch (error) {
        console.error("Error predicting:", error);
      } finally {
        setLoading(false);
        URL.revokeObjectURL(img.src);
      }
    };
  };

  // Real-time prediction from camera
  const runWebcamPrediction = async () => {
    if (!model || !webcamRef.current || !webcamRef.current.video) return;
    const prediction = await model.predict(webcamRef.current.video);
    const threshold = 0.7; // 70% confidence threshold

    const filtered = prediction.filter((p) => p.probability >= threshold);

    if (filtered.length === 0) {
      setPredictions([{ className: "Unknown", probability: 1 }]);
    } else {
      setPredictions(filtered);
    }
    // setPredictions(prediction);
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (useCamera && model) {
      intervalRef.current = setInterval(runWebcamPrediction, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [useCamera, model]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Teachable Machine Image Classification
      </h1>

      {/* Toggle Camera Mode */}
      <button
        onClick={() => {
          setUseCamera((prev) => !prev);
          setPredictions([]);
          setImage(null);
        }}
        className="mb-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        {useCamera ? "Switch to Upload Image" : "Switch to Camera"}
      </button>

      {/* Image Upload */}
      {!useCamera && (
        <div className="mb-6">
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera Feed */}
      {useCamera && (
        <div className="mb-6 border-2 border-gray-300 rounded-lg overflow-hidden">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width={224}
            height={224}
            videoConstraints={videoConstraints}
          />
        </div>
      )}

      {/* Display Uploaded Image */}
      {!useCamera && image && (
        <div className="mb-6">
          <img
            src={image}
            alt="Uploaded"
            className="w-56 h-56 object-contain border-2 border-gray-300 rounded-lg"
          />
        </div>
      )}

      {/* Predictions or Loader */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Predictions
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-opacity-50"></div>
          </div>
        ) : predictions.length > 0 ? (
          <ul className="space-y-2">
            {predictions.map((pred, index) => (
              <li
                key={index}
                className="flex justify-between text-gray-600 border-b py-2"
              >
                <span>{pred.className}</span>
                <span className="font-medium">
                  {(pred.probability * 100).toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            {useCamera
              ? "Point your camera at an object"
              : model
              ? "Upload an image to see predictions"
              : "Loading model..."}
          </p>
        )}
      </div>
    </div>
  );
}

export default TeachableMachine;
