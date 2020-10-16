
import IHash from "./Factory/IHash";
import SensorRepository from "./SensorRepository";
import * as functions from "firebase-functions";

export default class PayloadParser {

    public static async parsePayload(payload: IHash): Promise<IHash> { 
        let hash: IHash = {};
        hash = PayloadParser.isPayloadValid(payload);
        functions.logger.log(`isPayloadValid: ${JSON.stringify(hash)}`);
        hash = PayloadParser.addProperty(hash);
        functions.logger.log(`addProperty: ${JSON.stringify(hash)}`);
        hash = PayloadParser.addValue(hash);
        functions.logger.log(`addValue: ${JSON.stringify(hash)}`);
        hash = await PayloadParser.addDatabaseProperties(hash);
        functions.logger.log(`addDatabaseProperties: ${JSON.stringify(hash)}`);
        hash = PayloadParser.addMessageRef(hash);
        functions.logger.log(`addMessageRef: ${JSON.stringify(hash)}`);
        hash = PayloadParser.sanitizePayload(hash, ["id", hash["property"]]);
        functions.logger.log(`parsePayload.return: ${JSON.stringify(hash)}`);
        return hash;
    }

    private static isPayloadValid(payload: IHash): IHash {
        functions.logger.log(`fiwareData: ${JSON.stringify(payload.body)}`);
        if (!payload["body"]) throw new Error("Payload is empty");
        if (!Array.isArray(payload["body"]["data"])) throw new Error("Payload has incorrect format");
        return payload["body"]["data"][0];
    }

    private static addProperty(hash: IHash): IHash {
        if (!hash["controlledProperty"]) throw new Error("controlledProperty should be present in the Fiware Payload");
        const properties = Object.values(<string []>hash["controlledProperty"]);
        const keys = Object.keys(hash);
        const interseccion = properties.filter(property => keys.includes(property));
        if (interseccion.length !== 1) throw new Error("There's not match between controlledProperty and the property itself in the Fiware Payload");
        hash["property"] = interseccion[0];
        return hash;
    }

    private static addValue(hash: IHash) : IHash { 
        hash["value"] = hash[hash["property"]];
        return hash;
    }

    private static sanitizePayload(hash: IHash, properties: string[]): IHash {
        for (const property of properties){
            delete hash[property];
        }
        return hash;
    }

    private static addMessageRef(hash: IHash): IHash {
        const severity: IHash | undefined = Object.values(<IHash []>hash["levels"])
                                                  .find(level => level["min"] <= hash["value"] && level["max"] > hash["value"]); 
        if (!severity) throw new Error(`There's no mapped level of severity for property ${hash["property"]} and value ${hash["value"]} in Firebase Properties Collection`)
        hash["messageRef"] = severity["messageRef"];
        delete hash["levels"];
        return hash;
    }

    private static async addDatabaseProperties(hash: IHash): Promise<IHash> {
        const sensorRepository: SensorRepository = SensorRepository.getInstance();
        let doc: IHash;
        if (!hash["modelName"])  throw new Error("modelName should be present in the Fiware Payload");
        doc = await sensorRepository.getSensorByModelName(hash["modelName"]);
        for (const [key, value] of Object.entries(doc[hash["property"]])){
            hash[key] = value;
        }
        return hash;
    }


}