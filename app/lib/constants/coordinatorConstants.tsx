import {ArmyTableItem, Player, Town} from "@/app/lib/objects/coordinatorObjects";

export const InitialPlayers: Player[] = [
  {
    id: "0",
    playerName: "Council of Illyria",
    description: "",
    townIds: [],
  },
  {
    id: "1",
    playerName: "Clan Dollogh",
    description: "",
    townIds: [],
  },
  {
    id: "2",
    playerName: "Undying Flame",
    description: "",
    townIds: [],
  },
]

export const InitialTowns: Town[] = [
  {
    id: "4",
    townName: "Centrum",
    description: "",
    xPos: 0,
    yPos: 0,
    playerId: "0",
    armyIds: [],
  },
  {
    id: "5",
    townName: "Hastelbury",
    description: "",
    xPos: -152,
    yPos: 54,
    playerId: "0",
    armyIds: [],
  },
  {
    id: "6",
    townName: "Trottingham",
    description: "",
    xPos: 113,
    yPos: -72,
    playerId: "0",
    armyIds: [],
  },
  {
    id: "7",
    townName: "Lasthold",
    description: "",
    xPos: -651,
    yPos: -2382,
    playerId: "1",
    armyIds: [],
  },
  {
    id: "8",
    townName: "Verity City",
    description: "",
    xPos: -923,
    yPos: 113,
    playerId: "2",
    armyIds: [],
  },
]
