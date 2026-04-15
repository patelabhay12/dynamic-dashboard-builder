import { useRef, useState, useEffect } from "react";

export default function RichTextEditor({ el, update }) {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  const [initialized, setInitialized] = useState(false);

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && !initialized && el.content) {
      editorRef.current.innerHTML = el.content;
    }
  }, []);

  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleChange = () => {
    const content = editorRef.current?.innerHTML || "";
    update(el.id, { content });
  };

  const handleBlur = () => {
    const content = editorRef.current?.innerHTML || "";
    update(el.id, { content });
  };

  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    setFontSize(size);
    applyStyle("fontSize", "7");
    document.execCommand("fontSize", false, size);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="bg-gray-200 p-2 border-b flex gap-1 flex-wrap items-center">
        <button
          onClick={() => applyStyle("bold")}
          className="bg-gray-400 hover:bg-gray-500 px-2 py-1 rounded text-sm font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => applyStyle("italic")}
          className="bg-gray-400 hover:bg-gray-500 px-2 py-1 rounded text-sm italic"
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => applyStyle("underline")}
          className="bg-gray-400 hover:bg-gray-500 px-2 py-1 rounded text-sm underline"
          title="Underline"
        >
          U
        </button>
        <div className="w-px h-6 bg-gray-400"></div>
        <select
          value={fontSize}
          onChange={handleFontSizeChange}
          className="px-2 py-1 rounded text-sm border"
        >
          {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
        <div className="w-px h-6 bg-gray-400"></div>
        <button
          onClick={() => applyStyle("formatBlock", "<h1>")}
          className="bg-gray-400 hover:bg-gray-500 px-2 py-1 rounded text-sm"
          title="Heading"
        >
          H1
        </button>
        <button
          onClick={() => applyStyle("insertUnorderedList")}
          className="bg-gray-400 hover:bg-gray-500 px-2 py-1 rounded text-sm"
          title="Bullet List"
        >
          ⋯
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        onBlur={handleBlur}
        className="flex-1 p-2 overflow-auto focus:outline-none"
        suppressContentEditableWarning
      />
    </div>
  );
}
