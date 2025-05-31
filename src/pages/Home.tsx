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
