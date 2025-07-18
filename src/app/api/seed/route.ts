import db from "@/db";
import { advocates } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

/**
 * Seeds the database with initial data
 * @constructor
 */
export async function POST() {
  const dbWritableContext = db as PostgresJsDatabase;
  const records = await dbWritableContext
    .insert(advocates)
    .values(advocateData)
    .returning();

  return Response.json({ advocates: records });
}
