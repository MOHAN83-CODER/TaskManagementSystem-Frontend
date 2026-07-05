import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function TaskChart({ pending, completed }) {
  const data = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        data: [pending, completed],
        backgroundColor: [
          "#f59e0b",
          "#10b981",
        ],
        borderColor: [
          "#ffffff",
          "#ffffff",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="chart-container">
      <Pie
        data={data}
        options={options}
      />
    </div>
  );
}

export default TaskChart;