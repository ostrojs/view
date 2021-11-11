const FileNotFoundExceptionContracts = require('@ostro/contracts/view/fileNotFoundException')
class FileNotFoundException extends FileNotFoundExceptionContracts {
    constructor(errors) {
        super();
        this.name = this.constructor.name;
        this.message = 'View file not found';
        this.error = errors
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = FileNotFoundException