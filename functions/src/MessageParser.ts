import * as admin from "firebase-admin";
import IHash from "./Factory/IHash";
import * as functions from "firebase-functions";

export default class MessageParser {

    private static keyRegExp: RegExp = /(?<=#\{)\w+(?=\}#)/gi;
    private static tokenRegExp: RegExp = /#\{{1}\w+\}#{1}/gi;

    public static async getNotifications(hash: IHash): Promise<IHash[]> {
        const notificationsTemplate = await MessageParser.getNotificationsByMessageRef(hash["messageRef"]);
        return MessageParser.replaceTokens(notificationsTemplate, hash);
    }
    
    private static async getNotificationsByMessageRef(messageRef: string): Promise<IHash[]> {
        const doc = await admin.firestore().doc(messageRef).get();
        if (!doc.exists) throw new Error("No matches in Firebase Messages Collection")
        return doc.data()?.notifications as IHash [];
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
                throw new Error("There's no enough keys in the payload to replace the notification template");
        }
        return notificationKeys;
    }


}