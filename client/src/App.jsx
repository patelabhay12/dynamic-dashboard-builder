import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/layout");
        if (res.ok) {
          const data = await res.json();
          setLayout(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching layout:", error);
        setLayout([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, []);

  const saveLayout = async (newLayout) => {
    setLayout(newLayout);

    try {
      await fetch("http://localhost:8080/api/layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLayout),
      });
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return <Dashboard layout={layout} setLayout={saveLayout} />;
}