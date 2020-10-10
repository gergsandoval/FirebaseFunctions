import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import Notification from "../Message/Notification";

export default abstract class Message {
    private notification: Notification;
    private topic: string;

    public constructor(notification: Notification, topic: string){
        this.notification = notification;
        this.topic = topic;
    }

    public async sendToApp() {
        const messageId = await admin.messaging().send({notification: this.notification, topic: this.topic});
        functions.logger.log(`sendToApp.messageId: ${messageId}`);
    }
}