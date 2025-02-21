import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Configuration
const urlToCheck = "https://davidumoru.me/about";
const elementsToSearchFor: string[] = [
  "people with short attention span",
  "imageYouWantToCheckItsExistence.png",
];
const checkingFrequency = 5 * 1000;
const TELEX_WEBHOOK_URL = process.env.TELEX_WEBHOOK_URL || "";

// Function to check website changes
const checkWebsite = async () => {
  try {
    const response = await axios.get(urlToCheck);
    const body: string = response.data;

    if (!body) {
      console.error("Error: Request returned an empty body.");
      return;
    }

    // Check if any of the elements exist on the page
    if (elementsToSearchFor.some((el) => body.includes(el))) {
      sendTelexNotification(`🔥 Change detected in ${urlToCheck}`);
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
