module.exports = {
    configs: {
      recommended: {
        rules: {
          'process-must-contain-tilt-meta': 'error',
          'third-country-transfers-are-disallowed':'off',
          'controller-must-exist-once-and-only-once': 'error',
          'controller-must-be-completely-filled':'warn',
          'third-country-transfer-must-contain-country':'error'
        }
      }
    }
  }