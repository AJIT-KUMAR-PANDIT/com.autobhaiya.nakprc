import React from "react";

export default function Loader() {
  return (
    <div className="z-[9999999999999] fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="relative flex flex-col items-center">
        {/* Blinking Logo */}
        <div className="h-100 w-100 animate-blink">
          <img
            src="/logo.png"
            alt="Loading..."
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
