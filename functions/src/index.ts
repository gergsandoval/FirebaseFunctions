import * as functions from "firebase-functions";
import express, { Application, Request, Response } from "express";
import * as admin from "firebase-admin";
import MessageFactory from "./Factory/MessageFactory"
import OficialMessageFactory from "./Factory/OficialMessageFactory";
import StaffMessageFactory from "./Factory/StaffMessageFactory";
import StudentMessageFactory from "./Factory/StudentMessageFactory";
import Notification from "./Message/Notification";
import Message from "./Message/Message"

const cors = require("cors"); 
const app: Application = express();
app.use(cors({origin:true}));
app.use(express.json());
admin.initializeApp(functions.config().firebase);

app.post("/", async (req: Request, res: Response) => {
    functions.logger.log(`fiwareData: ${req.body}`);
    const factories = initializeFactories();
    const messages: Array<Message | null> = new Array();
    factories.forEach(factory => {
        const notification: Notification | null = factory.createNotification(req.body.data[0]);
        functions.logger.log(`factory.createNotification: ${notification}`);
        const message: Message | null = factory.createMessage(notification, factory.getTopic())
        functions.logger.log(`factory.createMessage: ${message}`);
        messages.push(message);
        message?.sendToApp();
    })
    res.json(messages);
})

const initializeFactories = () => {
    const factories: Array<MessageFactory> = new Array(3);
    factories[0] = OficialMessageFactory.getInstance();
    factories[1] = StaffMessageFactory.getInstance();
    factories[2] = StudentMessageFactory.getInstance();
    return factories;
}

exports.notification = functions.https.onRequest(app);