interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppInitDataUnsafe {
  user?: TelegramWebAppUser;
  [key: string]: unknown;
}

interface TelegramWebApp {
  ready: () => void;
  close: () => void;
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
  };
  initDataUnsafe: TelegramWebAppInitDataUnsafe;
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}
