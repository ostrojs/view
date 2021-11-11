const ejs = require('ejs')
class EJS {
    constructor(options = {}) {
        this.$options = options
    }
    render(content, data = {}, cb) {
        cb(ejs.render(content, data, this.$options))
    }

}
module.exports = EJS