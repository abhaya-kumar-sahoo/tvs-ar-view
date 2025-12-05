import { useEffect, useRef } from "react";
import "./modelViewer.css";
// Type declaration for model-viewer
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        ar?: boolean;
        "ar-modes"?: string;
        "camera-controls"?: boolean;
        "shadow-intensity"?: string;
        alt?: string;
        "auto-rotate"?: boolean;
        orientation?: string;
        scale?: string;
        "touch-action"?: string;
      };
    }
  }
}

export default function AppAr() {
  const viewerRef = useRef<any>(null);

  const audioRef = useRef(new Audio("/engine-sound.mp3"));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleARClick = () => {
    audioRef.current.play().catch((error) => {
      console.error("Audio play failed:", error);
    });
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
        width: "100vw",
        height: "100vh", // Changed to 100vh for full screen
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "relative",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <model-viewer
        ref={viewerRef}
        id="append-demo"
        src={`/m2.glb`} // Assuming models are in public root based on file list
        camera-controls
        touch-action="pan-y"
        ar
        ar-modes="quick-look webxr scene-viewer"
        scale="0.1 0.1 0.1"
        orientation="0deg 0deg -90deg"
        auto-rotate
        skybox-height="2m"
        max-camera-orbit="auto 90deg auto"
        shadow-intensity="1"
        alt="An animated 3D model"
        style={{ width: "100%", height: "100%" }}
      >
        <div slot="poster" className="model-poster">
          Loading Model…
        </div>

        <button slot="ar-button" className="ar-btn" onClick={handleARClick}>
          View in AR
        </button>
      </model-viewer>
    </div>
  );
}
