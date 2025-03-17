import {ArmyTableItemType, Player, Town} from "@/app/lib/objects/coordinatorObjects";

export const ExamplePlayers: Player[] = [
  {
    id: "0",
    type: ArmyTableItemType.Player,
    playerName: "Council of Illyria",
    description: "",
    townIds: [],
  },
  {
    id: "1",
    type: ArmyTableItemType.Player,
    playerName: "Clan Dollogh",
    description: "",
    townIds: [],
  },
  {
    id: "2",
    type: ArmyTableItemType.Player,
    playerName: "Undying Flame",
    description: "",
    townIds: [],
  },
]

export const ExampleTowns: Town[] = [
  {
    id: "4",
    type: ArmyTableItemType.Town,
    townName: "Centrum",
    description: "",
    xPos: 0,
    yPos: 0,
    playerId: "0",
    armyIds: [],
  },
  {
    id: "5",
    type: ArmyTableItemType.Town,
    townName: "Hastelbury",
    description: "",
    xPos: -152,
    yPos: 54,
    playerId: "0",
    armyIds: [],
  },
  {
    id: "6",
    type: ArmyTableItemType.Town,
    townName: "Trottingham",
    description: "",
    xPos: 113,
    yPos: -72,
    playerId: "0",
    armyIds: [],
  },
  {
    id: "7",
    type: ArmyTableItemType.Town,
    townName: "Lasthold",
    description: "",
    xPos: -651,
    yPos: -2382,
    playerId: "1",
    armyIds: [],
  },
  {
    id: "8",
    type: ArmyTableItemType.Town,
    townName: "Verity City",
    description: "",
    xPos: -923,
    yPos: 113,
    playerId: "2",
    armyIds: [],
  },
]
