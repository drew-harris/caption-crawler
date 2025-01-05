/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './../routes/__root'
import { Route as StopPurchaseImport } from './../routes/stop-purchase'
import { Route as PlaylistsImport } from './../routes/playlists'
import { Route as AccountImport } from './../routes/account'
import { Route as IndexImport } from './../routes/index'
import { Route as FeedbackIndexImport } from './../routes/feedback.index'
import { Route as AdminIndexImport } from './../routes/admin.index'
import { Route as SearchCollectionImport } from './../routes/search.$collection'

// Create/Update Routes

const StopPurchaseRoute = StopPurchaseImport.update({
  path: '/stop-purchase',
  getParentRoute: () => rootRoute,
} as any)

const PlaylistsRoute = PlaylistsImport.update({
  path: '/playlists',
  getParentRoute: () => rootRoute,
} as any)

const AccountRoute = AccountImport.update({
  path: '/account',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const FeedbackIndexRoute = FeedbackIndexImport.update({
  path: '/feedback/',
  getParentRoute: () => rootRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  path: '/admin/',
  getParentRoute: () => rootRoute,
} as any)

const SearchCollectionRoute = SearchCollectionImport.update({
  path: '/search/$collection',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/account': {
      id: '/account'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AccountImport
      parentRoute: typeof rootRoute
    }
    '/playlists': {
      id: '/playlists'
      path: '/playlists'
      fullPath: '/playlists'
      preLoaderRoute: typeof PlaylistsImport
      parentRoute: typeof rootRoute
    }
    '/stop-purchase': {
      id: '/stop-purchase'
      path: '/stop-purchase'
      fullPath: '/stop-purchase'
      preLoaderRoute: typeof StopPurchaseImport
      parentRoute: typeof rootRoute
    }
    '/search/$collection': {
      id: '/search/$collection'
      path: '/search/$collection'
      fullPath: '/search/$collection'
      preLoaderRoute: typeof SearchCollectionImport
      parentRoute: typeof rootRoute
    }
    '/admin/': {
      id: '/admin/'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof rootRoute
    }
    '/feedback/': {
      id: '/feedback/'
      path: '/feedback'
      fullPath: '/feedback'
      preLoaderRoute: typeof FeedbackIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AccountRoute,
  PlaylistsRoute,
  StopPurchaseRoute,
  SearchCollectionRoute,
  AdminIndexRoute,
  FeedbackIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/account",
        "/playlists",
        "/stop-purchase",
        "/search/$collection",
        "/admin/",
        "/feedback/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/account": {
      "filePath": "account.tsx"
    },
    "/playlists": {
      "filePath": "playlists.tsx"
    },
    "/stop-purchase": {
      "filePath": "stop-purchase.tsx"
    },
    "/search/$collection": {
      "filePath": "search.$collection.tsx"
    },
    "/admin/": {
      "filePath": "admin.index.tsx"
    },
    "/feedback/": {
      "filePath": "feedback.index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
