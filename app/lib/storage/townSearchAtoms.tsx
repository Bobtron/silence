import {atom} from "jotai";
import {RankedAllianceMetricsById, TownSearchRow} from "@/app/lib/objects/townSearchObjects";

export const dateLastLoadedAtom = atom<Date>();
export const townSearchRowsAtom = atom<TownSearchRow[]>([]);
export const alliancesRankingsAtom = atom<RankedAllianceMetricsById>();
