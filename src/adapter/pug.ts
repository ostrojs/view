class PUG {
    public $options: Record<string, any>;
    /**
     * constructor method.
     *
     * @param {any} options
     * @returns {any}
     */
    constructor(options: Record<string, any> = {}) {
        this.$options = options
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
        const pugModule = require('pug');
        const pug = pugModule?.default || pugModule;
        cb(pug.compile(content, this.$options)(data))
    }

}
export default PUG;