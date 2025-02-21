import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Website Monitoring Service Running..." });
});

// Health check
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Service is healthy" });
});

export default router;
