const path = require('path');
const {dynamicListExportedFunctions} = require('../dynamicListExportedFunctions');
const { assert } = require('console');

const pathToAnalyze = path.resolve(__dirname, './textures/moduleExportsDynamic.js');

const exportedFunctions = dynamicListExportedFunctions(pathToAnalyze);

assert(exportedFunctions.includes('add1'));
assert(exportedFunctions.includes('add2'));
assert(exportedFunctions.includes('add3'));
assert(exportedFunctions.includes('add4'));
assert(exportedFunctions.includes('add5'));
assert(exportedFunctions.includes('add6'));
assert(exportedFunctions.includes('add7'));
assert(exportedFunctions.includes('add8'));
assert(exportedFunctions.includes('add9'));
assert(exportedFunctions.includes('add10'));