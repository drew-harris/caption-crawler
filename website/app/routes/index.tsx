import "typed-htmx";

import { createRoute } from "honox/factory";
import Counter from "../islands/counter";

export default createRoute(async (c) => {
  const name = c.req.query("name") ?? "Hono";

  return c.render(
    <div class="p-3">
      <button
        class="p-2 bg-gray-300"
        hx-swap="outerHTML"
        preload="mouseover"
        hx-get="/hx"
      >
        Test
      </button>
    </div>,
    { title: name },
  );
});
