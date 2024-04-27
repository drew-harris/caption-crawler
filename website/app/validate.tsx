import { ZodSchema, z } from "zod";
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

export const hxValidate = <S extends ZodSchema>(type: InputType, schema: S) => {
  const val = validator(type, (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.render(
        <ErrorMsg>There was an error validating the request.</ErrorMsg>,
      );
    }
    return parsed.data as z.infer<S>;
  });
  return val;
};
