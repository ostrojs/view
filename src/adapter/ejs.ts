class EJS {
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
        const ejsModule = require('ejs');
        const ejs = ejsModule?.default || ejsModule;
        cb(ejs.render(content, data, this.$options))
    }

}
export default EJS;