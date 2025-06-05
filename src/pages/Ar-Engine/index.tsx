import { useEffect, useRef } from "react";
import * as THREE from "three";
import Video1 from "../../assets/videos/eg-video.mp4";
// import Video2 from "../../assets/videos/eg2.mp4";
import Text3D from "./Text3D";
import VideoPlane from "./3dVideo";
import GLBModel from "./GLBModel";
import createARButton from "./StartButton";

export default function App() {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    )
  );
  const rendererRef = useRef(
    new THREE.WebGLRenderer({ antialias: true, alpha: true })
  );

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    // Set size correctly
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);

    // Handle iOS Chrome issue
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIOS && !isSafari) {
      alert("Please open this site in Safari for AR support on iOS.");
    }

    if (!navigator.xr) {
      alert("WebXR not supported on this device/browser.");
    }

    // Add AR button
    const arButton = createARButton(renderer, {
      requiredFeatures: ["hit-test"],
    });
    document.body.appendChild(arButton);

    // Lights
    addOptimizedLights(scene);

    // Load initial 3D text
    Text3D(scene, "TVS Apache RR 310", [-1, 0.25, -2]);

    // Load 3D model
    GLBModel(scene, "/model.glb", [0.1, -0.3, -2]);

    VideoPlane(Video1, scene, renderer, [-0.7, -0.2, -2]);
    // VideoPlane(Video2, scene, renderer, [1.2, 0.6, -2]);
    // Start render loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
    arButton.click();
    // Handle resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);

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

function addOptimizedLights(scene: THREE.Scene) {
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
