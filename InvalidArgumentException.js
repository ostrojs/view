class InvalidArgumentException extends Error {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.message = message;
        this.error = message
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = InvalidArgumentException