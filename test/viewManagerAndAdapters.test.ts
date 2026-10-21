const mockEjs = {
    render: jest.fn((content, data, options) => `ejs:${content}:${JSON.stringify(data)}:${JSON.stringify(options)}`)
};
const mockHandlebars = {
    compile: jest.fn((content) => (data) => `hbs:${content}:${JSON.stringify(data)}`)
};
const mockNunjucks = {
    configure: jest.fn(),
    renderString: jest.fn((content, data, cb) => {
        if (content === 'ERROR') {
            return cb(new Error('Nunjucks render error'));
        }
        return cb(null, `nunjucks:${content}:${JSON.stringify(data)}`);
    })
};
const mockPug = {
    compile: jest.fn((content, options) => (data) => `pug:${content}:${JSON.stringify(data)}:${JSON.stringify(options)}`)
};
const mockTwig = {
    cache: jest.fn(),
    twig: jest.fn((opts) => ({
        renderAsync: jest.fn((data) => {
            if (opts.data === 'ERROR') {
                return Promise.reject(new Error('Twig render error'));
            }
            return Promise.resolve(`twig:${opts.data}:${JSON.stringify(data)}`);
        })
    }))
};

jest.mock('ejs', () => mockEjs, { virtual: true });
jest.mock('handlebars', () => mockHandlebars, { virtual: true });
jest.mock('nunjucks', () => mockNunjucks, { virtual: true });
jest.mock('pug', () => mockPug, { virtual: true });
jest.mock('twig', () => mockTwig, { virtual: true });

const _EJSAdapter = require('../src/adapter/ejs');
const EJSAdapter = _EJSAdapter.default || _EJSAdapter;
const _HandlebarAdapter = require('../src/adapter/handlebar');
const HandlebarAdapter = _HandlebarAdapter.default || _HandlebarAdapter;
const _NunjucksAdapter = require('../src/adapter/nunjucks');
const NunjucksAdapter = _NunjucksAdapter.default || _NunjucksAdapter;
const _PugAdapter = require('../src/adapter/pug');
const PugAdapter = _PugAdapter.default || _PugAdapter;
const _TwigAdapter = require('../src/adapter/twig');
const TwigAdapter = _TwigAdapter.default || _TwigAdapter;
const _ViewManager = require('../src/viewManager');
const ViewManager = _ViewManager.default || _ViewManager;
const _InvalidArgumentException = require('../src/InvalidArgumentException');
const InvalidArgumentException = _InvalidArgumentException.default || _InvalidArgumentException;

describe('Adapters & ViewManager', () => {
    describe('Individual Template Adapters', () => {
        test('EJS adapter render', (done) => {
            const ejs = new EJSAdapter({ async: false });
            ejs.render('hello <%= x %>', { x: 1 }, (result) => {
                expect(result).toContain('ejs:hello <%= x %>:{"x":1}');
                done();
            });
        });

        test('EJS adapter with default options', (done) => {
            const ejs = new EJSAdapter();
            ejs.render('content', undefined, (result) => {
                expect(result).toContain('ejs:content');
                done();
            });
        });

        test('Handlebars adapter render', (done) => {
            const hbs = new HandlebarAdapter({ strict: true });
            hbs.render('hello {{x}}', { x: 2 }, (result) => {
                expect(result).toContain('hbs:hello {{x}}:{"x":2}');
                done();
            });
        });

        test('Handlebars adapter with default options', (done) => {
            const hbs = new HandlebarAdapter();
            hbs.render('content', undefined, (result) => {
                expect(result).toContain('hbs:content');
                done();
            });
        });

        test('Pug adapter render', (done) => {
            const pug = new PugAdapter({ pretty: true });
            pug.render('p Hello', { name: 'Pug' }, (result) => {
                expect(result).toContain('pug:p Hello:{"name":"Pug"}');
                done();
            });
        });

        test('Pug adapter with default options', (done) => {
            const pug = new PugAdapter();
            pug.render('content', undefined, (result) => {
                expect(result).toContain('pug:content');
                done();
            });
        });

        test('Nunjucks adapter render success and error', (done) => {
            const nunjucks = new NunjucksAdapter({ path: '/views', cache: true });
            expect(mockNunjucks.configure).toHaveBeenCalledWith('/views', expect.objectContaining({
                noCache: false,
                web: { useCache: true, async: true }
            }));

            nunjucks.render('Hello {{ user }}', { user: 'Alice' }, (result) => {
                expect(result).toContain('nunjucks:Hello {{ user }}');

                // Error branch
                nunjucks.render('ERROR', {}, (err) => {
                    expect(err).toBeInstanceOf(Error);
                    expect(err.message).toBe('Nunjucks render error');
                    done();
                });
            });
        });

        test('Nunjucks adapter with default options', (done) => {
            const nunjucks = new NunjucksAdapter();
            nunjucks.render('test', undefined, (result) => {
                expect(result).toContain('nunjucks:test');
                done();
            });
        });

        test('Twig adapter render success and error', (done) => {
            const twig = new TwigAdapter({ path: '/views', cache: true });
            expect(mockTwig.cache).toHaveBeenCalledWith(true);

            twig.render('Hello {{ name }}', { name: 'Bob' }, (result) => {
                expect(result).toContain('twig:Hello {{ name }}');

                // Error branch
                twig.render('ERROR', {}, (err) => {
                    expect(err).toBeInstanceOf(Error);
                    expect(err.message).toBe('Twig render error');
                    done();
                });
            });
        });

        test('Twig adapter with default options', (done) => {
            const twig = new TwigAdapter();
            twig.render('test', undefined, (result) => {
                expect(result).toContain('twig:test');
                done();
            });
        });
    });

    describe('ViewManager', () => {
        let mockApp;
        let viewConfig;

        beforeEach(() => {
            viewConfig = {
                default: 'ejs',
                engines: {
                    ejs: {
                        root: '/views/ejs',
                        options: { async: false },
                        extension: 'ejs'
                    },
                    pug: {
                        root: '/views/pug'
                        // options intentionally omitted to test fallback to {}
                    },
                    twig: {
                        root: '/views/twig',
                        options: { cache: false }
                    },
                    nunjucks: {
                        root: '/views/nunjucks',
                        options: { cache: false }
                    },
                    handlebar: {
                        root: '/views/handlebar',
                        options: {}
                    }
                }
            };

            mockApp = {
                make: jest.fn((abstract) => {
                    if (abstract === 'config') {
                        return { view: viewConfig };
                    }
                    return null;
                })
            };
        });

        test('engine() and driver() resolution', () => {
            const manager = new ViewManager(mockApp);
            expect(manager.$type).toBe('view');
            expect(manager.getDefaultEngine()).toBe('ejs');

            // Default engine
            const defaultAdapter = manager.engine();
            expect(defaultAdapter.getRootPath()).toBe('/views/ejs');

            // Explicit engine name
            const ejsAdapter = manager.engine('ejs');
            expect(ejsAdapter).toBe(defaultAdapter);

            // Pug driver without options config
            const pugAdapter = manager.driver('pug');
            expect(pugAdapter.getRootPath()).toBe('/views/pug');

            // Twig driver
            const twigAdapter = manager.driver('twig');
            expect(twigAdapter.getRootPath()).toBe('/views/twig');

            // Nunjucks driver
            const nunjucksAdapter = manager.driver('nunjucks');
            expect(nunjucksAdapter.getRootPath()).toBe('/views/nunjucks');

            // Handlebar driver
            const hbsAdapter = manager.driver('handlebar');
            expect(hbsAdapter.getRootPath()).toBe('/views/handlebar');
        });

        test('resolve throws InvalidArgumentException when engine is not configured', () => {
            const manager = new ViewManager(mockApp);
            expect(() => {
                manager.driver('unsupported_engine');
            }).toThrow(InvalidArgumentException);

            expect(() => {
                manager.driver('unsupported_engine');
            }).toThrow('Engine [{unsupported_engine}] was not available.');
        });
    });
});
