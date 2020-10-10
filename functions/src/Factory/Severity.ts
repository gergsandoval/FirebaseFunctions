export default interface Severity {
    name: string;
    description: string;
    levels: Level [];
}

interface Level {
    name: string;
    min: number;
    max: number;
}