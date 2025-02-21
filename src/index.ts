import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";
import { diffWords } from "diff";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGO_URI as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Webpage Schema
const webpageSchema = new mongoose.Schema({
  url: String,
  content: String,
  lastChecked: { type: Date, default: Date.now },
});
const Webpage = mongoose.model("Webpage", webpageSchema);

// Configuration
const urlToCheck = "https://davidumoru.me/about";
const checkingFrequency = 5 * 1000;
const TELEX_WEBHOOK_URL = process.env.TELEX_WEBHOOK_URL || "";

// Function to check website changes
const checkWebsite = async () => {
  try {
    const response = await axios.get(urlToCheck);
    const newContent: string = response.data;

    if (!newContent) {
      console.error("Error: Request returned an empty body.");
      return;
    }

    const existingRecord = await Webpage.findOne({ url: urlToCheck });

    if (!existingRecord) {
      // If no record exists, store the first version
      await new Webpage({ url: urlToCheck, content: newContent }).save();
      console.log("First-time content stored.");
      return;
    }

    const oldContent = existingRecord.content;

    if (newContent !== oldContent) {
      // Detect changes
      const changes = diffWords(oldContent || "", newContent || "")
        .map((part) =>
          part.added
            ? `🔼 Added: ${part.value}`
            : part.removed
            ? `🔽 Removed: ${part.value}`
            : ""
        )
        .filter(Boolean)
        .join("\n");

      // Send notification if changes exist
      if (changes) {
        sendTelexNotification(
          `🔥 Changes detected in ${urlToCheck}:\n${changes}`
        );
      }

      // Update stored content
      existingRecord.content = newContent;
      existingRecord.lastChecked = new Date();
      await existingRecord.save();
    }
  } catch (error) {
    console.error(`Request Error: ${error}`);
  }
};

// Function to send notifications via Telex
const sendTelexNotification = async (message: string): Promise<void> => {
  try {
    const data = {
      event_name: "Website Monitor",
      message,
      status: "success",
      username: "Watchdog",
    };

    const response = await axios.post(TELEX_WEBHOOK_URL, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("Telex Notification Sent:", response.data);
  } catch (error: any) {
    console.error(
      "Telex Notification Error:",
      error?.response?.data || error.message
    );
  }
};

// Start monitoring at the specified interval
setInterval(checkWebsite, checkingFrequency);

// Express Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Website Monitoring Service Running..." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
