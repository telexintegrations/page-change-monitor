import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import { checkWebsite } from "./services/monitorService";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/", routes);

app.get("/integration.json", (req, res) => {
  const baseUrl = `${
    req.headers["x-forwarded-proto"] || req.protocol
  }://${req.get("host")}`;

  res.json({
    data: {
      date: {
        created_at: "2025-02-19",
        updated_at: "2025-02-19",
      },
      descriptions: {
        app_name: "Website Change Monitor",
        app_description: "Monitors website content changes at intervals",
        app_logo:
          "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh5KIpZ8m7Z3lL-nn0vFK9MuDAcVbu6W-vlLDmKr9TzKEqgEG3bwchzlGuoI8Apuxafvp3nNjp-ZDQswDsxA416UZ_cu_wJRJ1mBiJUbN_9D0Cs_UFp2dlw9_ro3qqIWeTbnkJKp39kpeoe/s1600/watchdog-01.jpg",
        app_url: baseUrl,
        background_color: "#fff",
      },
      is_active: true,
      integration_category: "Monitoring & Logging",
      integration_type: "interval",
      key_features: [
        "Detects website content changes",
        "Sends notifications to Telex channel",
        "Runs at configured intervals",
      ],
      author: "David Umoru",
      settings: [
        {
          label: "website_url",
          type: "text",
          required: true,
          default: "https://example.com",
        },
        {
          label: "interval",
          type: "text",
          required: true,
          default: "*/5 * * * *",
        },
      ],
      target_url: "",
      tick_url: `${baseUrl}/tick`,
    },
  });
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
