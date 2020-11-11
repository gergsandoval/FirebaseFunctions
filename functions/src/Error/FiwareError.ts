export default class FiwareError implements Error {
    name: string;
    statusCode: number;
    message: string;
    stack?: string | undefined;
    className: string;
    functionName: string;

    public constructor(statusCode: number, message: string, className: string, functionName: string){
        this.name = "Fiware Error";
        this.statusCode = statusCode;
        this.message = message;
        this.className = className;
        this.functionName = functionName;
    }
    
}