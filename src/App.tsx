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

// // App.tsx
// import { Routes, Route } from "react-router-dom";
// import HomeMobile from "./pages/HomeMobile";
// import { BikeDetect } from "./pages/BikeDetect";
// import Stage3 from "./pages/Ar-Engine";
// import NotFound from "./pages/NotFound";
// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   return (
//     <div className="w-screen h-full text-gray-300">
//       <Routes>
//         <Route path="/" element={<HomeMobile />} />
//         <Route
//           path="/cam"
//           element={
//             <ProtectedRoute requiredStep={2}>
//               <BikeDetect />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/3d"
//           element={
//             <ProtectedRoute requiredStep={3}>
//               <Stage3 />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </div>
//   );
// }
