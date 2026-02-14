import React from "react";
import { Minus, Square, X } from "lucide-react";

const TitleBar = () => {
  // Logic remains the same, styling is updated
  const handleMinimize = () => window.vibesApp?.minimizeWindow();
  const handleMaximize = () => window.vibesApp?.maximizeWindow();
  const handleClose = () => window.vibesApp?.closeWindow();

  return (
    <div className="drag-region w-full h-10 flex items-center justify-between px-3 select-none z-50 transition-colors duration-300">
      
      {/* Brand / Logo Area */}
      <div className="flex items-center gap-2 pl-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
        {/* We hide the title by default for a super clean look, 
            or show it if you prefer. Currently set to fade in on hover 
            so it doesn't clutter the top bar. */}
        <span className="text-xs font-bold text-text-muted tracking-widest uppercase">
          Vibes
        </span>
      </div>

      {/* Window Controls */}
      <div className="no-drag flex items-center gap-1">
        
        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className="p-2 rounded-lg text-text-muted hover:bg-slate-200 dark:hover:bg-white/10 hover:text-text-main transition-colors"
          aria-label="Minimize"
        >
          <Minus size={16} />
        </button>

        {/* Maximize */}
        <button
          onClick={handleMaximize}
          className="p-2 rounded-lg text-text-muted hover:bg-slate-200 dark:hover:bg-white/10 hover:text-text-main transition-colors"
          aria-label="Maximize"
        >
          <Square size={14} />
        </button>

        {/* Close (Red Hover) */}
        <button
          onClick={handleClose}
          className="p-2 rounded-lg text-text-muted hover:bg-red-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;