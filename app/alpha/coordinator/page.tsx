'use client';
import {useState} from 'react';
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
import Target from '../../coordinator/targetContent';
import Arrival from '../../coordinator/arrivalContent';
import Army from '../../coordinator/armyContent';
import ChangeDetail = AppLayoutProps.ChangeDetail;

const LOCALE = 'en';

export default function AppLayoutPreview() {

  const [activeHref, setActiveHref] = useState(
    "#/army"
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
        headerSelector="#h"
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
              {type: "link", text: "Armies", href: "#/army"},
              {type: "link", text: "Targets", href: "#/target"},
              {type: "link", text: "Arrival Times", href: "#/arrival"},
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
                {activeHref === '#/army' && <Army/>}
                {activeHref === '#/target' && <Target/>}
                {activeHref === '#/arrival' && <Arrival/>}
              </div>
            </Container>
          </ContentLayout>
        }
        splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}
      />
    </I18nProvider>
  );
}
