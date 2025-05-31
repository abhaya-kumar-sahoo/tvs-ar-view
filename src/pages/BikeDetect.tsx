import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tmImage from "@teachablemachine/image";
import * as tf from "@tensorflow/tfjs";
import { useNavigate } from "react-router-dom";

export const BikeDetect = () => {
  const webcamRef = useRef<Webcam>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [isWebXRSupported, setIsWebXRSupported] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const nav = useNavigate();
  const [predictions, setPredictions] = useState<
    { className: string; probability: number }[]
  >([]);
  const [cameraStarted, setCameraStarted] = useState(false);

  const startCamera = () => {
    requestCameraPermission();
  };

  // Load the Teachable Machine model
  const loadModel = async () => {
    const modelURL = "/310rr-bike-model/model.json";
    const metadataURL = "/310rr-bike-model/metadata.json";

    try {
      await tf.ready(); // ✅ Ensure TF backend is initialized

      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  const checkWebXR = async () => {
    try {
      if (
        navigator.xr &&
        (await navigator.xr.isSessionSupported("immersive-ar"))
      ) {
        setIsWebXRSupported(true);
      } else {
        setIsWebXRSupported(false);
        setError(
          "WebXR or immersive AR is not supported on this device or browser."
        );
      }
    } catch (err) {
      setIsWebXRSupported(false);
      setError(`Error checking WebXR: ${err.message}`);
    }
  };

  useEffect(() => {
    checkWebXR();
    loadModel();
  }, []);
  // Real-time prediction from camera
  const runWebcamPrediction = async () => {
    if (!model || !webcamRef.current || !webcamRef.current.video) return;

    const prediction = await model.predict(webcamRef.current.video);
    const threshold = 0.9;

    // Get the prediction with the highest probability above the threshold
    const maxPred = prediction
      .filter((p) => p.probability >= threshold)
      .sort((a, b) => b.probability - a.probability)[0]; // get top one

    if (maxPred) {
      // console.log({ maxPred: maxPred?.className });
      if (maxPred.className !== "Unknown Object") {
        // nav("/3d");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setPredictions([maxPred]);
      }
      // setCameraStarted(false);
      // nav("/3d");
    } else {
      setPredictions([{ className: "Unknown Object", probability: 1 }]);
    }
  };

  useEffect(() => {
    if (model) {
      intervalRef.current = setInterval(runWebcamPrediction, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [model]);

  async function requestCameraPermission() {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" }, // Back camera
        },
      });
      setCameraStarted(true);
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }

  return (
    <div className="relative h-screen w-screen flex justify-center items-center overflow-hidden bg-black text-white">
      {/* 🔵 Animated gradient blob background */}
      <div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]  opacity-20 spin-slow z-0"
        style={{
          background: "conic-gradient(at top left, #00ffcc, #3366ff, #00ffcc)",
        }}
      ></div>
      {/* 🟩 Grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#00ffbf_1px,transparent_1px)] [background-size:40px_40px] opacity-10 z-0"></div>
      {/* 💫 Glowing Scan Rings */}
      <div className="ring ring-green ring-delay-0 w-[600px] h-[600px]"></div>
      <div className="ring ring-blue ring-delay-1 w-[500px] h-[500px]"></div>
      <div className="ring ring-purple ring-delay-2 w-[400px] h-[400px]"></div>
      <div className="ring ring-yellow ring-delay-3 w-[300px] h-[300px]"></div>
      <div className="ring ring-green ring-delay-4 w-[200px] h-[200px]"></div>
      <div className="ring ring-blue ring-delay-5 w-[100px] h-[100px]"></div>
      <div className="ring ring-purple ring-delay-6 w-[50px] h-[50px]"></div>
      <div className="ring ring-yellow ring-delay-7 w-[10px] h-[10px]"></div>

      <div className="relative z-50">
        {!cameraStarted && (
          <>
            {/* 🌟 Content */}
            <div className="z-10 text-center px-4">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-green-400 to-emerald-300 drop-shadow-[0_2px_10px_rgba(132,204,22,0.7)]">
                Experience Your Bike in AR
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
                Scan your real-world bike using your camera and bring it to life
                in 3D Augmented Reality.
              </p>

              <button
                onClick={startCamera}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 via-lime-300 to-green-400 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(132,204,22,0.6)] hover:shadow-[0_0_30px_rgba(132,204,22,1)] transition-all duration-300 hover:scale-105 active:scale-95"
                title="Start scanning your bike"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M5.5 17.5A2.5 2.5 0 1 0 5.5 12a2.5 2.5 0 0 0 0 5.5zm13 0A2.5 2.5 0 1 0 18.5 12a2.5 2.5 0 0 0 0 5.5zM7.5 17.5h2L11 12h2l1.5 5.5h2" />
                  <path d="M5.5 12l2-3h4M14 9h4" />
                </svg>
                Start AR Bike Scan
              </button>
            </div>
          </>
        )}
        {cameraStarted && (
          <div className="relative border-2 border-white p-2 rounded-2xl">
            {/* Webcam Feed */}

            <Webcam
              ref={webcamRef}
              audio={false}
              className="rounded-md w-96 h-64 object-cover"
              videoConstraints={{
                facingMode: { exact: "environment" }, // back camera
              }}
            />

            {/* Centered Overlay Grid */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-[290px] h-[170px] relative">
                {/* Corner Borders */}
                {/* Top Left */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl-md" />
                {/* Top Right */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr-md" />
                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl-md" />
                {/* Bottom Right */}
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br-md" />
              </div>
            </div>
          </div>
        )}
        {predictions.length > 0 ? (
          <ul className="space-y-2 ">
            {predictions.map((pred, index) => (
              <li
                key={index}
                className="flex justify-center text-gray-100 border-b py-2"
              >
                <span className="text-center">{pred.className}</span>
                {/* <span className="font-medium ml-2">
                  {(pred.probability * 100).toFixed(2)}%
                </span> */}
              </li>
            ))}
            {predictions[0].className !== "Unknown Object" && (
              <div className="justify-center flex">
                <button
                  onClick={() => {
                    nav("3d");
                  }}
                  className="px-4 rounded bg-amber-600 py-2"
                >
                  Show me Engine
                </button>
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="px-4 mx-3 rounded bg-red-600 py-2"
                >
                  Restart
                </button>
              </div>
            )}
          </ul>
        ) : (
          <p className="text-red-600 text-lg text-center pt-20">
            {!isWebXRSupported && (error || "Checking WebXR support...")}
          </p>
        )}
      </div>
    </div>
  );
};
