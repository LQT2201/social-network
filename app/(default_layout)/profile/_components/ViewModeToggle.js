import React, { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";

const ViewModeToggle = ({ viewMode, toggleViewMode }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipText =
    viewMode === "grid" ? "Switch to list view" : "Switch to grid view";

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleViewMode}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center justify-center p-2 rounded-full bg-white text-yellow-orange hover:bg-orange-50 hover:text-l-yellow transition-colors duration-200 shadow-sm"
      >
        {viewMode === "grid" ? (
          <LayoutList size={20} />
        ) : (
          <LayoutGrid size={20} />
        )}
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-yellow-orange  text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-md">
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default ViewModeToggle;
