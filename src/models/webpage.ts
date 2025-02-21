import mongoose from "mongoose";

const webpageSchema = new mongoose.Schema({
  url: String,
  content: String,
  lastChecked: { type: Date, default: Date.now },
});

export const Webpage = mongoose.model("Webpage", webpageSchema);
