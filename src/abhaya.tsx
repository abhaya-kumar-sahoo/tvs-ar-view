import { Canvas } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
import Video1 from "./assets/videos/eg1.mp4";
import Video2 from "./assets/videos/eg2.mp4";
import useOrientation from "./hooks/oriantation";

interface VideoProps {
  src: string;
  position: string;
  size: string;
}

const Video = ({ src, position, size }: VideoProps) => (
  <video
    src={src}
    className={`absolute ${position} ${size} object-center`}
    autoPlay
    loop
    muted
    playsInline
  />
);

export default function AppAr() {
  const isPortrait = useOrientation();
  const videoSize = isPortrait ? "w-52 h-40" : "w-64 h-40";
  const arHeight = isPortrait ? "h-[70vh]" : "h-[60vh]";
  const store = createXRStore();

  return (
    <div className="w-screen h-screen m-0 p-0">
      <div className="w-screen">
        <div className="w-full">
          <Video src={Video1} position="left-0" size={videoSize} />
          <Video src={Video2} position="right-0" size={videoSize} />
        </div>

        <div className={`absolute bottom-0 w-full ${arHeight} bg-gray-800`}>
          <Canvas>
            <XR store={store}>
              <ambientLight />
              <pointLight position={[0, 1, 1]} />
              {/* <ARScene /> */}
            </XR>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
