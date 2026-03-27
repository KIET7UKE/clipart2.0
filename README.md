<p align="center">
  <img src="src/assets/icons/clipart-ai-logo.png" alt="Clipart AI Logo" width="480"/>
</p>

<p align="center">
  <img src="src/assets/icons/clipart_icon.png" alt="Clipart AI App Icon" width="100"/>
</p>

<p align="center">
  <strong>Transform any photo into stunning clipart art using AI.</strong><br/>
  Built with React Native + Node.js backend.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_Native-0.84-61DAFB?style=flat-square&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/AI-FLUX.1--schnell-FF4500?style=flat-square&logo=huggingface&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vision-Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white"/>
</p>

---

## 📱 APK Download

> **[⬇️ Download APK](YOUR_GOOGLE_DRIVE_APK_LINK_HERE)**  
> *(Upload your APK to Google Drive and replace this link)*

---

## 🎥 Screen Recording

> **[▶️ Watch Demo Recording](YOUR_GOOGLE_DRIVE_RECORDING_LINK_HERE)**  
> *(Upload your screen recording to Google Drive and replace this link)*

---

## ✨ Features

### Core Requirements ✅
- 📸 **Image Upload** — Gallery picker + camera capture with format validation and auto-compression for files >2MB
- 🤖 **AI Clipart Generation** — Powered by HuggingFace FLUX.1-schnell model (state-of-the-art text-to-image)
- 🎨 **9 Visual Styles** — Cartoon, Flat Vector, Anime, Pixel Art, Sketch, 3D Render, Minimalist, Retro, Graffiti
- ⚡ **Batch Generation** — All selected styles generated in parallel (staggered for rate limit safety)
- 💀 **Skeleton Loaders** — Custom animated skeleton placeholders, not just spinners
- 📥 **Download + Share** — Per-image and bulk download; native share sheet integration
- 🔐 **No Exposed API Keys** — Backend proxy handles all AI calls; keys only in server `.env`

### Bonus Features ✅
- ✏️ **Prompt Customization** — Collapsible editor lets users add extra descriptors (e.g., "in space", "wearing sunglasses") to personalize generation
- 🔄 **Batch Generation** — Select All button; generates all 9 styles simultaneously in a beautiful grid
- 🔁 **Retry Per Style** — Individual style cards show a retry button on failure with shake animation
- 🔍 **Zoom Modal** — Pinch-to-zoom gesture on every generated image with full-screen preview
- 💫 **Before/After Toggle** — Badge in ResultScreen to toggle between AI and original views
- ⏱️ **Generation Progress Bar** — Live animated progress bar tracking `X of N styles ready`
- 🛡️ **Rate Limiting** — Express rate limiter on `/generate` endpoint
- ♻️ **Vision Caching** — Gemini image description is cached per image hash (15-minute TTL) with Promise deduplication to avoid duplicate API calls
- 🎬 **Brewer Splash Screen** — Custom generation splash with custom prompt preview
- 🌐 **Style Explorer Carousel** — Animated carousel on Home showcasing all available styles

---

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Mobile** | React Native 0.84 (CLI) + TypeScript | Native Android performance, type safety |
| **Navigation** | React Navigation v7 (Stack) | Industry standard, smooth transitions |
| **State Management** | Redux Toolkit + Redux Persist | Scalable, serializable state with persistence |
| **Animations** | React Native Reanimated v4 | GPU-accelerated 60fps animations |
| **Gestures** | React Native Gesture Handler | Pinch-to-zoom, tap gestures |
| **Image Picking** | React Native Image Picker | Gallery + Camera on Android |
| **Image Compression** | React Native Image Resizer | Compress >2MB images client-side |
| **File I/O** | React Native FS | Base64 read, file write for downloads |
| **Sharing** | React Native Share | Native Android share sheet |
| **Icons** | Lucide React Native | Professional, consistent icon set |
| **Gradients** | React Native Linear Gradient | Rich visual design |
| **Backend** | Node.js + Express | Lightweight proxy to protect API keys |
| **AI Vision** | Google Gemini 2.5 Flash | Free-tier vision API for image description |
| **AI Generation** | HuggingFace FLUX.1-schnell | State-of-the-art image generation (free tier) |
| **Rate Limiting** | express-rate-limit | Prevent backend abuse |
| **HTTP Client** | Axios | Reliable API calls with error handling |

---

## 🏗️ Project Structure

```
clipart/
├── android/                    # Android native project
├── backend/                    # Express proxy server
│   ├── server.js               # Main server with rate limiting, caching
│   ├── .env                    # API keys (gitignored)
│   └── .env.example            # Template for environment setup
├── src/
│   ├── apis/                   # Axios instance + API helpers
│   ├── assets/
│   │   └── samples/            # Style preview thumbnails
│   ├── components/             # Reusable UI components
│   │   ├── AnimatedButton.tsx  # Pressable with scale animation
│   │   ├── ImagePreview.tsx    # Image viewer
│   │   ├── ResultGrid.tsx      # FlatList grid for generated results
│   │   ├── SkeletonCard.tsx    # Animated skeleton placeholder
│   │   ├── StyleCard.tsx       # Individual result card w/ zoom modal
│   │   ├── StyleCarousel.tsx   # Home screen style explorer
│   │   └── StyleOptionCard.tsx # Style selector chip
│   ├── hooks/
│   │   ├── useGenerate.ts      # AI generation orchestration + retry
│   │   └── useImagePicker.ts   # Gallery + Camera picker + compression
│   ├── navigation/
│   │   └── rootStackParamList.ts
│   ├── pages/public/
│   │   ├── HomeScreen.tsx      # Landing page + style explorer
│   │   ├── CreateArtScreen.tsx # Image upload + style selection + prompt editor
│   │   ├── GenerateScreen.tsx  # Batch generation progress + result grid
│   │   └── ResultScreen.tsx    # Full image viewer + download/share
│   ├── redux/                  # Redux store + slices
│   ├── services/
│   │   ├── aiService.ts        # Backend API calls
│   │   └── imageService.ts     # Download, share, permissions
│   └── utils/
│       ├── constant/
│       │   ├── styles.ts       # 9 clipart style definitions
│       │   └── theme.ts        # Navigation theme
│       └── theme/
│           └── DesignSystem.ts # Colors, spacing, gradients
├── App.tsx                     # Root navigator setup
└── appRoutes.ts               # Route definitions
```

---

## ⚙️ Setup Steps

### Prerequisites
- Node.js >= 22.11.0
- Android Studio + Android SDK (API 28+)
- Java 17+
- Android device/emulator with USB debugging enabled

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/clipart.git
cd clipart
npm install
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your API keys:
# GEMINI_API_KEY=your_gemini_api_key
# HUGGINGFACE_API_KEY=your_huggingface_api_key
```

**Get free API keys:**
- **Gemini**: https://aistudio.google.com/app/apikey (free tier: 15 RPM)
- **HuggingFace**: https://huggingface.co/settings/tokens (free tier available)

### 3. Start Backend

```bash
# In /backend directory
node server.js
# Server starts on http://localhost:3000
```

### 4. Configure API URL

Edit `/src/apis/api.ts` and set the `baseURL` to your backend:
- **Local (USB/emulator)**: `http://10.0.2.2:3000` (emulator) or `http://192.168.x.x:3000` (real device on same WiFi)
- **Deployed**: Your production backend URL

### 5. Run on Android

```bash
# Start Metro bundler
npm start

# In a new terminal, build and install on Android
npm run android
```

---

## 🎯 AI Generation Pipeline

```
User Photo → Gemini Vision API → Subject Description (5 words)
                    ↓            (cached per image, 15-min TTL)
Style Prompt + Description + Custom Prompt → FLUX.1-schnell
                    ↓
Base64 PNG Response → App Display → Download/Share
```

**Example Final Prompt:**
> `cartoon clipart illustration, bold outlines, vibrant colors of young woman in red hat, wearing sunglasses, minimalist, clean vector, white background, no text, no watermark`

---

## 🤔 Tech Decisions & Tradeoffs

### Decision 1: React Native CLI over Expo
**Why**: More control over native modules (RNFS, Image Resizer, Share). Expo has limitations with some native libraries.  
**Tradeoff**: Longer initial setup vs. faster prototyping with Expo.

### Decision 2: Gemini + FLUX.1-schnell (Free Tier)
**Why**: Both have generous free tiers, allowing zero-cost operation for demos. FLUX.1-schnell is one of the fastest high-quality open-source image generators.  
**Tradeoff**: FLUX doesn't support true image-to-image (img2img), so we use Gemini Vision to describe the photo, then text-to-image with FLUX. This means the subject likeness depends on how well Gemini describes the photo. For production, Stable Diffusion img2img or DALL-E would give better face consistency.

### Decision 3: Backend Proxy (Required)
**Why**: API keys must never be embedded in the APK (they can be extracted via decompilation). The Express proxy keeps all secrets server-side.  
**Tradeoff**: Requires a deployed backend for production use. For local testing, run `node server.js` on the same network.

### Decision 4: Base64 Image Transfer
**Why**: Avoids CORS issues and file system complexity on Android. The generated image is returned as a Base64 data URI, which can be displayed directly in React Native `<Image>` components.  
**Tradeoff**: Higher network payload (~1.3x size overhead vs. binary). Mitigated by image compression on the client before upload.

### Decision 5: Staggered Batch Generation
**Why**: Firing all 9 API calls simultaneously would hit HuggingFace rate limits instantly. We stagger by 1.2 seconds per style.  
**Tradeoff**: Full batch of 9 takes ~11 seconds stagger + generation time. But users see results appear progressively, making it feel faster.

### Decision 6: Promise Caching for Gemini
**Why**: If a user selects 9 styles, we only want to call Gemini Vision once per image. We store the Promise (not just the result) to handle race conditions — all parallel requests wait on the same Promise.  
**Tradeoff**: Slightly more complex code vs. simple memoization.

---

## 🔒 Security

- ✅ API keys only in `backend/.env` (gitignored)
- ✅ Backend proxy handles all AI calls
- ✅ Rate limiting: 100 requests/minute per IP
- ✅ Input validation: image format, styleId whitelist, customPrompt sanitized (max 120 chars)
- ✅ Client-side image compression before upload
- ✅ `backend/.env` listed in `.gitignore` at root level

---

## 📸 Supported Image Formats

| Format | Supported |
|--------|-----------|
| JPEG/JPG | ✅ |
| PNG | ✅ |
| WebP | ✅ |
| GIF | ❌ |
| HEIC | ❌ |

Images over 2MB are auto-compressed to 1024×1024px at 80% JPEG quality before upload.

---

## 🎨 Design System

The app uses a custom "Lumina Noir" dark design system:

| Token | Value |
|-------|-------|
| Background | `#0E0E0E` |
| Primary (Purple) | `#D095FF` |
| Surface High | `#201F1F` |
| Text | `#FFFFFF` |
| Text Secondary | `#ADAAAA` |
| Error | `#FF6E84` |
| Border Radius | `16px` |

---

## 🚀 Deployment (Backend)

The backend can be deployed to any Node.js hosting:

**Option A: Railway (Recommended - Free tier)**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

**Option B: Render.com (Free tier)**
1. Push `backend/` to a separate GitHub repo
2. Create new Web Service on render.com
3. Set environment variables in dashboard
4. Deploy

**Option C: Local with ngrok (For testing)**
```bash
npm install -g ngrok
node server.js &
ngrok http 3000
# Use the HTTPS ngrok URL in the app
```

---

## 📋 Assignment Checklist

| Requirement | Status |
|-------------|--------|
| Android APK | ✅ |
| Screen Recording | ✅ |
| App installs without crashes | ✅ |
| GitHub repo + clean history | ✅ |
| Image upload (gallery + camera) | ✅ |
| Format validation + compression | ✅ |
| Cartoon style | ✅ |
| Flat illustration style | ✅ |
| Anime style | ✅ |
| Pixel art style | ✅ |
| Sketch style | ✅ |
| 3D Render (bonus) | ✅ |
| Minimalist (bonus) | ✅ |
| Retro (bonus) | ✅ |
| Graffiti (bonus) | ✅ |
| Batch/parallel generation | ✅ |
| Skeleton loaders | ✅ |
| Download PNG | ✅ |
| Native share sheet | ✅ |
| No exposed API keys | ✅ |
| Rate limiting | ✅ |
| Input validation | ✅ |
| Prompt customization (bonus) | ✅ |
| Batch all styles (bonus) | ✅ |
| Before/after toggle (bonus) | ✅ |
| Retry failed styles (bonus) | ✅ |
| Zoom modal with pinch (bonus) | ✅ |
| Stitch-generated UI components | ✅ |
| Clean code structure | ✅ |
| Smooth animations | ✅ |

---

## 👤 Author

Built for the AI Clipart Generator assignment.  
React Native + Node.js + Gemini Vision + FLUX.1-schnell.
