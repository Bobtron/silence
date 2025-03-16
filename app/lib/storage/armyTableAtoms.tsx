import { atomWithStorage, RESET } from 'jotai/utils'
import {InitialPlayers, InitialTowns} from "@/app/lib/constants/coordinatorConstants";
import {Army, ArmyTableItem, Player, Town} from "@/app/lib/objects/coordinatorObjects";
import {useSetAtom} from "jotai/react";
import { atom } from 'jotai';
import {useAtom} from "jotai/index";
import {TableProps} from "@cloudscape-design/components";
import ExpandableItemToggleDetail = TableProps.ExpandableItemToggleDetail;

export const armyTableItemsAtom = atomWithStorage<ArmyTableItem[]>(
  'armyContentTableItemsAtom',
  [],
);

export const idAtom = atomWithStorage('idAtom', 0);
export const playerAtom = atomWithStorage('playerAtom', new Map<string, Player>());
export const townAtom = atomWithStorage('townAtom', new Map<string, Town>());
export const armyAtom = atomWithStorage('armyAtom', new Map<string, Army>());

export const selectedArmyTableItemsAtom = atom<ArmyTableItem[]>([])
export const expandedArmyTableItemsAtom = atom<ArmyTableItem[]>([])

export function useArmyTableItems() {
  const [armyTableItems, setArmyTableItems] = useAtom(armyTableItemsAtom);

  const [players, setPlayers] = useAtom(playerAtom);
  const [towns, setTowns] = useAtom(townAtom);
  const [armies, setArmies] = useAtom(armyAtom);

  const [selectedArmyTableItems, setSelectedArmyTableItems] = useAtom(selectedArmyTableItemsAtom);
  const [expandedArmyTableItems, setExpandedArmyTableItems] = useAtom(expandedArmyTableItemsAtom);

  let tempArmyTableItems: ArmyTableItem[] = armyTableItems;
  let tempPlayers: Map<string, Player> = players;
  let tempTowns: Map<string, Town> = towns;
  let tempArmies: Map<string, Army> = armies;

  function addPlayerToTemp (player: Player): void {
    if (!tempPlayers.has(player.id)) {
      tempPlayers.set(player.id, player);
      tempArmyTableItems = [
        ...tempArmyTableItems,
        {
          id: player.id,
          name: player.playerName,
          children: [],
        }
      ]
    }
  }

  function addTownToTemp(town: Town): void {
    if (!tempTowns.has(town.id)) {
      tempTowns.set(town.id, town);
      const townArmyTableItem: ArmyTableItem = {
        id: town.id,
        name: town.townName,
        description: town.description,
        position: `(${town.xPos}, ${town.yPos})`,
        children: [],
      };
      tempArmyTableItems = tempArmyTableItems.map((item: ArmyTableItem) => {
        if (item.id === town.playerId) {
          return {
            ...item,
            children: [...item.children, townArmyTableItem],
          }
        }
        return item;
      });
    }
  }

  const updateArmyTable = (newPlayers: Player[], newTowns: Town[], newArmies: Army[]): void => {
    for (const player of newPlayers) {
      addPlayerToTemp(player);
    }

    for (const town of newTowns) {
      addTownToTemp(town);
    }

    setArmyTableItems(tempArmyTableItems);
    setPlayers(tempPlayers);
    setTowns(tempTowns);
    setArmies(tempArmies);
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
    tempArmyTableItems = [];
    tempPlayers = new Map<string, Player>();
    tempTowns = new Map<string, Town>();
    tempArmies = new Map<string, Army>();

    updateArmyTable(InitialPlayers, InitialTowns, []);
  };

  return {
    resetArmyTableItems,
    onArmyTableItemSelect,
    onArmyTableItemExpand,
  };
}
