import axios from "axios";

export const sendTelexNotification = async (
  returnUrl: string,
  message: string
): Promise<void> => {
  try {
    const data = {
      message,
      username: "Website Monitor",
      event_name: "Website Change Detection",
      status: "success",
    };

    const response = await axios.post(returnUrl, data, {
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
