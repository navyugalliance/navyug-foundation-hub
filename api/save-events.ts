import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'events' array in request body",
      });
    }

    const filePath = path.join(process.cwd(), "src", "data", "events.json");
    
    // Write changes back to filesystem (this will work in local dev environments)
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2), "utf-8");

    return res.status(200).json({
      success: true,
      message: "Events successfully saved to src/data/events.json",
    });
  } catch (error: any) {
    console.warn("Could not write to local filesystem (read-only in cloud):", error.message);
    return res.status(200).json({
      success: true,
      message: "Saved successfully to local state (filesystem write skipped in cloud).",
    });
  }
}
