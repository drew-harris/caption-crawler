export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    console.log(`got request on path: ${request.url}`);
    await env.kv.put("tes", "tes");
    return new Response("Hello World");
  },
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    let messages = JSON.stringify(batch.messages);
    console.log(`consumed from our queue: ${messages}`);
  },
};
