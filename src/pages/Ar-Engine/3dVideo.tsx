import * as THREE from "three";

// interface VideoPlaneProps {
//   scene: THREE.Scene;
//   renderer: THREE.WebGLRenderer;
//   src: string;
//   position: [number, number, number];
// }

// const VideoPlane = ({
//   scene,
//   renderer,
//   src,
//   position,
// }: VideoPlaneProps): void => {
//   const video = document.createElement("video");
//   video.src = src;
//   video.crossOrigin = "anonymous";
//   video.loop = true;
//   video.muted = true;
//   video.playsInline = true;
//   video.setAttribute("autoplay", "");

//   renderer.xr.addEventListener("sessionstart", () => {
//     video.play().catch((err) => console.error("Video playback failed:", err));
//   });

//   const texture = new THREE.VideoTexture(video);
//   texture.minFilter = THREE.LinearFilter;
//   texture.magFilter = THREE.LinearFilter;
//   texture.format = THREE.RGBFormat;

//   const aspect = 1.77;
//   const height = 0.4;
//   const width = height * aspect;

//   const geometry = new THREE.PlaneGeometry(width, height);
//   const material = new THREE.MeshBasicMaterial({
//     map: texture,
//     side: THREE.DoubleSide,
//   });

//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.set(...position);
//   scene.add(mesh);
// };

// Helper to add a video plane
const VideoPlane = async (src, scene, renderer, position) => {
  const video = document.createElement("video");
  video.src = src;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("autoplay", "");
  videoTextureSetup(video);

  renderer.xr.addEventListener("sessionstart", () => {
    video.play();
  });

  function videoTextureSetup(videoElement) {
    const texture = new THREE.VideoTexture(videoElement);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    const aspect = 1.77;
    const height = 0.4;
    const width = height * aspect;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    scene.add(mesh);
  }
};

export default VideoPlane;
