import { useState } from 'react';
import ReminderForm from './ReminderForm';

const styles = {
  page: { maxWidth: 560, margin: '0 auto', padding: 16, paddingBottom: 32 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700 },
  btn: {
    padding: '8px 14px',
    border: 'none',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.1)',
    color: 'var(--text)',
    fontSize: 14
  },
  err: { color: 'var(--danger)', marginBottom: 12, textAlign: 'center' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 16,
    border: '1px solid rgba(255,255,255,0.08)'
  },
  cardTitle: { fontWeight: 600, marginBottom: 4 },
  cardBody: { color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 },
  cardTime: { fontSize: 13, color: 'var(--primary-light)' },
  actions: { marginTop: 12, display: 'flex', gap: 8 },
  editBtn: { padding: '6px 12px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13 },
  delBtn: { padding: '6px 12px', borderRadius: 8, border: 'none', background: 'rgba(199,92,92,0.3)', color: '#e88', fontSize: 13 }
};

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('ar-EG', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

export default function RemindersList({ user, reminders, error, onLogout, onRefresh, onClearFired, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = async (payload) => {
    if (editing) {
      await onUpdate(editing.id, payload);
      setEditing(null);
    } else {
      await onAdd(payload);
      setShowForm(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>تنبيهاتي</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={styles.btn} onClick={onRefresh}>تحديث</button>
          <button style={styles.btn} onClick={onLogout}>خروج</button>
        </div>
      </header>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        مرحباً، {user?.name || user?.email}. التنبيهات تظهر مكتوبة ويُقرأ نصها بصوت افتراضي عند وقت التذكير.
        لو لم يظهر تنبيه: اسمح بالإشعارات، أو اضغط «تحديث» بعد وقت التنبيه. لو استمرت المشكلة اضغط «مسح سجل التنبيهات» ثم حدّث.
      </p>
      {onClearFired && (
        <button type="button" style={{ ...styles.btn, marginBottom: 12, fontSize: 12 }} onClick={onClearFired}>
          مسح سجل التنبيهات (للاختبار)
        </button>
      )}
      {error && <p style={styles.err}>{error}</p>}

      {!showForm && !editing && (
        <button style={{ ...styles.btn, width: '100%', padding: 14, marginBottom: 20 }} onClick={() => setShowForm(true)}>
          + إضافة تنبيه
        </button>
      )}

      {(showForm || editing) && (
        <ReminderForm
          initial={editing ? { title: editing.title, body: editing.body, remind_at: editing.remind_at, repeat: editing.repeat } : null}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div style={styles.list}>
        {reminders.length === 0 && !showForm && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 24 }}>لا توجد تنبيهات. أضف تنبيهاً أولاً.</p>
        )}
        {reminders.map((r) => (
          <div key={r.id} style={styles.card}>
            <div style={styles.cardTitle}>{r.title}</div>
            {r.body && <div style={styles.cardBody}>{r.body}</div>}
            <div style={styles.cardTime}>{formatDateTime(r.remind_at)} {r.repeat ? ` • ${r.repeat}` : ''}</div>
            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => setEditing(r)}>تعديل</button>
              <button style={styles.delBtn} onClick={() => onDelete(r.id)}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
