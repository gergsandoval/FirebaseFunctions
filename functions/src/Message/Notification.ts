export default class Notification {
    title: string
    body: string
    imageUrl: string | undefined;

    public constructor(title: string, body: string) {
        this.title = title;
        this.body = body;
    }

    public setImageUrl(imageUrl: string): void {
        this.imageUrl = imageUrl;
    }
}