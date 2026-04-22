export const STORAGE_KEY = 'ig_recruit_v1'

export const PROSPECT_TYPES = [
  'Career Switcher',
  'Passive Job Seeker',
  'Fresh Grad',
  'Experienced Hire',
  'Side Hustle Seeker'
]

export const SWIPE_FILE = {
  'Career Switcher': {
    emoji: '🔄',
    template: `Hey [Name]! I came across your profile and noticed you're in [current industry]. I work in financial services and we're always looking for driven people who want to explore a new direction — especially those with backgrounds like yours. Would love to share what we do if you're open to a quick chat. No pressure at all! 😊`,
    tips: [
      'Look for bios mentioning burnout or "exploring new things"',
      'Check if they post about wanting change or new challenges',
      'Common phrases: "figuring out my next chapter", "open to opportunities"'
    ]
  },
  'Passive Job Seeker': {
    emoji: '👀',
    template: `Hi [Name]! Your profile caught my eye — you seem really intentional about your career. I'm in financial services consulting and we work with seriously motivated people. Not sure if you're open to opportunities, but if you ever want to explore something with real income potential, I'd love to connect. 🙌`,
    tips: [
      'Polished bios, talks about goals and self-improvement',
      'Ambitious but not explicitly job hunting',
      'Posts about productivity, growth mindset, side income'
    ]
  },
  'Fresh Grad': {
    emoji: '🎓',
    template: `Hey [Name]! Congrats on finishing your studies! Starting out is tough — I remember that feeling. I'm in financial services and we have a path that's great for people just starting out who want to build something of their own. Happy to share more if you're curious! 😊`,
    tips: [
      'Graduation posts, uni tags in bio, "fresh grad" mentions',
      'Posting about job hunting or first job anxieties',
      'Class of 2024/2025 in bio'
    ]
  },
  'Experienced Hire': {
    emoji: '💼',
    template: `Hi [Name]! I've been following your content and I'm genuinely impressed by your experience in [their field]. I work in financial services and I'm always looking to connect with people who've built real expertise. We offer something a bit different — would love a quick conversation if you're ever open. No hard sell, I promise! 😄`,
    tips: [
      '5+ years experience, leadership mentions, industry expertise',
      'Clear professional identity in bio',
      'Posts about industry insights or leadership lessons'
    ]
  },
  'Side Hustle Seeker': {
    emoji: '💡',
    template: `Hey [Name]! I see you're entrepreneurial — love that! I'm in financial services and what I do works really well alongside what you're already doing. A lot of people I work with started the same way. Would you be open to hearing more? Could be a great fit! 🚀`,
    tips: [
      'Bios mentioning multiple ventures or "building something"',
      'Posts about passive income or financial freedom',
      'Hustle culture content, entrepreneur tags'
    ]
  }
}

export const STATUS_CONFIG = {
  'Not Started': { color: '#94a3b8', bg: '#1e293b', dot: '#475569' },
  'DM Sent':     { color: '#60a5fa', bg: '#1e3a5f', dot: '#2563eb' },
  'Replied':     { color: '#34d399', bg: '#064e3b', dot: '#059669' },
  'Call Booked': { color: '#fbbf24', bg: '#451a03', dot: '#d97706' },
  'Not Interested': { color: '#f87171', bg: '#3b0808', dot: '#dc2626' }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { prospects: [] }
  } catch {
    return { prospects: [] }
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
