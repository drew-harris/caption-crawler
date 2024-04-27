import { Hono } from "hono";
import { MessageType, PossibleMessage } from "shared/types";
import { handlePlaylistIngest } from "./handlePlaylistIngest";

const app = new Hono<{
  Bindings: {
    kv: KVNamespace;
    ELASTIC_NODE: string;
    ELASTIC_PASSWORD: string;
    playlistQueue: Queue;
  };
}>();

app.get("/", async (c) => {
  c.json({ working: true });
});

app.post("/queue", async (c) => {
  console.log("queueing", await c.req.json());
  await c.env.playlistQueue.send(await c.req.json(), {
    contentType: "json",
  });
});

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    let messages = JSON.stringify(batch.messages);

    // Handle messages asynchronously
    let promises = batch.messages.map(async (message) => {
      const data = message.body as PossibleMessage;
      switch (data.type) {
        case MessageType.PLAYLIST_INGEST:
          const result = handlePlaylistIngest(message, data, env);
          return result;
          break;
        case MessageType.FAKE_MESSAGE:
          break;
        default:
          console.error("Unknown message type", data);
      }
    });

    const results = await Promise.all(promises);
    console.log("Results", results);
  },
};
