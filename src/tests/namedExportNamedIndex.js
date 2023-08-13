const path = require('path');
const { dynamicListExportedFunctions } = require('../dynamicListExportedFunctions');
const { assert } = require('console');

const pathToAnalyze = path.resolve(__dirname, './textures/namedExportNamedIndex.js');

const exportedFunctions = dynamicListExportedFunctions(pathToAnalyze);

assert(exportedFunctions.includes('add13'));
