import FileNotFoundExceptionContracts from '@ostro/contracts/view/fileNotFoundException';

class FileNotFoundException extends FileNotFoundExceptionContracts {
    public error: unknown;
    public statusCode: number;
    public name: string;
    public message: string;

    /**
     * constructor method.
     *
     * @param errors - Error details or message
     */
    constructor(errors: unknown) {
        super();
        this.name = this.constructor.name;
        this.message = 'View file not found';
        this.error = errors;
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default FileNotFoundException;