/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const PROP = Symbol('nrMwName')
const util = require('util')

module.exports = function initialize(shim, render) {
  shim.setFramework(shim.NEXT)
  shim.record(render, 'renderToHTML', function middlewareRecorder(shim, renderToHTML, name, [req, res, page]) {
    console.log('getServerProps', page)
    return {
      req,
      res,
      promise: true,
      name: `Nodejs/Nextjs/getServerProps/${page}`
    }
  })
}
