import { customAlphabet } from "nanoid";
export const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
);

const prefixes = {
  user: "us",
  jobs: "job",
} as const;

export function createId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], nanoid(16)].join("_");
}
