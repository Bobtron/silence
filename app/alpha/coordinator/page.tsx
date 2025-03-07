'use client';
import React, {useState} from 'react';
import {
  AppLayout, AppLayoutProps,
  BreadcrumbGroup, Container, ContentLayout,
  Flashbar, Header,
  HelpPanel, Link, NonCancelableCustomEvent,
  SideNavigation,
  SplitPanel,
} from '@cloudscape-design/components';
import {I18nProvider} from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import Source from '../../coordinator/source';
import Target from '../../coordinator/target';
import Arrival from '../../coordinator/arrival';
import Army from '../../coordinator/army';
import ChangeDetail = AppLayoutProps.ChangeDetail;

const LOCALE = 'en';

const ReadMe = () => <div>Home page, read me is work in progress.</div>;
// const SourceCities = () => <div>Source Cities content</div>;
// const Targets = () => <div>Targets content</div>;
// const ArrivalTimes = () => <div>Arrival Times content</div>;
// const Armies = () => <div>Armies content</div>;

export default function AppLayoutPreview() {

  const [activeHref, setActiveHref] = useState(
    "#/readme"
  );

  const [toolsOpen, setToolsOpen] = useState(
    false
  );

  const handleOnFollow = (event: CustomEvent) => {
    if (!event.detail.external) {
      event.preventDefault();
      console.log(event);
      console.log(event.detail);
      setActiveHref(event.detail.href);
    }
  }

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              {text: 'Home', href: '#'},
              {text: 'Service', href: '#'},
            ]}
          />
        }
        navigationOpen={true}
        navigation={
          <SideNavigation
            onFollow={handleOnFollow}
            header={{
              href: '#',
              text: 'Service name',
            }}
            items={[
              {type: "link", text: "Read Me", href: "#/readme"},
              {type: "link", text: "Source Cities", href: "#/source"},
              {type: "link", text: "Targets", href: "#/target"},
              {type: "link", text: "Arrival Times", href: "#/arrival"},
              {type: "link", text: "Armies", href: "#/army"},
            ]}
          />
        }
        notifications={
          <Flashbar
            items={[
              {
                type: 'info',
                dismissible: true,
                content: 'This is an info flash message.',
                id: 'message_1',
                // onDismiss:{
                //   (event: CustomEvent<ClickDetail>) => {
                //     console.log(event);
                //   }
                // }
              },
            ]}
          />
        }
        toolsOpen={toolsOpen}
        onToolsChange={
          (event: NonCancelableCustomEvent<ChangeDetail>) => {
            setToolsOpen(!toolsOpen);
          }
        }
        tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
        content={
          <ContentLayout
            header={
              <Header variant="h1" info={<Link variant="info">Info</Link>}>
                Page header
              </Header>
            }
          >
            <Container
              header={
                <Header variant="h2" description="Container description">
                  Container header
                </Header>
              }
            >
              <div className="contentPlaceholder">
                {activeHref === '#/readme' && <ReadMe/>}
                {activeHref === '#/source' && <Source/>}
                {activeHref === '#/target' && <Target/>}
                {activeHref === '#/arrival' && <Arrival/>}
                {activeHref === '#/army' && <Army/>}
              </div>
            </Container>
          </ContentLayout>
        }
        splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}
      />
    </I18nProvider>
  );
}
