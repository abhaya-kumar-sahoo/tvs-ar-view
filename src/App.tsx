import { BikeDetect } from "./pages/BikeDetect";
import NotFound from "./pages/NotFound";
// import FoxCon from "./teachable-machine/ttjs/Main";

import Stage3 from "./pages/Ar-Engine";
import { Routes, Route } from "react-router-dom";
import HomeMobile from "./pages/HomeMobile";
import AppAr from "./abhaya";
import { checkOS } from "./hooks/checkOS";
// import Home from "./pages/Home";
// import HomeMobile from "./pages/HomeMobile";
// PGTESTPAYUAT86
// overhappy-bertha-semidomestic.ngrok-free.dev
// allowedHosts: ["unperpetuable-nonhostile-adrianne.ngrok-free.dev"],

export default function App() {
  const isIOS = checkOS();
  console.log({ isIOS });
  return (
    <div className="w-screen h-full  text-gray-300">
      <Routes>
        <Route path="/" element={<HomeMobile />} />
        {isIOS && <Route path="/ios" element={<AppAr />} />}
        <Route path="/cam" element={<BikeDetect />} />
        <Route path="/3d" element={<Stage3 />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
