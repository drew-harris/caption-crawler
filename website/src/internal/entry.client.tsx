import { QueryClient, hydrate } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";
import { createTRPCQueryUtils } from "@trpc/react-query";
import { trpc } from "./trpc";
import { type User } from "lucia";
import posthog from "posthog-js";

let dehydrationUser: User | undefined = undefined;

void render();

posthog.init("phc_pXnq6RRDXBHYlKX6lQi9VTQQYeeUUsPILGhaKZ3GPo1", {
  api_host: "https://us.i.posthog.com",
  person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
});

async function render() {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      // TODO: REPLACE WITH DIRECT CALL
      httpBatchLink({
        url: import.meta.env.PROD
          ? "https://captioncrawler.com/trpc"
          : "http://localhost:3000/trpc",

        // NOTE: this will be important for auth stuff
        // You can pass any HTTP headers you wish here
        // async headers() {
        //   return {
        //     authorization: getAuthCookie(),
        //   };
        // },
      }),
    ],
  });
  const queryUtils = createTRPCQueryUtils({
    queryClient,
    client: trpcClient,
  });
  const router = createRouter(
    {
      context: {
        trpc: queryUtils,
        user: undefined,
      },
      hydrate: (dehydrated: any) => {
        hydrate(queryClient, dehydrated["queryClient"]);
        dehydrationUser = dehydrated["user"];
      },
    },
    queryClient,
    trpcClient,
  );

  // THIS DOES NOT WORK IF YOU WANT TO HYDRATE FROM TRPC!
  // if (!router.state.matches.length) {
  //   // do NOT need if not using lazy file routes
  //   await router.load(); // needed until https://github.com/TanStack/router/issues/1115 is resolved
  // }

  router.hydrate();

  const context = {
    trpc: queryUtils,
    user: dehydrationUser,
  };

  router.update({
    context,
  });

  hydrateRoot(document, <RouterProvider router={router} />);
}
