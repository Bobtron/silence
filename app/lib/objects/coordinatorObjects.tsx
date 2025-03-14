export enum Race {
  Human = "Human",
  Elf = "Elf",
  Dwarf = "Dwarf",
  Orc = "Orc",
}

export interface Player {
  id: string;
  playerName: string;
  description: string;
  // race: Race;
  // timezone: string; // TODO this needs to be timezone object
  townIds: string[];
}

export interface Town {
  id: string;
  townName: string;
  description: string;
  xPos: number;
  yPos: number;
  playerId: string;
  armyIds: string[];
}

export interface Army {
  id: string;
  armyName: string;
  description: string;
  speed: number;
  townId: string;
}

export interface ArmyTableItem {
  id: string;
  name: string;
  description?: string;
  position?: string;
  speed?: number;
  children: ArmyTableItem[];
}
