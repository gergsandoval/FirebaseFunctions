import FiwareMessage from "../Message/FiwareMessage";
import IHash from "./IHash";
import * as functions from "firebase-functions";

export default class FiwareMessageFactory {

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
        if (!keys.includes("notification")) throw new Error("Message.notification");
        if (types.filter(type => keys.includes(type)).length !== 1) throw new Error("Message.type");
        return this.createMessage(params);
    }
}