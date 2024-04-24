import { jsxRenderer } from "hono/jsx-renderer";

export const hxRender = jsxRenderer(({ children, title }, context) => {
  return <>{children}</>;
});
