/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
//@ts-expect-error
import "swiper/css";
//@ts-expect-error
import "swiper/css/navigation";
import tvsLogo from "../assets/images/tvs-logo.png";
import homeBanner from "../assets/images/home_banner.webp";
import fi5259008 from "../assets/svg/fi_5259008.svg";
import slide1 from "../assets/images/slide-img1.webp";
import slide2 from "../assets/images/slide-img2.webp";
import slide3 from "../assets/images/slide-img3.webp";
import slide4 from "../assets/images/slide-img4.webp";
import slide5 from "../assets/images/slide-img5.webp";
import bikeImg from "../assets/images/bike.webp";
import { useNavigate } from "react-router-dom";
const slides = [slide1, slide2, slide3, slide4, slide5];

interface HomeMobileProps {
  onStartAr?: () => void;
}

const HomeMobile: React.FC<HomeMobileProps> = () => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const nav = useNavigate();
  return (
    <div className="w-full  max-w-md mx-auto bg-white min-h-screen flex flex-col items-center font-sans">
      <header className="w-full flex justify-center items-center pt-6  bg-white">
        <img
          src={tvsLogo}
          alt="TVS Logo"
          loading="lazy"
          className="w-32 md:w-36 h-auto"
        />
      </header>
      <div className="w-full aspect-[250/300] mt-4">
        <img
          src={homeBanner}
          onLoad={() => setLoaded(true)}
          alt="Home Banner"
          className={`w-full h-[60vh] object-cover  transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="w-full my-10 px-4 justify-center align-middle flex">
        <button
          onClick={() => {
            // nav("/3d");
            nav("/cam");
          }}
          className="w-full py-5 cursor-pointer rounded-lg bg-gradient-to-r from-[#E62D38] to-[#183883] text-white font-bold text-[16px] leading-[1.24em] shadow-[0_0_15px_#E12338] md:max-w-md md:py-4 md:text-xl relative overflow-hidden neon-glow"
          style={{
            textShadow: "0px 4px 20px rgba(0,0,0,0.2)",
            fontFamily: "Gilroy-Bold",
          }}
        >
          <span className="relative z-20">Start AR Bike Scan</span>
          <img
            src={bikeImg}
            loading="lazy"
            alt="Bike"
            className="pointer-events-none select-none absolute top-1/2 left-0 w-18 h-auto opacity-80 z-10 animate-bike-run"
            style={{ transform: "translateY(-50%)" }}
          />
        </button>
      </div>

      {/* Swiper Slider Section */}
      <div className="relative w-full mb-4 px-0">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
          className="w-full"
        >
          {slides.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img}
                loading="lazy"
                alt={`Slide ${idx + 1}`}
                className="w-full "
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-2 right-4 bg-black bg-opacity-60 text-white text-xs rounded px-2 py-1">
          {current + 1} / {slides.length}
        </div>
      </div>
      {/* End Swiper Slider Section */}

      <div className="w-full flex flex-col items-center px-4 pt-6 md:pt-10 md:px-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 md:text-2xl">
            Dedicated Control Cubes
          </h2>
          <p className="text-sm text-gray-700 md:text-base">
            The control cubes on the handlebar, allows you to instinctively
            switch between ride modes with the touch of a button while you are
            on the go. Control cubes also helps the racer to navigate through
            the Multi Information Race Computer giving access to a host of
            essential information and personalization widgets
          </p>
        </div>
      </div>
      <footer className="w-full flex items-center justify-center gap-2 py-6 mt-auto text-[#183883] text-xs md:text-sm">
        <img
          src={fi5259008}
          loading="lazy"
          alt="Footer Icon"
          className="w-6 h-6 md:w-8 md:h-8"
        />
        <span>© TVS Motor Company. All Rights Reserved</span>
      </footer>
    </div>
  );
};

export default HomeMobile;
