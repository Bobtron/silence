'use client';

import React, {useEffect, useState} from 'react';
import {PropertyFilterProperty, useCollection} from '@cloudscape-design/collection-hooks';
import {
  Box,
  Button,
  CollectionPreferences,
  Container,
  Form,
  FormField,
  Header,
  Input,
  Pagination,
  PropertyFilter,
  SpaceBetween,
  Table,
} from '@cloudscape-design/components';
import {
  townSearchColumnDefinitions,
  CONTENT_DISPLAY_OPTIONS,
  DEFAULT_PREFERENCES, EMPTY_FILTER_QUERY, GET_FILTERING_PROPERTIES, FILTERING_OPTIONS
} from '../lib/config/townSearchConfig';
import {useAtom} from "jotai/index";
import {alliancesRankingsAtom, townSearchRowsAtom} from "@/app/lib/storage/townSearchAtoms";
import {RankedAllianceMetricsById, TownSearchRow} from "@/app/lib/objects/townSearchObjects";
import {getAllAlliancesRankings, getAllTownSearchRows, getDataLoadDate} from "@/app/lib/storage/illyriadObjectsDAO";

function EmptyState(props: any) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {props.title}
      </Box>
      <Box variant="p" padding={{ bottom: 's' }} color="inherit">
        {props.subtitle}
      </Box>
      {props.action}
    </Box>
  );
}

export default function TownSearchTable() {
  const [townSearchRows, setTownSearchRows] = useAtom(townSearchRowsAtom);
  const [alliancesRankings, setAlliancesRankings] = useAtom(alliancesRankingsAtom);

  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [xPosStr, setXPos] = useState("");
  const [yPosStr, setYPos] = useState("");
  const [maxDistanceStr, setMaxDistance] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(false);

  const { items, actions, filteredItemsCount, collectionProps, propertyFilterProps, paginationProps } = useCollection(
    townSearchRows,
    {
      propertyFiltering: {
        filteringProperties: GET_FILTERING_PROPERTIES(alliancesRankings),
        empty: <EmptyState title="No towns"/>,
        noMatch: <EmptyState
          title="No matches"
          action={
            <Button
              onClick={
                () => {
                  actions.setPropertyFiltering(EMPTY_FILTER_QUERY)
                }
              }
            >
              Clear filters
            </Button>
          }
        />,
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: {
        defaultState: {
          sortingColumn: {
            sortingField: 'distance',
          },
          isDescending: false,
        }
      },
      selection: {},
    }
  );

  const onTownSearch = () => {
    setIsTableLoading(true);
    getAllTownSearchRows().then((allTowns: TownSearchRow[]) => {
      const xPos = parseInt(xPosStr);
      const yPos = parseInt(yPosStr);
      const maxDistance = parseFloat(maxDistanceStr);

      const maxDistanceSq = maxDistance * maxDistance;
      const filteredTowns: TownSearchRow[] = allTowns.filter(town => {
        const deltaX = Math.abs(town.mapX - xPos);
        const deltaY = Math.abs(town.mapY - yPos);
        const distanceSq = deltaX * deltaX + deltaY * deltaY;
        return distanceSq <= maxDistanceSq;
      });
      const filteredTownsWithDistance: TownSearchRow[] = filteredTowns.map(town => {
        const deltaX = Math.abs(town.mapX - xPos);
        const deltaY = Math.abs(town.mapY - yPos);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return {...town, distance: parseFloat(distance.toFixed(2))};
      })
      setTownSearchRows(filteredTownsWithDistance);
      setIsTableLoading(false);
    });
    getAllAlliancesRankings().then((alliancesRankings: RankedAllianceMetricsById) => {
      setAlliancesRankings(alliancesRankings);
    });
  }

  useEffect(() => {
    getAllAlliancesRankings().then((alliancesRankings: RankedAllianceMetricsById) => {
      setAlliancesRankings(alliancesRankings);
    })
  }, [])

  return (
    <>
      <Table
        {...collectionProps}
        items={items}
        columnDefinitions={townSearchColumnDefinitions}
        columnDisplay={preferences.contentDisplay}
        stripedRows={preferences.stripedRows}
        contentDensity={preferences.contentDensity}
        header={
          <SpaceBetween direction="vertical" size="xs">
            <Header
              counter={filteredItemsCount ? `(${filteredItemsCount}/${townSearchRows.length})` : `(${townSearchRows.length})`}
              variant="h1"
            >
              Towns
            </Header>
            <SpaceBetween direction="horizontal" size="l">
              <FormField label="X Position">
                <Input
                  inputMode="numeric"
                  type="number"
                  onChange={({detail}) => setXPos(detail.value)}
                  value={xPosStr}
                  placeholder="0"
                />
              </FormField>
              <FormField label="Y Position">
                <Input
                  inputMode="numeric"
                  type="number"
                  onChange={({detail}) => setYPos(detail.value)}
                  value={yPosStr}
                  placeholder="0"
                />
              </FormField>
              <FormField label="Max Distance">
                <Input
                  inputMode="numeric"
                  type="number"
                  onChange={({detail}) => setMaxDistance(detail.value)}
                  value={maxDistanceStr}
                  placeholder="100"
                />
              </FormField>
              <FormField label="Search for Towns">
                <Button
                  variant="primary"
                  onClick={onTownSearch}
                >
                  Search
                </Button>
              </FormField>
            </SpaceBetween>
          </SpaceBetween>
        }
        pagination={<Pagination {...paginationProps} />}
        filter={
          <PropertyFilter
            {...propertyFilterProps}
            expandToViewport={true}
            enableTokenGroups={true}
            filteringPlaceholder="Filter Towns in Range"
            filteringOptions={FILTERING_OPTIONS}
            onChange={(event) => {
                console.log(event);
                propertyFilterProps.onChange(event);
              }
            }
          />
        }
        preferences={
          <CollectionPreferences
            pageSizePreference={{
              options: [
                { value: 10, label: "10 Towns" },
                { value: 20, label: "20 Towns" },
                { value: 50, label: "50 Towns" },
                { value: 100, label: "100 Towns" }
              ]
            }}
            stripedRowsPreference={{}}
            contentDensityPreference={{}}
            contentDisplayPreference={{options: CONTENT_DISPLAY_OPTIONS}}
            preferences={preferences}
            onConfirm={({ detail }) => setPreferences(detail)}
          />
        }
      />
    </>
  );
}
