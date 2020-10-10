export default class Notification {
    title: string;
    body: string;
    imageUrl: string | undefined;

    public constructor(title: string, body: string, imageUrl?: string) {
        this.title = title;
        this.body = body;
        this.imageUrl = imageUrl;
    }
}