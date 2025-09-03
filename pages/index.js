import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Papa from "papaparse";

export default function Dashboard() {
  const [data, setData] = useState([]);
  
  const fetchData = async () => {
    const res = await fetch("/api/data");
    const json = await res.json();
    setData(json.reverse()); // show oldest first
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Prepare chart data
  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map(d => d.temperature),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
        tension: 0.3,
      },
      {
        label: "Humidity (%)",
        data: data.map(d => d.humidity),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        tension: 0.3,
      },
    ],
  };

  // CSV download
  const downloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sensor_data.csv");
    link.click();
  };

  return (
    <div className="container">
      <h1>🌐 ESP32 Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h2>Latest Temperature</h2>
          <p>{data[data.length - 1]?.temperature ?? "--"} °C</p>
        </div>
        <div className="card">
          <h2>Latest Humidity</h2>
          <p>{data[data.length - 1]?.humidity ?? "--"} %</p>
        </div>
      </div>

      <div className="chart">
        <Line data={chartData} />
      </div>

      <button onClick={downloadCSV}>Download CSV</button>

      <style jsx>{`
        .container { font-family: Arial; padding: 2rem; text-align: center; }
        .cards { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; }
        .card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        button { margin-top: 1rem; padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer; border-radius: 6px; }
        .chart { max-width: 800px; margin: 0 auto 2rem auto; }
      `}</style>
    </div>
  );
}
