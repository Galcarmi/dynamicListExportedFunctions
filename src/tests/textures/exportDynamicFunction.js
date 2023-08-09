const add7Obj = require('./add7.js');

module.exports = () =>({
    add5: (a) => a + 11,
    add6: (a) => a + 10,
    ...add7Obj
})