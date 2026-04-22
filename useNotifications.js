import { useEffect } from 'react'

// Schedule a daily reminder at a given hour (24h, local time)
export function useDailyReminder(hour = 19) {
  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return

    async function schedule() {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const reg = await navigator.serviceWorker.ready
      if (!reg) return

      // Check if we already showed one today
      const lastShown = localStorage.getItem('last_reminder_date')
      const today = new Date().toISOString().split('T')[0]
      if (lastShown === today) return

      // Calculate ms until next reminder time
      const now = new Date()
      const target = new Date()
      target.setHours(hour, 0, 0, 0)
      if (now > target) target.setDate(target.getDate() + 1)
      const delay = target.getTime() - now.getTime()

      setTimeout(() => {
        // Check if target already logged 3 DMs today
        try {
          const raw = localStorage.getItem('ig_recruit_v1')
          const data = raw ? JSON.parse(raw) : { prospects: [] }
          const today2 = new Date().toISOString().split('T')[0]
          const todayCount = data.prospects.filter(p => p.date === today2).length
          if (todayCount >= 3) return

          const remaining = 3 - todayCount
          reg.showNotification('IG Recruit 📲', {
            body: `${remaining} DM${remaining !== 1 ? 's' : ''} left for today — keep the streak alive!`,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            tag: 'daily-reminder',
            renotify: false,
            data: { url: '/' }
          })
          localStorage.setItem('last_reminder_date', today2)
        } catch {}
      }, delay)
    }

    schedule()
  }, [hour])
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  const permission = await Notification.requestPermission()
  return permission
}

export function getNotificationStatus() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}
