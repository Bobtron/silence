import {atomWithStorage} from 'jotai/utils'
import {ExamplePlayers, ExampleTowns} from "@/app/lib/constants/coordinatorConstants";
import {Army, ArmyTableItem, ArmyTableItemType, Player, Town} from "@/app/lib/objects/coordinatorObjects";
import {atom} from 'jotai';
import {useAtom} from "jotai/index";
import {TableProps} from "@cloudscape-design/components";
import ExpandableItemToggleDetail = TableProps.ExpandableItemToggleDetail;

export const idAtom = atomWithStorage('idAtom', 0);
export const playerAtom = atomWithStorage('playerAtom', new Map<string, Player>());
export const townAtom = atomWithStorage('townAtom', new Map<string, Town>());
export const armyAtom = atomWithStorage('armyAtom', new Map<string, Army>());

export const selectedArmyTableItemsAtom = atom<ArmyTableItem[]>([])
export const expandedArmyTableItemsAtom = atom<ArmyTableItem[]>([])

export const armyTableItemsAtom = atom<ArmyTableItem[]>(
  (get): ArmyTableItem[] => {
    let armyTableItems: ArmyTableItem[] = Array.from(get(playerAtom)).map(([, player]: [string, Player]) => {
      return {
        id: player.id,
        type: ArmyTableItemType.Player,
        name: player.playerName,
        children: [],
      };
    });

    // TODO: This is O(n^2), simplify to O(n). Ideally create a map of these ids, which only at the end get converted
    // into an array for the armyTableItems.
    Array.from(get(townAtom)).forEach(([, town]: [string, Town]) => {
      armyTableItems = armyTableItems.map((item: ArmyTableItem) => {
        if (item.id === town.playerId) {
          const townArmyTableItem: ArmyTableItem = {
            id: town.id,
            type: ArmyTableItemType.Town,
            name: town.townName,
            description: town.description,
            position: `(${town.xPos}, ${town.yPos})`,
            children: [],
          };
          return {
            ...item,
            children: [...item.children, townArmyTableItem],
          };
        }
        return item;
      });
    });

    // TODO: add armies

    return armyTableItems;
  }
);

export function useArmyTableItems() {
  const [armyTableItems, setArmyTableItems] = useAtom(armyTableItemsAtom);

  const [players, setPlayers] = useAtom(playerAtom);
  const [towns, setTowns] = useAtom(townAtom);
  const [armies, setArmies] = useAtom(armyAtom);

  const [selectedArmyTableItems, setSelectedArmyTableItems] = useAtom(selectedArmyTableItemsAtom);
  const [expandedArmyTableItems, setExpandedArmyTableItems] = useAtom(expandedArmyTableItemsAtom);

  let tempPlayers: Map<string, Player> = players;
  let tempTowns: Map<string, Town> = towns;
  let tempArmies: Map<string, Army> = armies;

  function addPlayerToTemp (player: Player): void {
    if (!tempPlayers.has(player.id)) {
      tempPlayers.set(player.id, player);
    }
  }

  function addTownToTemp(town: Town): void {
    if (!tempTowns.has(town.id)) {
      tempTowns.set(town.id, town);
    }
  }

  const updateArmyTable = (newPlayers: Player[], newTowns: Town[], newArmies: Army[]): void => {
    for (const player of newPlayers) {
      addPlayerToTemp(player);
    }
    for (const town of newTowns) {
      addTownToTemp(town);
    }

    setPlayers(tempPlayers);
    setTowns(tempTowns);
    setArmies(tempArmies);
  }

  function removePlayerFromTemp(player: Player) {

  }

  function removeTownFromTemp(town: Town) {

  }

  function removeArmyFromTemp(army: Army) {
    throw new Error('Function not implemented.');
  }

  const deleteFromArmyTable = (removePlayers: Player[], removeTowns: Town[], removeArmies: Army[]): void => {
    for (const player of removePlayers) {
      removePlayerFromTemp(player);
    }
    for (const town of removeTowns) {
      removeTownFromTemp(town);
    }
    for (const army of removeArmies) {
      removeArmyFromTemp(army);
    }

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

  const onArmyTableExampleUse =  () => {
    tempPlayers = new Map<string, Player>();
    tempTowns = new Map<string, Town>();
    tempArmies = new Map<string, Army>();

    updateArmyTable(ExamplePlayers, ExampleTowns, []);

    setSelectedArmyTableItems([])
    setExpandedArmyTableItems([]);
  };

  const onArmyTableDeleteAll = () => {
    setSelectedArmyTableItems([]);
    setExpandedArmyTableItems([]);
    setPlayers(new Map<string, Player>());
    setTowns(new Map<string, Town>());
    setArmies(new Map<string, Army>());
  };

  const onArmyTableDeleteSelected = () => {
    for (const item of selectedArmyTableItems) {
      if (item.children.length > 0) {
        // TODO: Set error message here
        alert("Delete the inside first")
        return;
      }
    }

    const playersToDelete: Player[] = selectedArmyTableItems
      .filter(item => item.type === ArmyTableItemType.Player)
      .map(item => tempPlayers.get(item.id)!);
    const townsToDelete: Town[] = selectedArmyTableItems
      .filter(item => item.type === ArmyTableItemType.Town)
      .map(item => tempTowns.get(item.id)!);
    const armiesToDelete: Army[] = selectedArmyTableItems
      .filter(item => item.type === ArmyTableItemType.Army)
      .map(item => tempArmies.get(item.id)!);

    deleteFromArmyTable(playersToDelete, townsToDelete, armiesToDelete);
    setSelectedArmyTableItems([]);
    setExpandedArmyTableItems((prev: ArmyTableItem[]) => {
      return prev.filter((itemExpanded: ArmyTableItem) => {
        selectedArmyTableItems.forEach(itemToDelete => {
          if (itemExpanded.id === itemToDelete.id) {
            return false;
          }
        });
        return true;
      });
    });
  }

  return {
    onArmyTableExampleUse,
    onArmyTableItemSelect,
    onArmyTableItemExpand,
    onArmyTableDeleteAll,
    onArmyTableDeleteSelected,
  };
}
