import IHash from "../Factory/IHash";
import * as functions from "firebase-functions";
import MessageRepository from "../Repository/MessageRepository";
import FiwareError from "../Error/FiwareError";

export default class MessageParser {

    private static keyRegExp: RegExp = /(?<=#\{)\w+(?=\}#)/gi;
    private static tokenRegExp: RegExp = /#\{{1}\w+\}#{1}/gi;

    public static async getNotifications(hash: IHash): Promise<IHash[]> {
        const messageRepository = MessageRepository.getInstance();
        let notifications = await messageRepository.getNotificationsByMessageRef(hash["messageRef"]);
        notifications = MessageParser.replaceTokens(notifications, hash);
        return MessageParser.addTopic(hash, notifications);
    }

    private static addTopic(hash: IHash, notifications: IHash []): IHash [] {
        for (const notification of Object.values(notifications)){
            const topic = notification["topic"] as String
            const institucion = hash["institucion"] as String
            if (topic.toLowerCase() !== "funcionario") {
                notification["topic"] = `${institucion}${topic}`.toLowerCase();
            } else {
                notification["topic"] = `${topic}${functions.config().notification.hotel}`.toLowerCase();
            }
        }
        functions.logger.log("addTopic: ", JSON.stringify(notifications));
        return notifications
    } 

    private static replaceTokens(notifications: IHash[], hash: IHash): IHash [] {
        for (const notification of Object.values(notifications)){
            let notificationBody = notification["body"] as string;
            const tokens: RegExpMatchArray | null = MessageParser.getTokens(notificationBody);
            const keys: RegExpMatchArray | null = MessageParser.getKeys(notificationBody, hash);
            if (keys && tokens) {
                tokens.forEach((token, index) => {
                    notificationBody = notificationBody.replace(token, hash[keys[index]]);
                })
                notification["body"] = notificationBody;
            }
        }
        return notifications;
    }

    private static getTokens(notificationBody: string): RegExpMatchArray | null {
        return notificationBody.match(MessageParser.tokenRegExp);
    }

    private static getKeys(notificationBody: string, hash: IHash): RegExpMatchArray | null {
        const notificationKeys: RegExpMatchArray | null = notificationBody.match(MessageParser.keyRegExp);
        functions.logger.log(`notificationKeys: ${JSON.stringify(notificationKeys)}`);
        const hashKeys = Object.keys(hash);
        functions.logger.log(`hashKeys: ${JSON.stringify(hashKeys)}`);
        if (notificationKeys) {
            if(!notificationKeys.every(notificationKey => hashKeys.includes(notificationKey)))
                throw new FiwareError(400, "There's no enough keys in the payload to replace the notification template", MessageParser.name, MessageParser.getKeys.name);
        }
        return notificationKeys;
    }


}