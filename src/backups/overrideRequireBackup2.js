
const path = require('path');
require('uuid');
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
        moduleToRequire.dirtyModuleIndex = dirtyModuleIndex++;
        console.log('skipp requiring dirty proxy', moduleToRequire.id)
        originalJsRequire(moduleToRequire, dirtyProxy);
    }
}

console.time('lefRequireTime');
const exportedStuff = [];
const aModule = require(parentModule);
console.log (aModule, 'aModule')

const pushModuleExportsToExportedStuff = (module) => {
    for(let key in module){
        if(!key.startsWith('dirtyModulePath') && key !== 'uuid'){
            exportedStuff.push(key);
        }
    }
}

pushModuleExportsToExportedStuff(aModule);


// console.log(exportedStuff, 'exportedStuff')

for(key in aModule){
    debugger
    if(!key.startsWith('dirtyModulePath')){
        continue;
    }

    const dirtyModulePath = aModule[key];
    modulesToRequire.push(dirtyModulePath);
    delete require.cache[require.resolve(dirtyModulePath)];
    const dirtyModule = require(dirtyModulePath);
    pushModuleExportsToExportedStuff(dirtyModule);
}

console.log(exportedStuff, 'exportedStuff')
console.timeEnd('lefRequireTime');