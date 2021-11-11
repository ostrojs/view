const handlebars = require('handlebars')
class Handlebar {
    constructor(options = {}) {
        this.$options = options
    }
    render(content, data = {}) {
        cb(handlebars.compile(content)(data))
    }

}
module.exports = Handlebar