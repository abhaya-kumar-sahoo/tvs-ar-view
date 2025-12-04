/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tmImage from "@teachablemachine/image";
import * as tf from "@tensorflow/tfjs";
import { useNavigate } from "react-router-dom";
import useOrientation from "../hooks/oriantation";
// const isiOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
// const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
import { ToastContainer, toast } from "react-toastify";
import { checkOS } from "../hooks/checkOS";

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
  // const [cameraStarted, setCameraStarted] = useState(false);
  const isPortrait = useOrientation();
  const isIOS = checkOS();

  const startCamera = useCallback(() => {
    enterFullscreenAndUnlock();
    if (!isPortrait) {
      // requestCameraPermission();
    } else {
      toast(
        "Please enable auto rotate and rotate your device to use this feature.",
        { type: "warning" }
      );
    }
  }, [isPortrait]);

  useEffect(() => {
    startCamera();
  }, [startCamera]);
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
    } catch (err: any) {
      setIsWebXRSupported(false);
      setError(`Error checking WebXR: ${err?.message}`);
    }
  };

  useEffect(() => {
    checkWebXR();
    loadModel();
  }, []);
  // Real-time prediction from camera
  const runWebcamPrediction = useCallback(async () => {
    if (!model || !webcamRef.current || !webcamRef.current.video) return;
    console.log("Running webcam prediction...");
    const prediction = await model.predict(webcamRef.current.video);
    const threshold = 0.9;

    // Get the prediction with the highest probability above the threshold
    const maxPred = prediction
      .filter((p) => p.probability >= threshold)
      .sort((a, b) => b.probability - a.probability)[0]; // get top one

    if (maxPred) {
      // console.log({ maxPred: maxPred?.className });
      if (maxPred.className !== "Unknown Object") {
        // nav("/3d"); // Directly navigate to AR page
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
  }, [model, nav]);

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
  }, [model, runWebcamPrediction]);

  // async function requestCameraPermission() {
  //   try {
  //     await navigator.mediaDevices.getUserMedia({
  //       video: {
  //         facingMode: { exact: "environment" }, // Back camera
  //       },
  //     });
  //     // setCameraStarted(true);
  //   } catch (err) {
  //     console.error("Camera access denied:", err);
  //   }
  // }

  // Stop camera, clear interval and release resources
  const stopCamera = () => {
    // 1. Clear the prediction interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 2. Safely stop all tracks in the video stream
    const video = webcamRef.current?.video as HTMLVideoElement | undefined;

    if (video?.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop(); // This is crucial — stops camera/mic access
      });
      video.srcObject = null; // Detach stream from video element
    }

    // Optional: pause the video element explicitly (good practice)
    if (video) {
      video.pause();
    }

    // 3. Reset predictions
    setPredictions([]);

    nav(isIOS ? "/ios" : "/3d");
  };

  // Loader component
  const Loader = () => (
    <div className="flex flex-col justify-center align-middle items-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-100 text-lg text-center  whitespace-nowrap ">
        Detecting...
      </span>
    </div>
  );

  const enterFullscreenAndUnlock = async () => {
    try {
      await document.documentElement.requestFullscreen();
      await screen.orientation.unlock();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <div className="h-screen overflow-hidden">
        {/* {!cameraStarted && <HomeMobile onStartAr={startCamera} />} */}
        <div className="flex flex-col  items-center landscape:pt-6 portrait:justify-center w-full min-h-screen landscape:h-screen bg-gradient-to-br from-black via-red-900 to-blue-900 overflow-hidden">
          <div className="">
            <div
              className="relative  flex items-center justify-center w-[95vw] max-w-[700px] h-[60vw]  max-h-[400px]  rounded-tl-3xl rounded-br-3xl overflow-hidden 
                landscape:w-[60vw] portrait:w-[130vw]  landscape:h-[60vh] border-2 border-blue-500 "
            >
              {isPortrait ? (
                <h1 className="text-3xl font-bold">
                  Please rotate to scan bike !
                </h1>
              ) : (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  className="object-cover"
                  videoConstraints={{
                    facingMode: { exact: "environment" }, // back camera
                  }}
                />
              )}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-red-400 rounded-tl-2xl" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-400 " />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-400" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-red-400 rounded-br-2xl" />
            </div>
            <div className="w-full flex flex-col items-end mt-4 pr-0 md:pr-10 landscape:mt-2 landscape:pr-4">
              {predictions.length > 0 &&
              predictions[0].className !== "Unknown Object" ? (
                <div className="flex flex-col items-center w-full pt-2">
                  <div className="flex flex-row justify-center w-full mb-2">
                    <button
                      onClick={() => {
                        window.location.reload();
                      }}
                      className="px-4 mx-2 rounded bg-red-600 py-2 text-white"
                    >
                      Restart
                    </button>
                    <button
                      onClick={() => {
                        stopCamera();
                      }}
                      className="px-4 mx-2 rounded bg-amber-600 py-2 text-white"
                    >
                      Show me Engine
                    </button>
                  </div>
                  <span className="text-gray-100 text-lg text-right">
                    {predictions[0].className}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col justify-center w-full">
                  {!isPortrait && <Loader />}
                </div>
              )}

              {/* <button onClick={stopCamera}>Close Cam</button> */}
            </div>
          </div>
        </div>

        {isWebXRSupported && (
          <p className="text-red-600 text-lg text-center pt-20">
            {!isWebXRSupported && (error || "Checking WebXR support...")}
          </p>
        )}
      </div>
      <ToastContainer />
    </>
  );
};
