import { CollectionPreferencesProps } from "@cloudscape-design/components/collection-preferences";
import {RankedAllianceMetricsById, Alliance, TownSearchRow} from "../objects/townSearchObjects";
import {PropertyFilterProps, TableProps} from "@cloudscape-design/components";
import Link from "@cloudscape-design/components/link";
import {PropertyFilterProperty} from "@cloudscape-design/collection-hooks";
import FilteringOption = PropertyFilterProps.FilteringOption;
import {
  metricToLabelMap,
  metricToFilteringOptionValue,
  isAllianceIdInMetric,
  metricValueToLabel
} from "@/app/lib/config/townSearchMetrics";

export const townSearchColumnDefinitions: TableProps.ColumnDefinition<TownSearchRow>[] = [
  {
    id: "townName",
    header: "Town",
    cell: (item: TownSearchRow) => {
      return (
        <Link
          external
          href={`https://elgea.illyriad.co.uk/#/World/Map/${item.mapX}/${item.mapY}`}
        >
          {item.townName}
        </Link>
      )
    },
    sortingField: "townName",
  },
  {
    id: "playerName",
    header: "Player",
    cell: (item: TownSearchRow) => {
      return (
        <Link
          external
          href={`https://elgea.illyriad.co.uk/#/Player/Profile/${item.playerId}`}
        >
          {/*{item.playerName + (item.allianceId ? ` [${item.allianceTicker}]` : '')}*/}
          {item.playerName}
        </Link>
      )
    },
    sortingField: "playerName",
  },
  {
    id: "allianceName",
    header: "Alliance",
    cell: (item: TownSearchRow) => {
      if (item.allianceId) {
        return (
          <Link
            external
            href={`https://elgea.illyriad.co.uk/#/Alliance/Alliance/${item.allianceId}`}
          >
            {`${item.allianceName} [${item.allianceTicker}]`}
          </Link>
        )
      }
    },
    sortingField: "allianceName",
  },
  {
    id: "distance",
    header: "Distance",
    cell: (item: TownSearchRow) => item.distance,
    sortingField: "distance",
  },
  {
    id: "playerType",
    header: "Status",
    cell: (item: TownSearchRow) => item.playerType,
    sortingField: "playerType",
  },
  {
    id: "population",
    header: "Population",
    cell: (item: TownSearchRow) => item.population,
    sortingField: "population",
  },
  {
    id: "coordinateString",
    header: "Coordinates",
    cell: (item: TownSearchRow) => `(${item.mapX}, ${item.mapY})`,
    sortingField: "coordinateString",
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
  },
  {
    id: "terrainCombatType",
    header: "Combat Terrain",
    cell: (item: TownSearchRow) => item.terrainCombatType,
    sortingField: "terrainCombatType",
  },
  {
    id: "growth",
    header: "Growth Chart",
    cell: (item: TownSearchRow) => {
      return (
        <Link
          external
          href={`https://elgea.illyriad.co.uk/#/Player/Growth/${item.playerId}`}
        >
          📈📉
        </Link>
      )
    }
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
      id: "allianceName",
      visible: true,
    },
    {
      id: "distance",
      visible: true,
    },
    {
      id: "playerType",
      visible: false,
    },
    {
      id: "population",
      visible: true,
    },
    {
      id: "coordinateString",
      visible: true,
    },
    {
      id: "mapX",
      visible: false,
    },
    {
      id: "mapY",
      visible: false,
    },
    {
      id: "terrainCombatType",
      visible: true,
    },
    {
      id: "growth",
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
    alwaysVisible: true,
  },
  {
    id: "playerName",
    label: "Player Name",
    alwaysVisible: true,
  },
  {
    id: "allianceName",
    label: "Alliance Name",
    alwaysVisible: true,
  },
  {
    id: "distance",
    label: "Distance",
    alwaysVisible: true,
  },
  {
    id: "playerType",
    label: "Status",
  },
  {
    id: "population",
    label: "Population",
  },
  {
    id: "coordinateString",
    label: "Coordinates",
  },
  {
    id: "mapX",
    label: "X Coordinate",
  },
  {
    id: "mapY",
    label: "Y Coordinate",
  },
  {
    id: "terrainCombatType",
    label: "Combat Terrain",
  },
  {
    id: "growth",
    label: "Growth Chart",
  },
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

const topKValues = [10, 20, 40];
const metricTypes = ['byMemberCount', 'byTownCount', 'byPopulationCount'] as const; // Use `as const` for type safety

const dynamicFilteringOptions: FilteringOption[] = topKValues.flatMap(topK =>
  metricTypes.map(metricType => ({
    propertyKey: 'allianceId',
    value: metricToFilteringOptionValue(topK, metricType),
    label: metricToLabelMap.get(metricType)!(topK),
  }))
);

export const DEFAULT_FILTERING_OPTIONS: PropertyFilterProps.FilteringOption[] = [
  ...['500', '1000', '5000', '10000', '20000', '30000'].map(value => {
    return {
      propertyKey: 'population',
      value: value
    };
  }),
  ...[
    "Plains",
    "Small Hill",
    "Large Hill",
    "Small Forest",
    "Large Forest",
    "Small Mountain",
    "Large Mountain",
  ].map(value => {
    return {
      propertyKey: 'terrainCombatType',
      value: value,
    };
  })
];

export const FILTERING_OPTIONS: FilteringOption[] = [
  ...dynamicFilteringOptions,
  ...DEFAULT_FILTERING_OPTIONS,
];

export const GET_FILTERING_PROPERTIES =
  (allianceRankingsById?: RankedAllianceMetricsById): PropertyFilterProperty[] => {
    if (allianceRankingsById) {
      return [
        {
          key: 'allianceId',
          operators: [
            {
              operator: '=',
              match: (allianceId: any, metricValue: any) => {
                if (!allianceId) {
                  return false;
                }
                return isAllianceIdInMetric(metricValue, allianceId, allianceRankingsById);
              },
              format: (metricValue: string): string => metricValueToLabel(metricValue),
            },
            {
              operator: '!=',
              match: (allianceId: any, metricValue: any) => {
                if (!allianceId) {
                  return true;
                }
                return !isAllianceIdInMetric(metricValue, allianceId, allianceRankingsById);
              },
              format: (metricValue: string): string => metricValueToLabel(metricValue),
            },
          ],
          propertyLabel: 'Alliance',
          groupValuesLabel: 'Alliance values',
        },
        ...DEFAULT_FILTERING_PROPERTIES
      ]
    }
    return DEFAULT_FILTERING_PROPERTIES;
  };

export const DEFAULT_FILTERING_PROPERTIES: PropertyFilterProperty[] = [
  {
    key: 'population',
    operators: NUMERIC_OPERATORS,
    propertyLabel: 'Population',
    groupValuesLabel: 'Population values',
  },
  {
    key: 'terrainCombatType',
    operators: ENUM_OPERATORS,
    propertyLabel: 'Combat Terrain',
    groupValuesLabel: 'Combat Terrain values',
  },
]

export const EMPTY_FILTER_QUERY: PropertyFilterProps.Query = {
  operation: 'and',
  tokenGroups: [],
  tokens: [],
}
