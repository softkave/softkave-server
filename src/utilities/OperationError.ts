export interface IOperationErrorParameters {
    message?: string;
    field?: string;
    action?: string;
    value?: any;
}

class OperationError extends Error {
    public message: string;
    public field?: string;
    public action?: string;
    public value?: string;
    public isPublic = true;

    constructor(p: IOperationErrorParameters = {}) {
        super(p.message);

        // error data path
        this.field = p.field;

        // recommended action for the client
        this.action = p.action;

        if (p.value) {
            this.value = JSON.stringify(p.value);
        }
    }
}

export default OperationError;
