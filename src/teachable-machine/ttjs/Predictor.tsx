import React, { useEffect, useState, useRef } from "react";

import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

export const Predictor = ({ model }) => {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState("Waiting...");
  const [mobilenetModel, setMobilenetModel] = useState(null);

  useEffect(() => {
    mobilenet.load().then(setMobilenetModel);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!model || !mobilenetModel || !webcamRef.current) return;
      const image = tf.browser
        .fromPixels(webcamRef.current.video)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();
      const embedding = mobilenetModel.infer(image, true);
      const result = model.model.predict(embedding);
      const index = result.argMax(-1).dataSync()[0];
      console.log({
        result1: result.argMax(-1).dataSync(),
        index,
        lebled: model.labels[index],
      });

      setPrediction(model.labels[index]);
    }, 1000);
    return () => clearInterval(interval);
  }, [model, mobilenetModel]);

  return (
    <div className="space-y-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        width={320}
        height={240}
        className="mx-auto rounded shadow"
      />
      <div className="text-xl font-bold text-green-500">
        Prediction: {prediction}
      </div>
    </div>
  );
};
