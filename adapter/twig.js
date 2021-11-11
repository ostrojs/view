const twig = require('twig')
class Twig {
    constructor(options = {}) {
        this.$options = options;
        this.$options.base = options.path;
        twig.cache(this.$options['cache'])

    }
    render(string, data = {}, cb) {
        twig.twig({ data: string, ...this.$options }).renderAsync(data).then(function(res) {
            cb(res)
        }, cb)
    }

}
module.exports = Twig