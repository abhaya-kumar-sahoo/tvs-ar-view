import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
// Move labels.json to src/generated-modal/
import labels from "../../assets/generated-modal/labels.json"; // ["keyb", "biscuit", "bottle"]
export const PreTrainedPredictor = () => {
  const webcamRef = useRef<Webcam>(null);
  const [prediction, setPrediction] = useState("Waiting...");
  const [mobilenetModel, setMobilenetModel] = useState<any>(null);
  const [customModelData, setCustomModelData] = useState<{
    model: tf.LayersModel;
    labels: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        await tf.setBackend("webgl");
        console.log("Backend initialized:", tf.getBackend());

        const model = await tf.loadLayersModel(
          "/generated-modal/my-custom-model.json"
        );
        console.log("Custom model input shape:", model.inputs[0].shape); // [null, 1024]
        console.log("Custom model output shape:", model.outputs[0].shape); // [null, 2]
        console.log("Labels:", labels);

        setCustomModelData({ model, labels });
      } catch (err) {
        console.error("Failed to load model:", err);
        setError(
          "Failed to load the model. Please check the console for details."
        );
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    const loadMobileNet = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load({ version: 1, alpha: 1.0 });
        setMobilenetModel(loadedModel);
      } catch (err) {
        console.error("Failed to load MobileNet:", err);
        setPrediction("Error loading MobileNet model");
      }
    };
    loadMobileNet();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        !customModelData ||
        !mobilenetModel ||
        !webcamRef.current ||
        webcamRef.current.video.readyState !== 4
      )
        return;
      try {
        const image = tf.browser
          .fromPixels(webcamRef.current.video)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .div(127.5)
          .sub(1)
          .expandDims();
        const embedding = mobilenetModel.infer(image, true);
        console.log("Embedding shape:", embedding.shape);
        console.log(
          "Embedding sample values:",
          (await embedding.data()).slice(0, 10)
        );

        const result = customModelData.model.predict(embedding) as tf.Tensor;
        const normalizedResult = tf.softmax(result);
        console.log("Result shape:", normalizedResult.shape);
        console.log("Result probabilities:", await normalizedResult.data());

        const index = normalizedResult.argMax(-1).dataSync()[0];
        console.log({ index, labels: customModelData.labels });

        if (index >= 0 && index < customModelData.labels.length) {
          setPrediction(customModelData.labels[index]);
        } else {
          console.error("Invalid index:", index);
          setPrediction("Invalid prediction");
        }

        tf.dispose([image, embedding, result, normalizedResult]);
      } catch (err) {
        console.error("Prediction error:", err);
        setPrediction("Error during prediction");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [customModelData, mobilenetModel]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!customModelData) {
    return <div>Loading model...</div>;
  }

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
