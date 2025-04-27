import {RankedAllianceMetricsById} from "@/app/lib/objects/townSearchObjects";

export const metricToLabelMap: Map<string, (topK: number) => string> = new Map<string, (topK: number) => string>([
  ['byMemberCount', (topK: number) => `Top ${topK} by Players`],
  ['byTownCount', (topK: number) => `Top ${topK} by Towns`],
  ['byPopulationCount', (topK: number) => `Top ${topK} by Population`],
]);

export const metricToFilteringOptionValue = (topK: number, metric: string) => {
  return `${metric}_${topK}`;
};

export const metricValueToLabel = (metricValue: string) => {
  const [metric, topK] = metricValue.split('_');
  return metricToLabelMap.get(metric)!(parseInt(topK));
};

export const isAllianceIdInMetric =
  (filteringOptionValue: string, allianceId: string, allAllianceMetrics: RankedAllianceMetricsById): boolean => {
    const [metric, topK] = filteringOptionValue.split('_');
    const topKInt = parseInt(topK);
    const orderedAllianceIds = allAllianceMetrics[metric];
    const indexOfAllianceId = orderedAllianceIds.findIndex((currentAllianceId, index, arr) => currentAllianceId === allianceId);
    return indexOfAllianceId != -1 && indexOfAllianceId < topKInt;
  };
