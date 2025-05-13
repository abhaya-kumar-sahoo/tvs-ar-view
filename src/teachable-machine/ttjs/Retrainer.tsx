import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

export const Retrainer = () => {
  const [status, setStatus] = useState("Upload model and labels to start...");
  const [baseModel, setBaseModel] = useState<tf.LayersModel | null>(null); // Feature extractor
  const [labels, setLabels] = useState([]);
  const [dataset, setDataset] = useState({});
  const [labelInput, setLabelInput] = useState("");

  const webcamRef = useRef(null);

  useEffect(() => {
    tf.ready().then(() => tf.setBackend("webgl"));
  }, []);

  const handleModelUpload = async (e) => {
    const files = e.target.files;
    if (files.length < 2) {
      alert("Please upload both .json and .bin files");
      return;
    }

    const model = await tf.loadLayersModel(
      tf.io.browserFiles([files[0], files[1]])
    );

    const truncatedModel = tf.model({
      inputs: model.inputs,
      outputs: model.layers[model.layers.length - 2].output,
    });

    truncatedModel.trainable = false;
    setBaseModel(truncatedModel);
    setStatus("✅ Base model loaded");
  };

  const handleLabelsUpload = async (e) => {
    const file = e.target.files[0];
    const content = await file.text();
    const parsed = JSON.parse(content);
    setLabels(parsed);
    setStatus("✅ Labels loaded");
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc || !labelInput) return;

    if (!labels.includes(labelInput)) {
      setLabels((prev) => [...prev, labelInput]);
    }

    const updated = { ...dataset };
    updated[labelInput] = updated[labelInput]
      ? [...updated[labelInput], imageSrc]
      : [imageSrc];
    setDataset(updated);
    setStatus(`📸 Captured image for "${labelInput}"`);
  };

  const buildNewModel = (numClasses) => {
    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        inputShape: [baseModel.outputs[0].shape[1]],
        units: 128,
        activation: "relu",
      })
    );
    model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  };

  const trainModel = async () => {
    if (
      !baseModel ||
      labels.length === 0 ||
      Object.keys(dataset).length === 0
    ) {
      setStatus("❌ Missing model, labels, or dataset.");
      return;
    }

    setStatus("🔄 Preprocessing data...");
    const xs = [];
    const ys = [];

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      if (!dataset[label]) continue;

      for (let img of dataset[label]) {
        const imgElement = document.createElement("img");
        imgElement.src = img;
        await new Promise((res) => (imgElement.onload = res));

        const tensor = tf.browser
          .fromPixels(imgElement)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();
        const embedding = baseModel.predict(tensor);
        xs.push(embedding);
        ys.push(i);
      }
    }

    const xsStack = tf.concat(xs);
    const ysTensor = tf.tensor1d(ys, "int32");
    const ysOneHot = tf.oneHot(ysTensor, labels.length);

    const classifier = buildNewModel(labels.length);

    setStatus("🚀 Retraining...");
    await classifier.fit(xsStack, ysOneHot, {
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, logs) =>
          setStatus(`🧠 Epoch ${epoch + 1}: Accuracy ${logs.acc.toFixed(2)}`),
      },
    });

    // Combine base + new classifier
    const combinedModel = tf.sequential();
    combinedModel.add(baseModel);
    combinedModel.add(classifier);
    combinedModel.compile({
      optimizer: tf.train.adam(),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    setStatus("✅ Retraining complete! Exporting model...");
    await combinedModel.save("downloads://my-updated-model");

    const labelBlob = new Blob([JSON.stringify(labels)], {
      type: "application/json",
    });
    const labelLink = document.createElement("a");
    labelLink.href = URL.createObjectURL(labelBlob);
    labelLink.download = "updated-labels.json";
    labelLink.click();

    setStatus("✅ Model and labels exported!");
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto p-4">
      <div>
        <label className="block mb-2 font-medium">
          Upload Pretrained Model (.json + .bin)
        </label>
        <input type="file" multiple onChange={handleModelUpload} />
      </div>
      <div>
        <label className="block mb-2 font-medium">
          Upload Labels (labels.json)
        </label>
        <input type="file" accept=".json" onChange={handleLabelsUpload} />
      </div>

      <div className="mt-4 border-t pt-4">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          className="mx-auto rounded shadow"
        />
        <input
          type="text"
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          placeholder="Enter label"
          className="border px-2 py-1 mt-2"
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded ml-2"
          onClick={captureImage}
        >
          Capture
        </button>
      </div>

      <button
        className="bg-orange-600 text-white px-4 py-2 rounded"
        onClick={trainModel}
      >
        Retrain Model
      </button>

      <div className="text-lg font-semibold mt-4">{status}</div>
    </div>
  );
};

// setModel({ model: loadedModel, labels });
