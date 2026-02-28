import { useState, useEffect } from 'react';
import * as api from './api';

export default function InvitePage({ token, onGoToRegister }) {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    api.checkInviteLink(token).then((data) => {
      if (data.valid && !data.used) setStatus('valid');
      else {
        setStatus('invalid');
        setError(data.error || 'الرابط مُستهلَك أو غير صالح');
      }
    }).catch(() => {
      setStatus('invalid');
      setError('تعذّر التحقق من الرابط');
    });
  }, [token]);

  if (status === 'checking') {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <p>جاري التحقق...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <p style={{ color: '#f85149' }}>رابط غير صالح</p>
      </div>
    );
  }

  if (status === 'valid') {
    const isAndroid = /Android/i.test(navigator.userAgent);
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--primary)', fontSize: 18, marginBottom: 16 }}>✓ تم تفعيل الرابط بنجاح</p>
        <p style={{ color: '#f85149', fontSize: 14, marginBottom: 20 }}>⚠ لا تُشارك هذا الرابط — يعمل مرة واحدة فقط</p>
        <p style={{ color: 'var(--text)', marginBottom: 20, fontSize: 16 }}>{isAndroid ? 'إضافة تنبيهات Karas على الأندرويد:' : 'إضافة تنبيهات Karas على الآيفون:'}</p>
        {isAndroid ? (
          <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'right', maxWidth: 340 }}>
            <p style={{ margin: '0 0 12px', fontSize: 15 }}>1. في Chrome اضغط القائمة <strong>⋮</strong></p>
            <p style={{ margin: '0 0 12px', fontSize: 15 }}>2. اختر <strong>إضافة إلى الشاشة الرئيسية</strong></p>
            <p style={{ margin: 0, fontSize: 15 }}>3. اضغط <strong>إضافة</strong></p>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'right', maxWidth: 340 }}>
            <p style={{ margin: '0 0 12px', fontSize: 15 }}>1. اضغط زر <strong>المشاركة</strong></p>
            <p style={{ margin: '0 0 12px', fontSize: 15 }}>2. اختر <strong>إضافة إلى الشاشة الرئيسية</strong></p>
            <p style={{ margin: 0, fontSize: 15 }}>3. اضغط <strong>إضافة</strong></p>
          </div>
        )}
        <button type="button" onClick={() => onGoToRegister?.(token)} style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 16 }}>انتقل للتسجيل</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <p style={{ color: '#f85149', fontSize: 18, marginBottom: 8 }}>⚠ الرابط غير صالح</p>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{error}</p>
    </div>
  );
}
