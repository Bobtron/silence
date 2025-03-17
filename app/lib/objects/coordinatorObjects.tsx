export enum Race {
  Human = "Human",
  Elf = "Elf",
  Dwarf = "Dwarf",
  Orc = "Orc",
}

export enum ArmyTableItemType {
  Player = "Player",
  Town = "Town",
  Army = "Army",
}

export interface Player {
  id: string;
  type: ArmyTableItemType.Player;
  playerName: string;
  description: string;
  // race: Race;
  // timezone: string; // TODO this needs to be timezone object
  townIds: string[];
}

export interface Town {
  id: string;
  type: ArmyTableItemType.Town;
  townName: string;
  description: string;
  xPos: number;
  yPos: number;
  playerId: string;
  armyIds: string[];
}

export interface Army {
  id: string;
  type: ArmyTableItemType.Army;
  armyName: string;
  description: string;
  speed: number;
  townId: string;
}

export interface ArmyTableItem {
  id: string;
  type: ArmyTableItemType;
  name: string;
  description?: string;
  position?: string;
  speed?: number;
  children: ArmyTableItem[];
}
