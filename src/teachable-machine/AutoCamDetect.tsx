import { useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/JZyRRKVi-/"; // Replace with your model URL

export const WebcamClassifier = () => {
  const webcamContainerRef = useRef(null);
  const labelContainerRef = useRef(null);
  const [webcam, setWebcam] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);

  const isIos = /iPhone|iPad/.test(navigator.userAgent);

  const init = async () => {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    //   await tmImage.createTeachable({grayscale})
    const loadedModel = await tmImage.load(modelURL, metadataURL);
    setMaxPredictions(loadedModel.getTotalClasses());

    const cam = new tmImage.Webcam(200, 200, false);
    await cam.setup();

    if (isIos) {
      webcamContainerRef.current.appendChild(cam.webcam);
      const videoElement = cam.webcam;
      videoElement.setAttribute("playsinline", true);
      videoElement.muted = true;
      videoElement.style.width = "200px";
      videoElement.style.height = "200px";
    } else {
      webcamContainerRef.current.appendChild(cam.canvas);
    }

    await cam.play();
    setWebcam(cam);

    for (let i = 0; i < loadedModel.getTotalClasses(); i++) {
      labelContainerRef.current.appendChild(document.createElement("div"));
    }

    requestAnimationFrame(() => loop(cam, loadedModel));
  };

  const loop = async (cam, loadedModel) => {
    cam.update();
    await predict(cam, loadedModel);
    requestAnimationFrame(() => loop(cam, loadedModel));
  };

  const predict = async (cam, loadedModel) => {
    const prediction = isIos
      ? await loadedModel.predict(cam.webcam)
      : await loadedModel.predict(cam.canvas);

    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      labelContainerRef.current.childNodes[i].innerHTML = classPrediction;
    }
  };

  return (
    <div>
      <h2>Teachable Machine Image Model</h2>
      <button onClick={init}>Start</button>
      <div
        ref={webcamContainerRef}
        id="webcam-container"
        style={{ marginTop: "10px" }}
      ></div>
      <div
        ref={labelContainerRef}
        id="label-container"
        style={{ marginTop: "10px" }}
      ></div>
    </div>
  );
};
