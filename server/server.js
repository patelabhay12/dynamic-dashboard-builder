const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db, testConnection } = require("./config/db.js");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  credentials: true,
}));

app.use(bodyParser.json());


app.get("/api/layout", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT data FROM layout ORDER BY id DESC LIMIT 1"
    );

    if (results.length) {
      const data = results[0].data;
      // Check if data is already an object or needs parsing
      if (typeof data === 'string') {
        res.json(JSON.parse(data));
      } else {
        res.json(data || []);
      }
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching layout");
  }
});


app.post("/api/layout", async (req, res) => {
  try {

    const data = typeof req.body === 'string' 
      ? req.body 
      : JSON.stringify(req.body);

    await db.query(
      "INSERT INTO layout (data) VALUES (?)",
      [data]
    );

    res.json({ success: true, message: "Saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving layout", error: err.message });
  }
});


const startServer = async () => {
  await testConnection();
  app.listen(8080, () => {
    console.log("🚀 Server running on port 8080");
  });
};

startServer();