'use client';

import TopNavigation from "@cloudscape-design/components/top-navigation";
import {ReactNode} from "react";
import {applyMode, Mode} from "@cloudscape-design/global-styles";
import {createPortal} from "react-dom";

// TODO: this needs to be moved to the root layout

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: ReactNode;
}>) {
  /**
   * This Portal is for demo purposes only due to the additional
   * header used on the Demo page.
   */
  interface DemoHeaderPortalProps {
    children: ReactNode;
  }

  const DemoHeaderPortal = ({ children }: DemoHeaderPortalProps) => {
    const domNode = document.querySelector('#h')!;
    return createPortal(children, domNode);
  };

  return (
    <>
      <div id="h" style={{ position: 'sticky', top: 0, zIndex: 1002 }}>
        <TopNavigation
          identity={{
            href: "#",
            title: "Service",
          }}
          utilities={[
            {
              type: "button",
              text: "Link",
              href: "https://illyriad.com/?398697",
              external: true,
              externalIconAriaLabel: " (opens in a new tab)"
            },
            {
              type: "button",
              iconName: "notification",
              title: "Notifications",
              ariaLabel: "Notifications (unread)",
              badge: true,
              disableUtilityCollapse: false
            },
            {
              type: "menu-dropdown",
              iconName: "settings",
              ariaLabel: "Settings",
              title: "Settings",
              items: [
                {
                  id: "settings-org",
                  text: "Organizational settings"
                },
                {
                  id: "settings-project",
                  text: "Project settings"
                }
              ]
            },
            {
              type: "menu-dropdown",
              text: "Customer Name",
              description: "email@example.com",
              iconName: "user-profile",
              items: [
                { id: "profile", text: "Profile" },
                { id: "preferences", text: "Preferences" },
                { id: "security", text: "Security" },
                {
                  id: "support-group",
                  text: "Support",
                  items: [
                    {
                      id: "documentation",
                      text: "Documentation",
                      href: "#",
                      external: true,
                      externalIconAriaLabel:
                        " (opens in new tab)"
                    },
                    { id: "support", text: "Support" },
                    {
                      id: "feedback",
                      text: "Feedback",
                      href: "#",
                      external: true,
                      externalIconAriaLabel:
                        " (opens in new tab)"
                    }
                  ]
                },
                { id: "signout", text: "Sign out" }
              ]
            }
          ]}
        />
      </div>
      {children}
    </>
  );
}
