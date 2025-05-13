// import React, { useEffect, useState, useRef } from "react";

// import Webcam from "react-webcam";
// import * as tf from "@tensorflow/tfjs";
// import * as mobilenet from "@tensorflow-models/mobilenet";

// function FoxCon() {
//   const [mode, setMode] = useState("capture"); // capture | train | predict
//   const [dataset, setDataset] = useState({});
//   const [model, setModel] = useState(null);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 text-center">
//       <h1 className="text-3xl font-bold mb-6">React Teachable Machine Clone</h1>
//       <div className="flex justify-center gap-4 mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => setMode("capture")}
//         >
//           Capture
//         </button>
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded"
//           onClick={() => setMode("train")}
//         >
//           Train
//         </button>
//         <button
//           className="bg-purple-500 text-white px-4 py-2 rounded"
//           onClick={() => setMode("predict")}
//         >
//           Predict
//         </button>
//       </div>
//       {mode === "capture" && (
//         <WebcamCapture dataset={dataset} setDataset={setDataset} />
//       )}
//       {mode === "train" && <Trainer dataset={dataset} setModel={setModel} />}
//       {mode === "predict" && <Predictor model={model} />}
//     </div>
//   );
// }

// export default FoxCon;

// const WebcamCapture = ({ dataset, setDataset }) => {
//   const webcamRef = useRef(null);
//   const [label, setLabel] = useState("");

//   const capture = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc || !label) return;
//     const updated = { ...dataset };
//     updated[label] = updated[label]
//       ? [...updated[label], imageSrc]
//       : [imageSrc];
//     setDataset(updated);
//   };

//   return (
//     <div className="space-y-4">
//       <Webcam
//         audio={false}
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         width={320}
//         height={240}
//         className="mx-auto rounded shadow"
//       />
//       <input
//         className="border px-2 py-1"
//         value={label}
//         onChange={(e) => setLabel(e.target.value)}
//         placeholder="Enter class label"
//       />
//       <button
//         className="bg-blue-600 text-white px-3 py-1 rounded"
//         onClick={capture}
//       >
//         Capture Image
//       </button>
//     </div>
//   );
// };

// const Trainer = ({ dataset, setModel }) => {
//   const [status, setStatus] = useState("Idle");

//   const trainModel = async () => {
//     setStatus("Loading MobileNet...");

//     setStatus("Waiting for TensorFlow...");
//     await tf.ready(); // 🔥 wait for tf to be ready
//     await tf.setBackend("webgl"); // 🔁 optionally switch to webgl if webgpu fails

//     setStatus("Loading MobileNet...");
//     const mobilenetModel = await mobilenet.load();
//     // const model = await tf.loadLayersModel(
//     //   "https://your-s3-url.com/model.json"
//     // );

//     const model = tf.sequential();
//     model.add(
//       tf.layers.dense({ inputShape: [1024], units: 100, activation: "relu" })
//     );
//     model.add(
//       tf.layers.dense({
//         units: Object.keys(dataset).length,
//         activation: "softmax",
//       })
//     );

//     const labels = Object.keys(dataset);
//     const xs = [];
//     const ys = [];

//     for (let i = 0; i < labels.length; i++) {
//       for (let img of dataset[labels[i]]) {
//         const imgElement = document.createElement("img");
//         imgElement.src = img;
//         await new Promise((res) => (imgElement.onload = res));
//         const tensor = tf.browser
//           .fromPixels(imgElement)
//           .resizeNearestNeighbor([224, 224])
//           .toFloat()
//           .expandDims();
//         const embedding = mobilenetModel.infer(tensor, true);
//         xs.push(embedding);
//         ys.push(i);
//       }
//     }

//     const xsStack = tf.concat(xs);
//     const ysTensor = tf.tensor1d(ys, "int32");
//     const ysOneHot = tf.oneHot(ysTensor, labels.length);

//     model.compile({
//       optimizer: "adam",
//       loss: "categoricalCrossentropy",
//       metrics: ["accuracy"],
//     });

//     setStatus("Training...");
//     await model.fit(xsStack, ysOneHot, { epochs: 10 });

//     setModel({ model, labels });
//     setStatus("Trained successfully!");
//     await model.save("downloads://my-custom-model");
//   };

//   useEffect(() => {
//     if (Object.keys(dataset).length > 0) trainModel();
//   }, []);

//   return <div className="text-lg font-semibold">{status}</div>;
// };

// // components/Predictor.js

// const Predictor = ({ model }) => {
//   const webcamRef = useRef(null);
//   const [prediction, setPrediction] = useState("Waiting...");
//   const [mobilenetModel, setMobilenetModel] = useState(null);

//   useEffect(() => {
//     mobilenet.load().then(setMobilenetModel);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       if (!model || !mobilenetModel || !webcamRef.current) return;
//       const image = tf.browser
//         .fromPixels(webcamRef.current.video)
//         .resizeNearestNeighbor([224, 224])
//         .toFloat()
//         .expandDims();
//       const embedding = mobilenetModel.infer(image, true);
//       const result = model.model.predict(embedding);
//       const index = result.argMax(-1).dataSync()[0];
//       setPrediction(model.labels[index]);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [model, mobilenetModel]);

//   return (
//     <div className="space-y-4">
//       <Webcam
//         ref={webcamRef}
//         audio={false}
//         width={320}
//         height={240}
//         className="mx-auto rounded shadow"
//       />
//       <div className="text-xl font-bold">Prediction: {prediction}</div>
//     </div>
//   );
// };
