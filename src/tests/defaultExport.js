const path = require('path');
const {dynamicListExportedFunctions} = require('../dynamicListExportedFunctions');
const { assert } = require('console');

const pathToAnalyze = path.resolve(__dirname, './textures/defaultExport.js');

const exportedFunctions = dynamicListExportedFunctions(pathToAnalyze);

assert(exportedFunctions.length === 0);
