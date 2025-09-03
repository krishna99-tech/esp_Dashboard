// pages/api/data.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("esp32_dashboard");

    if (req.method === "POST") {
      const { temperature, humidity } = req.body;
      if (
        temperature === undefined ||
        humidity === undefined ||
        isNaN(temperature) ||
        isNaN(humidity)
      ) {
        return res.status(400).json({ error: "Invalid data" });
      }

      const doc = {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        timestamp: new Date(),
      };

      await db.collection("sensor_data").insertOne(doc);
      return res.status(200).json(doc);

    } else if (req.method === "GET") {
      const data = await db
        .collection("sensor_data")
        .find({})
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();
      return res.status(200).json(data);
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
}
