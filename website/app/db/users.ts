import { userTable } from "db";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { createId } from "../ids";

export const createNewUser = async (db: DrizzleD1Database) => {
  const user = await db
    .insert(userTable)
    .values([
      {
        id: createId("user"),
        createdAt: new Date(),
      },
    ])
    .returning()
    .then((a) => a.at(0));
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
};
