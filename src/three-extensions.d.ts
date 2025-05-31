/* eslint-disable @typescript-eslint/no-explicit-any */
// src/three-extensions.d.ts
declare module "three/examples/jsm/geometries/TextGeometry" {
  import { ExtrudeGeometryOptions } from "three";
  import { BufferGeometry } from "three";
  import { Font } from "three/examples/jsm/loaders/FontLoader";

  export class TextGeometry extends BufferGeometry {
    constructor(text: string, parameters: TextGeometryParameters);
  }

  export interface TextGeometryParameters extends ExtrudeGeometryOptions {
    font: Font;
    size?: number;
    height?: number;
    curveSegments?: number;
    bevelEnabled?: boolean;
    bevelThickness?: number;
    bevelSize?: number;
    bevelOffset?: number;
    bevelSegments?: number;
  }
}

// src/three-extensions.d.ts
declare module "three/examples/jsm/loaders/FontLoader" {
  import { Loader, LoadingManager } from "three";
  import { Font } from "three";

  export class FontLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (font: Font) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(json: object): Font;
  }

  export { Font };
}

declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { Loader, LoadingManager, Group } from "three";

  export interface GLTF {
    scene: Group;
    scenes: Group[];
    animations: any[];
    asset: any;
  }

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent | Error) => void
    ): void;
  }
}
