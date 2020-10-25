import IHash from "./IHash";
import * as colorString from "color-string";

export default class AndroidConfig {
    ttl: number;
    notification: IHash  
    
    public constructor(color: any) {
        this.ttl = 0;
        this.notification = {color: this.convertColorStringToHex(color)}
    }

    private convertColorStringToHex(color: string) {
        const hexColor = colorString.get.rgb(color);
        return colorString.to.hex(<number[]>hexColor);
    }
    
}
