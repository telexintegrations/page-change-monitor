import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import { checkWebsite } from "./services/monitorService";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/integration.json", (req, res) => {
  res.sendFile(__dirname + "/integration.json");
});

app.post("/tick", async (req, res): Promise<any> => {
  const { return_url, settings } = req.body;

  if (!return_url || !settings) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const websiteUrl = settings.find(
    (s: any) => s.label === "website_url"
  )?.default;

  if (!websiteUrl) {
    return res.status(400).json({ error: "Website URL is required" });
  }

  console.log(`Checking website: ${websiteUrl}`);
  await checkWebsite(websiteUrl, return_url);
  res.status(202).json({ status: "accepted" });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
