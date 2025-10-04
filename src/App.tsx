import { BikeDetect } from "./pages/BikeDetect";
import NotFound from "./pages/NotFound";
// import FoxCon from "./teachable-machine/ttjs/Main";

import Stage3 from "./pages/Ar-Engine";
import { Routes, Route } from "react-router-dom";
import HomeMobile from "./pages/HomeMobile";
// import Home from "./pages/Home";
// import HomeMobile from "./pages/HomeMobile";

export default function App() {
  return (
    <div className="w-screen h-full  text-gray-300">
      <Routes>
        <Route path="/" element={<HomeMobile />} />
        <Route path="/cam" element={<BikeDetect />} />
        <Route path="/3d" element={<Stage3 />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
