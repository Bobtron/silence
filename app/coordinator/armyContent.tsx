'use client';

import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import {useState} from "react";
import {
  armyTableItemsAtom,
  expandedArmyTableItemsAtom,
  selectedArmyTableItemsAtom,
  useArmyTableItems
} from "@/app/lib/storage/armyTableAtoms";
import {ArmyTableItem} from "@/app/lib/objects/coordinatorObjects";
import {useAtom, useAtomValue} from "jotai/index";

export default function Army() {

  const armyTableItems = useAtomValue(armyTableItemsAtom);
  const expandedItems = useAtomValue(expandedArmyTableItemsAtom);
  const selectedItems = useAtomValue(selectedArmyTableItemsAtom);

  const {
    resetArmyTableItems,
    onArmyTableItemSelect,
    onArmyTableItemExpand,
  } = useArmyTableItems();

  return (
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
          id: "position",
          header: "Position",
          cell: (item: ArmyTableItem) => item.position,
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
        { id: "position", visible: true },
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
            <Button>Create resource</Button>
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
              <Button
                onClick={resetArmyTableItems}>
                Reset Table
              </Button>
              <Button variant="primary">
                Create resource
              </Button>
              <Button
                variant="normal"
                onClick={
                  () => {
                    // const selectedItemsSet: Set<string> = new Set();
                    // selectedItems.forEach((obj: {id: string}) => {
                    //   selectedItemsSet.add(obj.id);
                    // });
                    //
                    // const modifiedTableItems: ArmyTableItem[] = armyTableItems.filter((item: ArmyTableItem) => {
                    //   return !selectedItemsSet.has(item.id);
                    // });
                    // setArmyTableItems(modifiedTableItems);
                    // setSelectedItems([]);
                  }
                }
              >
                Delete resource
              </Button>
            </SpaceBetween>
          }
        >
          Table with in-context actions
        </Header>
      }
    />
  );
}