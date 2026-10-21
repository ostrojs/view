jest.mock('ejs', () => ({ render: jest.fn() }), { virtual: true });
jest.mock('handlebars', () => ({ compile: jest.fn() }), { virtual: true });
jest.mock('nunjucks', () => ({ configure: jest.fn(), renderString: jest.fn() }), { virtual: true });
jest.mock('pug', () => ({ compile: jest.fn() }), { virtual: true });
jest.mock('twig', () => ({ cache: jest.fn(), twig: jest.fn() }), { virtual: true });

import FileNotFoundException from '../src/FileNotFoundException';
import InvalidArgumentException from '../src/InvalidArgumentException';
import ViewServiceProvider from '../src/viewServiceProvider';
import ViewManager from '../src/viewManager';

describe('View Exceptions & ViewServiceProvider', () => {
    test('FileNotFoundException attributes', () => {
        const err = new FileNotFoundException('File not on disk');
        expect(err.name).toBe('FileNotFoundException');
        expect(err.message).toBe('View file not found');
        expect(err.error).toBe('File not on disk');
        expect(err.statusCode).toBe(404);
        expect(err).toBeInstanceOf(FileNotFoundException);
    });

    test('InvalidArgumentException attributes', () => {
        const err = new InvalidArgumentException('Engine not available');
        expect(err.name).toBe('InvalidArgumentException');
        expect(err.message).toBe('Engine not available');
        expect(err.error).toBe('Engine not available');
        expect(err.statusCode).toBe(500);
        expect(err instanceof Error).toBe(true);
    });

    test('ViewServiceProvider register and boot', () => {
        const singletons = {};
        const mockApp = {
            singleton: jest.fn((name, callback) => {
                singletons[name] = callback(mockApp);
            }),
            config: {
                get: jest.fn().mockReturnValue({})
            }
        };

        const provider = new ViewServiceProvider(mockApp);
        provider.register();
        provider.boot();

        expect(mockApp.singleton).toHaveBeenCalledWith('view', expect.any(Function));
        expect(singletons.view).toBeInstanceOf(ViewManager);
    });
});
