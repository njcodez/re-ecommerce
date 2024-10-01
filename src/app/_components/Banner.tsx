"use client"; // Mark this file as a client component

import React, { useRef } from 'react';

interface BannerProps {
  onButtonClick: () => void; // Rename to clarify that this is a callback for client-side interaction
}

// const Banner: React.FC<BannerProps> = ({ onButtonClick }) => {
  const Banner = () => {

  const endRef = useRef<HTMLDivElement | null>(null);

  // const handleButtonClick = () => {
  //   if (endRef.current) {
  //     endRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  //   onButtonClick(); // Call the original callback if needed
  // };

   const scrollToProducts = () => {
    // Use document.getElementById to find the element and scroll into view
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } 
  };


  return (
    <section className="relative bg-green-500 text-white h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/banner-background.jpg)' }}></div>
      <div className="relative z-10 text-left px-8">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          Discover the world of Ayurveda
          <br />
          with our new eCommerce platform.
        </h1>
        <p className="text-xl mb-6">Explore a vast range of authentic Ayurvedic products crafted for your well-being.</p>
        <button 
          onClick={scrollToProducts} 
          className="bg-yellow-400 text-green-800 px-6 py-2 rounded-full shadow-lg"
        >
          Explore Products
        </button>
      </div>
      {/* This is the end of the banner */}
      <div ref={endRef} className="absolute bottom-0 left-0 w-full h-1"></div>
    </section>
  );
};

export default Banner;
