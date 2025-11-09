import { Hono } from "hono";
import type { HonoContext } from "../types";
import { adminRoutes } from "./admin-routes";
import { aiRoutes } from "./ai-routes";
import { couponRoutes } from "./coupon-routes";

export const apiRoutes = new Hono<HonoContext>()
.route("/admin", adminRoutes)
.route("/ai", aiRoutes)
.route("/coupons", couponRoutes)