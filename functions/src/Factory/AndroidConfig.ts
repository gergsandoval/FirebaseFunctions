import IHash from "./IHash";
import * as colorString from "color-string";

export default class AndroidConfig {
    ttl: number;
    notification: IHash  
    
    public constructor(color: string) {
        this.ttl = 0;
        this.notification = {color: this.colorStringToHex(color)}
    }

    private colorStringToHex(color: string) {
        const hexColor = colorString.get.rgb(color);
        return colorString.to.hex(<number[]>hexColor);
    }
    
}
