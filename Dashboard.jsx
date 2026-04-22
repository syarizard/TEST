import { useState } from 'react'
import { STATUS_CONFIG, getToday } from '../data.js'
import { requestNotificationPermission, getNotificationStatus } from '../useNotifications.js'

function RingProgress({ value, max, color, size = 80 }) {
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}

export default function Dashboard({ prospects, onAdd, onStatusChange }) {
  const today = getToday()
  const todayProspects = prospects.filter(p => p.date === today)
  const todayCount = todayProspects.length
  const [notifStatus, setNotifStatus] = useState(getNotificationStatus())

  const stats = {
    total: prospects.length,
    replied: prospects.filter(p => ['Replied', 'Call Booked'].includes(p.status)).length,
    calls: prospects.filter(p => p.status === 'Call Booked').length,
    streak: (() => {
      let s = 0, d = new Date()
      while (true) {
        const ds = d.toISOString().split('T')[0]
        if (prospects.filter(p => p.date === ds).length >= 3) { s++; d.setDate(d.getDate() - 1) }
        else break
      }
      return s
    })()
  }

  async function enableNotifs() {
    const result = await requestNotificationPermission()
    setNotifStatus(result)
  }

  const progressColor = todayCount >= 3 ? '#4ade80' : '#2563eb'

  return (
    <div style={{ padding: '16px', overflowY: 'auto', height: '100%', paddingBottom: '90px' }}>

      {/* Hero Progress Card */}
      <div style={{
        background: todayCount >= 3 ? 'linear-gradient(135deg, #052e16, #064e3b)' : 'linear-gradient(135deg, #0f172a, #1e293b)',
        border: `1px solid ${todayCount >= 3 ? '#16a34a' : '#1e293b'}`,
        borderRadius: '16px', padding: '20px', marginBottom: '14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.12em', marginBottom: '6px' }}>TODAY'S TARGET</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '52px', fontWeight: '800', lineHeight: 1, color: progressColor }}>
            {todayCount}<span style={{ fontSize: '28px', color: '#334155' }}>/3</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: todayCount >= 3 ? '#4ade80' : '#60a5fa' }}>
            {todayCount >= 3 ? '✓ Daily target hit!' : `${3 - todayCount} DM${3 - todayCount !== 1 ? 's' : ''} to go`}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <RingProgress value={todayCount} max={3} color={progressColor} size={84} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: progressColor }}>
            {Math.round((todayCount / 3) * 100)}%
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
        {[
          { label: 'TOTAL', value: stats.total, color: '#60a5fa' },
          { label: 'REPLIED', value: stats.replied, color: '#34d399' },
          { label: 'CALLS', value: stats.calls, color: '#fbbf24' },
          { label: 'STREAK', value: stats.streak + '🔥', color: '#f97316' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '8px', color: '#475569', letterSpacing: '0.1em', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today's DMs */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.12em', marginBottom: '12px' }}>TODAY'S DMs</div>
        {todayProspects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#334155' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📲</div>
            <div style={{ fontSize: '12px', marginBottom: '12px' }}>No DMs logged yet today</div>
            <button onClick={onAdd} style={{ background: '#1e3a5f', border: '1px solid #2563eb', borderRadius: '20px', color: '#60a5fa', cursor: 'pointer', padding: '8px 20px', fontSize: '11px', fontFamily: 'inherit' }}>
              + Log First DM
            </button>
          </div>
        ) : todayProspects.map(p => <MiniRow key={p.id} p={p} onStatusChange={onStatusChange} />)}
      </div>

      {/* Notification Banner */}
      {notifStatus !== 'granted' && notifStatus !== 'unsupported' && (
        <div style={{ background: '#1e3a5f', border: '1px solid #2563eb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#93c5fd', marginBottom: '2px' }}>Enable daily reminders</div>
            <div style={{ fontSize: '10px', color: '#475569' }}>Get pinged at 7pm if you haven't hit 3</div>
          </div>
          <button onClick={enableNotifs} style={{ background: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', padding: '8px 14px', fontSize: '11px', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Enable
          </button>
        </div>
      )}

      {/* Checklist */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px' }}>
        <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.12em', marginBottom: '12px' }}>DAILY CHECKLIST</div>
        {[
          'Pick 3 prospects from feed or explore',
          'Check bio → identify prospect type',
          'Use Swipe File or AI Drafter for message',
          'Personalise with name + 1 specific detail',
          'Log it here. Follow up in 3 days if no reply.'
        ].map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '10px', color: '#334155', minWidth: '18px', paddingTop: '1px' }}>0{i + 1}</span>
            <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniRow({ p, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG['Not Started']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', color: '#f1f5f9' }}>{p.name}
          {p.igHandle && <span style={{ fontSize: '10px', color: '#475569', marginLeft: '6px' }}>@{p.igHandle.replace('@','')}</span>}
        </div>
        <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>{p.type}</div>
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(!open)} style={{ background: sc.bg, border: 'none', borderRadius: '20px', color: sc.color, cursor: 'pointer', padding: '4px 10px', fontSize: '10px', fontFamily: 'inherit' }}>
          {p.status} ▾
        </button>
        {open && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', zIndex: 20, minWidth: '150px', overflow: 'hidden' }}>
            {Object.keys(STATUS_CONFIG).map(s => (
              <div key={s} onClick={() => { onStatusChange(p.id, s); setOpen(false) }}
                style={{ padding: '10px 14px', fontSize: '11px', cursor: 'pointer', color: STATUS_CONFIG[s].color }}>
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
