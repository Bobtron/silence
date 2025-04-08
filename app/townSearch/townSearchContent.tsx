'use client';

import {TownDataLoader} from "@/app/townSearch/townDataLoader";
import TownSearchTable from "@/app/townSearch/townSearchTable";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function TownSearch() {

  return (
    <>
      <SpaceBetween
        size="l"
      >
        <TownDataLoader/>
        <TownSearchTable/>
      </SpaceBetween>
    </>
  )
}
