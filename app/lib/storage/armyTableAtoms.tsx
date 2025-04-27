import {atomWithStorage, createJSONStorage} from 'jotai/utils'
import {ExamplePlayers, ExampleTowns} from "@/app/lib/config/coordinatorConfig";
import {
  Army,
  ArmyTableItem,
  ArmyTableItemType,
  InputArmy,
  InputPlayer,
  InputTown,
  Player,
  Town
} from "@/app/lib/objects/armyObjects";
import {atom} from 'jotai';
import {useAtom} from "jotai/index";
import {TableProps} from "@cloudscape-design/components";
import ExpandableItemToggleDetail = TableProps.ExpandableItemToggleDetail;

interface MapStorage {
  dataType: string;
  value: Array<[any, any]>;
}

// Refer to
// https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
// https://jotai.org/docs/utilities/storage
// https://github.com/pmndrs/jotai/blob/main/src/vanilla/utils/atomWithStorage.ts

// If we use the default JSON storage it can't serialize or deserialize Map objects properly
// Note that if any object has a key called 'dataType' and a value called 'Map', it will be
// incorrectly deserialized into a Map object
const jsonStorage = createJSONStorage<any>(() => localStorage, {
  replacer: (key, value: any) => {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  },
  reviver: (key, value: MapStorage | any) => {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  },
})

export const addPlayerModalVisibleAtom = atom(false);
export const addTownModalVisibleAtom = atom(false);
export const addArmyModalVisibleAtom = atom(false);

export const playerAtom = atomWithStorage<Map<string, Player>>('playerAtom', new Map<string, Player>(), jsonStorage);
export const townAtom = atomWithStorage<Map<string, Town>>('townAtom', new Map<string, Town>(), jsonStorage);
export const armyAtom = atomWithStorage<Map<string, Army>>('armyAtom', new Map<string, Army>(), jsonStorage);

export const selectedArmyTableItemsAtom = atom<ArmyTableItem[]>([])
export const expandedArmyTableItemsAtom = atom<ArmyTableItem[]>([])

export const armyTableItemsAtom = atom<ArmyTableItem[]>(
  (get): ArmyTableItem[] => {
    console.log("LOADING TABLE ARMY ATOM")

    let tempPlayers: Map<string, Player> = new Map<string, Player>(get(playerAtom));
    let tempTowns: Map<string, Town> = new Map<string, Town>(get(townAtom));
    let tempArmies: Map<string, Army> = new Map<string, Army>(get(armyAtom));

    let armyTableItems: ArmyTableItem[] = Array.from(tempPlayers).map(([, player]: [string, Player]) => {
      return {
        id: player.id,
        type: ArmyTableItemType.Player,
        name: player.playerName,
        children: player.townIds.map(townId => {
          const town = tempTowns.get(townId)!;

          const townArmyTableItem: ArmyTableItem = {
            id: town.id,
            type: ArmyTableItemType.Town,
            name: town.townName,
            description: town.description,
            position: `(${town.xPos}, ${town.yPos})`,
            children: [],
          };

          return townArmyTableItem;
        }),
      };
    });

    // TODO: add armies

    return armyTableItems;
  }
);

export function useArmyTableItems() {
  const [players, setPlayers] = useAtom(playerAtom);
  const [towns, setTowns] = useAtom(townAtom);
  const [armies, setArmies] = useAtom(armyAtom);

  const [selectedArmyTableItems, setSelectedArmyTableItems] = useAtom(selectedArmyTableItemsAtom);
  const [expandedArmyTableItems, setExpandedArmyTableItems] = useAtom(expandedArmyTableItemsAtom);

  let tempPlayers: Map<string, Player> = new Map<string, Player>(players);
  let tempTowns: Map<string, Town> = new Map<string, Town>(towns);
  let tempArmies: Map<string, Army> = new Map<string, Army>(armies);

  function addPlayerToTemp (player: Player): void {
    if (!tempPlayers.has(player.id)) {
      tempPlayers.set(player.id, player);
    }
  }

  function addTownToTemp(town: Town): void {
    if (!tempTowns.has(town.id)) {
      tempTowns.set(town.id, town);
      tempPlayers.get(town.playerId)!.townIds.push(town.id);
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
    tempPlayers.delete(player.id);
  }

  function removeTownFromTemp(town: Town) {
    const townOwner = tempPlayers.get(town.playerId)!;
    const updatedTownOwner = {
      ...townOwner,
      townIds: townOwner.townIds.filter(townId => townId != town.id),
    }
    tempPlayers.set(town.playerId, updatedTownOwner);

    tempTowns.delete(town.id);
  }

  function removeArmyFromTemp(army: Army) {
    throw new Error('Function not implemented.');
  }

  const deleteFromArmyTable = (
    removePlayers: Player[], removeTowns: Town[], removeArmies: Army[]
  ): void => {
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

  const onArmyTableAddInput = (
    newInputPlayers: InputPlayer[], newInputTowns: InputTown[], newInputArmies: InputArmy[]
  ): void => {
    const playersToAdd: Player[] = [];
    const townsToAdd: Town[] = [];

    for (const newInputPlayer of newInputPlayers) {
      const player: Player = {
        ...newInputPlayer,
        id: self.crypto.randomUUID().substring(0, 8),
        townIds: [],
        type: ArmyTableItemType.Player,
      };
      playersToAdd.push(player);
    }

    for (const newInputTown of newInputTowns) {
      const town: Town = {
        ...newInputTown,
        id: self.crypto.randomUUID().substring(0, 8),
        armyIds: [],
        type: ArmyTableItemType.Town,
      };
      townsToAdd.push(town);
    }

    updateArmyTable(playersToAdd, townsToAdd, []);
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
    const tempSelectedArmyTableItems = selectedArmyTableItems;
    tempPlayers = new Map<string, Player>(players);
    tempTowns = new Map<string, Town>(towns);
    tempArmies = new Map<string, Army>(armies);

    for (const item of tempSelectedArmyTableItems) {
      if (item.children.length > 0) {
        // TODO: Set error message here
        alert("Delete the inside first")
        return;
      }
    }

    const playersToDelete: Player[] = tempSelectedArmyTableItems
      .filter(item => item.type === ArmyTableItemType.Player)
      .map(item => tempPlayers.get(item.id)!);
    const townsToDelete: Town[] = tempSelectedArmyTableItems
      .filter(item => item.type === ArmyTableItemType.Town)
      .map(item => tempTowns.get(item.id)!);
    const armiesToDelete: Army[] = tempSelectedArmyTableItems
      .filter(item => item.type === ArmyTableItemType.Army)
      .map(item => tempArmies.get(item.id)!);

    deleteFromArmyTable(playersToDelete, townsToDelete, armiesToDelete);
    setExpandedArmyTableItems((prev: ArmyTableItem[]) => {
      return prev.filter((itemExpanded: ArmyTableItem) => {
        tempSelectedArmyTableItems.forEach(itemToDelete => {
          if (itemExpanded.id === itemToDelete.id) {
            return false;
          }
        });
        return true;
      });
    });
    setSelectedArmyTableItems([]);
  }

  return {
    onArmyTableAddInput,
    onArmyTableExampleUse,
    onArmyTableItemSelect,
    onArmyTableItemExpand,
    onArmyTableDeleteAll,
    onArmyTableDeleteSelected,
  };
}
