
const path = require('path');
const dirtyProxyObj = require('../dirtyProxy.js');
const originalJsRequire = require.extensions['.js'];
const parentModule = path.join(__dirname, './moduleExportsDynamic.js');
const modulesToRequire = [parentModule];
const dirtyProxy = path.join(__dirname, './dirtyProxy.js');
let dirtyModuleIndex = 0;
require.extensions['.js']= (moduleToRequire, pathToRequire)=>{
    if(modulesToRequire.includes(moduleToRequire.id)){
        console.log('parentModule', moduleToRequire.id)
        originalJsRequire(moduleToRequire, pathToRequire);
    }
    else if(moduleToRequire.id === dirtyProxy){
        console.log('dirtyProxy', module.id)
        originalJsRequire(moduleToRequire, pathToRequire);
    }
    else{
        moduleToRequire.dirtyProxyParentPath = moduleToRequire.id;
        moduleToRequire.dirtyModuleIndex = ++dirtyModuleIndex;
        console.log('skipp requiring dirty proxy', moduleToRequire.id)
        originalJsRequire(moduleToRequire, dirtyProxy);
    }
}

const exportedStuff = [];
debugger
const aModule = require(parentModule);

const pushModuleExportsToExportedStuff = (module) => {
    for(let key in module){
        if(key !== 'dirtyModulePath'){
            exportedStuff.push(key);
        }
    }
}

console.log (aModule, 'aModule')
pushModuleExportsToExportedStuff(aModule);

console.log(exportedStuff, 'exportedStuff')

if(aModule.dirtyModulePath){
    console.log('dirtyModulePath', aModule.dirtyModulePath)
    modulesToRequire.push(aModule.dirtyModulePath);
    delete require.cache[require.resolve(aModule.dirtyModulePath)];
    const dirtyModule = require(aModule.dirtyModulePath);
    console.log(dirtyModule, 'dirtyModule')
    pushModuleExportsToExportedStuff(dirtyModule);
}

console.log(exportedStuff, 'exportedStuff')