import axios from "axios";
import { diffWords } from "diff";
import { Webpage } from "../models/webpage";
import { sendTelexNotification } from "./notificationService";

export const checkWebsite = async (url: string, returnUrl: string) => {
  try {
    const response = await axios.get(url);
    const newContent: string = response.data;

    if (!newContent) {
      console.error("Error: Request returned an empty body.");
      return;
    }

    const existingRecord = await Webpage.findOne({ url });

    if (!existingRecord) {
      await new Webpage({ url, content: newContent }).save();
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
          returnUrl,
          `🔥 Changes detected in ${url}:\n${changes}`
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
