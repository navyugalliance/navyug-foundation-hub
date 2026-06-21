import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Load .env variables into process.env for local Vite server environment
const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const matched = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (matched) {
      const key = matched[1];
      let value = matched[2] || "";
      value = value.trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "api-server",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === "/api/register" && req.method === "POST") {
            try {
              const module = await server.ssrLoadModule("./api/register.ts");
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", async () => {
                try {
                  const vercelReq = {
                    method: "POST",
                    body: JSON.parse(body),
                    headers: req.headers,
                  };
                  const vercelRes = {
                    setHeader(name: string, value: string) {
                      res.setHeader(name, value);
                      return this;
                    },
                    status(code: number) {
                      res.statusCode = code;
                      return this;
                    },
                    json(data: any) {
                      res.setHeader("Content-Type", "application/json");
                      res.end(JSON.stringify(data));
                      return this;
                    },
                    end(data?: any) {
                      res.end(data);
                      return this;
                    },
                  };
                  await module.default(vercelReq, vercelRes);
                } catch (err: any) {
                  console.error("Vite API Request Processing Error:", err);
                  res.statusCode = 500;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ success: false, message: err.message }));
                }
              });
            } catch (err: any) {
              console.error("Vite API Server Loader Error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          } else {
            next();
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
