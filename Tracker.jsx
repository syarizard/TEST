import { useState } from 'react'
import { STATUS_CONFIG } from '../data.js'

export default function Tracker({ prospects, onAdd, onStatusChange, onDelete }) {
  const [filter, setFilter] = useState('All')
  const statuses = ['All', ...Object.keys(STATUS_CONFIG)]

  const filtered = filter === 'All' ? prospects : prospects.filter(p => p.status === filter)
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filter Bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', overflowX: 'auto', display: 'flex', gap: '8px', whiteSpace: 'nowrap' }}>
        {statuses.map(s => {
          const sc = STATUS_CONFIG[s]
          const active = filter === s
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: active ? (sc?.bg || '#1e3a5f') : '#111827',
              border: `1px solid ${active ? (sc?.dot || '#2563eb') : '#1e293b'}`,
              borderRadius: '20px', color: active ? (sc?.color || '#60a5fa') : '#475569',
              cursor: 'pointer', padding: '6px 14px', fontSize: '10px', fontFamily: 'inherit',
              letterSpacing: '0.05em', transition: 'all 0.15s'
            }}>
              {s}
            </button>
          )
        })}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', paddingBottom: '90px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.12em' }}>{sorted.length} PROSPECTS</div>
          <button onClick={onAdd} style={{ background: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', padding: '7px 14px', fontSize: '11px', fontFamily: 'inherit' }}>
            + Add
          </button>
        </div>

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#334155' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
            <div style={{ fontSize: '13px' }}>{filter === 'All' ? 'No prospects yet' : `No prospects with "${filter}" status`}</div>
          </div>
        ) : sorted.map(p => <ProspectCard key={p.id} p={p} onStatusChange={onStatusChange} onDelete={onDelete} />)}
      </div>
    </div>
  )
}

function ProspectCard({ p, onStatusChange, onDelete }) {
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG['Not Started']

  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: '500', marginBottom: '2px' }}>{p.name}</div>
          {p.igHandle && (
            <a href={`https://instagram.com/${p.igHandle.replace('@','')}`} target="_blank" rel="noreferrer"
              style={{ fontSize: '11px', color: '#60a5fa', textDecoration: 'none' }}>
              @{p.igHandle.replace('@','')} ↗
            </a>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setOpen(!open)} style={{ background: sc.bg, border: 'none', borderRadius: '20px', color: sc.color, cursor: 'pointer', padding: '5px 12px', fontSize: '10px', fontFamily: 'inherit' }}>
            {p.status} ▾
          </button>
          {open && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', zIndex: 20, minWidth: '160px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              {Object.keys(STATUS_CONFIG).map(s => (
                <div key={s} onClick={() => { onStatusChange(p.id, s); setOpen(false) }}
                  style={{ padding: '10px 14px', fontSize: '11px', cursor: 'pointer', color: STATUS_CONFIG[s].color, background: p.status === s ? '#0f172a' : 'transparent', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_CONFIG[s].dot, display: 'inline-block' }} />
                  {s}
                </div>
              ))}
              <div style={{ borderTop: '1px solid #334155', padding: '10px 14px', cursor: 'pointer', fontSize: '11px', color: '#f87171' }}
                onClick={() => { setOpen(false); setConfirmDelete(true) }}>
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: p.notes ? '8px' : 0 }}>
        <span style={{ fontSize: '10px', color: '#475569', background: '#1e293b', borderRadius: '6px', padding: '3px 8px' }}>{p.type}</span>
        <span style={{ fontSize: '10px', color: '#334155' }}>{p.date}</span>
      </div>

      {p.notes && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', lineHeight: '1.5' }}>{p.notes}</div>}

      {confirmDelete && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#1e293b', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Delete this prospect?</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setConfirmDelete(false)} style={{ background: 'transparent', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer', padding: '5px 10px', fontSize: '10px', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => onDelete(p.id)} style={{ background: '#7f1d1d', border: 'none', borderRadius: '6px', color: '#f87171', cursor: 'pointer', padding: '5px 10px', fontSize: '10px', fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}
