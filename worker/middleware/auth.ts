import { createMiddleware } from "hono/factory";
import { createAuth } from "../auth";
import { createDb } from "../db";
import type { HonoContext } from "../types";

export const authMiddleware = createMiddleware(async (c, next) => {
  try {
    const auth = createAuth(c.env);
    const db = createDb(c.env.D1);
    
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    
    c.set("user", session?.user || null);
    c.set("session", session?.session || null);
    c.set("db", db);
  } catch (error) {
    console.error("[AUTH] Error:", error);
    c.set("user", null);
    c.set("session", null);
    c.set("db", createDb(c.env.D1));
  }
  
  return next();
});

export const authenticatedOnly = createMiddleware<HonoContext>(
  async (c, next) => {
    const session = c.get("session");
    if (!session) {
      return c.json({ message: "You are not authenticated" }, 401);
    }
    return next();
  }
);

export const requireRole = (role: string) =>
  createMiddleware<HonoContext>(async (c, next) => {
    const session = c.get("session");
    const user = c.get("user");

    if (!session) {
      return c.json({ message: "You are not authenticated" }, 401);
    }

    if (!user || user.role !== role) {
      return c.json({ message: "Forbidden" }, 403);
    }

    return next();
  });

export const requireAdmin = requireRole("admin");
