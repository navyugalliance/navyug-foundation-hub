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
          if (req.url && req.url.startsWith("/api/")) {
            console.log(`[Vite API Server] Incoming request: ${req.method} ${req.url}`);
            const apiName = req.url.slice(5).split("?")[0];
            const apiPath = `./api/${apiName}.ts`;
            const absoluteApiPath = path.resolve(__dirname, apiPath);
            console.log(`[Vite API Server] Target file: ${absoluteApiPath}`);
            
            if (fs.existsSync(absoluteApiPath)) {
              console.log(`[Vite API Server] Found API handler file.`);
              try {
                const module = await server.ssrLoadModule(apiPath);
                
                // For OPTIONS or GET requests, we can execute the handler immediately
                if (req.method === "OPTIONS" || req.method === "GET" || req.method === "DELETE") {
                  console.log(`[Vite API Server] Running handler immediately for method: ${req.method}`);
                  const vercelReq = {
                    method: req.method,
                    body: {},
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
                  return;
                }

                // Defensive check: if body is already parsed by preceding middleware
                if ((req as any).body !== undefined) {
                  console.log("[Vite API Server] Body already parsed by a preceding middleware.");
                  const vercelReq = {
                    method: req.method,
                    body: (req as any).body,
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
                  return;
                }

                let body = "";
                req.on("data", (chunk) => {
                  body += chunk;
                  console.log(`[Vite API Server] Received chunk of size: ${chunk.length}`);
                });
                req.on("end", async () => {
                  console.log(`[Vite API Server] Finished reading request body stream. Total length: ${body.length}`);
                  try {
                    const parsedBody = body ? JSON.parse(body) : {};
                    const vercelReq = {
                      method: req.method,
                      body: parsedBody,
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
                    console.error("[Vite API Server] Body Parse/Execution Error:", err);
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ success: false, message: err.message }));
                  }
                });
              } catch (err: any) {
                console.error("[Vite API Server] Server Loader Error:", err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: false, message: err.message }));
              }
            } else {
              console.log(`[Vite API Server] API handler file does not exist on disk.`);
              next();
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
