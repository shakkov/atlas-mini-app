'use client';

import { Page } from '@/components/Page';
import { Cell, Link, List, Section } from '@telegram-apps/telegram-ui';
import TicketSearchApp from './home/home';

export default function Home() {
  return (
    <Page back={false}>
      <TicketSearchApp />
    </Page>
  );
}
