import { atomWithStorage, RESET } from 'jotai/utils'
import {InitialPlayers, InitialArmyContentTableItems, InitialTowns} from "@/app/lib/constants/coordinatorConstants";
import {Army, ArmyTableItem, Player, Town} from "@/app/lib/objects/coordinatorObjects";
import {useSetAtom} from "jotai/react";
import { atom } from 'jotai';
import {useAtom} from "jotai/index";
import {TableProps} from "@cloudscape-design/components";
import ExpandableItemToggleDetail = TableProps.ExpandableItemToggleDetail;
// import {atom} from "jotai/vanilla/atom";

export const armyTableItemsAtom = atomWithStorage<ArmyTableItem[]>(
  'armyContentTableItemsAtom',
  [],
);

export const idAtom = atomWithStorage('idAtom', 0);
export const playerAtom = atomWithStorage('playerAtom', new Map());
export const townAtom = atomWithStorage('townAtom', new Map());
export const armyAtom = atomWithStorage('armyAtom', new Map());

export const selectedArmyTableItemsAtom = atom<ArmyTableItem[]>([])
export const expandedArmyTableItemsAtom = atom<ArmyTableItem[]>([])

export function useArmyTableItems() {
  const setArmyTableItems = useSetAtom(armyTableItemsAtom);

  const [players, setPlayers] = useAtom(playerAtom);
  const [towns, setTowns] = useAtom(townAtom);
  const [armies, setArmies] = useAtom(armyAtom);

  const [selectedArmyTableItems, setSelectedArmyTableItems] = useAtom(selectedArmyTableItemsAtom);
  const [expandedArmyTableItems, setExpandedArmyTableItems] = useAtom(expandedArmyTableItemsAtom);

  const addPlayer = (player: Player) => {
    if (!players.has(player.id)) {
      setPlayers((prev) => {
        const newPlayersMap = new Map(prev);
        newPlayersMap.set(player.id, player);
        return newPlayersMap;
      })
      setArmyTableItems((prev: ArmyTableItem[]) => {
        return [...prev, {
          id: player.id,
          name: player.playerName,
          children: [],
        }]
      })
    }
  }

  const addTown= (town: Town) => {
    if (!towns.has(town.id)) {
      setTowns((prev) => {
        const newTownsMap = new Map(prev);
        newTownsMap.set(town.id, town);
        return newTownsMap;
      });
      setArmyTableItems((prev: ArmyTableItem[])=> {
        const townArmyTableItem: ArmyTableItem = {
          id: town.id,
          name: town.townName,
          description: town.description,
          position: `(${town.xPos}, ${town.yPos})`,
          children: [],
        }

        return prev.map((item: ArmyTableItem) => {
          if (item.id === town.playerId) {
            return {
              ...item,
              children: [...item.children, townArmyTableItem],
            }
          }
          return item;
        });
      });
    }
  }

  const addArmy = (army: Army)=> {

  }

  const onArmyTableItemSelect = (items: ArmyTableItem[]) => {
    setSelectedArmyTableItems(items);
  }

  const onArmyTableItemExpand = (detail: ExpandableItemToggleDetail<ArmyTableItem>) => {
    setExpandedArmyTableItems((prev: ArmyTableItem[]) => {
      if (detail.expanded) {
        return [...prev, detail.item];
      } else {
        return prev.filter((item: ArmyTableItem) => {
          return item.id != detail.item.id;
        });
      }
    });
  }

  const resetArmyTableItems =  () => {
    setArmyTableItems(RESET);
    setPlayers(RESET);
    setTowns(RESET);

    for (const player of InitialPlayers) {
      addPlayer(player);
    }

    for (const town of InitialTowns) {
      addTown(town);
    }
  };

  return {
    resetArmyTableItems,
    addPlayer,
    addTown,
    onArmyTableItemSelect,
    onArmyTableItemExpand,
  };
}
