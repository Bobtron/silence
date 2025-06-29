export enum PlayerType {
  Normal = "",
  Abandoned = "Abandoned",
  Banned = "Banned",
  Admin = "Developer/GM",
}

export interface RankedAllianceMetricsById {
  [key: string]: string[]; // Index signature
  byMemberCount: string[];
  byTownCount: string[];
  byPopulationCount: string[];
}

export interface TownSearchRow {
  townId: string;
  playerId: string;
  allianceId?: string;

  playerName: string;
  playerType: PlayerType;
  playerRace: string;

  allianceName?: string;
  allianceTicker?: string;

  townName: string;
  mapX: number;
  mapY: number;
  terrainCombatType: string;
  population: number;
  isCapitalCity: boolean;
  isAllianceCapitalCity: boolean;
  distance?: number;
}

export interface Player {
  playerId: string;
  playerName: string;
  playerType: PlayerType;
  playerRace: string;
  numTowns: number;
  numPopulation: number;
  allianceId?: string;
}

export interface Alliance {
  allianceId: string;
  allianceName: string;
  allianceTicker: string;
  numTowns: number;
  numPopulation: number;
  numPlayers: number;
}

export interface Town {
  townId: string;
  townName: string;
  playerId: string;
  mapX: number;
  mapY: number;
  terrainCombatType: string;
  population: number;
  isCapitalCity: boolean;
  isAllianceCapitalCity: boolean;
}
