import About from "./pages/About";
import { BikeDetect } from "./pages/BikeDetect";
import NotFound from "./pages/NotFound";
// import FoxCon from "./teachable-machine/ttjs/Main";

import Stage3 from "./pages/Ar-Engine";
import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import HomeMobile from "./pages/HomeMobile";

export default function App() {
  return (
    <div className="w-screen h-full bg-gray-800 text-gray-300">
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/mobile" element={<HomeMobile />} /> */}
        <Route path="/about" element={<About />} />
        {/* <Route path="/ar" element={<Stage3 />} />
        <Route path="/predict" element={<FoxCon />} /> */}
        <Route path="/3d" element={<Stage3 />} />
        <Route path="/" element={<BikeDetect />} />
        {/* <Route path="/detect" element={<BikeDetect />} /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
