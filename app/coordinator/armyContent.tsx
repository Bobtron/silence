'use client';

import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import {
  addPlayerModalVisibleAtom, addTownModalVisibleAtom,
  armyTableItemsAtom,
  expandedArmyTableItemsAtom,
  selectedArmyTableItemsAtom,
  useArmyTableItems
} from "@/app/lib/storage/armyTableAtoms";
import {ArmyTableItem} from "@/app/lib/objects/armyObjects";
import {useAtom, useAtomValue, useSetAtom} from "jotai/index";
import { ButtonDropdown } from "@cloudscape-design/components";
import { AddPlayerModal, AddTownModal } from "./armyModal";

export default function Army() {

  const armyTableItems = useAtomValue(armyTableItemsAtom);
  const expandedItems = useAtomValue(expandedArmyTableItemsAtom);
  const selectedItems = useAtomValue(selectedArmyTableItemsAtom);

  const setAddPlayerModalVisible = useSetAtom(addPlayerModalVisibleAtom);
  const setAddTownModalVisible = useSetAtom(addTownModalVisibleAtom);

  const {
    onArmyTableExampleUse,
    onArmyTableItemSelect,
    onArmyTableItemExpand,
    onArmyTableDeleteAll,
    onArmyTableDeleteSelected,
  } = useArmyTableItems();

  return (
    <>
      <AddPlayerModal />
      <AddTownModal />
      <Table
        onSelectionChange={({ detail }) =>
          onArmyTableItemSelect(detail.selectedItems)
        }
        selectedItems={selectedItems}
        columnDefinitions={[
          {
            id: "id",
            header: "id",
            cell: (item: ArmyTableItem) => item.id,
            isRowHeader: true,
          },
          {
            id: "name",
            header: "Player/Town/Army Name",
            cell: (item: ArmyTableItem) => item.name,
          },
          {
            id: "description",
            header: "Description",
            cell: (item: ArmyTableItem) => item.description,
          },
          {
            id: "position",
            header: "Position",
            cell: (item: ArmyTableItem) => item.position,
          },
          {
            id: "speed",
            header: "Speed",
            cell: (item: ArmyTableItem) => item.speed,
          },
        ]}
        expandableRows={{
          getItemChildren: (item: ArmyTableItem) => item.children ?? [],
          isItemExpandable: (item: ArmyTableItem) => item.children.length > 0,
          expandedItems: expandedItems,
          onExpandableItemToggle: ({ detail }) =>{
            onArmyTableItemExpand(detail)
          }
        }}
        columnDisplay={[
          { id: "id", visible: false },
          { id: "name", visible: true },
          { id: "description", visible: true},
          { id: "position", visible: true },
          { id: "speed", visible: true },
        ]}
        enableKeyboardNavigation
        items={armyTableItems}
        loadingText="Loading resources"
        selectionType="single"
        trackBy="id"
        empty={
          <Box
            margin={{ vertical: "xs" }}
            textAlign="center"
            color="inherit"
          >
            <SpaceBetween size="m">
              <b>No resources</b>
              <Button
                variant="primary"
                onClick={onArmyTableExampleUse}
              >Use examples</Button>
            </SpaceBetween>
          </Box>
        }
        header={
          <Header
            counter={
              // "(" + (selectedItems.length ? selectedItems.length + "/" : "") + armyTableItems.length + ")"
              "(" + selectedItems.length + ")"
            }
            actions={
              <SpaceBetween
                direction="horizontal"
                size="xs"
              >
                <ButtonDropdown
                  items={[
                    {
                      text: "Add",
                      items: [
                        { text: "Add Player", id: "addPlayer" },
                        { text: "Add Town", id: "addTown" },
                        { text: "Add Army", id: "addArmy"},
                      ]
                    },
                    {
                      text: "Delete",
                      items: [
                        { text: "Delete selected", id: "deleteSelected" },
                        { text: "Delete all", id: "deleteAll"}
                      ]
                    },
                    { text: "Use examples", id: "example" }
                  ]}
                  onItemClick={({detail})=> {
                    switch (detail.id) {
                      case "addPlayer":
                        setAddPlayerModalVisible(true);
                        // let uuid = self.crypto.randomUUID();
                        // alert(uuid);
                        break;
                      case "addTown":
                        setAddTownModalVisible(true);
                        break;
                      case "example":
                        onArmyTableExampleUse();
                        break;
                      case "deleteSelected":
                        onArmyTableDeleteSelected();
                        break;
                      case "deleteAll":
                        onArmyTableDeleteAll();
                        break;
                      default:
                        alert(detail.id);
                        break;
                    }
                  }}
                  variant="primary"
                >
                  Edit
                </ButtonDropdown>
              </SpaceBetween>
            }
          >
            Table with in-context actions
          </Header>
        }
      />
    </>
  );
}
