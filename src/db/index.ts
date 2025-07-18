import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return undefined;
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  return drizzle(queryClient);
};

export default setup();
