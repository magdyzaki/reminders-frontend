import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, showReminderNotification } from './notifications';
import * as api from './api';
import Login from './Login';
import RemindersList from './RemindersList';

const POLL_MS = 60 * 1000; // كل دقيقة

function App() {
  const [user, setUser] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [firedIds, setFiredIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('reminders_fired') || '[]'));
    } catch (_) {
      return new Set();
    }
  });

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('reminders_token') : null;
  const savedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('reminders_user') : null;

  useEffect(() => {
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (_) {
        localStorage.removeItem('reminders_user');
        localStorage.removeItem('reminders_token');
      }
    }
    setLoading(false);
  }, [token, savedUser]);

  const fetchReminders = useCallback(async () => {
    if (!token) return;
    try {
      const list = await api.getReminders();
      setReminders(list);
      setError('');
    } catch (e) {
      setError(e.message || 'خطأ في التحميل');
      if (e.message && e.message.includes('انتهت الجلسة')) {
        localStorage.removeItem('reminders_token');
        localStorage.removeItem('reminders_user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchReminders();
  }, [user, fetchReminders]);

  // التحقق من مواعيد التنبيهات وإطلاق الإشعار + TTS
  useEffect(() => {
    if (!reminders.length) return;

    const now = new Date();
    const nowMs = now.getTime();

    reminders.forEach((r) => {
      if (firedIds.has(r.id)) return;
      const remindAt = new Date(r.remind_at);
      if (remindAt.getTime() <= nowMs) {
        setFiredIds((prev) => {
          const next = new Set(prev);
          next.add(r.id);
          localStorage.setItem('reminders_fired', JSON.stringify([...next]));
          return next;
        });
        showReminderNotification(r.title, r.body || '');
      }
    });
  }, [reminders, firedIds]);

  // جلب التنبيهات دورياً للمزامنة
  useEffect(() => {
    if (!user) return;
    const t = setInterval(fetchReminders, POLL_MS);
    return () => clearInterval(t);
  }, [user, fetchReminders]);

  const handleLogin = (data) => {
    localStorage.setItem('reminders_token', data.token);
    localStorage.setItem('reminders_user', JSON.stringify(data.user));
    setUser(data.user);
    requestNotificationPermission();
  };

  const handleLogout = () => {
    localStorage.removeItem('reminders_token');
    localStorage.removeItem('reminders_user');
    setUser(null);
    setReminders([]);
  };

  const handleAddReminder = async (payload) => {
    const added = await api.addReminder(payload);
    setReminders((prev) => [...prev, added].sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at)));
  };

  const handleUpdateReminder = async (id, payload) => {
    const updated = await api.updateReminder(id, payload);
    setReminders((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r)).sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at))
    );
  };

  const handleDeleteReminder = async (id) => {
    await api.deleteReminder(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
    setFiredIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem('reminders_fired', JSON.stringify([...next]));
      return next;
    });
  };

  if (loading && !user) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <RemindersList
      user={user}
      reminders={reminders}
      error={error}
      onLogout={handleLogout}
      onRefresh={fetchReminders}
      onAdd={handleAddReminder}
      onUpdate={handleUpdateReminder}
      onDelete={handleDeleteReminder}
    />
  );
}

export default App;
