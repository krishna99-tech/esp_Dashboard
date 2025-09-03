import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("esp32_dashboard"); // DB name
  const collection = db.collection("sensor_data"); // collection name

  if (req.method === "POST") {
    const { temperature, humidity } = req.body;
    const timestamp = new Date();

    if (typeof temperature !== "number" || typeof humidity !== "number") {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Insert data
    await collection.insertOne({ temperature, humidity, timestamp });

    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    // Get last 10 rows, sorted by timestamp descending
    const data = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    return res.status(200).json(data);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
