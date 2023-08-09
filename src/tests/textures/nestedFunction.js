const exportsStatic = require('./exportsStatic');

const myObj = {...exportsStatic};

module.exports = {
    ...myObj,
}