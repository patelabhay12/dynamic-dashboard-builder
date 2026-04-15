import { useState, useEffect, useRef } from "react";
import RichTextEditor from "./RichTextEditor";
import ImageElement from "./ImageElement";
import ChartElement from "./ChartElement";

export default function ElementWrapper({ el, update, onDelete }) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const elementRef = useRef(null);

  const onElementMouseDown = (e) => {
    // Don't drag if clicking on resize handle or delete button
    if (
      e.target.closest('[title="Delete element"]') ||
      e.target.closest('[title="Drag to resize"]')
    ) {
      return;
    }

    // Don't drag if it's a contenteditable element (text editor)
    if (e.target.contentEditable === "true" || e.target.closest('[contenteditable="true"]')) {
      return;
    }

    // Don't drag if clicking on interactive elements like buttons or inputs
    if (
      e.target.tagName === 'BUTTON' ||
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'SELECT' ||
      e.target.tagName === 'TEXTAREA'
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    setDragging(true);
    offsetRef.current = {
      x: e.clientX - el.x,
      y: e.clientY - el.y,
    };
  };

  const onResizeMouseDown = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    setResizing(true);
    offsetRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: el.w,
      h: el.h,
      direction,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging && !resizing) return;

      if (dragging) {
        update(el.id, {
          x: e.clientX - offsetRef.current.x,
          y: e.clientY - offsetRef.current.y,
        });
      }

      if (resizing) {
        const direction = offsetRef.current.direction;
        const deltaX = e.clientX - offsetRef.current.x;
        const deltaY = e.clientY - offsetRef.current.y;

        let newW = offsetRef.current.w;
        let newH = offsetRef.current.h;
        let newX = el.x;
        let newY = el.y;

        // Handle different resize directions
        if (direction.includes('e')) newW = offsetRef.current.w + deltaX;
        if (direction.includes('s')) newH = offsetRef.current.h + deltaY;
        if (direction.includes('w')) {
          newW = offsetRef.current.w - deltaX;
          newX = el.x + deltaX;
        }
        if (direction.includes('n')) {
          newH = offsetRef.current.h - deltaY;
          newY = el.y + deltaY;
        }

        // Apply minimum constraints
        if (newW < 150) newW = 150;
        if (newH < 100) newH = 100;

        const updates = {
          w: newW,
          h: newH,
        };

        if (newX !== el.x) updates.x = newX;
        if (newY !== el.y) updates.y = newY;

        update(el.id, updates);
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    if (dragging || resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, el.id, el.x, el.y, update]);

  const renderContent = () => {
    switch (el.type) {
      case "text":
        return <RichTextEditor el={el} update={update} />;
      case "image":
        return <ImageElement el={el} update={update} />;
      case "chart":
        return <ChartElement el={el} update={update} />;
      default:
        return <div className="p-2 text-gray-500">Unknown element type</div>;
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={onElementMouseDown}
      onClick={() => setIsSelected(true)}
      onBlur={() => setIsSelected(false)}
      className={`absolute border-2 bg-white shadow-lg transition-all ${
        isSelected ? "border-blue-500" : "border-gray-300"
      } ${dragging || resizing ? "cursor-grabbing z-50" : "cursor-grab z-10"}`}
      style={{
        transform: `translate(${el.x}px, ${el.y}px)`,
        width: el.w,
        height: el.h,
        userSelect: 'none',
      }}
    >
      {/* Header with drag handle */}
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-t flex justify-between items-center cursor-grab active:cursor-grabbing select-none"
      >
        <span className="text-sm font-bold">{el.type.toUpperCase()}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(el.id);
          }}
          className="text-white hover:bg-red-600 px-2 py-0.5 rounded text-xs font-bold"
          title="Delete element"
        >
          ✕
        </button>
      </div>

      {/* Content area */}
      <div
        className="flex-1 overflow-auto"
        style={{ height: `calc(100% - 38px)` }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>


      {/* Top-left */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, 'nw')}
        className="absolute top-0 left-0 w-2 h-2 bg-blue-500 cursor-nwse-resize hover:bg-blue-700"
        title="Resize"
      />
      {/* Top-center */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, 'n')}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-blue-400 cursor-ns-resize hover:bg-blue-600"
        title="Resize"
      />
      {/* Top-right */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, 'ne')}
        className="absolute top-0 right-0 w-2 h-2 bg-blue-500 cursor-nesw-resize hover:bg-blue-700"
        title="Resize"
      />
      {/* Middle-left */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, 'w')}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-6 bg-blue-400 cursor-ew-resize hover:bg-blue-600"
        title="Resize"
      />
      {/* Middle-right */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, 'e')}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-6 bg-blue-400 cursor-ew-resize hover:bg-blue-600"
        title="Resize"
      />
      {/* Bottom-left */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, 'sw')}
        className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 cursor-nesw-resize hover:bg-blue-700"
        title="Resize"
      />
      {/* Bottom-center */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, 's')}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-blue-400 cursor-ns-resize hover:bg-blue-600"
        title="Resize"
      />
      {/* Bottom-right */}
      <div
        onMouseDown={(e) => onResizeMouseDown(e, 'se')}
        className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-se-resize hover:bg-blue-700"
        title="Resize"
      />
    </div>
  );
}