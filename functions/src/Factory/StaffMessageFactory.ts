import MessageFactory from "./MessageFactory";
import Notification from "../Message/Notification";

export default class StaffMessageFactory extends MessageFactory {
    private static instance: StaffMessageFactory;

    private constructor(topic: string) {
        super(topic);
    }

    public static getInstance(): StaffMessageFactory {
        if (!StaffMessageFactory.instance){
            StaffMessageFactory.instance = new StaffMessageFactory("Staff");
        }
        return StaffMessageFactory.instance;
    }

    public createNotification(payload: any): Notification | null {
        const property = super.getProperty(payload);
        const read = super.getRead(payload, property);
        const severity = super.getSeverity(property, read);
        if (!severity) return null;
        else if (severity === "red") return new Notification(`Evacuar al punto mas cercano`, `Mira el protoloco de evacuacion`);
        else if (severity === "orange") return new Notification(`Persiste el problema en el aula X`, `Mira el protocolo de evauacion`);
        else return new Notification(`Se detecto un problema en el aula X`, `Mira el protocolo de evacuacion`);
    }
}