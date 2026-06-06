import { jsPDF } from 'jspdf'

const C = {
  bg:       '#0a0f1a',
  card:     '#0f172a',
  border:   '#1e293b',
  blue:     '#60a5fa',
  green:    '#34d399',
  yellow:   '#fbbf24',
  red:      '#f87171',
  slate:    '#94a3b8',
  muted:    '#475569',
  text:     '#f1f5f9',
  subtext:  '#cbd5e1',
  darkblue: '#1e3a5f',
}

const STATUS_HEX = {
  'Not Started':    '#94a3b8',
  'DM Sent':        '#60a5fa',
  'Replied':        '#34d399',
  'Call Booked':    '#fbbf24',
  'Not Interested': '#f87171',
}

const CRITERIA_KEYS = [
  { label: 'Motivated & goal-oriented',       weight: 1 },
  { label: 'Network size (500+ followers)',   weight: 1 },
  { label: 'Engagement quality',              weight: 1 },
  { label: 'People skills / likeability',     weight: 1 },
  { label: 'Financial awareness',             weight: 1 },
  { label: 'Time availability',               weight: 1 },
  { label: 'Resilience / coachability',       weight: 1 },
  { label: 'Urgency / pain point identified', weight: 1 },
]

function hex2rgb(hex) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return [r, g, b]
}

function scoreColor(s) {
  if (s >= 5) return C.green
  if (s >= 4) return C.blue
  if (s >= 3) return C.yellow
  return C.red
}

// Auto-score a prospect based on its data
function autoScore(prospect) {
  const notes = (prospect.notes || '').toLowerCase()
  const scores = []

  scores.push(notes.includes('goal') || notes.includes('motivat') || notes.includes('ambiti') ? 5 : 3)
  scores.push(prospect.igHandle ? 4 : 2)
  scores.push(notes.includes('replied') || prospect.status === 'Replied' || prospect.status === 'Call Booked' ? 5 : 3)
  scores.push(notes.includes('warm') || notes.includes('friendly') || notes.includes('nice') ? 5 : 4)
  scores.push(notes.includes('invest') || notes.includes('finance') || notes.includes('money') ? 5 : 3)
  scores.push(notes.includes('free') || notes.includes('flex') || notes.includes('evening') ? 4 : 3)
  scores.push(notes.includes('coach') || notes.includes('learn') || notes.includes('growth') ? 5 : 3)
  scores.push(notes.includes('burnout') || notes.includes('change') || notes.includes('open') ? 5 : 4)

  return scores
}

function buildNextActions(prospect) {
  const isWarm = ['Replied', 'Call Booked'].includes(prospect.status)
  if (isWarm) {
    return [
      ['Within 24 hrs', 'Follow up on their reply — move the conversation toward a discovery call'],
      ['Day 2-3',       'Share a relatable story or result that aligns with their goals'],
      ['Day 4',         'Directly propose a 15-min discovery call — keep the ask low pressure'],
      ['Day 7+',        'If no call booked, send a warm check-in with updated social proof'],
    ]
  }
  return [
    ['Within 24 hrs', 'Reply to their latest Story — keep it casual and curious'],
    ['Day 2-3',       'Like & comment on 2-3 posts to build familiarity before the ask'],
    ['Day 4',         'Transition to a soft discovery call invite via DM'],
    ['Day 7+',        'If no response, send a low-pressure follow-up with social proof'],
  ]
}

export function generateReviewIdealPDF(prospect, recruiterName = 'IG Recruit') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const PW = 210
  const PH = 297
  const ML = 18
  const MR = 18
  const W  = PW - ML - MR
  let y = 0

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setFill = hex => { const [r,g,b] = hex2rgb(hex); doc.setFillColor(r,g,b) }
  const setDraw = hex => { const [r,g,b] = hex2rgb(hex); doc.setDrawColor(r,g,b) }
  const setTxt  = hex => { const [r,g,b] = hex2rgb(hex); doc.setTextColor(r,g,b) }

  const text = (str, x, ty, opts = {}) => doc.text(str, x, ty, opts)

  function sectionTitle(title) {
    y += 5
    setTxt(C.blue)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    text(title, ML, y)
    setDraw(C.border)
    doc.line(ML, y + 1.5, ML + W, y + 1.5)
    y += 6
  }

  function keyVal(key, val, valHex = C.text) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    setTxt(C.muted)
    text(key, ML, y)
    doc.setFont('helvetica', 'bold')
    setTxt(valHex)
    text(val, ML + 44, y)
    y += 6
  }

  function scoreBar(label, score, note) {
    const scHex = scoreColor(score)
    const BAR_X = ML + W - 52
    const BAR_W = 50

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    setTxt(C.subtext)
    text(label, ML, y)

    doc.setFont('helvetica', 'bold')
    setTxt(scHex)
    text(`${score}/5`, BAR_X - 12, y)

    // bar background
    setFill(C.border)
    doc.roundedRect(BAR_X, y - 3.5, BAR_W, 3.5, 1, 1, 'F')
    // bar fill
    setFill(scHex)
    const filled = BAR_W * score / 5
    if (filled > 0) doc.roundedRect(BAR_X, y - 3.5, filled, 3.5, 1, 1, 'F')

    y += 4
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7.5)
    setTxt(C.muted)
    text(`   ${note}`, ML, y)
    y += 4
  }

  // ── Header banner ────────────────────────────────────────────────────────
  setFill(C.bg)
  doc.rect(0, 0, PW, 18, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setTxt(C.text)
  text('IG RECRUIT', ML, 11)
  setTxt(C.blue)
  text('REVIEW IDEAL REPORT', PW - MR, 11, { align: 'right' })

  y = 26

  // ── Prospect name ─────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  setTxt(C.text)
  text(prospect.name, ML, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  setTxt(C.blue)
  text(prospect.igHandle ? `@${prospect.igHandle.replace('@','')}` : '', ML, y)
  y += 6

  // Status badge
  const statusHex = STATUS_HEX[prospect.status] || C.slate
  setFill(statusHex)
  setDraw(statusHex)
  doc.roundedRect(ML, y, 32, 6, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setTxt('#0a0f1a')
  text(prospect.status, ML + 16, y + 4.3, { align: 'center' })
  y += 12

  // ── Section 01 ─────────────────────────────────────────────────────────────
  sectionTitle('01  PROSPECT SNAPSHOT')
  keyVal('Prospect Type',  prospect.type  || '—')
  keyVal('First Contact',  prospect.date  || '—')
  keyVal('Current Status', prospect.status || '—', statusHex)
  keyVal('Recruiter',      recruiterName)
  keyVal('Report Date',    new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }))
  y += 2

  // Notes card
  if (prospect.notes) {
    setFill(C.card)
    setDraw(C.border)
    const noteLines = doc.splitTextToSize(`"${prospect.notes}"`, W - 14)
    const noteH = noteLines.length * 5 + 10
    doc.roundedRect(ML, y, W, noteH, 3, 3, 'FD')
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    setTxt(C.slate)
    doc.text(noteLines, ML + 7, y + 6)
    y += noteH + 4
  }

  // ── Section 02 ────────────────────────────────────────────────────────────
  sectionTitle('02  IDEAL CRITERIA ASSESSMENT')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setTxt(C.muted)
  text('Scored 1-5 based on Instagram profile and DM interaction.', ML, y)
  y += 6

  const scores = autoScore(prospect)
  const notes = [
    'Inferred from engagement patterns and notes',
    'Assessed from Instagram handle and profile',
    'Based on DM speed and quality of replies',
    'Inferred from tone and communication style',
    'Based on notes and content themes',
    'Estimated from profession and posting times',
    'Inferred from content about self-improvement',
    'Urgency signals from notes and status',
  ]

  let total = 0
  CRITERIA_KEYS.forEach(({ label }, i) => {
    scoreBar(label, scores[i], notes[i])
    total += scores[i]
  })

  // ── Section 03 ────────────────────────────────────────────────────────────
  const maxScore = CRITERIA_KEYS.length * 5
  const pct = total / maxScore * 100
  let verdict, vHex, rec
  if (pct >= 80) {
    verdict = 'STRONG MATCH'
    vHex    = C.green
    rec     = `This prospect closely matches the Ideal Recruit Profile. Prioritise moving to a discovery call within 48 hours. Use the ${prospect.type} script as a starting point.`
  } else if (pct >= 60) {
    verdict = 'GOOD MATCH'
    vHex    = C.blue
    rec     = 'Solid prospect — continue nurturing. Engage with their content for 3-5 days before proposing a call. Address any awareness gaps with targeted content.'
  } else {
    verdict = 'WEAK MATCH'
    vHex    = C.yellow
    rec     = 'Several criteria below threshold. Keep in pipeline at low priority; re-evaluate in 30 days if engagement improves.'
  }

  sectionTitle('03  OVERALL SCORE')

  // Score card
  setFill(C.card)
  setDraw(C.border)
  doc.roundedRect(ML, y, W, 28, 3, 3, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  setTxt(vHex)
  text(`${total} / ${maxScore}`, PW / 2, y + 13, { align: 'center' })

  doc.setFontSize(11)
  text(verdict, PW / 2, y + 22, { align: 'center' })
  y += 33

  // Recommendation
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  setTxt(C.text)
  text('Recommendation', ML, y)
  y += 4

  const recLines = doc.splitTextToSize(rec, W - 14)
  const recH = recLines.length * 5 + 10
  setFill(C.card)
  setDraw(C.border)
  doc.roundedRect(ML, y, W, recH, 3, 3, 'FD')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setTxt(C.slate)
  doc.text(recLines, ML + 7, y + 6)
  y += recH + 2

  // ── Section 04 ────────────────────────────────────────────────────────────
  sectionTitle('04  SUGGESTED NEXT ACTIONS')
  const actions = buildNextActions(prospect)
  actions.forEach(([timing, action]) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setTxt(C.blue)
    text(timing, ML, y)

    doc.setFont('helvetica', 'normal')
    setTxt(C.subtext)
    const aLines = doc.splitTextToSize(action, W - 30)
    doc.text(aLines, ML + 28, y)
    y += aLines.length * 5 + 2
  })

  // ── Footer ────────────────────────────────────────────────────────────────
  setDraw(C.border)
  doc.line(ML, PH - 14, ML + W, PH - 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setTxt(C.muted)
  text(`Generated ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}`, ML, PH - 9)
  text(recruiterName, ML + W, PH - 9, { align: 'right' })

  const filename = `review-ideal-${prospect.name.toLowerCase().replace(/\s+/g,'-')}.pdf`
  doc.save(filename)
  return filename
}

// Button component — drop this wherever you want a "Review Ideal" button
export default function ReviewIdealButton({ prospect, recruiterName, style = {} }) {
  const handleClick = () => generateReviewIdealPDF(prospect, recruiterName)

  return (
    <button
      onClick={handleClick}
      title="Download Review Ideal PDF"
      style={{
        background: '#1e3a5f',
        border: '1px solid #2563eb',
        borderRadius: '6px',
        color: '#60a5fa',
        cursor: 'pointer',
        padding: '4px 10px',
        fontSize: '10px',
        fontFamily: 'inherit',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        ...style,
      }}
    >
      PDF
    </button>
  )
}
