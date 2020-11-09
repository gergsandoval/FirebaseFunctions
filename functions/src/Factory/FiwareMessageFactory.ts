import FiwareMessage from "../Message/FiwareMessage";
import IHash from "./IHash";
import * as functions from "firebase-functions";
import FiwareError from "../Error/FiwareError";
import AndroidConfig from "./AndroidConfig";

export default class FiwareMessageFactory {

    private static instance: FiwareMessageFactory;
    private constructor() {}

    public static getInstance(): FiwareMessageFactory {
        if (!FiwareMessageFactory.instance){
            FiwareMessageFactory.instance = new FiwareMessageFactory()
        }
        return FiwareMessageFactory.instance;
    }

    private createMessage(notificationsParams: IHash, messageParams: IHash): FiwareMessage {
        let message: FiwareMessage;
        if (notificationsParams["topic"]) message = new FiwareMessage(messageParams["notification"], new AndroidConfig(notificationsParams["color"]), notificationsParams["topic"])
        else if (notificationsParams["token"]) message =  new FiwareMessage(messageParams["notification"], new AndroidConfig(notificationsParams["color"]), undefined, notificationsParams["token"]);
        else message = new FiwareMessage(messageParams["notification"], new AndroidConfig(messageParams["color"]), undefined, undefined, notificationsParams["condition"]);
        return message;
    }

    public newMessage(notificationsParams: IHash, messageParams: IHash): FiwareMessage {
        const keys = Object.keys(notificationsParams);
        functions.logger.log(`keys: ${JSON.stringify(keys)}`);
        const types = ["topic", "token", "condition"];
        functions.logger.log(`types: ${JSON.stringify(types)}`);
        if (!messageParams["notification"]) throw new FiwareError(500, "There's no notification in the Message parameters", FiwareMessageFactory.name, "newMessage");
        if (types.filter(type => keys.includes(type)).length !== 1) throw new FiwareError(500, "There's more than one MessageType (Token, Topic, Condition) in the Message parameters", FiwareMessageFactory.name, "newMessage");
        return this.createMessage(notificationsParams, messageParams);
    }
}