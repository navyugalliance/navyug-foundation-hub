import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

// Helper function to commit a file directly to GitHub via REST API
async function commitToGitHub(
  repo: string,
  filePath: string,
  contentBase64: string,
  message: string,
  branch: string,
  headers: any
) {
  let sha: string | undefined = undefined;
  try {
    const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;
    const res = await fetch(url, { headers });
    if (res.status === 200) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch (e) {
    console.warn(`Could not retrieve file SHA for ${filePath} (expected if new file):`, e);
  }

  const putUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const putBody: any = {
    message,
    content: contentBase64,
    branch
  };
  if (sha) {
    putBody.sha = sha;
  }

  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(putBody)
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub API commit failed for ${filePath}: ${errText}`);
  }
}

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

    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || "navyugalliance/navyug-foundation-hub";
    const githubBranch = process.env.GITHUB_BRANCH || "main";

    if (githubToken) {
      console.log(`[Save Events] Syncing to GitHub repo: ${githubRepo}, branch: ${githubBranch}`);
      const headers = {
        "Authorization": `token ${githubToken}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "navyug-foundation-hub-cms",
        "Content-Type": "application/json"
      };

      // Process images and push new ones directly to GitHub
      const processedEvents = [];
      for (const event of events) {
        if (event.images && Array.isArray(event.images)) {
          const processedImages = [];
          for (const img of event.images) {
            if (img.src && img.src.startsWith("data:image/")) {
              // It's a base64 string! Let's extract extension and base64 data
              const matches = img.src.match(/^data:image\/([A-Za-z0-9+]+);base64,(.+)$/);
              if (matches && matches.length === 3) {
                const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
                const base64Data = matches[2];
                
                // Generate unique name
                const fileName = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
                const gitHubImagePath = `public/uploads/${fileName}`;

                // Push image to GitHub
                await commitToGitHub(
                  githubRepo,
                  gitHubImagePath,
                  base64Data,
                  `Upload image: ${fileName} [skip ci]`,
                  githubBranch,
                  headers
                );

                processedImages.push({
                  ...img,
                  src: `/uploads/${fileName}`
                });
                continue;
              }
            }
            processedImages.push(img);
          }
          processedEvents.push({
            ...event,
            images: processedImages
          });
        } else {
          processedEvents.push(event);
        }
      }

      // Push updated events.json to GitHub
      const jsonContent = JSON.stringify(processedEvents, null, 2);
      const jsonBase64 = Buffer.from(jsonContent, "utf-8").toString("base64");
      
      await commitToGitHub(
        githubRepo,
        "src/data/events.json",
        jsonBase64,
        "Update events database from CMS journal",
        githubBranch,
        headers
      );

      return res.status(200).json({
        success: true,
        message: "Events and image uploads successfully saved and committed directly to GitHub!",
      });
    } else {
      // Local fallback
      console.log("[Save Events] GITHUB_TOKEN not found. Saving to local filesystem.");
      try {
        const filePath = path.join(process.cwd(), "src", "data", "events.json");
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const processedEvents = events.map((event: any) => {
          if (event.images && Array.isArray(event.images)) {
            const processedImages = event.images.map((img: any) => {
              if (img.src && img.src.startsWith("data:image/")) {
                const matches = img.src.match(/^data:image\/([A-Za-z0-9+]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                  const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
                  const base64Data = matches[2];
                  const buffer = Buffer.from(base64Data, "base64");
                  
                  const fileName = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
                  const destPath = path.join(uploadsDir, fileName);
                  
                  fs.writeFileSync(destPath, buffer);
                  return {
                    ...img,
                    src: `/uploads/${fileName}`
                  };
                }
              }
              return img;
            });
            return {
              ...event,
              images: processedImages
            };
          }
          return event;
        });

        fs.writeFileSync(filePath, JSON.stringify(processedEvents, null, 2), "utf-8");

        return res.status(200).json({
          success: true,
          message: "Events saved locally to src/data/events.json",
        });
      } catch (err: any) {
        console.warn("Could not save to local filesystem (expected in Vercel cloud environment):", err.message);
        return res.status(200).json({
          success: true,
          message: "Saved successfully to browser storage (cloud filesystem write skipped). Please configure GITHUB_TOKEN in Vercel settings to persist permanently.",
        });
      }
    }
  } catch (error: any) {
    console.error("Save Events Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred while saving events",
    });
  }
}
