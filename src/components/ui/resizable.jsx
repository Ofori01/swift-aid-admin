import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const ResizablePanel = ({
  children,
  defaultSize = 30,
  minSize = 20,
  maxSize = 60,
  className,
  onResize,
  ...props
}) => {
  const [size, setSize] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const startSizeRef = useRef(0);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.parentElement.offsetWidth;
      const deltaX = e.clientX - startXRef.current;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newSize = Math.min(
        maxSize,
        Math.max(minSize, startSizeRef.current + deltaPercent)
      );

      setSize(newSize);
      onResize?.(newSize);
    },
    [maxSize, minSize, onResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);

    // Restore text selection
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startSizeRef.current = size;

    // Prevent text selection during resize
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex", className)}
      {...props}
    >
      <div style={{ width: `${size}%` }} className="flex-shrink-0">
        {children[0]}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          "w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize flex-shrink-0 transition-colors",
          "hover:w-2 active:bg-red-500",
          isResizing && "bg-red-500 w-2"
        )}
      />

      <div style={{ width: `${100 - size}%` }} className="flex-1 min-w-0">
        {children[1]}
      </div>
    </div>
  );
};

export { ResizablePanel };
