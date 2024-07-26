import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
);

const prefixes = {
  user: "us",
  jobs: "job",
  collection: "col",
  content: "c",
  video: "v",
} as const;

export function createId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], nanoid(16)].join("_");
}
