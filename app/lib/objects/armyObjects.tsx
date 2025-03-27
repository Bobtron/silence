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

export interface InputPlayer {
  playerName: string;
  description: string;
}

export interface InputTown {
  townName: string;
  description: string;
  xPos: number;
  yPos: number;
  playerId: string;
}

export interface InputArmy {
  armyName: string;
  description: string;
  speed: number;
  townId: string;
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
  nameUrl?: string;
  description?: string;
  position?: string;
  mapUrl?: string;
  speed?: number;
  children: ArmyTableItem[];
}
