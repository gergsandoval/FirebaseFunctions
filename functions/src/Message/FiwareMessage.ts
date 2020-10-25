import * as admin from "firebase-admin";
import { ConditionMessage, TopicMessage, TokenMessage } from "firebase-admin/lib/messaging";
import Notification from "./Notification";
import * as functions from "firebase-functions";
import FiwareError from "../Error/FiwareError";

export default class FiwareMessage {
    private message: ConditionMessage | TopicMessage | TokenMessage

    public constructor(notification: Notification, android: admin.messaging.AndroidConfig, topic?: string, token?: string, condition?: string) {
        if (topic) this.message = {notification: notification, topic: topic, android: android};
        else if (token) this.message = {notification: notification, token: token, android: android};
        else if (condition) this.message = {notification: notification, condition: condition, android: android};
        else throw new FiwareError(500, "Couldn't create Fiware Message", FiwareMessage.name, "constructor");
    }

    public async sendToApp(): Promise<void> {
        const messageId = await admin.messaging().send(this.message);
        if (!messageId) throw new FiwareError(500, "An error ocurred while sending Fiware Message via Firebase FCM", FiwareMessage.name, "sendToApp");
        functions.logger.log(messageId);
    }
}