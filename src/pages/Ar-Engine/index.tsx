import { useEffect, useRef } from "react";
import * as THREE from "three";
import createARButton from "./StartButton";
import VideoPlane from "./3dVideo";
import Video1 from "../../assets/videos/eg-video.mp4";
import GLBModel from "./GLBModel";
import Text3D from "./Text3D";

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
  const modelRef = useRef<THREE.Object3D | null>(null);
  const isModelAdded = useRef(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.PositionalAudio(listener); // or THREE.Audio for non-positional

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("/tech-audio.mp3", (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(1);
      sound.setLoop(false);
      sound.setVolume(0.8);
      sound.play();
    });

    if (modelRef.current) {
      modelRef.current.add(sound); // Attach to model in AR
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // AR Button
    const arButton = createARButton(renderer, {
      requiredFeatures: ["hit-test"],
    });
    document.body.appendChild(arButton);

    // Lighting
    addOptimizedLights(scene);

    // Load initial 3D text
    Text3D(scene, "TVS Apache RR 310", [-1, 0.25, -2]);

    // Load 3D model
    GLBModel(scene, "/model.glb", [0.1, -0.3, -2], isModelAdded, modelRef);

    VideoPlane(Video1, scene, renderer, [-0.7, -0.2, -2]);
    // Render Loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Touch Gestures
    let initialTouchDist = 0;
    let initialScale = 1;
    let lastTouch: { clientX: number } | null = null;

    const handleTouchMove = (e: TouchEvent) => {
      const model = modelRef.current;
      if (!model) return;

      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!initialTouchDist) {
          initialTouchDist = dist;
          initialScale = model.scale.x;
          return;
        }

        const scaleFactor = dist / initialTouchDist;
        const newScale = initialScale * scaleFactor;
        model.scale.set(newScale, newScale, newScale);
      }

      if (e.touches.length === 1 && lastTouch) {
        const deltaX = e.touches[0].clientX - lastTouch.clientX;
        model.rotation.y += deltaX * 0.01;
      }

      lastTouch = { clientX: e.touches[0].clientX };
    };

    const handleTouchEnd = () => {
      initialTouchDist = 0;
      lastTouch = null;
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // Resize Handling
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Auto start AR
    arButton.click();

    // Cleanup
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      if (arButton && arButton.parentNode) {
        arButton.parentNode.removeChild(arButton);
      }

      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = null;
        isModelAdded.current = false;
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
