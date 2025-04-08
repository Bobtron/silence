import {atom} from "jotai";
import {TownSearchRow} from "@/app/lib/objects/townSearchObjects";

export const dateLastLoadedAtom = atom<Date | null>();
export const townSearchRowsAtom = atom<TownSearchRow[]>([]);
