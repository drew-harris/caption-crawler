import { Context, Env, Hono, Next } from "hono";
import { createNewUser } from "../serverUtils/users";
import { getCookie, setCookie } from "hono/cookie";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { Lucia } from "lucia";
import { logger } from "~/logging";
import { google } from ".";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { TB_users } from "db";

export const authMiddleware = async (c: Context<Env>, next: Next) => {
  const cookie = getCookie(c, c.var.auth.sessionCookieName);
  if (cookie) {
    const parsed = c.var.auth.readSessionCookie(cookie);
    if (parsed) {
      const session = await c.var.auth.validateSession(parsed);
      if (session.session) {
        c.set("user", session.user);
      }
    }
  }
  await next();
};

export const createUserWithCookie = async (
  db: PostgresJsDatabase,
  auth: Lucia,
  req: Context<Env>,
) => {
  logger.info("Creating user with cookie");
  const user = await createNewUser(db);
  const session = await auth.createSession(user.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);

  setCookie(req, auth.sessionCookieName, sessionCookie.serialize());
  return user;
};

const authRouter = new Hono<Env>();

authRouter.get("/login/google", async (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
  ]);

  setCookie(c, "google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "Lax",
  });
  setCookie(c, "google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "Lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
});

authRouter.get("/callback/google", async (c) => {
  const { code, state } = c.req.query();
  const storedState = getCookie(c, "google_oauth_state");
  const codeVerifier = getCookie(c, "google_code_verifier");

  if (!code || !state || !storedState || !codeVerifier) {
    return c.text("Invalid request", 400);
  }

  if (state !== storedState) {
    return c.text("Invalid state", 400);
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const idToken = tokens.idToken;
    if (!idToken()) {
      return c.text("Invalid ID token", 400);
    }

    const claims = decodeIdToken(idToken()) as {
      sub: string;
      name: string;
    };
    const googleUserId = claims.sub;

    let user = await c.var.db
      .select()
      .from(TB_users)
      .where(eq(TB_users.googleId, googleUserId))
      .then((a) => a.at(0));

    if (!user) {
      // Create new user
      user = await createUserWithCookie(c.var.db, c.var.auth, c);
    }

    // Update user with Google info
    // Create session for existing user
    await c.var.db
      .update(TB_users)
      .set({
        googleId: googleUserId,
      })
      .where(eq(TB_users.id, user.id));

    const session = await c.var.auth.createSession(user.id, {});
    const sessionCookie = c.var.auth.createSessionCookie(session.id);
    setCookie(c, c.var.auth.sessionCookieName, sessionCookie.serialize());
    return c.redirect("/");
  } catch (e) {
    logger.error("Error in Google callback", e);
    return c.text("Authentication failed", 400);
  }
});

export { authRouter };
