import axios from "axios";
import { diffWords } from "diff";
import { Webpage } from "../models/webpage";
import { sendTelexNotification } from "./notificationService";
import { config } from "../config/config";

export const checkWebsite = async () => {
  try {
    const response = await axios.get(config.URL_TO_CHECK);
    const newContent: string = response.data;

    if (!newContent) {
      console.error("Error: Request returned an empty body.");
      return;
    }

    const existingRecord = await Webpage.findOne({ url: config.URL_TO_CHECK });

    if (!existingRecord) {
      await new Webpage({
        url: config.URL_TO_CHECK,
        content: newContent,
      }).save();
      console.log("First-time content stored.");
      return;
    }

    const oldContent = existingRecord.content;

    if (newContent !== oldContent) {
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

      if (changes) {
        sendTelexNotification(
          `🔥 Changes detected in ${config.URL_TO_CHECK}:\n${changes}`
        );
      }

      existingRecord.content = newContent;
      existingRecord.lastChecked = new Date();
      await existingRecord.save();
    }
  } catch (error) {
    console.error(`Request Error: ${error}`);
  }
};

export const startMonitoring = () => {
  setInterval(checkWebsite, config.CHECKING_FREQUENCY);
};
