'use client';

import {Town, Player, Alliance} from "@/app/lib/objects/townSearchObjects";
import {X2jOptions, XMLParser} from "fast-xml-parser";
import {
  clearAllTowns,
  getAllTownIds, getAllTownSearchRows, loadAlliancesFromMap,
  loadPlayersFromMap,
  loadTownsFromArray, setDataLoadDate,
  setTown
} from "@/app/lib/storage/illyriadObjectsDAO";

onmessage = async (e: MessageEvent<File>): Promise<void> => {
  console.log("Main script fetches town data");

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
      }

      if (townStruct['player']['playeralliance']) {
        const allianceObj: Alliance = {
          allianceId: townStruct['player']['playeralliance']['alliancename']['@_id'],
          allianceName: townStruct['player']['playeralliance']['alliancename']['#text'],
          allianceTicker: townStruct['player']['playeralliance']['allianceticker'],
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

    await Promise.all([
      loadTownsFromArray(townsObjArr),
      loadPlayersFromMap(playersObjMap),
      loadAlliancesFromMap(alliancesObjMap),
    ]);

    await setDataLoadDate(dataGenerationDateTime);
    console.log("Done loading into IndexedDB");

    postMessage(await getAllTownSearchRows());

  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

