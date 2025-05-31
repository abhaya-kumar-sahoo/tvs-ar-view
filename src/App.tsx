import About from "./pages/About";
import { BikeDetect } from "./pages/BikeDetect";
import NotFound from "./pages/NotFound";
// import FoxCon from "./teachable-machine/ttjs/Main";

import Stage3 from "./pages/Ar-Engine";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="w-screen h-screen bg-gray-800 text-gray-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/ar" element={<Stage3 />} />
        <Route path="/predict" element={<FoxCon />} /> */}
        <Route path="/3d" element={<Stage3 />} />
        <Route path="/cam" element={<BikeDetect />} />
        {/* <Route path="/detect" element={<BikeDetect />} /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
