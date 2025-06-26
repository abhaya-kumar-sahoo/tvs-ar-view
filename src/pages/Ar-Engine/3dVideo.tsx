import * as THREE from "three";

// Helper to add a video plane
const VideoPlane = async (
  src: string,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  position: [number, number, number]
) => {
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

  function videoTextureSetup(videoElement: HTMLVideoElement) {
    const texture = new THREE.VideoTexture(videoElement);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    const aspect = 1.6;
    const height = 0.5;
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
