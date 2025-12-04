import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import createARButton from "./StartButton";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Fonts from "../../assets/fonts/RushbladeDemo_Italic.json";
import Video1 from "../../assets/videos/eg-video.mp4";
import GLBModel from "./GLBModel";
import { useNavigationStep } from "../../components/Navigation.Context";

export default function ARFontAudioExample() {
  const sceneRef = useRef(new THREE.Scene());
  const { setCurrentStep } = useNavigationStep();

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

  // --- Asset Refs ---
  const textRef = useRef<THREE.Mesh | null>(null);
  const videoRef = useRef<THREE.Mesh | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const watermarksRef = useRef<THREE.Group | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Promise wrapper for font loading
  const loadFont = (): Promise<Font> => {
    return new Promise((resolve, reject) => {
      try {
        const loader = new FontLoader();
        const font = loader.parse(Fonts); // parse JSON font
        if (font) {
          resolve(font);
        } else {
          reject(new Error("Failed to parse font"));
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  // ✅ Promise wrapper for audio loading
  const loadAudio = (
    listener: THREE.AudioListener
  ): Promise<THREE.PositionalAudio> => {
    return new Promise((resolve, reject) => {
      try {
        const sound = new THREE.PositionalAudio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(
          // "/tech-audio.mp3",
          "engine-sound.mp3",
          (buffer) => {
            sound.setBuffer(buffer);
            sound.setRefDistance(1);
            sound.setLoop(true);
            sound.setVolume(1);
            resolve(sound);
          },
          undefined,
          (err) => reject(err)
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  // ✅ Promise wrapper for video loading
  const loadVideo = (): Promise<THREE.VideoTexture> => {
    return new Promise((res, rej) => {
      const video = document.createElement("video");
      video.src = Video1;
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video
        .play()
        .then(() => {
          const texture = new THREE.VideoTexture(video);
          res(texture);
        })
        .catch(rej);
    });
  };

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add AR Button
    const arButton = createARButton(renderer, {
      requiredFeatures: ["hit-test"],
    });
    document.body.appendChild(arButton);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5); // default 1 → now 1.5
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2); // default 1 → now 2
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Audio listener
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // ✅ Load font + audio + video + glb
    Promise.all([
      loadFont(),
      loadAudio(listener),
      loadVideo(),
      GLBModel(scene, "/model.glb", [0.25, -0.3, -1.5]),
    ])
      .then(([font, sound, videoTexture, glbModel]) => {
        // --- Add 3D text (once) ---
        if (!textRef.current) {
          const textGeometry = new TextGeometry("TVS Apache RR 310", {
            font: font,
            size: 0.15,
            depth: 0.02,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.005,
            bevelSize: 0.003,
            bevelOffset: 0,
            bevelSegments: 5,
          });
          const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
          const textMesh = new THREE.Mesh(textGeometry, material);
          textMesh.position.set(-1, 0.35, -2);
          textMesh.add(sound);
          scene.add(textMesh);
          sound.play();

          textRef.current = textMesh;
        }

        // --- Video Plane (once) ---
        if (!videoRef.current) {
          const videoMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
          });
          const aspect = 1.6;
          const height = 0.8;
          const width = height * aspect;
          const videoPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            videoMaterial
          );
          videoPlane.position.set(-1, -0.2, -2);
          scene.add(videoPlane);

          videoRef.current = videoPlane;
        }

        // --- GLB Model (once) ---
        if (!modelRef.current) {
          // scene.add(glbModel);
          // modelRef.current = glbModel;

          const box = new THREE.Box3().setFromObject(glbModel);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // pick 70% up along Y axis (0 = bottom, 1 = top)
          const pivotY = box.min.y + size.y * 0.9;

          // rotation anchor
          const pivotPoint = new THREE.Vector3(center.x, pivotY, center.z);

          // shift model so that point is at pivot (0,0,0)
          glbModel.position.sub(pivotPoint);

          const pivot = new THREE.Group();
          pivot.add(glbModel);
          pivot.position.set(0.25, -0.1, -1.5); // world placement
          scene.add(pivot);

          modelRef.current = pivot;
        }

        // --- Multiple Image Watermarks All Around (once) ---
        if (!watermarksRef.current) {
          const watermarkGroup = new THREE.Group();

          // Load TVS logo texture
          const textureLoader = new THREE.TextureLoader();
          const logoTexture = textureLoader.load("/tvs-logo.png");

          // Create plane geometry for image watermark
          const watermarkGeometry = new THREE.PlaneGeometry(0.3, 0.15);

          // Semi-transparent material with logo texture
          const watermarkMaterial = new THREE.MeshBasicMaterial({
            map: logoTexture,
            transparent: true,
            opacity: 0.6,
            alphaTest: 0.1, // Remove background if logo has transparency
          });

          // Define positions around the user (circular pattern)
          const watermarkPositions = [
            // Front center vertical line (behind main elements)
            {
              pos: [0, 1.2, -2.5] as [number, number, number],
              rot: [0, 0, 0] as [number, number, number],
            }, // Top center

            {
              pos: [0, 0, -2.5] as [number, number, number],
              rot: [0, 0, 0] as [number, number, number],
            }, // Middle center

            {
              pos: [0, -1.2, -2.5] as [number, number, number],
              rot: [0, 0, 0] as [number, number, number],
            }, // Bottom center

            // Front corner positions
            {
              pos: [1.2, -0.7, -1.5] as [number, number, number],
              rot: [0, 0, 0] as [number, number, number],
            }, // Bottom right
            {
              pos: [-1.2, -0.7, -1.5] as [number, number, number],
              rot: [0, 0, 0] as [number, number, number],
            }, // Bottom left
            {
              pos: [1.2, 0.8, -1.5] as [number, number, number],
              rot: [0, 0, 0] as [number, number, number],
            }, // Top right
            {
              pos: [-1.2, 0.8, -1.5] as [number, number, number],
              rot: [0, 0, 0] as [number, number, number],
            }, // Top left

            // Side positions (left and right)
            {
              pos: [-2, 0, -0.5] as [number, number, number],
              rot: [0, Math.PI / 2, 0] as [number, number, number],
            }, // Left side
            {
              pos: [2, 0, -0.5] as [number, number, number],
              rot: [0, -Math.PI / 2, 0] as [number, number, number],
            }, // Right side

            // Back positions
            {
              pos: [0.8, -0.5, 1] as [number, number, number],
              rot: [0, Math.PI, 0] as [number, number, number],
            }, // Back right
            {
              pos: [-0.8, -0.5, 1] as [number, number, number],
              rot: [0, Math.PI, 0] as [number, number, number],
            }, // Back left

            // Additional corner positions
            {
              pos: [1.5, 0, 0.8] as [number, number, number],
              rot: [0, -Math.PI * 0.75, 0] as [number, number, number],
            }, // Back-right corner
            {
              pos: [-1.5, 0, 0.8] as [number, number, number],
              rot: [0, Math.PI * 0.75, 0] as [number, number, number],
            }, // Back-left corner
          ];

          // Create watermark meshes at each position
          watermarkPositions.forEach((config) => {
            const watermarkMesh = new THREE.Mesh(
              watermarkGeometry.clone(),
              watermarkMaterial.clone()
            );

            watermarkMesh.position.set(...config.pos);
            watermarkMesh.rotation.set(...config.rot);

            // Add slight random variation to avoid perfect uniformity
            watermarkMesh.rotation.x += (Math.random() - 0.5) * 0.1;
            watermarkMesh.rotation.z += (Math.random() - 0.5) * 0.05;

            watermarkGroup.add(watermarkMesh);
          });

          scene.add(watermarkGroup);
          watermarksRef.current = watermarkGroup;
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Asset loading failed:", err);
        setError("Failed to load AR assets");
        setLoading(false);
      });

    // Render loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Auto Start AR
    arButton.click();

    // Touch Gestures
    let initialTouchDist = 0;
    let initialScale = 1;
    let lastTouch: { clientX: number } | null = null;

    const handleTouchMove = (e: TouchEvent) => {
      const pivot = modelRef.current; // now pivot group
      if (!pivot) return;

      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!initialTouchDist) {
          initialTouchDist = dist;
          initialScale = pivot.scale.x;
          return;
        }

        const scaleFactor = dist / initialTouchDist;
        const newScale = initialScale * scaleFactor;
        pivot.scale.set(newScale, newScale, newScale);
      }

      if (e.touches.length === 1 && lastTouch) {
        const deltaX = e.touches[0].clientX - lastTouch.clientX;
        pivot.rotation.y += deltaX * 0.01;
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

    // Cleanup
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      setCurrentStep(1);

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (arButton && arButton.parentNode) {
        arButton.parentNode.removeChild(arButton);
      }

      // Dispose text
      if (textRef.current) {
        scene.remove(textRef.current);
        textRef.current.geometry.dispose();
        (textRef.current.material as THREE.Material).dispose();
        textRef.current = null;
      }

      // Dispose video
      if (videoRef.current) {
        scene.remove(videoRef.current);
        videoRef.current.geometry.dispose();
        (videoRef.current.material as THREE.Material).dispose();
        videoRef.current = null;
      }

      // Dispose model
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = null;
      }

      // Dispose watermarks
      if (watermarksRef.current) {
        watermarksRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
        scene.remove(watermarksRef.current);
        watermarksRef.current = null;
      }
    };
  }, [setCurrentStep]);

  return (
    <>
      {/* Loading Overlay */}
      {loading && !error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-black to-red-900">
          <div className="flex flex-col items-center space-y-6">
            {/* Gradient Spinner */}
            <div className="relative">
              <div className="h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-500 border-r-red-500"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-red-500 blur-md opacity-40"></div>
            </div>

            {/* Text */}
            <p className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent animate-pulse">
              Loading AR Experience...
            </p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600/90">
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="h-12 w-12 text-white animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.668 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.332.192 3 1.732 3z"
              />
            </svg>
            <p className="text-lg font-semibold text-white">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 rounded-lg bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/30 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </>
  );
}
