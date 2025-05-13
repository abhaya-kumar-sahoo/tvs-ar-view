import "@google/model-viewer";
import { Canvas } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
import { useEffect, useState } from "react";

import VRScene from "./ARScene";
import CameraFeed from "./components/CameraFeed";

export default function Stage1() {
  const store = createXRStore({
    // Configure for VR
    customSessionInit: {
      requiredFeatures: ["local-floor"], // VR typically uses local-floor
      optionalFeatures: ["bounded-floor", "hand-tracking"],
    },
  });

  const [isVRSupported, setIsVRSupported] = useState(false);

  // Check if VR is supported
  useEffect(() => {
    navigator.xr?.isSessionSupported("immersive-vr").then((supported) => {
      console.log({ supported });
      setIsVRSupported(supported);
    });
  }, []);
  return (
    <div className="w-screen h-screen bg-amber-700">
      {/* <CameraFeed /> */}
      <model-viewer
        src="engine1.glb"
        ar
        ar-modes="scene-viewer quick-look webxr" // put webxr last
        camera-controls
        tone-mapping="neutral"
        poster="poster.webp"
        shadow-intensity="1.23"
        exposure="1.45"
        shadow-softness="1"
        style={{ width: "100%", height: "500px" }}
      ></model-viewer>
    </div>
  );

  // return (
  //   <div className="w-screen h-screen m-0 p-0">
  //     <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
  //       {isVRSupported ? (
  //         <button
  //           className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
  //           onClick={() => store.enterVR()}
  //         >
  //           Enter VR
  //         </button>
  //       ) : (
  //         <p className="text-red-500">VR is not supported on this device.</p>
  //       )}
  //       <Canvas
  //         style={{ width: "100%", height: "100%" }}
  //         gl={{ antialias: true }}
  //       >
  //         <XR store={store}>
  //           <VRScene />
  //         </XR>
  //       </Canvas>
  //     </div>
  //   </div>
  // );
}
