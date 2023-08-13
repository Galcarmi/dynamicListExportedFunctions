const path = require('path');
const { dynamicListExportedFunctions } = require('../dynamicListExportedFunctions');
const { assert } = require('console');

const pathToAnalyze = path.resolve(__dirname, './textures/nestedObject.js');

const exportedFunctions = dynamicListExportedFunctions(pathToAnalyze);

assert(exportedFunctions.includes('add11'));
assert(exportedFunctions.includes('add12'));