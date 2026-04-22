# IG Recruit PWA

Your personal Instagram recruitment DM tracker — installable on iPhone/Android as a home screen app.

## Features
- 📊 Daily progress tracker (0/3 target)
- 📋 Full prospect CRM with status tracking
- 💬 Swipe file with 5 message templates
- ✨ AI-powered DM generator
- 🔔 Daily push notification reminder at 7pm (if you haven't hit 3 DMs)
- 📱 Installable on iPhone & Android home screen

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
1. Create a new repo at github.com
2. Upload all these files (drag & drop the folder)
3. Commit

### Step 2 — Deploy on Vercel
1. Go to **vercel.com** → Sign up free with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Click **Deploy** (Vercel auto-detects Vite)
5. Done! You'll get a live URL like `ig-recruit.vercel.app`

### Step 3 — Add to iPhone Home Screen
1. Open your Vercel URL in **Safari** (must be Safari for iOS)
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add**
5. The app icon appears on your home screen — tap to open like a native app

### Android
1. Open the URL in **Chrome**
2. Tap the **⋮ menu** → **"Add to Home screen"**
3. Tap Add

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Notes
- All data is stored locally on your device (localStorage)
- The AI DM generator uses the Anthropic API (claude.ai handles the key)
- Push notifications only work after you tap "Enable" in the app
- iOS notifications require iOS 16.4+ and the app must be added to home screen first
