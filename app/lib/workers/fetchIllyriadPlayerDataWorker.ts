'use client';

import {Player, Race} from "@/app/lib/objects/townSearchObjects";
import {X2jOptions, XMLParser} from "fast-xml-parser";

onmessage = async (e: MessageEvent<null>): Promise<void> => {
  console.log("Main script fetches player data");

  const xmlParserOptions: X2jOptions = {
    ignoreAttributes: false,
    transformTagName: false,
  }
  const xmlParser: XMLParser = new XMLParser(xmlParserOptions);
  const url = "https://api.allorigins.win/raw?url=https://data-root.illyriad.co.uk/datafile_players.xml";
  const playersMap = new Map<string, Player>();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    console.log("Fetched player data");
    const rawXml = await response.text();
    const parsedXmlObj = xmlParser.parse(rawXml);
    console.log("Parsed player data");

    parsedXmlObj.playerdata.players.player.forEach((player: any) => {
      let playerRace: Race;

      switch (player.race['@_id']) {
        case "1":
          playerRace = Race.Human;
          break;
        case "2":
          playerRace = Race.Elf;
          break;
        case "3":
          playerRace = Race.Dwarf;
          break;
        case "4":
          playerRace = Race.Orc;
          break;
        default:
          throw new Error(`Unknown race ${player.race['@_id']}`);
      }

      const playerData: Player = {
        playerId: player.playername['@_id'],
        playerName: player.playername['#text'],
        race: playerRace,
      };

      if (player.allianceId) {
        playerData.allianceId = player.allianceId['@_id'];
      }

      playersMap.set(playerData.playerId, playerData);
    });

  } catch (error: any) {
    console.error(error);
  }

  postMessage(playersMap);
};

