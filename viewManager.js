require('@ostro/support/helpers')
const ViewAdapter = require('./viewAdapter')
const InvalidArgumentException = require('./InvalidArgumentException')
const ErrorBag = require('@ostro/support/errorBag')
const Input = require('@ostro/support/input')
const Manager = require('@ostro/support/manager')

class ViewManager extends Manager {

    $type = 'view';

    engine(name = null) {
        return this.driver(name)
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
        return super.resolve($name, config)
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

    adapt(adapter, config) {
        return new ViewAdapter(adapter, config);
    }

    getConfig(name) {
        return super.getConfig(`engines.${name}`);
    }

    getDefaultEngine() {
        return this.getConfig('default');
    }

}

module.exports = ViewManager