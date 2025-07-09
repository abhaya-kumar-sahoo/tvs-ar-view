import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  // Define the list of pages with their paths and display names
  const pages = [
    // { path: "/about", name: "About" },
    { path: "/3d", name: "AR 3D Engine" },
    { path: "/cam", name: "Bike Cam" },
    // { path: "/ar", name: "AR Stage" },
    // { path: "/predict", name: "Image Training" },
    // { path: "/detect", name: "Image Detect" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-gray-300">
      <div className="mt-8 w-full max-w-md">
        <ul className="space-y-4">
          {pages.map((page) => (
            <li key={page.path}>
              <Link
                to={page.path}
                className="block w-full px-6 py-3 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

// return (
//   <div className="relative h-screen w-screen flex justify-center items-center overflow-hidden bg-black text-white">
//     <div
//       className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]  opacity-20 spin-slow z-0"
//       style={{
//         background: "conic-gradient(at top left, #00ffcc, #3366ff, #00ffcc)",
//       }}
//     ></div>
//     <div className="absolute inset-0 bg-[radial-gradient(#00ffbf_1px,transparent_1px)] [background-size:40px_40px] opacity-10 z-0"></div>
//     <div className="ring ring-green ring-delay-0 w-[600px] h-[600px]"></div>
//     <div className="ring ring-blue ring-delay-1 w-[500px] h-[500px]"></div>
//     <div className="ring ring-purple ring-delay-2 w-[400px] h-[400px]"></div>
//     <div className="ring ring-yellow ring-delay-3 w-[300px] h-[300px]"></div>
//     <div className="ring ring-green ring-delay-4 w-[200px] h-[200px]"></div>
//     <div className="ring ring-blue ring-delay-5 w-[100px] h-[100px]"></div>
//     <div className="ring ring-purple ring-delay-6 w-[50px] h-[50px]"></div>
//     <div className="ring ring-yellow ring-delay-7 w-[10px] h-[10px]"></div>

//     <div className="relative z-50">
//       {!cameraStarted && (
//         <>
//           <div className="z-10 text-center px-4">
//             <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-green-400 to-emerald-300 drop-shadow-[0_2px_10px_rgba(132,204,22,0.7)]">
//               Experience Your Bike in AR
//             </h1>
//             <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
//               Scan your real-world bike using your camera and bring it to life
//               in 3D Augmented Reality.
//             </p>

//             <button
//               onClick={startCamera}
//               className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 via-lime-300 to-green-400 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(132,204,22,0.6)] hover:shadow-[0_0_30px_rgba(132,204,22,1)] transition-all duration-300 hover:scale-105 active:scale-95"
//               title="Start scanning your bike"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path d="M5.5 17.5A2.5 2.5 0 1 0 5.5 12a2.5 2.5 0 0 0 0 5.5zm13 0A2.5 2.5 0 1 0 18.5 12a2.5 2.5 0 0 0 0 5.5zM7.5 17.5h2L11 12h2l1.5 5.5h2" />
//                 <path d="M5.5 12l2-3h4M14 9h4" />
//               </svg>
//               Start AR Bike Scan
//             </button>
//           </div>
//         </>
//       )}
//       {cameraStarted && (
//         <div className="fixed inset-0 z-50 bg-black">
//           <Webcam
//             ref={webcamRef}
//             audio={false}
//             className="w-full h-full object-cover"
//             videoConstraints={
//               {
//                 // facingMode: { exact: "environment" }, // back camera
//               }
//             }
//           />

//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
//             <div className="w-[90vw] h-[90vh] relative">
//               <div className="absolute top-0 left-0 w-10 h-10 border-t-6 border-l-6 border-red-400 rounded-tl-md" />
//               <div className="absolute top-0 right-0 w-10 h-10 border-t-6 border-r-6 border-red-400 rounded-tr-md" />
//               <div className="absolute bottom-0 left-0 w-10 h-10 border-b-6 border-l-6 border-red-400 rounded-bl-md" />
//               <div className="absolute bottom-0 right-0 w-10 h-10 border-b-6 border-r-6 border-red-400 rounded-br-md" />
//             </div>
//           </div>
//         </div>
//       )}
//       {predictions.length > 0 ? (
//         <ul className="space-y-2 ">
//           {predictions.map((pred, index) => (
//             <li
//               key={index}
//               className="flex justify-center text-gray-100 border-b py-2"
//             >
//               <span className="text-center">{pred.className}</span>
//             </li>
//           ))}
//           {predictions[0].className !== "Unknown Object" && (
//             <div className="justify-center flex">
//               <button
//                 onClick={() => {
//                   nav("3d");
//                 }}
//                 className="px-4 rounded bg-amber-600 py-2"
//               >
//                 Show me Engine
//               </button>
//               <button
//                 onClick={() => {
//                   window.location.reload();
//                 }}
//                 className="px-4 mx-3 rounded bg-red-600 py-2"
//               >
//                 Restart
//               </button>
//             </div>
//           )}
//         </ul>
//       ) : (
//         <p className="text-red-600 text-lg text-center pt-20">
//           {!isWebXRSupported && (error || "Checking WebXR support...")}
//         </p>
//       )}
//     </div>
//   </div>
// );
