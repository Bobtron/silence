'use client';

import {IDBPTransaction, openDB} from 'idb';
import {Alliance, Player, Town, TownSearchRow} from "@/app/lib/objects/townSearchObjects";

const dbPromise = () => openDB('illyriad-objects-store', 3, {
    upgrade(db) {
      db.deleteObjectStore('illyriad-towns');
      db.deleteObjectStore('illyriad-players');
      db.deleteObjectStore('illyriad-alliances');
      db.deleteObjectStore('illyriad-metadata');

      db.createObjectStore('illyriad-towns', {
        keyPath: 'townId',
      });
      db.createObjectStore('illyriad-players', {
        keyPath: 'playerId',
      });
      db.createObjectStore('illyriad-alliances', {
        keyPath: 'allianceId',
      });
      db.createObjectStore('illyriad-metadata');
    },
  });

export async function loadTownsFromArray(towns: Town[]) {
  await clearAllTowns();
  {
    const loadTownsTx = (await dbPromise()).transaction('illyriad-towns', 'readwrite');
    const addOperationsArray: Promise<IDBValidKey>[] = towns.map(town => loadTownsTx.store.add(town));
    await Promise.all(addOperationsArray);
    await loadTownsTx.done;
  }
}

export async function loadPlayersFromMap(playerMap: Map<string, Player>) {
  await clearAllPlayers();
  {
    const loadPlayersTx = (await dbPromise()).transaction('illyriad-players', 'readwrite');
    const addOperationsArray: Promise<IDBValidKey>[] = Array.from(playerMap.values()).map(player => loadPlayersTx.store.add(player));
    await Promise.all(addOperationsArray);
    await loadPlayersTx.done;
  }
}

export async function loadAlliancesFromMap(allianceMap: Map<string, Alliance>) {
  await clearAllAlliances();
  {
    const loadAlliancesTx = (await dbPromise()).transaction('illyriad-alliances', 'readwrite');
    const addOperationsArray: Promise<IDBValidKey>[] = Array.from(allianceMap.values()).map(alliance => loadAlliancesTx.store.add(alliance));
    await Promise.all(addOperationsArray);
    await loadAlliancesTx.done;
  }
}

export async function getAllTownSearchRows(): Promise<TownSearchRow[]> {
  const townsArr: Town[] = await (await dbPromise()).getAll('illyriad-towns'); //, null, 100);
  const playersArr: Player[] = await (await dbPromise()).getAll('illyriad-players');
  const playerIdToPlayerMap: Map<string, Player> = playersArr.reduce((acc, player) => acc.set(player.playerId, player), new Map<string, Player>());
  const alliancesArr: Alliance[] = await (await dbPromise()).getAll('illyriad-alliances');
  const allianceIdToAllianceMap: Map<string, Alliance> = alliancesArr.reduce((acc, alliance) => acc.set(alliance.allianceId, alliance), new Map<string, Alliance>());

  return townsArr.map(town => {
    const player = playerIdToPlayerMap.get(town.playerId)!;
    const townSearchRow: TownSearchRow = {
      townName: town.townName,
      playerName: player.playerName,
      population: town.population,
      terrainCombatType: town.terrainCombatType,
      mapX: town.mapX,
      mapY: town.mapY,
      playerRace: player.playerRace,
      isCapitalCity: town.isCapitalCity,
      isAllianceCapitalCity: town.isAllianceCapitalCity,
    }
    if (player.allianceId) {
      const alliance = allianceIdToAllianceMap.get(player.allianceId)!;
      townSearchRow.allianceName = alliance.allianceName;
      townSearchRow.allianceTicker = alliance.allianceTicker;
      townSearchRow.playerName = `${townSearchRow.playerName} [${alliance.allianceTicker}]`
    }
    return townSearchRow;
  });
}

export async function setDataLoadDate(date: Date) {
  return (await dbPromise()).put('illyriad-metadata', date, 'data-load-date');
}
export async function getDataLoadDate(): Promise<Date> {
  return (await dbPromise()).get('illyriad-metadata', 'data-load-date');
}

export async function getTownById(townId: string) {
  return (await dbPromise()).get('illyriad-towns', townId);
}
export async function setTown(town: Town) {
  return (await dbPromise()).put('illyriad-towns', town);
}
export async function delTownById(townId: string) {
  return (await dbPromise()).delete('illyriad-towns', townId);
}
export async function clearAllTowns() {
  return (await dbPromise()).clear('illyriad-towns');
}
export async function getAllTownIds() {
  return (await dbPromise()).getAllKeys('illyriad-towns');
}

export async function getPlayerById(playerId: string) {
  return (await dbPromise()).get('illyriad-players', playerId);
}
export async function setPlayer(player: Player) {
  return (await dbPromise()).put('illyriad-players', player);
}
export async function delPlayerById(playerId: string) {
  return (await dbPromise()).delete('illyriad-players', playerId);
}
export async function clearAllPlayers() {
  return (await dbPromise()).clear('illyriad-players');
}

export async function getAllianceById(allianceId: string) {
  return (await dbPromise()).get('illyriad-alliances', allianceId);
}
export async function setAlliance(alliance: Alliance) {
  return (await dbPromise()).put('illyriad-alliances', alliance);
}
export async function delAllianceById(allianceId: string) {
  return (await dbPromise()).delete('illyriad-alliances', allianceId);
}
export async function clearAllAlliances() {
  return (await dbPromise()).clear('illyriad-alliances');
}
