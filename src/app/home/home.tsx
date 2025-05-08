'use client';

import { useState, useMemo } from 'react';
import { initDataState as _initDataState, type User, useSignal } from '@telegram-apps/sdk-react';
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

  const userRows = useMemo<any[] | undefined>(() => {
    return initDataState && initDataState.user ? getUserRows(initDataState.user) : undefined;
  }, [initDataState]);

  const handleSubmit = async () => {
    if (!date || !time1 || !time2) {
      alert('Заполните все поля');
      return;
    }

    const userId = userRows?.find((row) => row.title === 'id')?.value;

    try {
      const response = await fetch('https://1e89-158-220-102-147.ngrok-free.app/search', {
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
    }
  };

  return (
    <div className="p-4 space-y-4 text-base">
      <h2 className="text-xl font-bold">Поиск билетов</h2>

      <div>
        <label>Город отправления:</label>
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border rounded p-2">
          <option value="c625144">Минск</option>
          <option value="c625665">Могилев</option>
        </select>
      </div>

      <div>
        <label>Город прибытия:</label>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border rounded p-2">
          <option value="c625665">Могилев</option>
          <option value="c625144">Минск</option>
        </select>
      </div>

      <div>
        <label>Дата:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label>Время от:</label>
        <input
          type="time"
          value={time1}
          onChange={(e) => setTime1(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label>Время до:</label>
        <input
          type="time"
          value={time2}
          onChange={(e) => setTime2(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded">
        Найти билеты
      </button>
    </div>
  );
}
