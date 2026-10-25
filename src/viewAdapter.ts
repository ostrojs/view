import fs from 'node:fs';
import path from 'node:path';
import ObjectGet from 'lodash.get';

class ViewAdapter {
    #adapter: any;
    #config: Record<string, any>;
    #cache: Record<string, string>;

    /**
     * constructor method.
     *
     * @param adapter - Engine adapter instance
     * @param config - Configuration options dictionary
     */
    constructor($adapter: any, config: Record<string, any>) {
        this.#adapter = $adapter;
        this.#config = config;
        this.#cache = Object.create(null);
    }

    /**
     * renderFile method.
     *
     * @param file - File path or identifier
     * @param data - Template data dictionary
     * @param cb - Callback function
     */
    renderFile(file: string, data: Record<string, any>, cb: (err: unknown, result?: unknown) => void): void {
        this.readFile(this.applyPathPrefix(file), (err: unknown, content?: string) => {
            if (err) return cb(err);
            try {
                this.#adapter.render(content, data, cb);
            } catch (err) {
                cb(err);
            }
        });
    }

    /**
     * readFile method.
     *
     * @param filename - Absolute or resolved file path
     * @param cb - Callback function receiving error or file contents
     */
    readFile(filename: string, cb: (err: unknown, data?: string) => void): void {
        if (this.getConfig('cache')) {
            if (this.#cache[filename]) {
                return cb(null, this.#cache[filename]);
            }
        }
        fs.readFile(filename, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
            if (this.getConfig('cache')) {
                this.#cache[filename] = data;
            }
            cb(err, data);
        });
    }

    /**
     * getConfig method.
     *
     * @param name - Configuration key name
     * @returns Configuration value or null
     */
    public getConfig(name: string): any {
        return ObjectGet(this.#config, name, null);
    }

    /**
     * getRootPath method.
     *
     * @returns Root directory path
     */
    public getRootPath(): string {
        return this.#config['root'] || '';
    }

    /**
     * applyPathPrefix method.
     *
     * @param dest - Destination view path
     * @returns Full resolved path with extension
     */
    public applyPathPrefix(dest: string = ''): string {
        return this.applyExtension(path.join(this.getRootPath(), dest.replace(/\./g, '/')));
    }

    /**
     * applyExtension method.
     *
     * @param path - File path without extension
     * @returns File path with extension appended
     */
    public applyExtension(path: string = ''): string {
        return path + '.' + (this.getConfig('extension') || this.getConfig('engine'));
    }

}

export default ViewAdapter;