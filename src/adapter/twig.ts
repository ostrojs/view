class Twig {
    public $options: Record<string, any>;
    /**
     * constructor method.
     *
     * @param {any} options
     * @returns {any}
     */
    constructor(options: Record<string, any> = {}) {
        this.$options = options;
        this.$options.base = options.path;
        const twigModule = require('twig');
        const twig = twigModule?.default || twigModule;
        twig.cache(this.$options['cache'])

    }
    /**
     * render method.
     *
     * @param {any} string
     * @param {any} data
     * @param {any} cb
     * @returns {any}
     */
    public render(string: any, data: Record<string, any> = {}, cb: any) {
        const twigModule = require('twig');
        const twig = twigModule?.default || twigModule;
        twig.twig({ data: string, ...this.$options }).renderAsync(data).then(function(res) {
            cb(res)
        }, cb)
    }

}
export default Twig;