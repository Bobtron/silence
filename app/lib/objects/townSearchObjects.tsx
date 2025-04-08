export interface TownSearchRow {
  townName: string;
  playerName: string;
  distance?: number;
  population: number;
  allianceName?: string;
  allianceTicker?: string;
  terrainCombatType: string;
  mapX: number;
  mapY: number;
  playerRace: string;
  isCapitalCity: boolean;
  isAllianceCapitalCity: boolean;
}

export interface Player {
  playerId: string;
  playerName: string;
  playerRace: string;
  allianceId?: string;
}

export interface Alliance {
  allianceId: string;
  allianceName: string;
  allianceTicker: string;
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
