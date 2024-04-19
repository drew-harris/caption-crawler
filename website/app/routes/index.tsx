import { createRoute } from "honox/factory";
import Counter from "../islands/counter";

export default createRoute(async (c) => {
  const name = c.req.query("name") ?? "Hono";
  c.env.playlistQueue.send({
    test: "message",
  });

  // const result = await c.env.kv.get("tes");
  // const webResponse = await c.env.worker.fetch("https://lsijef.com/log");
  // console.log(webResponse.status);

  return c.render(
    <div class="bg-red-500">
      {/* <h1>Hello, {webResponse.status}!</h1> */}
      <div>Working now</div>
      <Counter />
    </div>,
    { title: name },
  );
});
