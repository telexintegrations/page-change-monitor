import axios from "axios";
import { config } from "../config/config";

export const sendTelexNotification = async (message: string): Promise<void> => {
  try {
    const data = {
      event_name: "Website Monitor",
      message,
      status: "success",
      username: "Watchdog",
    };

    const response = await axios.post(config.TELEX_WEBHOOK_URL, data, {
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
