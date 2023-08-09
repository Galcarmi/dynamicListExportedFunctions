let dirtyModulePath = module.dirtyProxyParentPath;

const dirtyProxy = new Proxy(()=>{}, {
    get: function (_target, prop) {
        if(prop === `dirtyModulePath${module.dirtyModuleIndex}`){
            return dirtyModulePath;
        }
        return dirtyProxy;
    },
    apply() {
        return dirtyProxy;
    }
})

dirtyProxy[`dirtyModulePath${module.dirtyModuleIndex}`] = module.dirtyProxyParentPath;

module.exports = dirtyProxy;
