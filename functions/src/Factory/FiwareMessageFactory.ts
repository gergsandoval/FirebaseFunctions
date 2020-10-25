import FiwareMessage from "../Message/FiwareMessage";
import IHash from "./IHash";
import * as functions from "firebase-functions";
import FiwareError from "../Error/FiwareError";

export default class FiwareMessageFactory {

    private static instance: FiwareMessageFactory;
    private constructor() {}

    public static getInstance(): FiwareMessageFactory {
        if (!FiwareMessageFactory.instance){
            FiwareMessageFactory.instance = new FiwareMessageFactory()
        }
        return FiwareMessageFactory.instance;
    }

    private createMessage(params: IHash): FiwareMessage {
        let message: FiwareMessage;
        if (params["topic"]) message = new FiwareMessage(params["notification"], params["topic"])
        else if (params["token"]) message =  new FiwareMessage(params["notification"], undefined, params["token"]);
        else message = new FiwareMessage(params["notification"], undefined, undefined, params["condition"]);
        return message;
    }

    public newMessage(params: IHash): FiwareMessage {
        const keys = Object.keys(params);
        functions.logger.log(`keys: ${JSON.stringify(keys)}`);
        const types = ["topic", "token", "condition"];
        functions.logger.log(`types: ${JSON.stringify(types)}`);
        if (!keys.includes("notification")) throw new FiwareError(500, "There's no notification in the Message parameters", FiwareMessageFactory.name, "newMessage");
        if (types.filter(type => keys.includes(type)).length !== 1) throw new FiwareError(500, "There's more than one MessageType (Token, Topic, Condition) in the Message parameters", FiwareMessageFactory.name, "newMessage");
        return this.createMessage(params);
    }
}