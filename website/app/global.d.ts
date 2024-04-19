import {} from "hono";

type Head = {
  title?: string;
};

declare module "hono" {
  interface Env {
    Bindings: GenEnv;
  }
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head?: Head,
    ): Response | Promise<Response>;
  }
}
