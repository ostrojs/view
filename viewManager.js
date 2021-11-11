require('@ostro/support/helpers')
const ViewAdapter = require('./viewAdapter')
const InvalidArgumentException = require('./InvalidArgumentException')
const ErrorBag = require('@ostro/support/errorBag')
const Input = require('@ostro/support/input')
const kApp = Symbol('app')
const kEngines = Symbol('engines')
const kCustomEngines = Symbol('customEngines')

class ViewManager {
    constructor($app) {
        this.$app = $app
        Object.defineProperties(this, {
            [kEngines]: {
                value: Object.create(null),
                writable: true,
            },
            [kCustomEngines]: {
                value: Object.create(null),
                writable: true,
            }
        })
    }

    engine(name = null) {
        name = name ? name : this.getDefaultEngine();
        return this[kEngines][name] = this.getDriver(name);
    }

    getDriver(name) {
        return this[kEngines][name] || this.resolve(name);
    }

    resolve($name) {
        var config = this.getConfig($name);
        if (!config) {
            throw new InvalidArgumentException("Engine [{" + $name + "}] was not available.");
        }
        if (typeof config['options'] != 'object') {
            config['options'] = {}
        }
        config['options']['path'] = config['root']
        var driverMethod = 'create' + (config['driver']).ucfirst() + 'Driver';
        if ((this[kCustomEngines][config['driver']])) {
            return this.callCustomCreator(config);
        } else if (this[driverMethod]) {
            return this[driverMethod](config);
        } else {
            throw new InvalidArgumentException("Driver [{" + config['driver'] + "}] is not supported.");
        }
    }

    callCustomCreator($config) {
        return this[kCustomEngines][$config['driver']];
    }

    createTwigDriver($config) {
        return this.adapt(new(require('./adapter/twig'))($config['options']), $config);
    }

    createEjsDriver($config) {
        return this.adapt(new(require('./adapter/ejs'))($config['options']), $config);
    }

    createPugDriver($config) {
        return this.adapt(new(require('./adapter/pug'))($config['options']), $config);
    }

    createNunjucksDriver($config) {
        return this.adapt(new(require('./adapter/nunjucks'))($config['options']), $config);
    }

    createHandlebarDriver($config) {
        return this.adapt(new(require('./adapter/handlebar'))($config['options']), $config);
    }

    extends(key, tpl) {
        if (!this.getConfig(key)) {
            throw new InvalidArgumentException(`Config not found for  [${key}] Engine.`);
        }
        this[kCustomEngines][key] = this.adapt(tpl, this.getConfig(key))
    }
    adapt(adapter, config) {
        return new ViewAdapter(adapter, config);
    }

    set($name, $engine) {
        this[kEngines][$name] = $engine;
        return this;
    }

    getConfig(name) {
        return this.$app['config']['view']['engines'][name];
    }

    getDefaultEngine() {
        return this.$app['config']['view']['default'];
    }

}

module.exports = ViewManager