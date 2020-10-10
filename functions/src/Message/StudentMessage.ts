import Message from "./Message"
import Notification from "../Message/Notification";

export default class StudentMessage extends Message {
    public constructor(notification: Notification, topic: string) {
        super(notification, topic);
    }
}