import Message from "./Message"
import Notification from "../Message/Notification";

export default class OfficialMessage extends Message {
    public constructor(notification: Notification, topic: string) {
        super(notification, topic);
    }
}