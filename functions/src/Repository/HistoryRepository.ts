import * as admin from "firebase-admin";
import IHash from "../Factory/IHash";

export default class HistoryRepository {

    private static instance: HistoryRepository;
    private constructor(){}

    public static getInstance(): HistoryRepository {
        if (!HistoryRepository.instance){
            HistoryRepository.instance = new HistoryRepository();
        }
        return HistoryRepository.instance;
    }

    private async getDocument(topic: string): Promise<IHash | null> { 
        const query = await admin.firestore().collection("Users").where("topic", "==", topic).limit(1).get();
        if (query.docs.length === 0) return null
        const doc = query.docs[0].data() as IHash;
        doc["id"] = query.docs[0].id;
        return doc;
    }

    private updateNotifications(notifications: IHash, message: any): IHash {
        const notification = {
            title: message.notification.title,
            body: message.notification.body,
            date: admin.firestore.Timestamp.fromDate(new Date()),
            color: message.android.notification.color,
        }
        const updatedNotifications = Object.values(notifications)
        updatedNotifications.unshift(notification);
        return updatedNotifications;
    }

    public async saveNotification(message: any) {
        const document: IHash | null = await this.getDocument(message.topic);
        if (!document) return;
        const updatedNotifications = this.updateNotifications(document["notifications"], message);
        await admin.firestore().collection("Users").doc(document["id"]).set({notifications: updatedNotifications}, {merge: true});
    }
    

}