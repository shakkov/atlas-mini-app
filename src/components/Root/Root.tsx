'use client';

import { type PropsWithChildren, useEffect, useState } from 'react';
import { initData, miniApp, useLaunchParams, useSignal } from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useDidMount } from '@/hooks/useDidMount';

import './styles.css';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: number;
          };
        };
        ready: () => void;
        isExpanded?: boolean;
        expand: () => void;
      };
    };
  }
}

function RootInner({ children }: PropsWithChildren) {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  // Инициализация Telegram WebApp
  useEffect(() => {
    const initTelegram = () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();

        // Развернуть приложение, если оно свернуто
        if (!tg.isExpanded) {
          tg.expand();
        }

        setIsTelegramReady(true);
      } else {
        console.warn('Telegram WebApp not available');
        // Для разработки вне Telegram
        setIsTelegramReady(true);
      }
    };

    // Проверяем, загружен ли уже Telegram WebApp
    if (window.Telegram?.WebApp) {
      initTelegram();
    } else {
      // Если нет, загружаем скрипт
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = initTelegram;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  if (!isTelegramReady) {
    return <div className="root__loading">Initializing Telegram WebApp...</div>;
  }

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}>
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="root__loading">Loading application...</div>
  );
}
