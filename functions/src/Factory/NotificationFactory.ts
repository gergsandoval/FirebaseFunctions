import IHash from "./IHash";
import Notification from "../Message/Notification";
import FiwareError from "../Error/FiwareError";

export default class NotificationFactory { 
    
    private static instance: NotificationFactory;
    private constructor() {}

    public static getInstance(): NotificationFactory {
        if (!NotificationFactory.instance){
            NotificationFactory.instance = new NotificationFactory()
        }
        return NotificationFactory.instance;
    }

    private createNotification(params : IHash) : IHash {
        const messageParams: IHash = {};
        const notification = new Notification(params["title"], params["body"]);
        if (params["imageUrl"]) notification.setImageUrl(params["imageUrl"]);
        messageParams["notification"] = notification;
        messageParams["topic"] = params["topic"];
        messageParams["color"] = params["color"];
        return messageParams;
    }

    public newNotification(params : IHash): IHash {
        const keys = Object.keys(params);
        if (!keys.includes("title")) throw new FiwareError(500, "There's no title in the Notification parameters", NotificationFactory.name, "newNotification");
        else if (!keys.includes("body")) throw new FiwareError(500, "There's no body in the Notification parameters", NotificationFactory.name, "newNotification");
        return this.createNotification(params);
    }
}