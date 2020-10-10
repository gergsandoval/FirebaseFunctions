import MessageFactory from "./MessageFactory";
import Notification from "../Message/Notification";

export default class OficialMessageFactory extends MessageFactory {
    private static instance: OficialMessageFactory;

    private constructor(topic: string) {
        super(topic);
    }

    public static getInstance(): OficialMessageFactory {
        if (!OficialMessageFactory.instance){
            OficialMessageFactory.instance = new OficialMessageFactory("Official");
        }
        return OficialMessageFactory.instance;
    }

    public createNotification(payload: any): Notification | null {
        const property = super.getProperty(payload);
        const read = super.getRead(payload, property);
        const severity = super.getSeverity(property, read);
        if (!severity) return null;
        else if (severity === "red") return new Notification(`Alerta Roja`, `Los niveles de ${property} estan en ${read}`);
        else if (severity === "orange") return new Notification(`Alerta Naranja`, `Los niveles de ${property} estan en ${read}`);
        else return new Notification(`Alerta Amarilla`, `Los niveles de ${property} estan en ${read}`);
    }
}