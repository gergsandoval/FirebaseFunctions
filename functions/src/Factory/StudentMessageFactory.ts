import MessageFactory from "./MessageFactory";
import Notification from "../Message/Notification";

export default class StudentMessageFactory extends MessageFactory {
    private static instance: StudentMessageFactory;

    private constructor(topic: string) {
        super(topic);
    }

    public static getInstance(): StudentMessageFactory {
        if (!StudentMessageFactory.instance){
            StudentMessageFactory.instance = new StudentMessageFactory("Student");
        }
        return StudentMessageFactory.instance;
    }

    public createNotification(payload: any): Notification | null {
        const property = super.getProperty(payload);
        const read = super.getRead(payload, property);
        const severity = super.getSeverity(property, read);
        if (!severity|| severity === "yellow") return null;
        else if (severity === "red") return new Notification(`Evacuar al punto mas cercano`,`Mira el protocolo de evauacion`);
        else return new Notification(`Atento a la instrucciones del staff`, `Mira el protocolo de evauacion`);
        //else if (severity === "orange") return new Notification(`Atento a la instrucciones del staff`, `Mira el protocolo de evauacion`);
        //else if (severity === "yellow") return new Notification(`null`,`null`);
    }
}