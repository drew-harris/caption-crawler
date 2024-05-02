import { builtinModules } from "module";
import type { Plugin, UserConfig } from "vite";

// FROM: https://gist.github.com/laiso/caa8f8ea18451763b70c9c8af9815230
export const nodeServerPlugin = (): Plugin => {
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
    config: async (): Promise<UserConfig> => {
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
              entryFileNames: "server.mjs",
            },
          },
        },
      };
    },
  };
};

export default nodeServerPlugin;
