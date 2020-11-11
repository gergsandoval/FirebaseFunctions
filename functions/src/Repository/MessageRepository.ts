import IHash from "../Factory/IHash";
import * as admin from "firebase-admin";
import FiwareError from "../Error/FiwareError";

export default class MessageRepository {

    private static instance: MessageRepository;
    private constructor(){}

    public static getInstance(): MessageRepository {
        if (!MessageRepository.instance){
            MessageRepository.instance = new MessageRepository();
        }
        return MessageRepository.instance;
    }
    
    public async getNotificationsByMessageRef(messageRef: string): Promise<IHash []> {
        const doc = await admin.firestore().doc(messageRef).get();
        if (!doc.exists) throw new FiwareError(404, "No matches in Firebase Messages Collection", MessageRepository.name, "getNotificationsByMessageRef");
        const docData = doc.data() as IHash;
        for (const notification of docData["notifications"]){
            notification["color"] = docData["color"];
        }
        return docData["notifications"];
    }
}