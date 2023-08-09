const path = require('path');
const {dynamicListExportedFunctions} = require('../dynamicListExportedFunctions');
const { assert } = require('console');

const pathToAnalyze = path.resolve(__dirname, './textures/nestedFunction.js');

const exportedFunctions = dynamicListExportedFunctions(pathToAnalyze);

assert(exportedFunctions.includes('add3'));
assert(exportedFunctions.includes('add4'));
