import React from "react";

const About: React.FC = () => {
  return (
    <div className="p-8 font-sans bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-6">About Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        Welcome to our application! We are dedicated to providing the best
        experience for our users.
      </p>
      <p className="text-lg text-gray-700">
        Our team is passionate about creating innovative solutions to solve
        real-world problems. Thank you for being a part of our journey.
      </p>
    </div>
  );
};

export default About;
