import { TypesenseMoment } from "shared/types";
import { SearchResponse } from "typesense/lib/Typesense/Documents";
import { MultiSearchResponse } from "typesense/lib/Typesense/MultiSearch";
import { z } from "zod";
import { logger } from "~/logging";
import { autoUserProcedure, publicProcedure, router } from "~/trpc/base";

export const searchRouter = router({
  search: autoUserProcedure
    .input(
      z.object({
        query: z.string(),
        collection: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      logger.info(
        {
          query: input.query,
          collection: input.collection,
          user: ctx.user.id,
        },
        "Doing Search",
      );
      const results = (await ctx.typesense
        .collections(input.collection)
        .documents()
        .search({
          q: input.query,
          highlight_full_fields: "content",
          per_page: 30,
          query_by: "content",
        })) as SearchResponse<TypesenseMoment>;
      return results;
    }),
});
