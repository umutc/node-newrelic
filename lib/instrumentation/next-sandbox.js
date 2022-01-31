/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
module.exports = function initialize(shim, sandbox) {
  shim.setFramework(shim.NEXT)
  shim.record(sandbox, 'run', function middlewareRecorder(shim, origRun, name, [args]) {
    return {
      name: `Nodejs/Middleware/Nextjs/${args.name}`,
      type: shim.ROUTE,
      req: args.request,
      route: args.name,
      promise: true
    }
  })
}
