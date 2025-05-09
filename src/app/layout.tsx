import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';

import { Root } from '@/components/Root/Root';

import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import './_assets/globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'], // если нужен русский
  weight: ['400', '500', '600', '700'], // нужные веса
  variable: '--font-ibm-plex-mono', // если хочешь использовать как CSS-переменную
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Atlas Bot',
  description: 'Search for tickets',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning className={ibmPlexMono.className}>
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
