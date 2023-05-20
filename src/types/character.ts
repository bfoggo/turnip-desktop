export interface CharacterData {
    name: string;
    id: number;
    initiative: number | undefined;
    isActive: boolean;
    turnAvailable: boolean;
    characterType: number;
}