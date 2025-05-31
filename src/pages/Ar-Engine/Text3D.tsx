import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const Text3D = (scene: THREE.Scene, text: string) => {
  const loader = new FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const geo = new TextGeometry(text, {
        font: font,
        size: 0.3, // Smaller size (0.1 meters ~ 10 cm)
        depth: 0.02, // Thinner depth
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.005, // Subtle bevel
        bevelSize: 0.003,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      const mat = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(-2, 1.5, -3);
      scene.add(mesh);
    }
  );
};

export default Text3D;
