export interface CharacterData {
    name: string;
    id: number;
    characterType: number;
    initiative: number | null;
    isActive: boolean;
    turnAvailable: boolean;
}