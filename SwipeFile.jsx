import { useState } from 'react'
import { SWIPE_FILE, PROSPECT_TYPES } from '../data.js'

export default function SwipeFileScreen() {
  const [selected, setSelected] = useState('Career Switcher')
  const [copied, setCopied] = useState(false)
  const sf = SWIPE_FILE[selected]

  function copy() {
    navigator.clipboard.writeText(sf.template).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Type Selector */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', overflowX: 'auto', display: 'flex', gap: '8px', whiteSpace: 'nowrap' }}>
        {PROSPECT_TYPES.map(t => {
          const active = selected === t
          return (
            <button key={t} onClick={() => { setSelected(t); setCopied(false) }} style={{
              background: active ? '#1e3a5f' : '#111827',
              border: `1px solid ${active ? '#2563eb' : '#1e293b'}`,
              borderRadius: '20px', color: active ? '#60a5fa' : '#475569',
              cursor: 'pointer', padding: '7px 14px', fontSize: '11px', fontFamily: 'inherit',
              transition: 'all 0.15s'
            }}>
              {SWIPE_FILE[t].emoji} {t}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '90px' }}>
        {/* Template Card */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.12em' }}>MESSAGE TEMPLATE</div>
            <button onClick={copy} style={{
              background: copied ? '#052e16' : '#1e293b',
              border: `1px solid ${copied ? '#16a34a' : '#334155'}`,
              borderRadius: '8px', color: copied ? '#4ade80' : '#94a3b8',
              cursor: 'pointer', padding: '6px 14px', fontSize: '11px', fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.8', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
            {sf.template}
          </div>
          <div style={{ marginTop: '14px', padding: '10px', background: '#1e293b', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: '#475569', marginBottom: '4px' }}>REMEMBER TO REPLACE</div>
            <div style={{ fontSize: '11px', color: '#60a5fa' }}>[Name], [current industry], [their field]</div>
          </div>
        </div>

        {/* Tips Card */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.12em', marginBottom: '12px' }}>HOW TO SPOT THEM</div>
          {sf.tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563eb', fontSize: '12px', minWidth: '12px', paddingTop: '1px' }}>→</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
