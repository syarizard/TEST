import { useState, useEffect } from 'react'
import { loadData, saveData, getToday } from './data.js'
import { useDailyReminder } from './useNotifications.js'
import Dashboard from './screens/Dashboard.jsx'
import Tracker from './screens/Tracker.jsx'
import SwipeFileScreen from './screens/SwipeFile.jsx'
import AIDrafter from './screens/AIDrafter.jsx'
import AddModal from './components/AddModal.jsx'

const TABS = [
  { id: 'dashboard', label: 'Home', icon: '⊡' },
  { id: 'tracker',   label: 'Track', icon: '◫' },
  { id: 'swipe',     label: 'Swipes', icon: '⊞' },
  { id: 'ai',        label: 'AI DM', icon: '✦' },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [data, setData] = useState(loadData)
  const [showAdd, setShowAdd] = useState(false)

  useDailyReminder(19) // 7pm reminder

  useEffect(() => { saveData(data) }, [data])

  function addProspect(prospect) {
    setData(d => ({ ...d, prospects: [...d.prospects, prospect] }))
  }

  function updateStatus(id, status) {
    setData(d => ({ ...d, prospects: d.prospects.map(p => p.id === id ? { ...p, status } : p) }))
  }

  function deleteProspect(id) {
    setData(d => ({ ...d, prospects: d.prospects.filter(p => p.id !== id) }))
  }

  const todayCount = data.prospects.filter(p => p.date === getToday()).length
  const needsDMs = todayCount < 3

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#0a0f1a' }}>

      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 12px) + 12px) 20px 12px',
        borderBottom: '1px solid #1e293b',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#0a0f1a', flexShrink: 0
      }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#f1f5f9' }}>
            IG RECRUIT
          </div>
          <div style={{ fontSize: '9px', color: '#334155', letterSpacing: '0.15em' }}>
            {todayCount}/3 TODAY {todayCount >= 3 ? '🔥' : '·'}
            {' '}
            {data.prospects.length} TOTAL
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: needsDMs ? '#2563eb' : '#1e293b',
            border: 'none', borderRadius: '10px', color: 'white',
            cursor: 'pointer', padding: '10px 16px', fontSize: '12px',
            fontFamily: 'inherit', fontWeight: '500',
            boxShadow: needsDMs ? '0 0 16px rgba(37,99,235,0.4)' : 'none',
            transition: 'all 0.3s'
          }}>
          + Log DM
        </button>
      </div>

      {/* Screen Content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {tab === 'dashboard' && <Dashboard prospects={data.prospects} onAdd={() => setShowAdd(true)} onStatusChange={updateStatus} />}
        {tab === 'tracker'   && <Tracker prospects={data.prospects} onAdd={() => setShowAdd(true)} onStatusChange={updateStatus} onDelete={deleteProspect} />}
        {tab === 'swipe'     && <SwipeFileScreen />}
        {tab === 'ai'        && <AIDrafter onLogDM={() => { setTab('tracker'); setShowAdd(true) }} />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        display: 'flex', borderTop: '1px solid #1e293b', background: '#0a0f1a',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)', flexShrink: 0
      }}>
        {TABS.map(t => {
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 4px 10px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px', transition: 'all 0.15s'
            }}>
              <span style={{ fontSize: '20px', opacity: active ? 1 : 0.35, filter: active ? 'none' : 'grayscale(1)', transition: 'all 0.15s' }}>
                {t.icon}
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '0.1em', color: active ? '#60a5fa' : '#334155', transition: 'all 0.15s' }}>
                {t.label}
              </span>
              {active && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2563eb', marginTop: '-2px' }} />}
            </button>
          )
        })}
      </div>

      {/* Add Modal */}
      {showAdd && <AddModal onSave={addProspect} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
