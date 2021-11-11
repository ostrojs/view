const pug = require('pug')
class PUG {
    constructor(options = {}) {
        this.$options = options
    }
    render(content, data = {}) {
        cb(pug.compile(content, this.$options)(data))
    }

}
module.exports = PUG