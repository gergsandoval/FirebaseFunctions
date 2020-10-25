import IHash from "../Factory/IHash";
import * as admin from "firebase-admin";

export default class MessageRepository {

    private static instance: MessageRepository;
    private constructor(){}

    public static getInstance(): MessageRepository {
        if (!MessageRepository.instance){
            MessageRepository.instance = new MessageRepository();
        }
        return MessageRepository.instance;
    }
    
    public async getNotificationsByMessageRef(messageRef: string): Promise<IHash[]> {
        const doc = await admin.firestore().doc(messageRef).get();
        if (!doc.exists) throw new Error("No matches in Firebase Messages Collection")
        return doc.data()?.notifications as IHash [];
    }
}