import { createRoute } from "honox/factory";
import { z } from "zod";
import { hxRender } from "../../middleware/hxRender";
import { hxValidate } from "../../validate";
import { ErrorMsg } from "../../components/ErrorMsg";

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
        <ErrorMsg>There was an error processing your playlist</ErrorMsg>,
      );
    }
  },
);
