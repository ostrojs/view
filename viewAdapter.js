const path = require('path')
const ObjectGet = require('lodash.get')
const FileNotFoundException = require('./FileNotFoundException')
const kAdapter = Symbol('adapter')
const kConfig = Symbol('config')
const kCache = Symbol('cache')
const fs = require('fs')
class ViewAdapter {
    constructor($adapter, config) {
        this[kAdapter] = $adapter;
        this[kConfig] = config;
        this[kCache] = Object.create(null)
    }
    renderFile(file, data, cb) {

        this.readFile(this.applyPathPrefix(file), (err, content) => {
            if (err) return cb(err)
            try {
                this[kAdapter].render(content, data, cb)
            } catch (err) {
                cb(err)
            }
        })
    }
    readFile(filename, cb) {
        if (this.getConfig('cache')) {
            if (this[kCache][filename]) {
                return cb(null, this[kCache][filename])
            }
        }
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (this.getConfig('cache')) {

                this[kCache][filename] = data
            }
            cb(err, data)
        })
    }
    getConfig(name) {
        return ObjectGet(this[kConfig], name, null)
    }

    getRootPath() {
        return this[kConfig]['root'] || ''
    }

    applyPathPrefix(dest = '') {
        return this.applyExtension(path.join(this.getRootPath(), dest.replace(/\./g, '/')))
    }

    applyExtension(path = '') {
        return path + '.' + (this.getConfig('extension') || this.getConfig('engine'))
    }

}
module.exports = ViewAdapter