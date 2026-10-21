class InvalidArgumentException extends Error {
    public error: string;
    public statusCode: number;

    /**
     * constructor method.
     *
     * @param message - Exception error message
     */
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.error = message;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default InvalidArgumentException;