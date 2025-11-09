import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth";
import { apiRoutes } from "./routes";
import { createAuth } from "./auth";
import type { HonoContext } from "./types";

const authApp = new Hono<HonoContext>();
authApp.all("*", async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

const app = new Hono<HonoContext>()
  .use("*", cors({
    origin: (origin) => origin || "*",
    credentials: true,
    allowHeaders: ["*"],
    allowMethods: ["*"],
  }))
  .onError((err, c) => {
    console.error("[ERROR]", err);
    return c.json({ error: "Internal Server Error" }, 500);
  })
  .route("/api/auth", authApp)
  .use("*", authMiddleware)
  .route("/api", apiRoutes)
  .all("*", async (c) => {
    const url = new URL(c.req.url);
    const isHtmlRoute =
      c.req.method === "GET" &&
      (!url.pathname.includes(".") || url.pathname.endsWith("/"));

    if (isHtmlRoute) {
      const indexUrl = new URL("/index.html", url.origin);
      const req = new Request(indexUrl.toString(), c.req.raw);
      const resp = await c.env.ASSETS.fetch(req);
      const out = new Response(resp.body, resp);
      out.headers.set("Content-Type", "text/html; charset=utf-8");
      out.headers.delete("Content-Disposition");
      return out;
    }
    return c.env.ASSETS.fetch(c.req.raw);
  });

export type AppType = typeof apiRoutes;
export default app;
