import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import routes from "./routes";
import { startMonitoring } from "./services/monitorService";

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", routes);

// Connect to Database
connectDB();

// Start Monitoring
startMonitoring();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
