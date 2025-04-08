import { CollectionPreferencesProps } from "@cloudscape-design/components/collection-preferences";
import { TownSearchRow } from "../objects/townSearchObjects";
import {PropertyFilterProps, TableProps} from "@cloudscape-design/components";

export const columnDefinitions: TableProps.ColumnDefinition<TownSearchRow>[] = [
  {
    id: "townName",
    header: "Town Name",
    cell: (item: TownSearchRow) => item.townName,
    sortingField: "townName",
  },
  {
    id: "playerName",
    header: "Player Name",
    cell: (item: TownSearchRow) => item.playerName,
    sortingField: "playerName",
  },
  {
    id: "distance",
    header: "Distance",
    cell: (item: TownSearchRow) => item.distance,
    sortingField: "distance",
  },
  {
    id: "population",
    header: "Population",
    cell: (item: TownSearchRow) => item.population,
    sortingField: "population",
  },
  {
    id: "mapX",
    header: "X Coordinate",
    cell: (item: TownSearchRow) => item.mapX,
    sortingField: "mapX",
  },
  {
    id: "mapY",
    header: "Y Coordinate",
    cell: (item: TownSearchRow) => item.mapY,
    sortingField: "mapY",
  }
]

export const DEFAULT_PREFERENCES: CollectionPreferencesProps.Preferences ={
  pageSize: 50,
  contentDisplay: [
    {
      id: "townName",
      visible: true,
    },
    {
      id: "playerName",
      visible: true,
    },
    {
      id: "distance",
      visible: true,
    },
    {
      id: "population",
      visible: true,
    },
    {
      id: "mapX",
      visible: true,
    },
    {
      id: "mapY",
      visible: true,
    }
  ],
  stripedRows: true,
  contentDensity: 'compact',
}

export const CONTENT_DISPLAY_OPTIONS: CollectionPreferencesProps.ContentDisplayOption[] = [
  {
    id: "townName",
    label: "Town Name",
    alwaysVisible: true
  },
  {
    id: "playerName",
    label: "Player Name",
    alwaysVisible: true
  },
  {
    id: "distance",
    label: "Distance",
    alwaysVisible: true
  },
  {
    id: "population",
    label: "Population",
  },
  {
    id: "mapX",
    label: "X Coordinate",
  },
  {
    id: "mapY",
    label: "Y Coordinate",
  }
]

export const ENUM_OPERATORS = [
  { operator: '=', tokenType: 'enum' },
  { operator: '!=', tokenType: 'enum' },
  ':',
  '!:',
  '^',
  '!^',
] as const;

export const NUMERIC_OPERATORS = [
  "=", "!=", ">", "<", "<=", ">=",
] as const;

export const DEFAULT_FILTERING_OPTIONS: PropertyFilterProps.FilteringOption[] = [
  ...['500', '1000', '5000', '10000', '20000', '30000'].map(value => {
    return {
      propertyKey: 'population',
      value: value
    };
  })
]

export const DEFAULT_FILTERING_PROPERTIES: PropertyFilterProps.FilteringProperty[] = [
  {
    key: 'population',
    operators: NUMERIC_OPERATORS,
    propertyLabel: 'Population',
    groupValuesLabel: 'Population values',
  },
]
