let latestData = { temperature: null, humidity: null };

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { temperature, humidity } = req.body;
      if (temperature !== undefined && humidity !== undefined) {
        latestData = { temperature, humidity };
        return res.status(200).json({ message: "Data received", latestData });
      } else {
        return res.status(400).json({ error: "Invalid payload" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "GET") {
    return res.status(200).json(latestData);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
