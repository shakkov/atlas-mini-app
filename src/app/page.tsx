'use client';
import { useState, useEffect } from 'react';

export default function TicketSearchApp() {
  const [from, setFrom] = useState('c625144'); // Минск
  const [to, setTo] = useState('c625665'); // Могилев
  const [date, setDate] = useState('');
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [userId, setUserId] = useState(null);
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setUserId(tg.initDataUnsafe?.user?.id);
      setIsTelegramReady(true);
      tg.MainButton.hide();

      // Для отладки
      alert('Telegram WebApp initialized');
    } else {
      alert('Telegram WebApp not available');
      // Для разработки вне Telegram можно установить тестовые данные
      if (process.env.NODE_ENV === 'development') {
        setUserId(123456789);
        setIsTelegramReady(true);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!date || !time1 || !time2) {
      alert('Заполните все поля');
      return;
    }

    if (!isTelegramReady) {
      alert('Приложение не инициализировано. Запустите в Telegram.');
      return;
    }

    if (!userId) {
      alert('Не удалось получить user_id');
      return;
    }

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Билеты найдены');

      // Если нужно закрыть WebApp после успешного поиска
      // if (window.Telegram?.WebApp) {
      //   window.Telegram.WebApp.close();
      // }
    } catch (error) {
      console.error('Ошибка при поиске билетов:', error);
      alert(`Ошибка: ${error.message}`);
    }
  };

  return (
    <div className="p-4 space-y-4 text-base">
      <h2 className="text-xl font-bold">Поиск билетов</h2>

      {!isTelegramReady && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4">
          {typeof window !== 'undefined' && window.Telegram?.WebApp
            ? 'Инициализация Telegram WebApp...'
            : 'Запустите приложение в Telegram для корректной работы'}
        </div>
      )}

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

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={!isTelegramReady}>
        Найти билеты
      </button>

      <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
        <h3 className="font-bold">Отладочная информация:</h3>
        <p>Telegram WebApp: {isTelegramReady ? 'Готов' : 'Не готов'}</p>
        <p>User ID: {userId || 'не получен'}</p>
      </div>
    </div>
  );
}
