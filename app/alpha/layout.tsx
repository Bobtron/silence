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
      <div id="h" style={{position: 'sticky', top: 0, zIndex: 1002}}>
        <TopNavigation
          identity={{
            href: "#",
            title: "Illy Revolution!",
          }}
          utilities={[
            {
              type: "button",
              variant: 'primary-button',
              text: 'Buy me a beer!',
              href: 'https://www.buymeacoffee.com/jusly',
              iconUrl: 'https://assets.illyriad.net/img/icons/beer_48.png',
              external: true,
              target: '_blank',
            },
            {
              type: "button",
              variant: 'primary-button',
              text: "Play Illyriad",
              href: "https://elgea.illyriad.co.uk/Account/LogOn",
              iconUrl: 'https://assets.illyriad.net/img/icons/mana_48.png',
              external: true,
              target: '_blank',
            }
          ]}
        />
      </div>

      {children}
    </>
  );
}
