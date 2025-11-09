import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { couponCodes } from "../db/schema";

export const couponRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  .post(
    "/validate",
    zValidator(
      "json",
      z.object({
        code: z.string().min(1),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");

      if (!user) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
      }

      const { code } = c.req.valid("json");

      const normalizedCode = code.trim().toUpperCase();

      const [coupon] = await db
        .select()
        .from(couponCodes)
        .where(eq(couponCodes.code, normalizedCode))
        .limit(1);

      if (!coupon) {
        return c.json(
          {
            success: false,
            message: "Invalid coupon code",
          },
          400
        );
      }

      if (coupon.used) {
        return c.json(
          {
            success: false,
            message: "This coupon code has already been used",
          },
          400
        );
      }

      await db
        .update(couponCodes)
        .set({
          used: true,
          usedBy: user.id,
          usedAt: new Date(),
        })
        .where(eq(couponCodes.code, normalizedCode));

      return c.json({
        success: true,
        message: "Coupon code applied successfully! You now have lifetime free access.",
        planGranted: coupon.planGranted,
      });
    }
  )
  .get("/check/:code", async (c) => {
    const db = c.get("db");
    const code = c.req.param("code").trim().toUpperCase();

    const [coupon] = await db
      .select()
      .from(couponCodes)
      .where(eq(couponCodes.code, code))
      .limit(1);

    if (!coupon) {
      return c.json({ valid: false, message: "Coupon code not found" });
    }

    if (coupon.used) {
      return c.json({ valid: false, message: "Coupon already used" });
    }

    return c.json({ 
      valid: true, 
      message: "Valid coupon code", 
      planGranted: coupon.planGranted 
    });
  });
