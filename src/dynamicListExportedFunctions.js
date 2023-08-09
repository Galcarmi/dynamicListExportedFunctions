
const path = require('path');
const originalJsRequire = require.extensions['.js'];

const dynamicListExportedFunctions = (modulePathToAnalyze) => {
    const modulesToRequire = [modulePathToAnalyze];
    const dirtyProxy = path.join(__dirname, './dirtyProxy.js');
    let dirtyModuleIndex = 0;
    require.extensions['.js']= (moduleToRequire, pathToRequire)=>{
        if(modulesToRequire.includes(moduleToRequire.id)){
            originalJsRequire(moduleToRequire, pathToRequire);
        }
        else if(moduleToRequire.id === dirtyProxy){
            originalJsRequire(moduleToRequire, pathToRequire);
        }
        else{
            moduleToRequire.dirtyProxyParentPath = moduleToRequire.id;
            moduleToRequire.dirtyModuleIndex = dirtyModuleIndex++;
            originalJsRequire(moduleToRequire, dirtyProxy);
        }
    }

    const getModuleExports = (currentModule) => {
        const exportedStuff = [];

        for(let key in currentModule){
            if(!key.startsWith('dirtyModulePath')){
                exportedStuff.push(key);
            }
        }

        return exportedStuff;
    }

    const isCurrentModuleContainsDirtyKeys = (currentModule) => {
        for(let key in currentModule){
            if(key.startsWith('dirtyModulePath')){
                return true;
            }
        }
        return false;
    }

    console.time('lefRequireTime');

    let currentModule = require(modulePathToAnalyze);
    while(isCurrentModuleContainsDirtyKeys(currentModule)){
        for(key in currentModule){
            if(!key.startsWith('dirtyModulePath')){
                continue;
            }

            const dirtyModulePath = currentModule[key];
            modulesToRequire.push(dirtyModulePath);
        }

        for(const moduleToRequire of modulesToRequire){
            delete require.cache[require.resolve(moduleToRequire)];
        }

        currentModule = require(modulePathToAnalyze);
    }
    console.timeEnd('lefRequireTime');

    return getModuleExports(currentModule);
}

exports.dynamicListExportedFunctions = dynamicListExportedFunctions;