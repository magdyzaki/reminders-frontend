import { useState, useEffect } from 'react';

const styles = {
  form: { background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 20 },
  input: {
    width: '100%',
    padding: '12px 14px',
    marginBottom: 12,
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text)',
    fontSize: 16
  },
  row: { display: 'flex', gap: 12, marginBottom: 12 },
  btn: { padding: '10px 18px', borderRadius: 8, border: 'none', fontSize: 15, fontWeight: 600 },
  primary: { background: 'var(--primary)', color: '#fff' },
  secondary: { background: 'rgba(255,255,255,0.1)', color: 'var(--text)' }
};

function toLocalISO(d) {
  const t = new Date(d);
  const offset = t.getTimezoneOffset() * 60000;
  return new Date(t.getTime() - offset).toISOString().slice(0, 16);
}

export default function ReminderForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [remind_at, setRemind_at] = useState('');
  const [repeat, setRepeat] = useState('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setBody(initial.body || '');
      setRemind_at(initial.remind_at ? toLocalISO(initial.remind_at) : '');
      setRepeat(initial.repeat || '');
    } else {
      const next = new Date();
      next.setMinutes(next.getMinutes() + 5);
      setRemind_at(toLocalISO(next));
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const at = new Date(remind_at).toISOString();
    onSave({ title: title.trim(), body: body.trim(), remind_at: at, repeat: repeat.trim() || null });
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="عنوان التنبيه"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
        required
      />
      <textarea
        placeholder="نص التنبيه (يُقرأ بصوت افتراضي عند التذكير)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
        rows={3}
      />
      <input
        type="datetime-local"
        value={remind_at}
        onChange={(e) => setRemind_at(e.target.value)}
        style={styles.input}
        required
      />
      <input
        type="text"
        placeholder="تكرار (مثال: يومي، أسبوعي - اختياري)"
        value={repeat}
        onChange={(e) => setRepeat(e.target.value)}
        style={styles.input}
      />
      <div style={styles.row}>
        <button type="submit" style={{ ...styles.btn, ...styles.primary }}>حفظ</button>
        <button type="button" style={{ ...styles.btn, ...styles.secondary }} onClick={onCancel}>إلغاء</button>
      </div>
    </form>
  );
}
