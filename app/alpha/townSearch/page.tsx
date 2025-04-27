'use client';

import {useState} from 'react';
import {
  AppLayout, AppLayoutProps,
  BreadcrumbGroup, ContentLayout,
  Flashbar, Header,
  HelpPanel, Link, NonCancelableCustomEvent,
  SideNavigation,
} from '@cloudscape-design/components';
import {I18nProvider} from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import ChangeDetail = AppLayoutProps.ChangeDetail;
import TownSearch from "@/app/townSearch/townSearchContent";

const LOCALE = 'en';

export default function AppLayoutPreview() {

  const [activeHref, setActiveHref] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);

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
              {text: 'Reactionary Finder', href: '#'},
            ]}
          />
        }
        navigationOpen={navigationOpen}
        onNavigationChange={
          (event: NonCancelableCustomEvent<ChangeDetail>) => {
            setNavigationOpen(event.detail.open);
          }
        }
        navigation={
          <SideNavigation
            onFollow={handleOnFollow}
            header={{
              href: '#',
              text: 'Reactionary Finder',
            }}
            items={[
            ]}
          />
        }
        notifications={
          <Flashbar
            items={
              [
                // {
                //   type: 'info',
                //   dismissible: true,
                //   content: 'This is an info flash message.',
                //   id: 'message_1',
                //   // onDismiss:{
                //   //   (event: CustomEvent<ClickDetail>) => {
                //   //     console.log(event);
                //   //   }
                //   // }
                // },
              ]
            }
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
                Reactionary Finder (Town Search)
              </Header>
            }
          >
            <div className="contentPlaceholder">
              <TownSearch/>
            </div>
          </ContentLayout>
        }
      />
    </I18nProvider>
  );
}
