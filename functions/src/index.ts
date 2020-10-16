import * as functions from "firebase-functions";
import express, { Application, Request, Response } from "express";
import * as admin from "firebase-admin";
import PayloadParser from "./PayloadParser";
import MessageParser from "./MessageParser";
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
            const fiwareMessage = fiwareMessageFactory.newMessage(messageParams);
            messages.push(fiwareMessage);
            await fiwareMessage.sendToApp();
        });
        res.json(messages);
    } catch (err) {
        res.status(500).send({statusCode: 500, message: err.message});
    }
})

const initializeFactories = () => {
    const notificationFactory = NotificationFactory.getInstance();
    const fiwareMessageFactory = FiwareMessageFactory.getInstance();
    return {notificationFactory, fiwareMessageFactory}
}


exports.notification = functions.https.onRequest(app);