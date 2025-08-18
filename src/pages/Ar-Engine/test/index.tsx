// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import createARButton from "./StartButton";
// import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// import Fonts from "../../assets/fonts/RushbladeDemo_Italic.json";
// import Video1 from "../../assets/videos/eg-video.mp4";
// import GLBModel from "./GLBModel";
// import { useNavigationStep } from "../../components/Navigation.Context";

// export default function ARFontAudioExample() {
//   const sceneRef = useRef(new THREE.Scene());
//   const modelRef = useRef<THREE.Object3D | null>(null);
//   const { setCurrentStep } = useNavigationStep();

//   const cameraRef = useRef(
//     new THREE.PerspectiveCamera(
//       70,
//       window.innerWidth / window.innerHeight,
//       0.01,
//       20
//     )
//   );
//   const rendererRef = useRef(
//     new THREE.WebGLRenderer({ antialias: true, alpha: true })
//   );

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ✅ Promise wrapper for font loading
//   const loadFont = (): Promise<Font> => {
//     return new Promise((resolve, reject) => {
//       try {
//         const loader = new FontLoader();
//         const font = loader.parse(Fonts); // parse JSON font
//         if (font) {
//           resolve(font);
//         } else {
//           reject(new Error("Failed to parse font"));
//         }
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   // ✅ Promise wrapper for audio loading
//   const loadAudio = (
//     listener: THREE.AudioListener
//   ): Promise<THREE.PositionalAudio> => {
//     return new Promise((resolve, reject) => {
//       try {
//         const sound = new THREE.PositionalAudio(listener);
//         const audioLoader = new THREE.AudioLoader();
//         audioLoader.load(
//           "/tech-audio.mp3",
//           (buffer) => {
//             sound.setBuffer(buffer);
//             sound.setRefDistance(1);
//             sound.setLoop(false);
//             sound.setVolume(0.8);
//             resolve(sound);
//           },
//           undefined,
//           (err) => reject(err)
//         );
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   // ✅ Promise wrapper for audio loading
//   const loadVideo = (): Promise<unknown> => {
//     return new Promise((res, rej) => {
//       const video = document.createElement("video");
//       video.src = Video1;
//       video.crossOrigin = "anonymous";
//       video.loop = true;
//       video.muted = true;
//       video
//         .play()
//         .then(() => {
//           const texture = new THREE.VideoTexture(video);
//           res(texture);
//         })
//         .catch(rej);
//     });
//   };

//   useEffect(() => {
//     const scene = sceneRef.current;
//     const camera = cameraRef.current;
//     const renderer = rendererRef.current;

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.xr.enabled = true;
//     document.body.appendChild(renderer.domElement);

//     // Add AR Button
//     const arButton = createARButton(renderer, {
//       requiredFeatures: ["hit-test"],
//     });
//     document.body.appendChild(arButton);

//     // Lights
//     const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
//     scene.add(hemiLight);

//     // Audio listener
//     const listener = new THREE.AudioListener();
//     camera.add(listener);

//     // ✅ Load font + audio in parallel
//     Promise.all([
//       loadFont(),
//       loadAudio(listener),
//       loadVideo(),
//       GLBModel(scene, "/model.glb", [0.1, -0.3, -2]),
//     ])
//       .then(([font, sound, videoTexture, glbModel]) => {
//         // --- Add 3D text ---
//         const textGeometry = new TextGeometry("TVS Apache RR 310", {
//           font: font,
//           size: 0.15,
//           depth: 0.02,
//           curveSegments: 12,
//           bevelEnabled: true,
//           bevelThickness: 0.005,
//           bevelSize: 0.003,
//           bevelOffset: 0,
//           bevelSegments: 5,
//         });
//         const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
//         const textMesh = new THREE.Mesh(textGeometry, material);
//         textMesh.position.set(-1, 0.25, -2);
//         scene.add(textMesh);

//         // --- Attach audio to text mesh ---
//         textMesh.add(sound);
//         sound.play();
//         // --- Attach video  ---

//         const videoMaterial = new THREE.MeshBasicMaterial({
//           map: videoTexture,
//         });

//         const aspect = 1.6;
//         const height = 0.5;
//         const width = height * aspect;
//         const videoPlane = new THREE.Mesh(
//           new THREE.PlaneGeometry(width, height),
//           videoMaterial
//         );

//         videoPlane.position.set(-0.7, -0.2, -2);
//         scene.add(videoPlane);

//         // --- Add GLB Model ---
//         // ✅ GLB model is already added inside GLBModel, but you can still access it here
//         console.log("Model loaded:", glbModel);
//         scene.add(glbModel);
//         modelRef.current = glbModel;

//         setLoading(false); // hide preloader
//       })
//       .catch((err) => {
//         console.error("Asset loading failed:", err);
//         setError("Failed to load AR assets");
//         setLoading(false);
//       });

//     // Render loop
//     renderer.setAnimationLoop(() => {
//       renderer.render(scene, camera);
//     });

//     // Auto Start AR
//     arButton.click();

//     // Touch Gestures
//     let initialTouchDist = 0;
//     let initialScale = 1;
//     let lastTouch: { clientX: number } | null = null;

//     const handleTouchMove = (e: TouchEvent) => {
//       const model = modelRef.current;
//       if (!model) return;

//       if (e.touches.length === 2) {
//         const dx = e.touches[0].clientX - e.touches[1].clientX;
//         const dy = e.touches[0].clientY - e.touches[1].clientY;
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         if (!initialTouchDist) {
//           initialTouchDist = dist;
//           initialScale = model.scale.x;
//           return;
//         }

//         const scaleFactor = dist / initialTouchDist;
//         const newScale = initialScale * scaleFactor;
//         model.scale.set(newScale, newScale, newScale);
//       }

//       if (e.touches.length === 1 && lastTouch) {
//         const deltaX = e.touches[0].clientX - lastTouch.clientX;
//         model.rotation.y += deltaX * 0.01;
//       }

//       lastTouch = { clientX: e.touches[0].clientX };
//     };

//     const handleTouchEnd = () => {
//       initialTouchDist = 0;
//       lastTouch = null;
//     };

//     window.addEventListener("touchmove", handleTouchMove, {
//       passive: true,
//     });
//     window.addEventListener("touchend", handleTouchEnd);

//     // Resize Handling
//     const onResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener("resize", onResize);

//     // Cleanup
//     return () => {
//       renderer.setAnimationLoop(null);
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("touchmove", handleTouchMove);
//       window.removeEventListener("touchend", handleTouchEnd);
//       setCurrentStep(1);
//       if (renderer.domElement.parentNode) {
//         renderer.domElement.parentNode.removeChild(renderer.domElement);
//       }

//       if (arButton && arButton.parentNode) {
//         arButton.parentNode.removeChild(arButton);
//       }

//       if (modelRef.current) {
//         scene.remove(modelRef.current);
//         modelRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <>
//       {loading && !error && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.85)",
//             color: "white",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: "20px",
//             zIndex: 9999,
//           }}
//         >
//           Loading AR Experiance...
//         </div>
//       )}
//       {error && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(255,0,0,0.85)",
//             color: "white",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: "20px",
//             zIndex: 9999,
//           }}
//         >
//           {error}
//         </div>
//       )}
//     </>
//   );
// }

// stage - stage

// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import createARButton from "./StartButton";
// import VideoPlane from "./3dVideo";
// import Video1 from "../../assets/videos/eg-video.mp4";
// import { useNavigationStep } from "../../components/Navigation.Context";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// import Fonts from "../../assets/fonts/RushbladeDemo_Italic.json";

// //   // ✅ Promise wrapper for GLB loading
// //   const loadGLB = (): Promise<THREE.Group> => {
// //     return new Promise((resolve, reject) => {
// //       const loader = new GLTFLoader();
// //       loader.load(
// //         "/model.glb",
// //         (gltf) => {
// //           resolve(gltf.scene); // return the scene of the model
// //         },
// //         undefined,
// //         (err) => reject(err)
// //       );
// //     });
// //   };

// // new Promise((res, rej) => {
// //     const video = document.createElement("video");
// //     video.src = Video1;
// //     video.crossOrigin = "anonymous";
// //     video.loop = true;
// //     video.muted = true;
// //     video
// //       .play()
// //       .then(() => {
// //         const texture = new THREE.VideoTexture(video);
// //         res(texture);
// //       })
// //       .catch(rej);
// //   })

// // ✅ Video on Plane
// //    const videoMaterial = new THREE.MeshBasicMaterial({
// //     map: videoTexture,
// //   });
// //   const videoPlane = new THREE.Mesh(
// //     new THREE.PlaneGeometry(2, 1.2),
// //     videoMaterial
// //   );
// //   videoPlane.position.set(0, -1, 0);
// //   scene.add(videoPlane);

// export default function App() {
//   const sceneRef = useRef(new THREE.Scene());
//   const { setCurrentStep } = useNavigationStep();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const cameraRef = useRef(
//     new THREE.PerspectiveCamera(
//       70,
//       window.innerWidth / window.innerHeight,
//       0.01,
//       20
//     )
//   );
//   const rendererRef = useRef(
//     new THREE.WebGLRenderer({ antialias: true, alpha: true })
//   );
//   const modelRef = useRef<THREE.Object3D | null>(null);
//   const isModelAdded = useRef(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   useEffect(() => {
//     const scene = sceneRef.current;
//     const camera = cameraRef.current;
//     const renderer = rendererRef.current;

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.xr.enabled = true;
//     document.body.appendChild(renderer.domElement);

//     // AR Button
//     const arButton = createARButton(renderer, {
//       requiredFeatures: ["hit-test"],
//     });
//     document.body.appendChild(arButton);

//     // Lighting
//     addOptimizedLights(scene);

//     // Load initial 3D text
//     // Text3D(scene, "TVS Apache RR 310", [-1, 0.25, -2]); // Removed as now handled in loadAssets

//     // Load 3D model
//     // GLBModel(scene, "/model.glb", [0.1, -0.3, -2], isModelAdded, modelRef); // Removed as now handled in loadAssets

//     // VideoPlane(Video1, scene, renderer, [-0.7, -0.2, -2]); // Removed as now handled in loadAssets
//     // Render Loop
//     renderer.setAnimationLoop(() => {
//       renderer.render(scene, camera);
//     });

//     // Touch Gestures
//     let initialTouchDist = 0;
//     let initialScale = 1;
//     let lastTouch: { clientX: number } | null = null;

//     const handleTouchMove = (e: TouchEvent) => {
//       const model = modelRef.current;
//       if (!model) return;

//       if (e.touches.length === 2) {
//         const dx = e.touches[0].clientX - e.touches[1].clientX;
//         const dy = e.touches[0].clientY - e.touches[1].clientY;
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         if (!initialTouchDist) {
//           initialTouchDist = dist;
//           initialScale = model.scale.x;
//           return;
//         }

//         const scaleFactor = dist / initialTouchDist;
//         const newScale = initialScale * scaleFactor;
//         model.scale.set(newScale, newScale, newScale);
//       }

//       if (e.touches.length === 1 && lastTouch) {
//         const deltaX = e.touches[0].clientX - lastTouch.clientX;
//         model.rotation.y += deltaX * 0.01;
//       }

//       lastTouch = { clientX: e.touches[0].clientX };
//     };

//     const handleTouchEnd = () => {
//       initialTouchDist = 0;
//       lastTouch = null;
//     };

//     window.addEventListener("touchmove", handleTouchMove, { passive: true });
//     window.addEventListener("touchend", handleTouchEnd);

//     // Resize Handling
//     const onResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener("resize", onResize);

//     // Auto start AR
//     arButton.click();

//     // Cleanup
//     return () => {
//       renderer.setAnimationLoop(null);
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("touchmove", handleTouchMove);
//       window.removeEventListener("touchend", handleTouchEnd);
//       setCurrentStep(1);
//       if (renderer.domElement.parentNode) {
//         renderer.domElement.parentNode.removeChild(renderer.domElement);
//       }

//       if (arButton && arButton.parentNode) {
//         arButton.parentNode.removeChild(arButton);
//       }

//       if (modelRef.current) {
//         scene.remove(modelRef.current);
//         modelRef.current = null;
//         isModelAdded.current = false;
//       }
//     };
//   }, [setCurrentStep]);

//   useEffect(() => {
//     const scene = sceneRef.current;
//     const camera = cameraRef.current;
//     const renderer = rendererRef.current;

//     const loadAssets = async () => {
//       try {
//         const gltfLoader = new GLTFLoader();
//         const fontLoader = new FontLoader();
//         const audioLoader = new THREE.AudioLoader();

//         const listener = new THREE.AudioListener();
//         camera.add(listener);
//         const sound = new THREE.PositionalAudio(listener);

//         // Load GLB model
//         const gltfPromise = new Promise<THREE.Object3D>((resolve, reject) => {
//           gltfLoader.load(
//             "/model.glb",
//             (gltf) => {
//               const model = gltf.scene;
//               model.position.set(0.1, -0.3, -2);
//               const scale = 0.06;
//               model.scale.set(scale, scale, scale);
//               model.rotation.y = Math.PI / 4;
//               model.traverse((child: THREE.Object3D) => {
//                 if (child instanceof THREE.Mesh) {
//                   const mesh = child as THREE.Mesh;
//                   if (
//                     mesh.material instanceof THREE.MeshStandardMaterial ||
//                     mesh.material instanceof THREE.MeshPhongMaterial
//                   ) {
//                     const material =
//                       mesh.material as THREE.MeshStandardMaterial; // Assuming standard material for envMap, adjust if phong material is intended for envMap
//                     material.side = THREE.DoubleSide;
//                     if (material.metalness > 0.5 && !material.envMap) {
//                       material.metalness = 0.2;
//                       material.roughness = 0.6;
//                     }
//                     const baseColor = material.color;
//                     if (
//                       baseColor.r < 0.1 &&
//                       baseColor.g < 0.1 &&
//                       baseColor.b < 0.1
//                     ) {
//                       baseColor.setRGB(0.6, 0.6, 0.6);
//                     }
//                     material.needsUpdate = true;
//                     // These lines are critical for reflections
//                     material.envMap = new THREE.CubeTextureLoader()
//                       .setPath("/env/")
//                       .load([
//                         "px.jpg",
//                         "nx.jpg",
//                         "py.jpg",
//                         "ny.jpg",
//                         "pz.jpg",
//                         "nz.jpg",
//                       ]);
//                     material.envMapIntensity = 1;
//                     if (mesh.name === "exhausttt") {
//                       material.metalness = 0.5;
//                       material.roughness = 0.1;
//                       material.color.set("#C0C0C0");
//                     }
//                   }
//                 }
//               });
//               resolve(model);
//             },
//             undefined,
//             (error) => {
//               console.error("GLB Model load failed:", error);
//               reject("Failed to load 3D model.");
//             }
//           );
//         });

//         // Load Font for 3D Text
//         const fontPromise = new Promise<Font>((resolve) => {
//           resolve(fontLoader.parse(Fonts));
//         });

//         // Load Audio
//         const audioPromise = new Promise<AudioBuffer>((resolve, reject) => {
//           audioLoader.load(
//             "/tech-audio.mp3",
//             (buffer) => resolve(buffer),
//             undefined,
//             (error) => {
//               console.error("Audio load failed:", error);
//               reject("Failed to load audio.");
//             }
//           );
//         });

//         const [model, font, audioBuffer] = await Promise.all([
//           gltfPromise,
//           fontPromise,
//           audioPromise,
//         ]);

//         // Setup environment map
//         scene.environment = new THREE.CubeTextureLoader()
//           .setPath("/env/")
//           .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

//         // Add loaded model to scene
//         scene.add(model);
//         modelRef.current = model;
//         isModelAdded.current = true;

//         // Add 3D text to scene
//         const textGeometry = new TextGeometry("TVS Apache RR 310", {
//           font: font,
//           size: 0.15,
//           depth: 0.02,
//           curveSegments: 12,
//           bevelEnabled: true,
//           bevelThickness: 0.005,
//           bevelSize: 0.003,
//           bevelOffset: 0,
//           bevelSegments: 5,
//         });
//         const textMaterial = new THREE.MeshPhongMaterial({
//           color: "#FF0000",
//           specular: 0x3333ff,
//           shininess: 50,
//           emissive: 0x000066,
//           emissiveIntensity: 0.3,
//         });
//         const textMesh = new THREE.Mesh(textGeometry, textMaterial);
//         textMesh.position.set(-1, 0.25, -2);
//         scene.add(textMesh);

//         // Setup audio
//         sound.setBuffer(audioBuffer);
//         sound.setRefDistance(1);
//         sound.setLoop(false);
//         sound.setVolume(0.8);
//         model.add(sound); // Attach to model in AR
//         sound.play();

//         // Setup Video Plane (assuming VideoPlane handles its own loading of videoElement)
//         const videoElement = await VideoPlane(
//           Video1,
//           scene,
//           renderer,
//           [-0.7, -0.2, -2]
//         );
//         videoRef.current = videoElement;

//         setIsLoading(false);
//       } catch (err: unknown) {
//         setError(String(err));
//         setIsLoading(false);
//         console.error("Error loading AR assets:", err);
//       }
//     };

//     loadAssets();

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.xr.enabled = true;
//     document.body.appendChild(renderer.domElement);

//     const arButton = createARButton(renderer, {
//       requiredFeatures: ["hit-test"],
//     });
//     document.body.appendChild(arButton);

//     addOptimizedLights(scene);

//     renderer.setAnimationLoop(() => {
//       renderer.render(scene, camera);
//     });

//     // Touch Gestures
//     let initialTouchDist = 0;
//     let initialScale = 1;
//     let lastTouch: { clientX: number } | null = null;

//     const handleTouchMove = (e: TouchEvent) => {
//       const model = modelRef.current;
//       if (!model) return;

//       if (e.touches.length === 2) {
//         const dx = e.touches[0].clientX - e.touches[1].clientX;
//         const dy = e.touches[0].clientY - e.touches[1].clientY;
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         if (!initialTouchDist) {
//           initialTouchDist = dist;
//           initialScale = model.scale.x;
//           return;
//         }

//         const scaleFactor = dist / initialTouchDist;
//         const newScale = initialScale * scaleFactor;
//         model.scale.set(newScale, newScale, newScale);
//       }

//       if (e.touches.length === 1 && lastTouch) {
//         const deltaX = e.touches[0].clientX - lastTouch.clientX;
//         model.rotation.y += deltaX * 0.01;
//       }

//       lastTouch = { clientX: e.touches[0].clientX };
//     };

//     const handleTouchEnd = () => {
//       initialTouchDist = 0;
//       lastTouch = null;
//     };

//     window.addEventListener("touchmove", handleTouchMove, { passive: true });
//     window.addEventListener("touchend", handleTouchEnd);

//     // Resize Handling
//     const onResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener("resize", onResize);

//     // Auto start AR
//     setTimeout(() => {
//       arButton.click();
//       if (videoRef.current) {
//         videoRef.current.play();
//       }
//     }, 1000); // Add a 1-second delay

//     // Cleanup
//     return () => {
//       renderer.setAnimationLoop(null);
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("touchmove", handleTouchMove);
//       window.removeEventListener("touchend", handleTouchEnd);
//       setCurrentStep(1);
//       if (renderer.domElement.parentNode) {
//         renderer.domElement.parentNode.removeChild(renderer.domElement);
//       }

//       if (arButton && arButton.parentNode) {
//         arButton.parentNode.removeChild(arButton);
//       }

//       if (modelRef.current) {
//         scene.remove(modelRef.current);
//         modelRef.current = null;
//         isModelAdded.current = false;
//       }
//     };
//   }, [setCurrentStep]);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
//         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-lg">Loading AR Experience...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-red-900 text-white">
//         <p className="text-lg">Error: {String(error)}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-blue-500 rounded"
//         >
//           Reload
//         </button>
//       </div>
//     );
//   }

//   return null;
// }

// function addOptimizedLights(scene: THREE.Scene) {
//   const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
//   hemiLight.position.set(0.5, 1, 0.25);
//   scene.add(hemiLight);

//   const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
//   dirLight.position.set(3, 10, 5);
//   dirLight.castShadow = true;
//   scene.add(dirLight);

//   const pointLight = new THREE.PointLight(0xffffff, 1);
//   pointLight.position.set(0, 2, -2);
//   scene.add(pointLight);

//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//   scene.add(ambientLight);
// }
