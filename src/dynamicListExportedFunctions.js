
const path = require('path');
const originalJsRequire = require.extensions['.js'];

const requestedBasedModulesToRequire = {};

const dynamicListExportedFunctions = (requestUUID, modulePathToAnalyze) => {
    requestedBasedModulesToRequire[requestUUID] = {
        modulePaths: [modulePathToAnalyze],
        dirtyModuleIndex: 0
    };
    const dirtyProxyPath = path.join(__dirname, './dirtyProxy.js');
    const texturesFolderPath = path.join(__dirname, './tests/textures');

    require.extensions['.js']= (moduleToRequire, pathToRequire)=>{
        if(!moduleToRequire.id.startsWith(texturesFolderPath)){
            // overriding require only for modules that are in textures folder
            originalJsRequire(moduleToRequire, pathToRequire);

            return;
        }
        if(!requestedBasedModulesToRequire[requestUUID]?.modulePaths){
            // overriding require only for requested modules
            originalJsRequire(moduleToRequire, pathToRequire);

            return;
        }

        if(requestedBasedModulesToRequire[requestUUID].modulePaths.includes(moduleToRequire.id)){
            originalJsRequire(moduleToRequire, pathToRequire);

            return;
        }
        else if(moduleToRequire.id === dirtyProxyPath){
            originalJsRequire(moduleToRequire, pathToRequire);

            return;
        }
        else{
            moduleToRequire.dirtyProxyParentPath = moduleToRequire.id;
            moduleToRequire.dirtyModuleIndex = requestedBasedModulesToRequire[requestUUID].dirtyModuleIndex++;
            originalJsRequire(moduleToRequire, dirtyProxyPath);

            return;
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
        for(let [key, value] of Object.entries(currentModule)){

            if(key.startsWith('dirtyModulePath')){
                return true;
            }

            for(let valueKeys in value){
                if(valueKeys.startsWith('dirtyModulePath')){
                    return true;
                }
            }
        }
        return false;
    }

    console.time('lefRequireTime');

    let currentModule = require(modulePathToAnalyze);
    while(isCurrentModuleContainsDirtyKeys(currentModule)){
        for(let [key, value] of Object.entries(currentModule)){
            const isKeyDirty = key.startsWith('dirtyModulePath');
            let isValueDirty = false;

            for(let valueKeys in value){
                if(valueKeys.startsWith('dirtyModulePath')){
                    isValueDirty = true;
                }
            }

            if(!isKeyDirty && !isValueDirty){
                continue;
            }

            let dirtyModulePath = null;
            if(isValueDirty){
                dirtyModulePath  = value[`dirtyModulePath${value.dirtyModuleIndex}`];
            } else if(isKeyDirty){
                dirtyModulePath = currentModule[key];
            }
            
            if(dirtyModulePath === null){
                console.error('dirtyModulePath is null, skipping...')
            }

            requestedBasedModulesToRequire[requestUUID].modulePaths.push(dirtyModulePath);
        }

        for(const moduleToRequire of requestedBasedModulesToRequire[requestUUID].modulePaths){
            delete require.cache[require.resolve(moduleToRequire)];
        }

        currentModule = require(modulePathToAnalyze);
    }
    console.timeEnd('lefRequireTime');

    delete requestedBasedModulesToRequire[requestUUID];

    return getModuleExports(currentModule);
}

exports.dynamicListExportedFunctions = dynamicListExportedFunctions;