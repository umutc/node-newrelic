/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
module.exports = function initialize(shim, nextServer) {
  const Server = nextServer.default
  shim.setFramework(shim.NEXT)
  shim.record(
    Server.prototype,
    'handleRequest',
    function wrapRequest(shim, handleRequest, name, args) {
      return {
        req: args[0],
        res: args[1],
        name: `Nodejs/Middleware/Nextjs/${name}`,
        promise: true
      }
    }
  )

  shim.record(
    Server.prototype,
    'renderToResponse',
    function wrapRequest(shim, renderToResponse, name, [args]) {
      shim.setTransactionUri(args.pathname)
      return {
        name: `Nodejs/Middleware/Nextjs/renderToResponse/${args.pathname}`,
        promise: true
      }
    }
  )

  shim.record(
    Server.prototype,
    'findPageComponents',
    function wrapRequest(shim, findPageComponents, name, [page]) {
      return {
        name: `Nodejs/Middleware/Nextjs/findPageComponents/${page}`,
        promise: true
      }
    }
  )

  shim.record(
    Server.prototype,
    'renderToResponseWithComponents',
    function wrapRequest(shim, renderToResponseWithComponents, name, [request]) {
      return {
        name: `Nodejs/Middleware/Nextjs/renderToResponseWithComponents/${request.pathname}`,
        promise: true
      }
    }
  )

  shim.wrap(
    Server.prototype,
    'renderErrorToResponse',
    function wrapRequest(shim, renderErrorToResponse) {
      return function wrappedRenderError(ctx, err) {
        shim.noticeError(ctx, err)
        return renderErrorToResponse.apply(this, arguments)
      }
    }
  )

  shim.record(
    Server.prototype,
    'handleApiRequest',
    function wrapRequest(shim, handleApiRequest, name, args) {
      const route = findRoute.apply(this, [args[2]])
      shim.setTransactionUri(route)
      return {
        name: `Nodejs/Middleware/Nextjs/${route}`,
        req: args[0],
        res: args[1],
        promise: true
      }
    }
  )

  /**
   * In case of a dynamic route, look for the appropriate name
   *
   * @param url
   */
  function findRoute(url) {
    for (const route of this.dynamicRoutes) {
      if (route.page.startsWith('/api') && route.match(url)) {
        return route.page
      }
    }

    return url
  }
}
