//@ts-nocheck
import { Context } from "hono";
import * as entry from "./entry.server";
import { stream } from "hono/streaming";
import { drewsRenderToStream } from "./streamer";
import { logger } from "~/logging";

export const handlePage = async (c: Context) => {
  c.header("Content-Type", "text/html; charset=utf-8");
  try {
    // TODO: Fix error
    // @ts-expect-error more hono context stuff
    const { app, router } = await entry.render(c.req.raw, c.var);
    // TODO: Getting closer
    if (router.state.redirect) {
      return c.redirect(router.state.redirect.href);
    }

    const { stream: ssrxStream, statusCode } = await drewsRenderToStream({
      app: () => app,
      req: c.req.raw,
    });

    let status = statusCode();
    if (router.hasNotFoundMatch() && status !== 500) status = 404;

    return stream(c, async (stream) => {
      stream.onAbort(() => {
        if (!ssrxStream.locked) {
          ssrxStream.cancel();
        }
      });

      if (ssrxStream.locked) {
        logger.error("Stream is locked, cannot proceed with operations");
        return;
      }

      const response = new Response(ssrxStream, { status });

      if (response.body) {
        await stream.pipe(response.body).catch((err) => {
          if (!ssrxStream.locked) {
            ssrxStream.cancel();
          }
        });
      }
    });
  } catch (err) {
    logger.error(err, "Server-side rendering failed:");
    throw err; // Rethrow to let Hono handle the error
  }
};
