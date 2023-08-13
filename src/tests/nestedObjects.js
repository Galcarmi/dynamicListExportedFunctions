const path = require('path');
const { dynamicListExportedFunctions } = require('../dynamicListExportedFunctions');
const { assert } = require('console');
const { uniqueId } = require('lodash')

const pathToAnalyze = path.resolve(__dirname, './textures/nestedObject.js');

const exportedFunctions = dynamicListExportedFunctions(uniqueId(), pathToAnalyze);

assert(exportedFunctions.includes('add11'));
assert(exportedFunctions.includes('add12'));