
const dirtyProxy = new Proxy(()=>{}, {
    get: function (target, prop) {
        if(prop.startsWith('dirtyModulePath')){
            return module.dirtyModulePath || target[prop];
        }

        return dirtyProxy;
    },
    set: function (target, prop, value) {
        if(prop.startsWith('dirtyModulePath')){  
            target[prop] = value;
        }

        return true;
    },
    apply() {
        return dirtyProxy;
    }
})

if(module.dirtyModulePath){
    dirtyProxy.dirtyModulePath = module.dirtyModulePath;
}

module.exports = dirtyProxy;
