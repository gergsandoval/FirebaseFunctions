import IHash from "../Factory/IHash";
import * as admin from "firebase-admin";
import FiwareError from "../Error/FiwareError";

export default class SensorRepository {

    private static instance: SensorRepository;
    private constructor(){}

    public static getInstance(): SensorRepository {
        if (!SensorRepository.instance){
            SensorRepository.instance = new SensorRepository();
        }
        return SensorRepository.instance;
    }
    
    public async getSensorByModelName(modelName: string): Promise<IHash> {
        const querySnapshot = await admin.firestore().collection("Sensors")
                                         .where("modelName", "==", modelName).limit(1).get();
        if (!querySnapshot.docs[0]) throw new FiwareError(404, "No matches in Firebase Sensors Collection", SensorRepository.name, "getSensorByModelName");
        return querySnapshot.docs[0].data() as IHash;
    }
}