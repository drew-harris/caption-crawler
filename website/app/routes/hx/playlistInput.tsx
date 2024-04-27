import { createRoute } from "honox/factory";
import { hxRender } from "../../middleware/hxRender";

// Main initial playlist ingest point
export default createRoute(hxRender, (c) => {
  return c.render(<div>Testing</div>);
});
