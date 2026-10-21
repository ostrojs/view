class Nunjucks {
    public default: Record<string, any>;
    /**
     * constructor method.
     *
     * @param {any} options
     * @returns {any}
     */
    constructor(options: Record<string, any> = {}) {
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
        const nunjucksModule = require('nunjucks');
        const nunjucks = nunjucksModule?.default || nunjucksModule;
        nunjucks.configure(this.default.path, this.default);
    }
    /**
     * render method.
     *
     * @param {any} content
     * @param {any} data
     * @param {any} cb
     * @returns {any}
     */
    public render(content: any, data: Record<string, any> = {}, cb: any) {
        const nunjucksModule = require('nunjucks');
        const nunjucks = nunjucksModule?.default || nunjucksModule;
        return nunjucks.renderString(content, data, function(err, res) {
            if (err) return cb(err)
            cb(res)
        })
    }

}
export default Nunjucks;