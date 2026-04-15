import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartElement({ el, update }) {
  const chartType = el?.chartType || "bar";

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Revenue",
        data: [30, 40, 50, 60, 45, 70],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${chartType === "bar" ? "Bar" : "Line"} Chart - Dashboard Analytics`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col p-2">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => update(el.id, { chartType: "bar" })}
          className={`px-2 py-1 rounded text-xs font-medium ${
            chartType === "bar"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Bar
        </button>
        <button
          onClick={() => update(el.id, { chartType: "line" })}
          className={`px-2 py-1 rounded text-xs font-medium ${
            chartType === "line"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Line
        </button>
      </div>
      <div className="flex-1">
        {chartType === "bar" ? (
          <Bar data={data} options={options} />
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}