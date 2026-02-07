/**
 * طلب صلاحية الإشعارات ثم إظهار إشعار مكتوب + قراءة النص بصوت افتراضي (TTS)
 */
export function requestNotificationPermission() {
  if (!('Notification' in window)) return Promise.resolve(false);
  if (Notification.permission === 'granted') return Promise.resolve(true);
  if (Notification.permission === 'denied') return Promise.resolve(false);
  return Notification.requestPermission().then(p => p === 'granted');
}

/**
 * إظهار تنبيه: إشعار مكتوب + TTS
 * @param {string} title - عنوان التنبيه
 * @param {string} body - نص التنبيه (يُقرأ بالصوت)
 */
export function showReminderNotification(title, body) {
  const textToSpeak = body && body.trim() ? `${title}. ${body}` : title;

  // إشعار المتصفح (مكتوب)
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: body || title,
        dir: 'rtl',
        lang: 'ar'
      });
    } catch (_) {}
  }

  // الصوت الافتراضي (TTS)
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(textToSpeak);
    u.lang = 'ar-SA';
    u.rate = 0.9;
    const voices = speechSynthesis.getVoices();
    const arVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arVoice) u.voice = arVoice;
    speechSynthesis.speak(u);
  }
}

// تحميل الأصوات (بعض المتصفحات لا تعيد الأصوات إلا بعد تفاعل)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.getVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
}
