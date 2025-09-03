import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState({ temperature: "--", humidity: "--", timestamp: null });

  // Fetch data every 5s
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();
        setData(json);
        setLatest(json.length > 0 ? json[0] : { temperature: "--", humidity: "--", timestamp: null });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map(d => d.temperature),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Humidity (%)",
        data: data.map(d => d.humidity),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };

  const downloadCSV = () => {
    let csv = "Temperature,Humidity,Timestamp\n";
    data.forEach(d => {
      csv += `${d.temperature},${d.humidity},${new Date(d.timestamp).toLocaleString()}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "esp32_data.csv");
  };

  return (
    <div className="container">
      <h1>🌐 ESP32 Dashboard</h1>
      <div className="cards">
        <div className="card temp">
          <h2>🌡 Temperature</h2>
          <p>{latest.temperature} °C</p>
        </div>
        <div className="card hum">
          <h2>💧 Humidity</h2>
          <p>{latest.humidity} %</p>
        </div>
      </div>
      <p className="timestamp">
        ⏱ Last Update: {latest.timestamp ? new Date(latest.timestamp).toLocaleTimeString() : "--"}
      </p>

      <button onClick={downloadCSV} className="download-btn">Download CSV</button>

      <h3>Chart (Last 10 Records)</h3>
      <Bar data={chartData} options={options} />

      <style jsx>{`
        .container { font-family: Arial,sans-serif; text-align:center; padding:2rem; }
        h1 { color:#333; }
        .cards { display:flex; justify-content:center; gap:2rem; margin:1rem 0; flex-wrap:wrap; }
        .card { padding:1.5rem; background:#fff; border-radius:12px; min-width:150px; box-shadow:0 4px 10px rgba(0,0,0,0.1); }
        .temp { border-top:4px solid #ff6b6b; }
        .hum { border-top:4px solid #4dabf7; }
        .timestamp { margin:1rem 0; color:#777; }
        .download-btn { padding:0.5rem 1rem; margin:1rem; background:#4dabf7; color:#fff; border:none; border-radius:6px; cursor:pointer; }
        .download-btn:hover { background:#3793e1; }
      `}</style>
    </div>
  );
}
