
const dirtyProxy = new Proxy(()=>{}, {
    get: function (_target, prop) {
        if(prop === `dirtyModulePath${module.dirtyModuleIndex}`){
            return module.dirtyProxyParentPath;
        }

        if(prop === 'dirtyModuleIndex'){
            return module.dirtyModuleIndex;
        }

        return dirtyProxy;
    },
    set: function (target, prop, value) {
        if(prop === `dirtyModulePath${module.dirtyModuleIndex}` || prop === 'dirtyModuleIndex'){  
            target[prop] = value;
        }

        return true;
    },
    apply() {
        return dirtyProxy;
    }
})

dirtyProxy[`dirtyModulePath${module.dirtyModuleIndex}`] = module.dirtyProxyParentPath;
dirtyProxy.dirtyModuleIndex = module.dirtyModuleIndex;

module.exports = dirtyProxy;
