/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

module.exports.selfRegister = function selfRegister(shimmer) {
  shimmer.registerInstrumentation({
    moduleName: './next-server',
    type: 'web-framework',
    onRequire: require('./next-server')
  })
  shimmer.registerInstrumentation({
    moduleName: './sandbox',
    type: 'web-framework',
    onRequire: require('./next-sandbox')
  })
  shimmer.registerInstrumentation({
    moduleName: './context',
    type: 'web-framework',
    onRequire: require('./next-context')
  })
}
