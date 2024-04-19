import pages from "@hono/vite-cloudflare-pages";
import honox from "honox/vite";
import adapter from "@hono/vite-dev-server/cloudflare";
import client from "honox/vite/client";
import { defineConfig } from "vite";
import { getPlatformProxy } from "wrangler";

export default defineConfig(async ({ mode, command }) => {
  const proxy = await getPlatformProxy();
  console.log(proxy.env);
  if (mode === "client") {
    return {
      plugins: [client()],
      clearScreen: false,
      build: {
        rollupOptions: {
          input: ["/app/style.css"],
          output: {
            assetFileNames: "static/assets/[name].[ext]",
          },
        },
      },
    };
  } else {
    const devAdapter =
      command == "serve"
        ? adapter({
            proxy: {
              persist: {
                path: "../worker/.wrangler/state/v3",
              },
            },
          })
        : undefined;

    return {
      plugins: [
        honox({
          devServer: {
            // injectClientScript: false //Experiment with this
            adapter: devAdapter,
          },
        }),
        pages(),
      ],
    };
  }
});
