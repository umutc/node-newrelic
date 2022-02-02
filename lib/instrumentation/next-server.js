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
      const route = findRoute.apply(this, [args[0].url])
      debugger
      console.log('handle request', route)
      return {
        req: args[0],
        res: args[1],
        name: `Nodejs/Middleware/Nextjs/${route}`,
        promise: true
      }
    }
  )

  shim.record(
    Server.prototype,
    'renderToResponse',
    function wrapRequest(shim, renderToResponse, name, [args]) {
      const route = findRoute.apply(this, [args.pathname])
      console.log('redner to response', route)
      shim.setTransactionUri(route)
      return {
        name: `Nodejs/Middleware/Nextjs/renderToResponse/${route}`,
        promise: true
      }
    }
  )

  shim.record(
    Server.prototype,
    'findPageComponents',
    function wrapRequest(shim, findPageComponents, name, [page]) {
      console.log('find page comp')
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
      console.log('render to response with comp', request.pathname)
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
      console.log('handle api', route)
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
      if (route.match(url)) {
        return route.page
      }
    }

    return url
  }
}
