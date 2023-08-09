// let dirtyModulePath = module.dirtyProxyParentPath;

// debugger


// const dirtyProxy = new Proxy(()=>{}, {
//     get: function (target, prop) {
//         if(prop === 'dirtyModulePath'){
//             return dirtyModulePath;
//         }
//         console.log('module parent', module.parent.id)
//         console.log('dirtyProxyParentPath', module.dirtyProxyParentPath)
//         return dirtyProxy;
//     },
//     apply(target, thisArg, argumentsList) {
//         console.log('dirty func')
//         return dirtyProxy;
//     }
// })

// dirtyProxy.dirtyModulePath = module.dirtyProxyParentPath;

// module.exports = dirtyProxy;

const { v4: uuidv4 } = require('uuid');

let dirtyModulePath = module.dirtyProxyParentPath;
const uuid = uuidv4();

const dirtyProxy = new Proxy(()=>{}, {
    get: function (target, prop) {
        console.log('getterr', prop)
        if(prop === `dirtyModulePath${module.dirtyModuleIndex}`){
            return dirtyModulePath;
        }
        if(prop === 'uuid'){
            return uuid;
        }
        if(prop === 'method'){
            return target[prop];
        }
        // console.log('dirtyProxyParentPath', module.dirtyProxyParentPath)
        return dirtyProxy;
    },
    set: function (target, prop, value) {
        console.log('setter', prop, value)
        if(prop === `method` || prop === `uuid` || prop === `dirtyModulePath${module.dirtyModuleIndex}`){
            target[prop] = value;
        }
        return true;
    },
    apply(target, thisArg, argumentsList) {
        console.log('dirty func')
        if(target.uuid === dirtyProxy.uuid){
            console.log('dirty func thisArg === dirtyProxy')
            target.method = 'call';
        }
        return dirtyProxy;
    },
    construct(target, args) {
        console.log(`Creating a asdsadasdsad`);
        // Expected output: "Creating a monster1"
    
        return dirtyProxy;
      },
})

dirtyProxy[`dirtyModulePath${module.dirtyModuleIndex}`] = module.dirtyProxyParentPath;
dirtyProxy.uuid = uuid;

module.exports = dirtyProxy;
