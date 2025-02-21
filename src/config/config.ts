import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  TELEX_WEBHOOK_URL: process.env.TELEX_WEBHOOK_URL || "",
  CHECKING_FREQUENCY: 5 * 60 * 1000,
  URL_TO_CHECK: "https://davidumoru.me/about",
};
