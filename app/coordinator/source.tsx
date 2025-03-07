'use client';

import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import {useState} from "react";

interface Source {
  id: string;
  playerName: string;
  townName: string;
  xPos: number;
  yPos: number;
}

export default function Source() {
  const [
    selectedItems,
    setSelectedItems
  ] = useState<Array<{ id: string }>>([]);

  const [
    tableItems,
    setTableItems
  ] = useState([
    {
      id: "0",
      playerName: "King Sigurd",
      townName: "Centrum",
      xPos: 0,
      yPos: 0,
    },
    {
      id: "1",
      playerName: "Clan Dollogh",
      townName: "Lasthold",
      xPos: -651,
      yPos: -2382,
    },
    {
      id: "2",
      playerName: "Undying Flame",
      townName: "Verity City",
      xPos: -923,
      yPos: 113,
    },
    {
      id: "3",
      playerName: "Brotherhood of Kerala",
      townName: "City of Temples",
      xPos: -321,
      yPos: -847,
    }
  ])


  return (
    <Table
      onSelectionChange={({ detail }) => {
          setSelectedItems(detail.selectedItems.map(obj => ({id: obj.id})));
        }
      }
      selectedItems={selectedItems}
      columnDefinitions={[
        {
          id: "playerName",
          header: "Player",
          cell: (item: Source) => item.playerName,
        },
        {
          id: "townName",
          header: "Town",
          cell: (item: Source) => item.townName,
        },
        {
          id: "xPos",
          header: "X Position",
          cell: (item: Source) => item.xPos,
        },
        {
          id: "yPos",
          header: "Y Position",
          cell: (item: Source) => item.yPos,
        }
      ]}
      columnDisplay={[
        { id: "playerName", visible: true },
        { id: "townName", visible: true },
        { id: "xPos", visible: true },
        { id: "yPos", visible: true },
      ]}
      enableKeyboardNavigation
      items={tableItems}
      loadingText="Loading resources"
      selectionType="multi"
      stickyColumns={{ first: 0, last: 1 }}
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
            "(" + (selectedItems.length ? selectedItems.length + "/" : "") + tableItems.length + ")"
          }
          actions={
            <SpaceBetween
              direction="horizontal"
              size="xs"
            >
              <Button>Secondary button</Button>
              <Button variant="primary">
                Create resource
              </Button>
              <Button
                variant="normal"
                onClick={
                  () => {
                    const selectedItemsSet: Set<string> = new Set();
                    selectedItems.forEach((obj: {id: string}) => {
                      selectedItemsSet.add(obj.id);
                    });

                    const modifiedTableItems: Source[] = tableItems.filter((item: Source) => {
                      return !selectedItemsSet.has(item.id);
                    });
                    setTableItems(modifiedTableItems);
                    setSelectedItems([]);
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