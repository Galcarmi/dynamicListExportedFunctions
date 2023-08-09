const weirdExport = require('./weirdExport.js')
const exportsStatic = require('./exportsStatic.js')
const exportDynamicFunction = require('./exportDynamicFunction.js')
const defineExports = require('./defineExports.js')
const largeFile = require('./largeFiles/large-file.js')
const largeFile2 = require('./largeFiles/large-file.min.js')
const esbuildLargeFile = require('./largeFiles/large-file.esbuild.js')
const esbuildLargeFile2 = require('./largeFiles/large-file.esbuild.mini.js')
const largeFile3 = require('./largeFiles/large-file2.js')

const obj = {
    add8: (a) => a + 8,
    add9: (a) => a + 9,
    ...exportsStatic,
    ...weirdExport,
}

module.exports = {
    ...obj,
    undefinedFunc: exportsStatic.kafa,
    ...exportDynamicFunction(),
    ...defineExports,
}
