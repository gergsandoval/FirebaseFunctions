import * as functions from "firebase-functions";
import express, { Application, Request, Response } from "express";
import * as admin from "firebase-admin";
import PayloadParser from "./PayloadParser";
import IHash from "./Factory/IHash";
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
    functions.logger.log(`fiwareData: ${JSON.stringify(req.body)}`);
    let hash: IHash;
    let notifications: IHash [];
    const messages: Array<FiwareMessage> = [];
    const notificationFactory = new NotificationFactory();
    const fiwareMessageFactory = new FiwareMessageFactory();
    try {
        hash = await PayloadParser.parsePayload(req);
        notifications = await MessageParser.getNotifications(hash);
        notifications.forEach(async notificationParams => {
            const messageParams = notificationFactory.newNotification(notificationParams);
            const fiwareMessage = fiwareMessageFactory.newMessage(messageParams);
            messages.push(fiwareMessage);
            await fiwareMessage.sendToApp();
        });
        res.json(messages);
    } catch (err) {
        hash = {statusCode: 500, message: err.message, payload: req.body}
        res.status(500).send(hash);
    }
})


exports.notification = functions.https.onRequest(app);