import React, { useEffect } from "react";
import { CloudCog, Minus, Square, X } from "lucide-react";
import icon from "../assets/icon.png";

const TitleBar = () => {
  console.log("TitleBar rendering, window.vibesApp:", !!window.vibesApp);

  const handleMinimize = () => {
    console.log("Minimize clicked");
    if (window.vibesApp) {
      window.vibesApp.minimizeWindow();
    } else {
      console.error("vibesApp not found on window");
    }
  };

  const handleMaximize = async () => {
    console.log("Maximize clicked");
    if (window.vibesApp) {
      window.vibesApp.maximizeWindow();
    } else {
      console.error("vibesApp not found on window");
    }
  };

  const handleClose = () => {
    console.log("Close clicked");
    if (window.vibesApp) {
      window.vibesApp.closeWindow();
    } else {
      console.error("vibesApp not found on window");
    }
  };

  return (
    <div className="drag-region h-12 flex items-center justify-between px-4 glass border-b border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-2">
        {/* <img
          src={icon}
          alt="Vibes Logo"
          className="w-8 h-8 rounded-lg shadow-glow-purple"
        /> */}
        <span className="text-[35px] font-bold font-vibes bg-gradient-to-r bg-clip-text">
          Vibes
        </span>
      </div>

      {/* Window Controls */}
      <div className="no-drag flex items-center gap-2">
        <button
          onClick={handleMinimize}
          className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Minimize"
        >
          <Minus size={16} className="text-white/70" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Maximize"
        >
          <Square size={14} className="text-white/70" />
        </button>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group"
          aria-label="Close"
        >
          <X size={16} className="text-white/70 group-hover:text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
