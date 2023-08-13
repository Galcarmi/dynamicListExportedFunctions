const path = require('path');
const { dynamicListExportedFunctions } = require('../dynamicListExportedFunctions');
const { assert } = require('console');
const { uniqueId } = require('lodash')

const pathToAnalyze = path.resolve(__dirname, './textures/defaultExport.js');

const exportedFunctions = dynamicListExportedFunctions(uniqueId(), pathToAnalyze);

assert(exportedFunctions.length === 0);
