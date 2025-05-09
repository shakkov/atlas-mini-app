'use client';

import { useState, useMemo } from 'react';
import { initDataState as _initDataState, type User, useSignal } from '@telegram-apps/sdk-react';
import styles from './TicketSearchApp.module.css';

function getUserRows(user: User): any[] {
  return Object.entries(user).map(([title, value]) => ({ title, value }));
}

export default function TicketSearchApp() {
  const initDataState = useSignal(_initDataState);
  const [from, setFrom] = useState('c625144');
  const [to, setTo] = useState('c625665');
  const [date, setDate] = useState('');
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userRows = useMemo<any[] | undefined>(() => {
    return initDataState && initDataState.user ? getUserRows(initDataState.user) : undefined;
  }, [initDataState]);

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
      console.log('Search response:', response);

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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Поиск билетов</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Город отправления:</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={styles.select}
            disabled={isLoading}>
            <option value="c625144">Минск</option>
            <option value="c625665">Могилев</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Город прибытия:</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={styles.select}
            disabled={isLoading}>
            <option value="c625665">Могилев</option>
            <option value="c625144">Минск</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Дата:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.dateInput}
            disabled={isLoading}
          />
        </div>

        <div className={styles.timeContainer}>
          <div className={styles.timeGroup}>
            <label className={styles.label}>Время отправления от:</label>
            <input
              type="time"
              value={time1}
              onChange={(e) => setTime1(e.target.value)}
              className={styles.timeInput}
              disabled={isLoading}
            />
          </div>
          <div className={styles.timeGroup}>
            <label className={styles.label}>Время отправления до:</label>
            <input
              type="time"
              value={time2}
              onChange={(e) => setTime2(e.target.value)}
              className={styles.timeInput}
              disabled={isLoading}
            />
          </div>
        </div>

        <button onClick={handleSubmit} className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg
                className={styles.spinner}
                style={{ width: '20px', height: '20px' }}
                viewBox="0 0 24 24">
                <circle
                  style={{ opacity: 0.25 }}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  style={{ opacity: 0.75 }}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
