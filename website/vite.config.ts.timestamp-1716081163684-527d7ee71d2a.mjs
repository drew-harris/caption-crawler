// vite.config.ts
import honox from "file:///Users/drew/programs/caption-crawler/node_modules/.pnpm/honox@0.1.15_hono@4.2.4/node_modules/honox/dist/vite/index.js";
import client from "file:///Users/drew/programs/caption-crawler/node_modules/.pnpm/honox@0.1.15_hono@4.2.4/node_modules/honox/dist/vite/client.js";
import { defineConfig, loadEnv } from "file:///Users/drew/programs/caption-crawler/node_modules/.pnpm/vite@5.2.8_@types+node@20.12.8_terser@5.31.0/node_modules/vite/dist/node/index.js";

// nodeServerPlugin.ts
import { builtinModules } from "module";
var nodeServerPlugin = () => {
  const virtualEntryId = "virtual:node-server-entry-module";
  const resolvedVirtualEntryId = "\0" + virtualEntryId;
  return {
    name: "@hono/vite-node-server",
    resolveId(id) {
      if (id === virtualEntryId) {
        return resolvedVirtualEntryId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualEntryId) {
        return `import { Hono } from 'hono'
        import { serveStatic } from '@hono/node-server/serve-static'
        import { serve } from '@hono/node-server'
        
        const worker = new Hono()
        worker.use('/static/*',   serveStatic({root: './dist'}))
        
        const modules = import.meta.glob(['/app/server.ts'], { import: 'default', eager: true })
        for (const [, app] of Object.entries(modules)) {
          if (app) {
            worker.route('/', app)
            worker.notFound(app.notFoundHandler)
          }
        }
        
        serve({ ...worker, port: 3000 }, info => {
          console.log('Listening on http://localhost:'+info.port)
        })`;
      }
    },
    config: async () => {
      return {
        build: {
          outDir: "./dist",
          emptyOutDir: false,
          minify: true,
          ssr: true,
          rollupOptions: {
            external: [...builtinModules, /^node:/],
            input: virtualEntryId,
            output: {
              entryFileNames: "server.mjs"
            }
          }
        }
      };
    }
  };
};
var nodeServerPlugin_default = nodeServerPlugin;

// vite.config.ts
var vite_config_default = defineConfig(({ mode, command }) => {
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
            assetFileNames: "static/assets/[name].[ext]"
          }
        }
      }
    };
  } else {
    return {
      clearScreen: false,
      plugins: [honox(), nodeServerPlugin_default()],
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
            prev[`process.env.${key}`] = JSON.stringify(env[key]);
            return prev;
          }, {})
        },
        // postgres
        external: ["pg", "drizzle-orm/node-postgres", "dotenv", "bullmq"],
        target: "node",
        optimizeDeps: {
          include: ["drizzle-orm/node-postgres"]
        }
      }
    };
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibm9kZVNlcnZlclBsdWdpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3L3Byb2dyYW1zL2NhcHRpb24tY3Jhd2xlci93ZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJldy9wcm9ncmFtcy9jYXB0aW9uLWNyYXdsZXIvd2Vic2l0ZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJldy9wcm9ncmFtcy9jYXB0aW9uLWNyYXdsZXIvd2Vic2l0ZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBob25veCBmcm9tIFwiaG9ub3gvdml0ZVwiO1xuaW1wb3J0IGNsaWVudCBmcm9tIFwiaG9ub3gvdml0ZS9jbGllbnRcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgbm9kZVNlcnZlclBsdWdpbiBmcm9tIFwiLi9ub2RlU2VydmVyUGx1Z2luXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlLCBjb21tYW5kIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBcIi5cIik7XG4gIGNvbnNvbGUubG9nKGVudik7XG5cbiAgaWYgKG1vZGUgPT09IFwiY2xpZW50XCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGx1Z2luczogW2NsaWVudCgpXSxcbiAgICAgIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICBpbnB1dDogW1wiL2FwcC9zdHlsZS5jc3NcIl0sXG4gICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBhc3NldEZpbGVOYW1lczogXCJzdGF0aWMvYXNzZXRzL1tuYW1lXS5bZXh0XVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgICAgIHBsdWdpbnM6IFtob25veCgpLCBub2RlU2VydmVyUGx1Z2luKCldLFxuICAgICAgLy8gZGVmaW5lOiB7XG4gICAgICAvLyAgIC4uLk9iamVjdC5rZXlzKGVudikucmVkdWNlKChwcmV2LCBrZXkpID0+IHtcbiAgICAgIC8vICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAvLyAgICAgcHJldltgcHJvY2Vzcy5lbnYuJHtrZXl9YF0gPSBKU09OLnN0cmluZ2lmeShlbnZba2V5XSk7XG4gICAgICAvLyAgICAgcmV0dXJuIHByZXY7XG4gICAgICAvLyAgIH0sIHt9KSxcbiAgICAgIC8vIH0sXG4gICAgICBzc3I6IHtcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgLi4uT2JqZWN0LmtleXMoZW52KS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcHJldltgcHJvY2Vzcy5lbnYuJHtrZXl9YF0gPSBKU09OLnN0cmluZ2lmeShlbnZba2V5XSk7XG4gICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICB9LCB7fSksXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcG9zdGdyZXNcbiAgICAgICAgZXh0ZXJuYWw6IFtcInBnXCIsIFwiZHJpenpsZS1vcm0vbm9kZS1wb3N0Z3Jlc1wiLCBcImRvdGVudlwiLCBcImJ1bGxtcVwiXSxcbiAgICAgICAgdGFyZ2V0OiBcIm5vZGVcIixcbiAgICAgICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAgICAgaW5jbHVkZTogW1wiZHJpenpsZS1vcm0vbm9kZS1wb3N0Z3Jlc1wiXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kcmV3L3Byb2dyYW1zL2NhcHRpb24tY3Jhd2xlci93ZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHJldy9wcm9ncmFtcy9jYXB0aW9uLWNyYXdsZXIvd2Vic2l0ZS9ub2RlU2VydmVyUGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kcmV3L3Byb2dyYW1zL2NhcHRpb24tY3Jhd2xlci93ZWJzaXRlL25vZGVTZXJ2ZXJQbHVnaW4udHNcIjtpbXBvcnQgeyBidWlsdGluTW9kdWxlcyB9IGZyb20gXCJtb2R1bGVcIjtcbmltcG9ydCB0eXBlIHsgUGx1Z2luLCBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcblxuLy8gRlJPTTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbGFpc28vY2FhOGY4ZWExODQ1MTc2M2I3MGM5YzhhZjk4MTUyMzBcbmV4cG9ydCBjb25zdCBub2RlU2VydmVyUGx1Z2luID0gKCk6IFBsdWdpbiA9PiB7XG4gIGNvbnN0IHZpcnR1YWxFbnRyeUlkID0gXCJ2aXJ0dWFsOm5vZGUtc2VydmVyLWVudHJ5LW1vZHVsZVwiO1xuICBjb25zdCByZXNvbHZlZFZpcnR1YWxFbnRyeUlkID0gXCJcXDBcIiArIHZpcnR1YWxFbnRyeUlkO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJAaG9uby92aXRlLW5vZGUtc2VydmVyXCIsXG4gICAgcmVzb2x2ZUlkKGlkKSB7XG4gICAgICBpZiAoaWQgPT09IHZpcnR1YWxFbnRyeUlkKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlZFZpcnR1YWxFbnRyeUlkO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgbG9hZChpZCkge1xuICAgICAgaWYgKGlkID09PSByZXNvbHZlZFZpcnR1YWxFbnRyeUlkKSB7XG4gICAgICAgIHJldHVybiBgaW1wb3J0IHsgSG9ubyB9IGZyb20gJ2hvbm8nXG4gICAgICAgIGltcG9ydCB7IHNlcnZlU3RhdGljIH0gZnJvbSAnQGhvbm8vbm9kZS1zZXJ2ZXIvc2VydmUtc3RhdGljJ1xuICAgICAgICBpbXBvcnQgeyBzZXJ2ZSB9IGZyb20gJ0Bob25vL25vZGUtc2VydmVyJ1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgd29ya2VyID0gbmV3IEhvbm8oKVxuICAgICAgICB3b3JrZXIudXNlKCcvc3RhdGljLyonLCAgIHNlcnZlU3RhdGljKHtyb290OiAnLi9kaXN0J30pKVxuICAgICAgICBcbiAgICAgICAgY29uc3QgbW9kdWxlcyA9IGltcG9ydC5tZXRhLmdsb2IoWycvYXBwL3NlcnZlci50cyddLCB7IGltcG9ydDogJ2RlZmF1bHQnLCBlYWdlcjogdHJ1ZSB9KVxuICAgICAgICBmb3IgKGNvbnN0IFssIGFwcF0gb2YgT2JqZWN0LmVudHJpZXMobW9kdWxlcykpIHtcbiAgICAgICAgICBpZiAoYXBwKSB7XG4gICAgICAgICAgICB3b3JrZXIucm91dGUoJy8nLCBhcHApXG4gICAgICAgICAgICB3b3JrZXIubm90Rm91bmQoYXBwLm5vdEZvdW5kSGFuZGxlcilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNlcnZlKHsgLi4ud29ya2VyLCBwb3J0OiAzMDAwIH0sIGluZm8gPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdMaXN0ZW5pbmcgb24gaHR0cDovL2xvY2FsaG9zdDonK2luZm8ucG9ydClcbiAgICAgICAgfSlgO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29uZmlnOiBhc3luYyAoKTogUHJvbWlzZTxVc2VyQ29uZmlnPiA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIG91dERpcjogXCIuL2Rpc3RcIixcbiAgICAgICAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICAgIHNzcjogdHJ1ZSxcbiAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBleHRlcm5hbDogWy4uLmJ1aWx0aW5Nb2R1bGVzLCAvXm5vZGU6L10sXG4gICAgICAgICAgICBpbnB1dDogdmlydHVhbEVudHJ5SWQsXG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwic2VydmVyLm1qc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbm9kZVNlcnZlclBsdWdpbjtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1QsT0FBTyxXQUFXO0FBQ3hVLE9BQU8sWUFBWTtBQUNuQixTQUFTLGNBQWMsZUFBZTs7O0FDRjBSLFNBQVMsc0JBQXNCO0FBSXhWLElBQU0sbUJBQW1CLE1BQWM7QUFDNUMsUUFBTSxpQkFBaUI7QUFDdkIsUUFBTSx5QkFBeUIsT0FBTztBQUV0QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixVQUFVLElBQUk7QUFDWixVQUFJLE9BQU8sZ0JBQWdCO0FBQ3pCLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTSxLQUFLLElBQUk7QUFDYixVQUFJLE9BQU8sd0JBQXdCO0FBQ2pDLGVBQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFrQlQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRLFlBQWlDO0FBQ3ZDLGFBQU87QUFBQSxRQUNMLE9BQU87QUFBQSxVQUNMLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFFBQVE7QUFBQSxVQUNSLEtBQUs7QUFBQSxVQUNMLGVBQWU7QUFBQSxZQUNiLFVBQVUsQ0FBQyxHQUFHLGdCQUFnQixRQUFRO0FBQUEsWUFDdEMsT0FBTztBQUFBLFlBQ1AsUUFBUTtBQUFBLGNBQ04sZ0JBQWdCO0FBQUEsWUFDbEI7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTywyQkFBUTs7O0FEcERmLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsTUFBTSxRQUFRLE1BQU07QUFDakQsUUFBTSxNQUFNLFFBQVEsTUFBTSxHQUFHO0FBQzdCLFVBQVEsSUFBSSxHQUFHO0FBRWYsTUFBSSxTQUFTLFVBQVU7QUFDckIsV0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUFBLE1BQ2xCLGFBQWE7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLGVBQWU7QUFBQSxVQUNiLE9BQU8sQ0FBQyxnQkFBZ0I7QUFBQSxVQUN4QixRQUFRO0FBQUEsWUFDTixnQkFBZ0I7QUFBQSxVQUNsQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0YsT0FBTztBQUNMLFdBQU87QUFBQSxNQUNMLGFBQWE7QUFBQSxNQUNiLFNBQVMsQ0FBQyxNQUFNLEdBQUcseUJBQWlCLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BUXJDLEtBQUs7QUFBQSxRQUNILFFBQVE7QUFBQSxVQUNOLEdBQUcsT0FBTyxLQUFLLEdBQUcsRUFBRSxPQUFPLENBQUMsTUFBTSxRQUFRO0FBRXhDLGlCQUFLLGVBQWUsR0FBRyxFQUFFLElBQUksS0FBSyxVQUFVLElBQUksR0FBRyxDQUFDO0FBQ3BELG1CQUFPO0FBQUEsVUFDVCxHQUFHLENBQUMsQ0FBQztBQUFBLFFBQ1A7QUFBQTtBQUFBLFFBR0EsVUFBVSxDQUFDLE1BQU0sNkJBQTZCLFVBQVUsUUFBUTtBQUFBLFFBQ2hFLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxVQUNaLFNBQVMsQ0FBQywyQkFBMkI7QUFBQSxRQUN2QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
