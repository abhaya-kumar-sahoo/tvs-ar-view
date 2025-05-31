/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const GLBModel = (
  scene: THREE.Scene,
  modelPath: string,
  position: [number, number, number]
): void => {
  const envMap = new THREE.CubeTextureLoader()
    .setPath("/env/") // Folder must have 6 images: px, nx, py, ny, pz, nz
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
  const scale = 0.1;
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    (gltf: GLTF) => {
      const model = gltf.scene;
      model.position.set(...position);
      model.scale.set(scale, scale, scale);
      model.rotation.y = Math.PI / 4; // Rotate 45° around the Y axis

      scene.environment = envMap;

      model.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // Enable rendering on both sides
          child.material.side = THREE.DoubleSide;

          // If metallic but has no environment map, downgrade it
          if (child.material.metalness > 0.5 && !child.material.envMap) {
            child.material.metalness = 0.2;
            child.material.roughness = 0.6;
          }

          // Optional: Add neutral gray base if color is very dark
          const baseColor = child.material.color;
          if (baseColor.r < 0.1 && baseColor.g < 0.1 && baseColor.b < 0.1) {
            child.material.color.setRGB(0.6, 0.6, 0.6); // override black with gray
          }

          child.material.needsUpdate = true;
          // Apply manually if needed
          child.material.envMap = envMap;
          child.material.envMapIntensity = 1;
          if (child.name === "exhausttt") {
            child.material.metalness = 0.5;
            child.material.roughness = 0.1;
            child.material.color.set("#C0C0C0"); // Light silver-gray
          }
        }
      });

      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("GLB Model load failed:", error);
    }
  );
};

export default GLBModel;
