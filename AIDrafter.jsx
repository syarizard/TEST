import { useState } from 'react'

export default function AIDrafter({ onLogDM }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    if (!input.trim()) return
    setLoading(true)
    setOutput('')
    setError('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a recruitment DM specialist for a financial services consultant in Singapore.
Write warm, genuine, non-pushy Instagram cold DMs that feel personal and human — not salesy.
The sender works in financial services consulting, manages a team, and is recruiting driven people.
Keep DMs under 100 words. Conversational tone. End with a soft CTA. Use 1-2 emojis max.
Return ONLY the DM message, nothing else. No preamble, no explanation.`,
          messages: [{
            role: 'user',
            content: `Write a personalized Instagram cold DM for this prospect:\n\n${input}\n\nMake it feel genuine and specific to what I've shared.`
          }]
        })
      })
      const json = await res.json()
      const text = json.content?.find(b => b.type === 'text')?.text
      if (!text) throw new Error('No response')
      setOutput(text)
    } catch {
      setError('Something went wrong. Check your connection and try again.')
    }
    setLoading(false)
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function reset() {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '16px', paddingBottom: '90px', gap: '14px' }}>

      {/* Input */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px' }}>
        <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.12em', marginBottom: '4px' }}>PROSPECT INFO</div>
        <div style={{ fontSize: '11px', color: '#334155', marginBottom: '12px' }}>Paste their bio, recent posts, or anything you noticed</div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'e.g. "Name: Sarah. Bio: Marketing exec | 7 years FMCG | mum of 2 | love running. Recent posts about feeling stuck in corporate and wanting more flexibility."'}
          style={{
            width: '100%', minHeight: '120px', background: '#0f172a', border: '1px solid #334155',
            borderRadius: '10px', color: '#e2e8f0', fontFamily: 'inherit', fontSize: '12px',
            padding: '12px', outline: 'none', resize: 'vertical', lineHeight: '1.6'
          }}
        />
        <button
          onClick={generate}
          disabled={loading || !input.trim()}
          style={{
            width: '100%', marginTop: '12px', background: loading || !input.trim() ? '#1e293b' : '#2563eb',
            border: 'none', borderRadius: '10px', color: loading || !input.trim() ? '#475569' : 'white',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', padding: '14px',
            fontSize: '13px', fontFamily: 'inherit', fontWeight: '500', transition: 'all 0.2s'
          }}
        >
          {loading ? 'Drafting your DM...' : '✨ Generate DM'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#475569', fontSize: '12px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px', animation: 'pulse 1s infinite' }}>✍️</div>
          Writing your DM...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#3b0808', border: '1px solid #7f1d1d', borderRadius: '12px', padding: '14px', fontSize: '12px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div style={{ background: '#0f1f3d', border: '1px solid #1e3a5f', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', color: '#60a5fa', letterSpacing: '0.12em' }}>YOUR DM</div>
            <button onClick={copy} style={{
              background: copied ? '#052e16' : '#1e293b', border: `1px solid ${copied ? '#16a34a' : '#334155'}`,
              borderRadius: '8px', color: copied ? '#4ade80' : '#94a3b8', cursor: 'pointer',
              padding: '6px 14px', fontSize: '11px', fontFamily: 'inherit', transition: 'all 0.2s'
            }}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {output}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #1e293b' }}>
            <button onClick={() => generate()} disabled={loading} style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', padding: '10px', fontSize: '11px', fontFamily: 'inherit' }}>
              Regenerate
            </button>
            <button onClick={reset} style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', padding: '10px', fontSize: '11px', fontFamily: 'inherit' }}>
              Clear
            </button>
            <button onClick={onLogDM} style={{ flex: 1, background: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', padding: '10px', fontSize: '11px', fontFamily: 'inherit' }}>
              Log DM →
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
