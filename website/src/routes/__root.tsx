import "./__root.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  createRootRouteWithContext,
  ErrorComponent,
  Outlet,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// @ts-expect-error no types
import jsesc from "jsesc";

import type { RootRouterContext } from "../internal/router";
import { Layout } from "~/client/Layout";
import { UserContextProvider } from "~/client/context/UserContext";

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
  loader: (ctx) => {
    return ctx.context.user || null;
  },
  scripts: () => [
    <script
      defer
      data-domain="captioncrawler.com"
      src="https://analytics.drewh.cloud/js/script.hash.outbound-links.pageview-props.tagged-events.js"
    ></script>,
  ],
});

function RootComponent() {
  const router = useRouter();
  const { bodyTags, headTags } = router.options.context;
  const user = useLoaderData({ from: "__root__" });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        {headTags?.()}
      </head>

      <body className="bg-brand text-wording">
        <UserContextProvider initialUser={user}>
          <Layout>
            <Outlet />
          </Layout>
        </UserContextProvider>
        {import.meta.env.DEV && (
          <>
            <TanStackRouterDevtools />
            <ReactQueryDevtools />
          </>
        )}

        {bodyTags?.()}
        <DehydrateRouter />
      </body>
    </html>
  );
}

function RootErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }

  return <ErrorComponent error={error} />;
}

export function DehydrateRouter() {
  const router = useRouter();

  const dehydrated = router.dehydratedData || {
    router: router.dehydrate(),
    payload: router.options.dehydrate?.(),
  };

  const stringified = jsesc(router.options.transformer.stringify(dehydrated), {
    isScriptContext: true,
    wrap: true,
  });

  return (
    <script
      id="__TSR_DEHYDRATED__"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          window.__TSR_DEHYDRATED__ = {
            data: ${stringified}
          }
        `,
      }}
    />
  );
}
