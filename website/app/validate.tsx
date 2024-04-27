import { ZodSchema } from "zod";
import { validator } from "hono/validator";
import { ErrorMsg } from "./components/ErrorMsg";

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
        <ErrorMsg>There was an error validating the request.</ErrorMsg>,
      );
    }
    return parsed.data;
  });
  return val;
};
