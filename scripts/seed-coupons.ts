import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { couponCodes } from "../worker/db/schema";

const codes = [
  "AILAWYER-FREE-001",
  "AILAWYER-FREE-002",
  "AILAWYER-FREE-003",
  "AILAWYER-FREE-004",
  "AILAWYER-FREE-005",
  "AILAWYER-FREE-006",
  "AILAWYER-FREE-007",
  "AILAWYER-FREE-008",
];

async function seedCoupons() {
  const dbPath = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/xyz.sqlite";
  
  console.log("🌱 Seeding coupon codes...");
  
  try {
    const client = createClient({
      url: `file:${dbPath}`,
    });
    
    const db = drizzle(client);

    for (const code of codes) {
      await db
        .insert(couponCodes)
        .values({
          code,
          used: false,
          planGranted: "lifetime_free",
        })
        .onConflictDoNothing();
      
      console.log(`✅ Added coupon: ${code}`);
    }

    console.log("\n✨ Successfully seeded 8 coupon codes!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding coupons:", error);
    process.exit(1);
  }
}

seedCoupons();
