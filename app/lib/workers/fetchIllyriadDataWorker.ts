'use client';

import {Town, Player, Alliance, PlayerType} from "@/app/lib/objects/townSearchObjects";
import {X2jOptions, XMLParser} from "fast-xml-parser";
import {
  loadAlliancesFromMap,
  loadPlayersFromMap,
  loadTownsFromArray, setDataLoadDate,
} from "@/app/lib/storage/illyriadObjectsDAO";

onmessage = async (e: MessageEvent<File>): Promise<void> => {
  const xmlParserOptions: X2jOptions = {
    ignoreAttributes: false,
  }
  const xmlParser: XMLParser = new XMLParser(xmlParserOptions);

  try {
    const rawXml = await e.data.text();
    const parsedXmlObj = xmlParser.parse(rawXml);
    console.log("Parsed town data");
    const dataGenerationDateTime: Date = new Date(parsedXmlObj.towns.server.datagenerationdatetime + 'Z');

    const townsObjArr: Town[] = [];
    const playersObjMap: Map<string, Player> = new Map<string, Player>();
    const alliancesObjMap: Map<string, Alliance> = new Map<string, Alliance>();

    for (const townStruct of parsedXmlObj.towns.town) {
      const townObj: Town = {
        playerId: townStruct['player']['playername']['@_id'],
        mapX: townStruct['location']['mapx'],
        mapY: townStruct['location']['mapy'],
        terrainCombatType: townStruct['location']['terrainoveralltype']['#text'],
        townId: townStruct['towndata']['townname']['@_id'],
        townName: townStruct['towndata']['townname']['#text'],
        population: townStruct['towndata']['population'],
        isCapitalCity: townStruct['towndata']['iscapitalcity'],
        isAllianceCapitalCity: townStruct['towndata']['isalliancecapitalcity'],
      }

      const playerObj: Player = {
        playerId: townStruct['player']['playername']['@_id'],
        playerName: townStruct['player']['playername']['#text'],
        playerRace: townStruct['player']['playerrace'],
        playerType: PlayerType.Normal,
        numTowns: 0,
        numPopulation: 0,
      }

      if (townStruct['player']['playeralliance']) {
        const allianceObj: Alliance = {
          allianceId: townStruct['player']['playeralliance']['alliancename']['@_id'],
          allianceName: townStruct['player']['playeralliance']['alliancename']['#text'],
          allianceTicker: townStruct['player']['playeralliance']['allianceticker'],
          numTowns: 0,
          numPopulation: 0,
          numPlayers: 0,
        }
        playerObj.allianceId = allianceObj.allianceId;

        if (!alliancesObjMap.has(allianceObj.allianceId)) {
          alliancesObjMap.set(allianceObj.allianceId, allianceObj);
        }
      }

      townsObjArr.push(townObj);
      if (!playersObjMap.has(playerObj.playerId)) {
        playersObjMap.set(playerObj.playerId, playerObj);
      }
    }

    for (const townObj of townsObjArr) {
      const playerObj: Player = playersObjMap.get(townObj.playerId)!;
      playerObj.numTowns++;
      playerObj.numPopulation += townObj.population;
      playersObjMap.set(playerObj.playerId, playerObj);
    }

    for (const playerObj of playersObjMap.values()) {
      if (playerObj.allianceId) {
        const allianceObj: Alliance = alliancesObjMap.get(playerObj.allianceId)!;
        allianceObj.numTowns += playerObj.numTowns;
        allianceObj.numPopulation += playerObj.numPopulation;
        allianceObj.numPlayers++;
        alliancesObjMap.set(allianceObj.allianceId, allianceObj);
      }
    }

    await Promise.all([
      loadTownsFromArray(townsObjArr),
      loadPlayersFromMap(playersObjMap),
      loadAlliancesFromMap(alliancesObjMap),
    ]);

    await setDataLoadDate(dataGenerationDateTime);
    console.log("Done loading into IndexedDB");

    postMessage(null);

  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
