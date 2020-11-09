import * as functions from "firebase-functions";
import express, { Application, Request, Response } from "express";
import * as admin from "firebase-admin";
import PayloadParser from "./Parser/PayloadParser";
import MessageParser from "./Parser/MessageParser";
import NotificationFactory from "./Factory/NotificationFactory";
import FiwareMessage from "./Message/FiwareMessage";
import FiwareMessageFactory from "./Factory/FiwareMessageFactory";

const cors = require("cors"); 
const app: Application = express();
app.use(cors({origin:true}));
app.use(express.json());
admin.initializeApp(functions.config().firebase);

app.post("/", async (req: Request, res: Response) => {
    const messages: Array<FiwareMessage> = [];
    try {
        const hash = await PayloadParser.parsePayload(req);
        const notifications = await MessageParser.getNotifications(hash);
        const {notificationFactory, fiwareMessageFactory} = initializeFactories();
        notifications.forEach(async notificationParams => {
            const messageParams = notificationFactory.newNotification(notificationParams);
            const fiwareMessage = fiwareMessageFactory.newMessage(notificationParams, messageParams);
            messages.push(fiwareMessage);
            await fiwareMessage.sendToApp();
        });
        res.json(messages);
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        res.status(error.statusCode).send(error);
    }
})

const initializeFactories = () => {
    const notificationFactory = NotificationFactory.getInstance();
    const fiwareMessageFactory = FiwareMessageFactory.getInstance();
    return {notificationFactory, fiwareMessageFactory}
}

exports.notification = functions.https.onRequest(app);

exports.insertUserData = functions.auth.user().onCreate(async user => {
    const uid = user.uid
    const topic: string | undefined = user.email?.substring(0, user.email?.indexOf("@"))
    const doc = {notifications: [], topic: topic?.toLowerCase(), topicDescription: ""}
    await admin.firestore().collection("Users").doc(uid).set(doc, {merge: true});
});



