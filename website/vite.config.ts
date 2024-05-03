import honox from "honox/vite";
import client from "honox/vite/client";
import { defineConfig, loadEnv } from "vite";
import nodeServerPlugin from "./nodeServerPlugin";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, ".");
  console.log(env);

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
    return {
      clearScreen: false,
      plugins: [honox(), nodeServerPlugin()],
      // define: {
      //   ...Object.keys(env).reduce((prev, key) => {
      //     // @ts-ignore
      //     prev[`process.env.${key}`] = JSON.stringify(env[key]);
      //     return prev;
      //   }, {}),
      // },
      ssr: {
        define: {
          ...Object.keys(env).reduce((prev, key) => {
            // @ts-ignore
            prev[`process.env.${key}`] = JSON.stringify(env[key]);
            return prev;
          }, {}),
        },

        // postgres
        external: ["pg", "drizzle-orm/node-postgres", "dotenv", "bullmq"],
        target: "node",
        optimizeDeps: {
          include: ["drizzle-orm/node-postgres"],
        },
      },
    };
  }
});
