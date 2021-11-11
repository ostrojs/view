const nunjucks = require('nunjucks')
class Handlebar {
    constructor(options = {}) {
        this.default = {
            noCache: !options['cache'],
            web: {
                useCache: options['cache'],
                async: true
            }

        }
        this.default = { ...this.default,
            ...options
        }
        nunjucks.configure(this.default.path, this.default);
    }
    render(content, data = {}, cb) {
        return nunjucks.renderString(content, data, function(err, res) {
            if (err) return cb(err)
            cb(res)
        })
    }

}
module.exports = Handlebar