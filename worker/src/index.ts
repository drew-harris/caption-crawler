import { Hono } from "hono";
import { MessageType, PossibleMessage } from "shared/types";

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
    for (let message of batch.messages) {
      const data = message.body as PossibleMessage;
      switch (data.type) {
        case MessageType.PLAYLIST_INGEST:
          break;
        case MessageType.FAKE_MESSAGE:
          break;
        default:
          console.error("Unknown message type", data);
      }
    }
  },
};
