import { ZodSchema } from "zod";
import { validator } from "hono/validator";

type InputType =
  | "form"
  | "json"
  | "header"
  | "param"
  | "cookie"
  | "form"
  | "query";

export const hxValidate = (type: InputType, schema: ZodSchema) => {
  const val = validator(type, (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.render(
        <div class="bg-red-200 p-2 border border-red-500">
          There was an error submitting data.
        </div>,
      );
    }
    return parsed.data;
  });
  return val;
};
