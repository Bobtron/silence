'use client';

import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import {useEffect, useState} from "react";
import Spinner from "@cloudscape-design/components/spinner";
import FormField from "@cloudscape-design/components/form-field";
import FileUpload from "@cloudscape-design/components/file-upload";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Form from "@cloudscape-design/components/form";
import Link from "@cloudscape-design/components/link";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import {useAtom} from "jotai/index";
import {dateLastLoadedAtom} from "../lib/storage/townSearchAtoms";
import {getDataLoadDate} from "@/app/lib/storage/illyriadObjectsDAO";

export function TownDataLoader() {
  const [fetchingData, setFetchingData] = useState(false);
  const [townsXMLFileList, setTownsXMLFileList] = useState<File[]>([]);
  const [loadDataExpanded, setLoadDataExpanded] = useState(true);

  const [dateLastLoaded, setDateLastLoaded] = useAtom(dateLastLoadedAtom);

  const analyzeDataFiles = () => {
    const townDataWorker = new Worker(new URL("../lib/workers/fetchIllyriadDataWorker.ts", import.meta.url));

    townDataWorker.onmessage = (e: MessageEvent<null>) => {
      getDataLoadDate().then((date: Date | undefined) => {
        setDateLastLoaded(date);
      });
      setLoadDataExpanded(false);
      setFetchingData(false);
    };

    if (townsXMLFileList.length > 0) {
      setFetchingData(true);
      townDataWorker.postMessage(townsXMLFileList[0]);
    }
  }

  useEffect(() => {
    getDataLoadDate().then((date: Date | undefined) => {
      setDateLastLoaded(date);
    });
  }, [])

  return (
    <ExpandableSection
      variant="container"
      headerText="Load Illyriad data from datafiles"
      headerDescription={
        "Last loaded: " + (dateLastLoaded ? dateLastLoaded.toUTCString() : "No data loaded")
      }
      headerActions={
        fetchingData && <Spinner size="big"/>
      }
      expanded={loadDataExpanded}
      onChange={({detail}) => setLoadDataExpanded(detail.expanded)}
    >
      <form onSubmit={async e => {
        e.preventDefault();

        analyzeDataFiles();
      }}>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                formAction="none"
                variant="link"
                onClick={() => setLoadDataExpanded(false)}
              >
                Cancel
              </Button>
              <Button variant="primary">Submit</Button>
            </SpaceBetween>
          }
          header={<Header variant="h1"></Header>}
        >
          <Container>
            <SpaceBetween direction="horizontal" size="l">
              <FormField
                label="Download Link for Towns XML File"
                description="Do NOT click this link. RIGHT CLICK -> Save Link As..."
                warningText="Directly clicking this link may crash your browser. RIGHT CLICK -> Save Link As..."
              >
                <Link
                  external
                  href="https://data-root.illyriad.co.uk/datafile_towns.xml"
                  variant="primary"
                >
                  datafile_towns.xml
                </Link>
              </FormField>
              <FormField
                label="Use downloaded Towns XML File"
                description="Select the downloaded Towns XML file"
              >
                <FileUpload
                  onChange={({ detail }) => {
                    setTownsXMLFileList(detail.value);
                  }}
                  value={townsXMLFileList}
                  i18nStrings={{
                    uploadButtonText: e =>
                      e ? "Choose files" : "Choose file",
                    dropzoneText: e =>
                      e
                        ? "Drop files to upload"
                        : "Drop file to upload",
                    removeFileAriaLabel: e =>
                      `Remove file ${e + 1}`,
                    limitShowFewer: "Show fewer files",
                    limitShowMore: "Show more files",
                    errorIconAriaLabel: "Error",
                    warningIconAriaLabel: "Warning"
                  }}
                  showFileLastModified
                  showFileSize
                  showFileThumbnail
                  tokenLimit={3}
                  constraintText="File will be used client-side only"
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </Form>
      </form>
    </ExpandableSection>
  )
}
