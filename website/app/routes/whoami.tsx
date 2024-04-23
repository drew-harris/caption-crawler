import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
  return c.render(
    <div>
      <div>{c.var.user.id}</div>
    </div>,
  );
});
