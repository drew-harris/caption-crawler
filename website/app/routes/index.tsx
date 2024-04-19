import { createRoute } from "honox/factory";
import Counter from "../islands/counter";

export default createRoute(async (c) => {
  const name = c.req.query("name") ?? "Hono";
  // c.env.playlistQueue.send({
  //   test: "message",
  // });
  const result = await c.env.kv.get("tes");
  return c.render(
    <div class="bg-red-500">
      <h1>Hello, {result}!</h1>
      <Counter />
    </div>,
    { title: name },
  );
});
