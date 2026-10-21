const path = require('path');
const fs = require('fs');
const _ViewAdapter = require('../src/viewAdapter');
const ViewAdapter = _ViewAdapter.default || _ViewAdapter;

describe('ViewAdapter', () => {
    const tmpDir = path.join(__dirname, 'fixtures');
    const templatePath = path.join(tmpDir, 'welcome.html');

    beforeAll(() => {
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
        fs.writeFileSync(templatePath, 'Hello <%= name %>!');
    });

    afterAll(() => {
        if (fs.existsSync(templatePath)) {
            fs.unlinkSync(templatePath);
        }
        if (fs.existsSync(tmpDir)) {
            fs.rmdirSync(tmpDir);
        }
    });

    test('constructor and defaults', () => {
        const adapter = new ViewAdapter({}, {});
        expect(adapter.getRootPath()).toBe('');
        expect(adapter.getConfig('unknown')).toBeNull();
        expect(adapter.applyExtension('test')).toBe('test.null');
    });

    test('applyPathPrefix with dot notation and extension fallback', () => {
        const adapter = new ViewAdapter({}, {
            root: '/views',
            extension: 'ejs'
        });
        expect(adapter.applyPathPrefix('user.profile')).toBe(path.join('/views', 'user/profile.ejs'));

        const adapterEngine = new ViewAdapter({}, {
            root: '/views',
            engine: 'pug'
        });
        expect(adapterEngine.applyPathPrefix('index')).toBe(path.join('/views', 'index.pug'));
    });

    test('renderFile successfully with mock adapter', (done) => {
        const mockEngine = {
            render: jest.fn((content, data, cb) => {
                cb(null, content.replace('<%= name %>', data.name));
            })
        };

        const adapter = new ViewAdapter(mockEngine, {
            root: tmpDir,
            extension: 'html'
        });

        adapter.renderFile('welcome', { name: 'John' }, (err, result) => {
            expect(err).toBeNull();
            expect(result).toBe('Hello John!');
            expect(mockEngine.render).toHaveBeenCalledWith('Hello <%= name %>!', { name: 'John' }, expect.any(Function));
            done();
        });
    });

    test('renderFile handles file read error', (done) => {
        const adapter = new ViewAdapter({}, {
            root: tmpDir,
            extension: 'html'
        });

        adapter.renderFile('non_existent_file', {}, (err, result) => {
            expect(err).toBeTruthy();
            expect(result).toBeUndefined();
            done();
        });
    });

    test('renderFile catches adapter synchronous exception', (done) => {
        const throwingEngine = {
            render: jest.fn(() => {
                throw new Error('Engine compilation error');
            })
        };

        const adapter = new ViewAdapter(throwingEngine, {
            root: tmpDir,
            extension: 'html'
        });

        adapter.renderFile('welcome', {}, (err, result) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Engine compilation error');
            done();
        });
    });

    test('readFile with cache enabled', (done) => {
        const mockEngine = {
            render: jest.fn((content, data, cb) => cb(null, content))
        };

        const adapter = new ViewAdapter(mockEngine, {
            root: tmpDir,
            extension: 'html',
            cache: true
        });

        const fullPath = path.join(tmpDir, 'welcome.html');
        // First read (populates cache)
        adapter.readFile(fullPath, (err1, data1) => {
            expect(err1).toBeNull();
            expect(data1).toBe('Hello <%= name %>!');

            // Second read (served from cache)
            adapter.readFile(fullPath, (err2, data2) => {
                expect(err2).toBeNull();
                expect(data2).toBe('Hello <%= name %>!');
                done();
            });
        });
    });
});
