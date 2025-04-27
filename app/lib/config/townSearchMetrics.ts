import {RankedAllianceMetricsById} from "@/app/lib/objects/townSearchObjects";

export const metricToLabelMap = {
  byMemberCount: (topK: number) => `Top ${topK} by Players`,
  byTownCount: (topK: number) => `Top ${topK} by Towns`,
  byPopulationCount: (topK: number) => `Top ${topK} by Population`,
}

export const metricToFilteringOptionValue = (topK: number, metric: string) => {
  return `${metric}_${topK}`;
}

export const isAllianceIdInMetric =
  (filteringOptionValue: string, allianceId: string, allAllianceMetrics: RankedAllianceMetricsById): boolean => {
    const [metric, topK] = filteringOptionValue.split('_');
    const topKInt = parseInt(topK);
    const orderedAllianceIds = allAllianceMetrics[metric];
    const indexOfAllianceId = orderedAllianceIds.findIndex((currentAllianceId, index, arr) => currentAllianceId === allianceId);
    return indexOfAllianceId != -1 && indexOfAllianceId < topKInt;
  };
