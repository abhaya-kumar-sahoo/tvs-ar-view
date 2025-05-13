import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

export default function VRScene() {
  const model = useGLTF("/engine1.glb");

  return (
    <Suspense fallback={null}>
      {/* Model */}
      <primitive
        object={model.scene}
        position={[0, 1, -3]} // Position model 3 units in front, 1 unit up for VR comfort
        scale={0.5}
      />
      {/* Lights */}
      <ambientLight intensity={5} color="#ffffff" />
      <pointLight
        position={[3, 3, 3]}
        intensity={5}
        distance={5}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[-3, 3, -3]}
        intensity={5}
        distance={5}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[3, -3, 3]}
        intensity={5}
        distance={5}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[-3, -3, -3]}
        intensity={5}
        distance={5}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[0, 3, 0]}
        intensity={1.8}
        distance={5}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[0, -3, 0]}
        intensity={1.8}
        distance={5}
        decay={2}
        color="#ffffff"
      />
      <directionalLight
        position={[0, 5, 5]}
        intensity={5}
        castShadow
        color="#ffffff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </Suspense>
  );
}

// Preload the model
useGLTF.preload("/engine1.glb");
