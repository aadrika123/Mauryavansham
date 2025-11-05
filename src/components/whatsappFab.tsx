"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa6";

const WhatsappFab = () => {
  const number = "919135135033"; 
  const message = "Hello support team of Mauryavansham! Is anyone available to chat?";
  const encodedMsg = encodeURIComponent(message);

  // Detect if it's mobile
  const isMobile = () =>
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const handleClick = () => {
    const url = isMobile()
      ? `https://api.whatsapp.com/send?phone=${number}&text=${encodedMsg}`
      : `https://web.whatsapp.com/send?phone=${number}&text=${encodedMsg}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
    >
      <FaWhatsapp className="h-10 w-10 text-white" />
    </button>
  );
};

export default WhatsappFab;
