/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
// I am not sure if this is better than the next-context instrumentation
/* module.exports = function initialize(shim, sandbox) {
  shim.setFramework(shim.NEXT)
  shim.record(sandbox, 'run', function middlewareRecorder(shim, origRun, name, [args]) {
    debugger
    return {
      name: `Nodejs/Middleware/Nextjs/${args.name}`,
      type: shim.ROUTE,
      req: args.request,
      route: args.name,
      promise: true
    }
  })
}*/
