import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

export const Trainer = ({ dataset, setModel }) => {
  const [status, setStatus] = useState("Idle");
  const hasTrained = useRef(false);

  // Save labels.json
  const saveLabels = (labels) => {
    const blob = new Blob([JSON.stringify(labels)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "labels.json";
    link.click();
  };

  const trainModel = async () => {
    try {
      setStatus("Initializing TensorFlow...");
      await tf.ready();
      await tf.setBackend("webgl");

      setStatus("Loading MobileNet...");
      const mobilenetModel = await mobilenet.load({ version: 1, alpha: 1.0 });

      const labels = Object.keys(dataset);
      if (labels.length === 0) {
        setStatus("No data to train on.");
        return;
      }

      // Validate dataset balance
      console.log(
        "Dataset sizes:",
        Object.entries(dataset).map(([k, v]) => `${k}: ${v.length}`)
      );
      const minSamples = Math.min(
        ...Object.values(dataset).map((v) => v.length)
      );
      if (minSamples < 10) {
        setStatus(
          "Too few samples per class. Need at least 10 images per class."
        );
        return;
      }

      const xs = [];
      const ys = [];

      setStatus("Processing images with augmentation...");

      for (let i = 0; i < labels.length; i++) {
        const images = dataset[labels[i]].slice(0, minSamples); // Balance classes
        for (let img of images) {
          const imgElement = document.createElement("img");
          imgElement.src = img;
          await new Promise((res) => (imgElement.onload = res));

          let tensor = tf.browser
            .fromPixels(imgElement)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .div(127.5)
            .sub(1); // Normalize to [-1, 1]

          // Add batch dimension before augmentation
          tensor = tensor.expandDims();

          // Basic augmentation: random flip
          if (Math.random() > 0.5) {
            tensor = tf.image.flipLeftRight(tensor);
          }

          const embedding = mobilenetModel.infer(tensor, true);

          xs.push(embedding);
          ys.push(i);
        }
      }

      const xsStack = tf.concat(xs);
      const ysTensor = tf.tensor1d(ys, "int32");
      const ysOneHot = tf.oneHot(ysTensor, labels.length);

      const model = tf.sequential();
      model.add(
        tf.layers.dense({ inputShape: [1024], units: 100, activation: "relu" })
      );
      model.add(
        tf.layers.dense({ units: labels.length, activation: "softmax" })
      );

      model.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      setStatus("Training...");
      await model.fit(xsStack, ysOneHot, {
        epochs: 20,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(
              `Epoch ${epoch + 1}: Loss=${logs.loss.toFixed(
                4
              )}, Acc=${logs.acc.toFixed(4)}, Val_Acc=${logs.val_acc.toFixed(
                4
              )}`
            );
          },
        },
      });

      setModel({ model, labels });
      setStatus("Saving model...");

      await model.save("downloads://my-custom-model");
      saveLabels(labels);

      setStatus("Trained and saved successfully!");
    } catch (error) {
      console.error("Training error:", error);
      setStatus("Training failed. Check console for errors.");
    }
  };

  useEffect(() => {
    if (!hasTrained.current && Object.keys(dataset).length > 0) {
      hasTrained.current = true;
      trainModel();
    }
  }, [dataset]);

  return <div className="text-lg font-semibold text-indigo-400">{status}</div>;
};
