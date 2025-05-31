import { useEffect, useRef } from "react";
import * as THREE from "three";
import Video1 from "../../assets/videos/eg1.mp4";
import Video2 from "../../assets/videos/eg2.mp4";
import Text3D from "./Text3D";
import VideoPlane from "./3dVideo";
import GLBModel from "./GLBModel";
import createARButton from "./StartButton";

export default function App() {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera());
  const rendererRef = useRef(
    new THREE.WebGLRenderer({ antialias: true, alpha: true })
  );

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    renderer.setSize(0, 0);
    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);
    // Setup AR button
    const arButton = createARButton(renderer, {
      requiredFeatures: ["hit-test"],
    });
    document.body.appendChild(arButton);
    // Add lights
    addLights(scene);

    // Load scene content
    Text3D(scene, "TVS Apache RR 310");
    VideoPlane(Video1, scene, renderer, [-1.2, 0.6, -2]);
    VideoPlane(Video2, scene, renderer, [1.2, 0.6, -2]);
    GLBModel(scene, "/model.glb", [-1, -0.5, -2]);

    // Start rendering
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Click the AR button after small delay (once it's in the DOM)
    // arButton.click(); // Start AR session

    // Cleanup
    return () => {
      // clearTimeout(startTimeout);
      renderer.setAnimationLoop(null);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (arButton && arButton.parentNode) {
        arButton.parentNode.removeChild(arButton);
      }
    };
  }, []);

  return null;
}

function addLights(scene: THREE.Scene) {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  hemiLight.position.set(0.5, 1, 0.25);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(3, 10, 5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 2, -2);
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
}
