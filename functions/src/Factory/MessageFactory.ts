import Notification from "../Message/Notification"
import Message from "../Message/Message";
import OfficialMessage from "../Message/OfficialMessage";
import StaffMessage from "../Message/StaffMessage";
import StudentMessage from "../Message/StudentMessage";
import Severity from "./Severity";
import * as functions from "firebase-functions";
import * as fs from "fs"

export default abstract class MessageFactory { 

    private severities: Severity [] = JSON.parse(fs.readFileSync(__dirname + "/SeveritiesData.json", 'utf-8'));
    private topic: string; 

    public constructor(topic: string) {
        this.topic = topic;
    }

    public getTopic(): string {
        return this.topic;
    }

    public getProperty(payload: any): string {
        let foundProperty = "";
        for (const property in payload) {
            if (this.severities.find(severity => severity.name === property)){
                foundProperty = property;
            }
        }
        functions.logger.log(`getProperty.foundProperty: ${foundProperty}`);
        return foundProperty;
    }

    public getRead(payload: any, property: string): number {
        const read = payload[property];
        functions.logger.log(`getRead.read: ${read}`)
        return read;
    }

    public getSeverity(property: string, read: number): string | undefined {
        const severityData: Severity = this.severities
                                           .find(severity => severity.name === property) as Severity;
        functions.logger.log(`getSeverity.severityData: ${severityData}`);
        try {
            const severityLevel: string | undefined = severityData.levels
                                                         .find(level => read >= level.min && read < level.max)?.name
            functions.logger.log(`getSeverity.severityLevel: ${severityLevel}`);
            return severityLevel;
        } catch (error) {
            functions.logger.error(`Property sent by Fiware isn't mapped in SeveritiesData.json`);
            return undefined;
        }
    }
    
    abstract createNotification(payload: any) : Notification | null;

    public createMessage(notification: Notification | null, topic: string | null) : Message | null {
        try {
            if (!notification|| !topic) return null;
            else if (topic === "Official") return new OfficialMessage(notification, topic);
            else if (topic === "Staff") return new StaffMessage(notification, topic);
            else return new StudentMessage(notification, topic);
        } catch (error) {
            functions.logger.error(`createMessage: ${error}`)
            return null;
        }

    }
}