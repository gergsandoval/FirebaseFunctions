import * as admin from "firebase-admin";

export default class HistoricRepository {

    private static instance: HistoricRepository;
    private constructor(){}

    public static getInstance(): HistoricRepository {
        if (!HistoricRepository.instance){
            HistoricRepository.instance = new HistoricRepository();
        }
        return HistoricRepository.instance;
    }

    public async saveNotification(message: any) {
        const query = await admin.firestore().collection("History").where("topic", "==", message.topic).limit(1).get();
        for (const doc of query.docs) {
            await admin.firestore().collection("History").doc(doc.id).update
            ({notifications: admin.firestore.FieldValue.arrayUnion({title: message.notification.title, body: message.notification.body, date: admin.firestore.Timestamp.fromDate(new Date())})})
        }
    }
    

}