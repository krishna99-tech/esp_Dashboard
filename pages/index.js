import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState({ temperature: null, humidity: null });
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();
        if (json.temperature !== null && json.humidity !== null) {
          setData(json);
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "50px" }}>
      <h1>🌡 ESP32 Dashboard</h1>
      <p style={{ fontSize: "20px" }}>
        <strong>Temperature:</strong>{" "}
        {data.temperature !== null ? `${data.temperature} °C` : "—"}
      </p>
      <p style={{ fontSize: "20px" }}>
        <strong>Humidity:</strong>{" "}
        {data.humidity !== null ? `${data.humidity} %` : "—"}
      </p>
      <p style={{ fontSize: "14px", color: "gray" }}>
        ⏱ Last Update: {lastUpdate ? lastUpdate : "—"}
      </p>
    </div>
  );
}
