/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Fonts from "../../assets/fonts/RushbladeDemo_Italic.json";
const Text3D = (
  scene: THREE.Scene,
  text: string,
  position: [number, number, number]
  // font: any
) => {
  const loader = new FontLoader();
  const font = loader.parse(Fonts as any);
  const geo = new TextGeometry(text, {
    font: font,
    size: 0.15, // Smaller size (0.1 meters ~ 10 cm)
    depth: 0.02, // Thinner depth
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.005, // Subtle bevel
    bevelSize: 0.003,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const mat = new THREE.MeshPhongMaterial({
    color: "#FF0000",
    specular: 0x3333ff, // Blue-tinted highlights
    shininess: 50,
    emissive: 0x000066, // Subtle blue glow
    emissiveIntensity: 0.3,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...position);
  scene.add(mesh);
};

export default Text3D;
