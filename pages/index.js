// pages/index.js
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState({ temperature: "--", humidity: "--", timestamp: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();
        setData(json);
        setLatest(json.length > 0 ? json[0] : { temperature: "--", humidity: "--", timestamp: null });
      } catch (err) {
        console.error("Fetch error:", err);
        setData([]);
        setLatest({ temperature: "--", humidity: "--", timestamp: null });
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

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

      <h3>Last 10 Records</h3>
      <table>
        <thead>
          <tr>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr key={idx}>
              <td>{d.temperature}</td>
              <td>{d.humidity}</td>
              <td>{new Date(d.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .container { text-align:center; padding:2rem; font-family: Arial, sans-serif; }
        h1 { color:#333; }
        .cards { display:flex; justify-content:center; gap:2rem; margin:1rem 0; flex-wrap:wrap; }
        .card { padding:1.5rem; background:#fff; border-radius:12px; min-width:150px; box-shadow:0 4px 10px rgba(0,0,0,0.1); }
        .temp { border-top:4px solid #ff6b6b; }
        .hum { border-top:4px solid #4dabf7; }
        table { margin:1rem auto; border-collapse:collapse; width:80%; }
        th, td { border:1px solid #ccc; padding:0.5rem; }
        th { background:#f0f0f0; }
        .timestamp { margin:1rem 0; color:#777; }
      `}</style>
    </div>
  );
}
