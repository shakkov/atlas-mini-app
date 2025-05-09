'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  initDataState as _initDataState,
  type User,
  useSignal,
  cloudStorage,
  init,
} from '@telegram-apps/sdk-react';
import styles from './TicketSearchApp.module.css';

// Интерфейс для города
interface City {
  id: string;
  name: string;
  region: string;
}

// Список всех областных городов Беларуси
const BELARUSIAN_CITIES: City[] = [
  { id: 'c625144', name: 'Минск', region: 'Минская область' },
  { id: 'c625665', name: 'Могилёв', region: 'Могилёвская область' },
  { id: 'c629634', name: 'Брест', region: 'Брестская область' },
  { id: 'c620127', name: 'Витебск', region: 'Витебская область' },
  { id: 'c627907', name: 'Гомель', region: 'Гомельская область' },
  { id: 'c627904', name: 'Гродно', region: 'Гродненская область' },
];

function getUserRows(user: User): any[] {
  return Object.entries(user).map(([title, value]) => ({ title, value }));
}

export default function TicketSearchApp() {
  const initDataState = useSignal(_initDataState);
  const [from, setFrom] = useState<string>('c625144'); // Минск по умолчанию
  const [to, setTo] = useState<string>('c625665'); // Могилёв по умолчанию
  const [date, setDate] = useState('');
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Получаем выбранные города для отображения
  const selectedFromCity = BELARUSIAN_CITIES.find((city) => city.id === from);
  const selectedToCity = BELARUSIAN_CITIES.find((city) => city.id === to);

  const userRows = useMemo<any[] | undefined>(() => {
    return initDataState && initDataState.user ? getUserRows(initDataState.user) : undefined;
  }, [initDataState]);

  // Сохранение выбора в CloudStorage/localStorage
  useEffect(() => {
    const saveData = async () => {
      try {
        await cloudStorage.setItem('lastFrom', from);
        await cloudStorage.setItem('lastTo', to);
        alert('Данные сохранены');
      } catch (error: any) {
        alert('Ошибка при сохранении cloudStorage: ' + error.message);
      }
    };
    saveData();
  }, [from, to]);

  // Загрузка сохранённого выбора
  // Инициализация и Загрузка cloudStorage
  useEffect(() => {
    const initApp = async () => {
      try {
        await init();

        if (!cloudStorage.isSupported()) {
          alert('cloudStorage не поддерживается');
          return;
        }

        const [savedFrom, savedTo] = await Promise.all([
          cloudStorage.getItem('lastFrom'),
          cloudStorage.getItem('lastTo'),
        ]);

        console.log('[cloudStorage] Загружено:', { savedFrom, savedTo });

        if (savedFrom) setFrom(savedFrom);
        else alert('lastFrom не найден в cloudStorage');

        if (savedTo) setTo(savedTo);
        else alert('lastTo не найден в cloudStorage');
      } catch (error: any) {
        alert('Ошибка загрузки cloudStorage: ' + error.message);
        console.error('[cloudStorage] Ошибка при загрузке:', error);
      }
    };

    initApp();
  }, []);

  const handleSubmit = async () => {
    if (!date || !time1 || !time2) {
      alert('Заполните все поля');
      return;
    }

    setIsLoading(true);
    const userId = userRows?.find((row) => row.title === 'id')?.value;

    try {
      const response = await fetch('https://atalas-app-back.onrender.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          from,
          to,
          date,
          time1,
          time2,
        }),
      });

      if (!response.ok) throw new Error('Ошибка запроса');

      const telegramWebApp = (window as any).Telegram?.WebApp;
      if (telegramWebApp?.close) {
        telegramWebApp.close();
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Ошибка при поиске билетов');
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для смены городов местами
  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Поиск билетов по Беларуси</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Откуда:</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={styles.select}
            disabled={isLoading}>
            {BELARUSIAN_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.region})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swapCities}
          className={styles.swapButton}
          disabled={isLoading}
          title="Поменять местами">
          ↔
        </button>

        <div className={styles.formGroup}>
          <label className={styles.label}>Куда:</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={styles.select}
            disabled={isLoading}>
            {BELARUSIAN_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.region})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Дата поездки:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.dateInput}
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className={styles.timeContainer}>
          <div className={styles.timeGroup}>
            <label className={styles.label}>Время от:</label>
            <input
              type="time"
              value={time1}
              onChange={(e) => setTime1(e.target.value)}
              className={styles.timeInput}
              disabled={isLoading}
            />
          </div>
          <div className={styles.timeGroup}>
            <label className={styles.label}>Время до:</label>
            <input
              type="time"
              value={time2}
              onChange={(e) => setTime2(e.target.value)}
              className={styles.timeInput}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.selectedCities}>
          <p>
            Маршрут: <strong>{selectedFromCity?.name}</strong> →{' '}
            <strong>{selectedToCity?.name}</strong>
          </p>
        </div>

        <button onClick={handleSubmit} className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <span className={styles.buttonContent}>
              <svg className={styles.spinner} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Поиск...
            </span>
          ) : (
            'Найти билеты'
          )}
        </button>
      </div>
    </div>
  );
}
