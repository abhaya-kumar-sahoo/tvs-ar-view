import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import CameraFeed from "./components/CameraFeed";
import TeachableMachine from "./teachable-machine/Main";
import { LiveTrainer } from "./teachable-machine/LiveTraing";
import FoxCon from "./teachable-machine/ttjs/Main";

export default function App() {
  return (
    <div className="w-screen h-screen bg-gray-800 text-gray-300">
      {/* <TeachableMachine /> */}
      <FoxCon />
    </div>
  );
}
