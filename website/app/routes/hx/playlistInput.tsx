import { createRoute } from "honox/factory";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { hxRender } from "../../middleware/hxRender";
import { validator } from "hono/validator";
import { hxValidate } from "../../validate";

const inputSchema = z.object({
  url: z.string().url(),
});

// Main initial playlist ingest point
export const POST = createRoute(
  hxRender,
  hxValidate("form", inputSchema),
  async (c) => {
    try {
      const { url } = await c.req.valid("form");
      return c.render(<div>Testing</div>);
    } catch (e) {
      return c.render(
        <div>There was an error processing the playlist. Please try later</div>,
      );
    }
  },
);
