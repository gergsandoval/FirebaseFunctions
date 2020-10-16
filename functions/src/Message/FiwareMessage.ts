import * as admin from "firebase-admin";
import { ConditionMessage, TopicMessage, TokenMessage } from "firebase-admin/lib/messaging";
import Notification from "./Notification";
import * as functions from "firebase-functions";

export default class FiwareMessage {
    private message: ConditionMessage | TopicMessage | TokenMessage

    public constructor(notification: Notification, topic?: string, token?: string, condition?: string) {
        if (topic) this.message = {notification: notification, topic: topic};
        else if (token) this.message = {notification: notification, token: token};
        else if (condition) this.message = {notification: notification, condition: condition};
        else throw new Error("An error ocurred while creating the Fiware Message")
    }

    public async sendToApp(): Promise<void> {
        const messageId = await admin.messaging().send(this.message);
        if (!messageId) throw new Error("An error ocurred while sending Fiware Message via Firebase FCM");
        functions.logger.log(messageId);
    }
}