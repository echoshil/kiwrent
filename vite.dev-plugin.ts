import { Plugin } from "vite";

export function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      console.log("[EXPRESS] Initializing Express server...");
      try {
        const { createServer } = await import("./server");
        const app = await createServer();
        console.log("[EXPRESS] Express server initialized, adding middleware");
        server.middlewares.use(app);
        console.log("[EXPRESS] Express middleware added");
      } catch (err) {
        console.error("[EXPRESS] Error initializing Express:", err);
      }
      return undefined;
    },
  };
}
