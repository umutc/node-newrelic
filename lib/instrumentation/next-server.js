/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
module.exports = function initialize(shim, nextServer) {
  const Server = nextServer.default
  shim.setFramework(shim.NEXT)
  shim.wrap(Server.prototype, 'handleRequest', function wrapRequest(shim, handleRequest) {
    return function wrappedRequest(req, res, parsedUrl) {
      const uri = (parsedUrl && parsedUrl.pathname) || req.url
      console.log('in handlerequest', uri)
      shim.setTransactionUri(uri)
      return handleRequest.apply(this, arguments)
    }
  })

  /* shim.wrap(Server.prototype, 'renderToResponseWithComponents', function wrapRequest(shim, handleRequest) {
    return function wrappedRequest() {
      console.log('in renderToResponseWithComponents', arguments)
      return handleRequest.apply(this, arguments)
    }
  })*/

  shim.wrap(Server.prototype, 'handleApiRequest', function wrapRequest(shim, handleApiRequest) {
    return function wrappedApiRequest(req, res, parsedUrl) {
      const route = findRoute.apply(this, [parsedUrl])
      console.log('in api request', route)
      shim.setTransactionUri(route)
      return handleApiRequest.apply(this, arguments)
    }
  })

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
