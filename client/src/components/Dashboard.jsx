import { useCallback, useState } from "react";
import ElementWrapper from "./ElementWrapper";

export default function Dashboard({ layout, setLayout }) {
  const [savedMessage, setSavedMessage] = useState("");

  const addElement = (type) => {
    const newEl = {
      id: Date.now(),
      type,
      x: 80,
      y: 80,
      w: 300,
      h: 200,
      content: "",
      chartType: "bar",
    };

    const newLayout = [...layout, newEl];
    setLayout(newLayout);
  };

  const deleteElement = useCallback(
    (id) => {
      const newLayout = layout.filter((el) => el.id !== id);
      setLayout(newLayout);
    },
    [layout, setLayout]
  );

  const updateElement = useCallback(
    (id, updates) => {
      const newLayout = layout.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );

      setLayout(newLayout);
    },
    [layout, setLayout]
  );

  const clearDashboard = () => {
    if (window.confirm("Are you sure you want to clear all elements?")) {
      setLayout([]);
    }
  };

  const handleSave = async () => {
    try {
      await fetch("http://localhost:8080/api/layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(layout),
      });

      setSavedMessage("Dashboard saved successfully!");
      setTimeout(() => setSavedMessage(""), 2000);
    } catch (error) {
      console.error("Error saving dashboard:", error);
      setSavedMessage("Error saving dashboard");
      setTimeout(() => setSavedMessage(""), 2000);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
    
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard Builder</h1>
          <div className="flex gap-2 items-center">
            {savedMessage && (
              <span
                className={`text-sm font-medium px-3 py-1 rounded ${
                  savedMessage.includes("successfully")
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {savedMessage}
              </span>
            )}
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>


      <div className="bg-white shadow-md px-6 py-3 flex gap-3 flex-wrap border-b">
        <span className="text-sm font-semibold text-gray-700 self-center">
          Add Elements:
        </span>
        <button
          onClick={() => addElement("text")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition flex gap-2 items-center"
        >
          <span>📝</span> Text
        </button>
        <button
          onClick={() => addElement("image")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition flex gap-2 items-center"
        >
          <span>🖼️</span> Image
        </button>
        <button
          onClick={() => addElement("chart")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-medium transition flex gap-2 items-center"
        >
          <span>📊</span> Chart
        </button>
        <button
          onClick={clearDashboard}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition ml-auto"
        >
          Clear All
        </button>
      </div>


      <div className="flex-1 p-6 overflow-auto">
        <div className="relative w-full min-h-full bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-sm">
          {layout.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No elements yet</p>
                <p className="text-sm">Add an element from the toolbar above</p>
              </div>
            </div>
          ) : (
            layout.map((el) => (
              <ElementWrapper
                key={el.id}
                el={el}
                update={updateElement}
                onDelete={deleteElement}
              />
            ))
          )}
        </div>
      </div>

      <div className="bg-gray-200 px-6 py-2 border-t text-xs text-gray-600">
        <span>Elements: {layout.length}</span>
      </div>
    </div>
  );
}