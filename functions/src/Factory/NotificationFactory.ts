import IHash from "./IHash";
import Notification from "../Message/Notification";

export default class NotificationFactory {

   private createNotification(params : IHash) : IHash {
        const messageParams: IHash = {};
        const notification = new Notification(params["title"], params["body"]);
        if (params["imageUrl"]) notification.setImageUrl(params["imageUrl"]);
        messageParams["notification"] = notification;
        messageParams["topic"] = params["topic"];
        return messageParams;
   }

    public newNotification(params : IHash): IHash {
        const keys = Object.keys(params);
        if (!keys.includes("title")) throw new Error("Notification.title");
        else if (!keys.includes("body")) throw new Error("Notification.body");
        return this.createNotification(params);
    }
}