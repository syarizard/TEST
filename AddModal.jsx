import { useState } from 'react'
import { PROSPECT_TYPES, STATUS_CONFIG, generateId, getToday } from '../data.js'

const defaultForm = () => ({
  name: '', igHandle: '', type: 'Career Switcher',
  status: 'DM Sent', notes: '', date: getToday()
})

export default function AddModal({ onSave, onClose }) {
  const [form, setForm] = useState(defaultForm())
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function save() {
    if (!form.name.trim()) return
    onSave({ ...form, id: generateId() })
    onClose()
  }

  const inputStyle = {
    width: '100%', background: '#1e293b', border: '1px solid #334155',
    borderRadius: '10px', color: '#e2e8f0', fontFamily: 'inherit',
    fontSize: '14px', padding: '12px 14px', outline: 'none', marginBottom: '10px'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      zIndex: 50, display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#111827', borderRadius: '20px 20px 0 0',
        padding: '20px 20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
        border: '1px solid #1e293b', borderBottom: 'none',
        maxHeight: '85vh', overflowY: 'auto',
        animation: 'slideUp 0.25s ease'
      }}>
        <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '2px', margin: '0 auto 20px' }} />
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800', marginBottom: '18px', color: '#f1f5f9' }}>Log a DM</div>

        <label style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>NAME *</label>
        <input style={inputStyle} placeholder="e.g. Sarah Tan" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />

        <label style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>INSTAGRAM HANDLE</label>
        <input style={inputStyle} placeholder="@handle (optional)" value={form.igHandle} onChange={e => set('igHandle', e.target.value)} />

        <label style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>PROSPECT TYPE</label>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.type} onChange={e => set('type', e.target.value)}>
          {PROSPECT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>

        <label style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>STATUS</label>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => set('status', e.target.value)}>
          {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
        </select>

        <label style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>DATE</label>
        <input type="date" style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} />

        <label style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>NOTES</label>
        <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} placeholder="Any context, follow-up notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />

        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <button onClick={onClose} style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', padding: '14px', fontSize: '13px', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={save} disabled={!form.name.trim()} style={{ flex: 2, background: form.name.trim() ? '#2563eb' : '#1e293b', border: 'none', borderRadius: '10px', color: form.name.trim() ? 'white' : '#475569', cursor: form.name.trim() ? 'pointer' : 'not-allowed', padding: '14px', fontSize: '13px', fontFamily: 'inherit', fontWeight: '500' }}>
            Save DM
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
    </div>
  )
}
