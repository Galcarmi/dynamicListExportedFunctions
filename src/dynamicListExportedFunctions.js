
const path = require('path');
const m = require('module');
const originalJsRequire = require.extensions['.js'];
const originalLoadMethod = m.Module._load;
const dirtyProxyPath = path.join(__dirname, './dirtyProxy.js');
const texturesFolderPath = path.join(__dirname, './tests/textures');
const requesteBasedModulesToRequire = {};

const handleNPMRequire = (requestUUID, requesteBasedModulesToRequire) => {
    m.Module._load = (request, parent, obj) => {
        if(!parent.id.startsWith(texturesFolderPath)){
            // overriding require only for modules that are in textures folder
            
            return originalLoadMethod(request, parent, obj);
        }
        if(!request.startsWith('.') && !request.startsWith('/')){
            const resolvedPath = require.resolve(request);
            if(!requesteBasedModulesToRequire[requestUUID].modulePaths.includes(resolvedPath)){
                const result =  originalLoadMethod(dirtyProxyPath, parent, obj);
                result.dirtyModulePath = resolvedPath;
                return result;
            }

            return originalLoadMethod(request, parent, obj);
        } else {
            return originalLoadMethod(request, parent, obj);
        }
    }
}

const handleFileRequire = (requestUUID, requesteBasedModulesToRequire) => {
    require.extensions['.js']= (moduleToRequire, pathToRequire)=>{
        if(!moduleToRequire.id.startsWith(texturesFolderPath)){
            // overriding require only for modules that are in textures folder
            
            return originalJsRequire(moduleToRequire, pathToRequire);
        }
        if(!requesteBasedModulesToRequire[requestUUID]?.modulePaths){
            // overriding require only for requested modules
            
            return originalJsRequire(moduleToRequire, pathToRequire);
        }

        if(requesteBasedModulesToRequire[requestUUID].modulePaths.includes(moduleToRequire.id)){
            return originalJsRequire(moduleToRequire, pathToRequire);
        }
        else if(moduleToRequire.id === dirtyProxyPath){
            return originalJsRequire(moduleToRequire, pathToRequire);
        }
        else{
            moduleToRequire.dirtyModulePath = moduleToRequire.id;

            return originalJsRequire(moduleToRequire, dirtyProxyPath);
        }
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

const requireModuleAndAnalyzeExportsObject = (requestUUID, requesteBasedModulesToRequire, modulePathToAnalyze) => {
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
                dirtyModulePath  = value.dirtyModulePath;
            } else if(isKeyDirty){
                dirtyModulePath = currentModule[key];
            }
            
            if(dirtyModulePath === null){
                console.error('dirtyModulePath is null, skipping...')
            }

            requesteBasedModulesToRequire[requestUUID].modulePaths.push(dirtyModulePath);
        }

        for(const moduleToRequire of requesteBasedModulesToRequire[requestUUID].modulePaths){
            delete require.cache[require.resolve(moduleToRequire)];
        }

        currentModule = require(modulePathToAnalyze);
    }

    return currentModule;
}

const dynamicListExportedFunctions = (requestUUID, modulePathToAnalyze) => {
    requesteBasedModulesToRequire[requestUUID] = {
        modulePaths: [modulePathToAnalyze],
    };
    handleFileRequire(requestUUID, requesteBasedModulesToRequire);
    handleNPMRequire(requestUUID, requesteBasedModulesToRequire);

    console.time('lefRequireTime');

    const currentModule = requireModuleAndAnalyzeExportsObject(requestUUID, requesteBasedModulesToRequire, modulePathToAnalyze);

    console.timeEnd('lefRequireTime');

    delete requesteBasedModulesToRequire[requestUUID];

    return getModuleExports(currentModule);
}

exports.dynamicListExportedFunctions = dynamicListExportedFunctions;