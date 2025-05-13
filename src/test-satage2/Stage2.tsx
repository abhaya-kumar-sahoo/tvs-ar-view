import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

import { useEffect, useRef, useState } from "react";

export default function Stage2() {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    cocoSsd.load().then((loadedModel) => setModel(loadedModel));
  }, []);

  return <div className="w-screen h-screen m-0 p-0"></div>;
}
