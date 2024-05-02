FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install turbo --global

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run build

RUN pnpm deploy --filter=website --prod /prod/website
RUN pnpm deploy --filter=worker --prod /prod/worker


FROM base AS website
COPY --from=build /prod/website /prod/website
WORKDIR /prod/website
CMD ["node", "dist/server.mjs"]

FROM base AS worker
COPY --from=build /prod/worker /prod/worker
WORKDIR /prod/worker
CMD ["node", "dist/index.js"]
