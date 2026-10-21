class Handlebar {
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
        const hbModule = require('handlebars');
        const handlebars = hbModule?.default || hbModule;
        cb(handlebars.compile(content)(data))
    }

}
export default Handlebar;