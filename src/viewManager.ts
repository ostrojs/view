import '@ostro/support/helpers';
import Manager from '@ostro/support/manager';
import InvalidArgumentException from './InvalidArgumentException';
import ViewAdapter from './viewAdapter';
import EjsAdapter from './adapter/ejs';
import HandlebarAdapter from './adapter/handlebar';
import NunjucksAdapter from './adapter/nunjucks';
import PugAdapter from './adapter/pug';
import TwigAdapter from './adapter/twig';

class ViewManager extends Manager {

    /**
     * $type property.
     */
    public $type: string = 'view';

    /**
     * engine method.
     *
     * @param name - Engine name or null for default
     * @returns View adapter instance
     */
    public engine(name: string | null = null): ViewAdapter {
        return this.driver(name) as ViewAdapter;
    }

    /**
     * resolve method.
     *
     * @param name - Engine name to resolve
     * @returns Resolved driver instance
     */
    public resolve($name: string): any {
        const config: Record<string, any> = this.getConfig($name);
        if (!config) {
            throw new InvalidArgumentException("Engine [{" + $name + "}] was not available.");
        }
        if (typeof config['options'] != 'object') {
            config['options'] = {};
        }
        config['options']['path'] = config['root'];
        config['driver'] = config['driver'] || $name;
        return super.resolve($name, config);
    }

    /**
     * createTwigDriver method.
     *
     * @param config - Driver configuration
     * @returns View adapter instance
     */
    public createTwigDriver($config: Record<string, any>): ViewAdapter {
        return this.adapt(new TwigAdapter($config['options']), $config);
    }

    /**
     * createEjsDriver method.
     *
     * @param config - Driver configuration
     * @returns View adapter instance
     */
    public createEjsDriver($config: Record<string, any>): ViewAdapter {
        return this.adapt(new EjsAdapter($config['options']), $config);
    }

    /**
     * createPugDriver method.
     *
     * @param config - Driver configuration
     * @returns View adapter instance
     */
    public createPugDriver($config: Record<string, any>): ViewAdapter {
        return this.adapt(new PugAdapter($config['options']), $config);
    }

    /**
     * createNunjucksDriver method.
     *
     * @param config - Driver configuration
     * @returns View adapter instance
     */
    public createNunjucksDriver($config: Record<string, any>): ViewAdapter {
        return this.adapt(new NunjucksAdapter($config['options']), $config);
    }

    /**
     * createHandlebarDriver method.
     *
     * @param config - Driver configuration
     * @returns View adapter instance
     */
    public createHandlebarDriver($config: Record<string, any>): ViewAdapter {
        return this.adapt(new HandlebarAdapter($config['options']), $config);
    }

    /**
     * adapt method.
     *
     * @param adapter - Engine adapter instance
     * @param config - Configuration options
     * @returns View adapter instance
     */
    public adapt(adapter: any, config: Record<string, any>): ViewAdapter {
        return new ViewAdapter(adapter, config);
    }

    /**
     * getConfig method.
     *
     * @param name - Configuration key name
     * @returns Configuration value
     */
    public getConfig(name: string): any {
        return super.getConfig(`engines.${name}`);
    }

    /**
     * getDefaultDriver method.
     *
     * @returns Default driver name
     */
    public getDefaultDriver(): string {
        return this.getDefaultEngine();
    }

    /**
     * getDefaultEngine method.
     *
     * @returns Default engine name
     */
    public getDefaultEngine(): string {
        return super.getConfig('default');
    }

}

export default ViewManager;