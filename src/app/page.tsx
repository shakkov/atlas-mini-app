'use client';
import { useEffect, useState } from 'react';

export default function TicketSearchApp() {
  const [from, setFrom] = useState('c625144'); // Минск
  const [to, setTo] = useState('c625665'); // Могилев
  const [date, setDate] = useState('');
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.MainButton.hide();
    } else {
      console.warn('Telegram WebApp не доступен');
    }
  }, []);

  const handleSubmit = async () => {
    if (!date || !time1 || !time2) return alert('Заполните все поля');

    const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
    if (!userId) return alert('Не удалось получить user_id');

    setSubmitted(true);

    await fetch('https://cdc0-158-220-102-147.ngrok-free.app/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 123,
        from,
        to,
        date,
        time1,
        time2,
      }),
    });

    window.Telegram.WebApp.close();
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

      <button
        onClick={handleSubmit}
        // disabled={submitted}
        className="w-full bg-blue-600 text-white py-2 rounded">
        Найти билеты
      </button>
    </div>
  );
}
