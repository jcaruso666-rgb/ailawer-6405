import { autumn } from "autumn-js/better-auth";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";

export const createAuth = (env: Cloudflare.Env) => {
  const db = drizzle(env.D1, { schema, logger: false }) as any;

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      usePlural: true,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    secret: env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",
    plugins: [autumn(), admin()],
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const firstName = user.name?.split(" ")[0] || "";
            const lastName = user.name?.split(" ")[1] || "";
            const role = user.email === env.ADMIN_EMAIL ? "admin" : "user";

            return {
              data: {
                ...user,
                firstName,
                lastName,
                role,
              },
            };
          },
        },
      },
    },
  });
};
