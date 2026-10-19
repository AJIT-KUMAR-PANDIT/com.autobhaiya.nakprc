# Auto Bhaiya by NAKPRC — Deployment Guide

This guide provides step-by-step instructions for deploying the **Auto Bhaiya by NAKPRC** web application and packaging it for mobile devices (Android & iOS) via Capacitor.

---

## 1. Web Deployment

The application is built with Vite and React. The production build generates an optimized Single Page Application (SPA) inside the `dist/` directory.

### Build Command
```bash
npm run build
```

---

### Option A: Netlify (Recommended)

The project includes a pre-configured `netlify.toml` for Single Page Application routing:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Deployment Steps:
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Netlify](https://app.netlify.com/) and click **Add new site** -> **Import an existing project**.
3. Select your repository.
4. Settings will automatically detect:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Under **Environment variables**, add:
   - `VITE_APPWRITE_ENDPOINT`
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_APPWRITE_DATABASE_ID`
   - `VITE_APPWRITE_BOOKINGS_COLLECTION_ID`
6. Click **Deploy Site**.

---

### Option B: Vercel

1. Install the Vercel CLI or link via [vercel.com](https://vercel.com).
2. If using Vercel dashboard, import the repository with Framework Preset: `Vite`.
3. Ensure SPA route rewrites are set (or add `vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
4. Set the environment variables in Project Settings -> Environment Variables.
5. Deploy!

---

### Option C: Static / Docker / Nginx

To serve via Nginx, ensure all requests route to `index.html`:

```nginx
server {
    listen 80;
    server_name autobhaiya.nakprc.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 2. Mobile Deployment (Capacitor)

The repository is configured with `@capacitor/core` and `@capacitor/cli` for native Android and iOS mobile wrappers.

### Configuration (`capacitor.config.json`)
```json
{
  "appId": "com.autobhaiya.nakprc",
  "appName": "Auto Bhaiya",
  "webDir": "dist",
  "bundledWebRuntime": false
}
```

---

### Step 2.1: Prepare Web Assets
Every time you make web code changes, rebuild the `dist/` folder and sync with native platforms:
```bash
npm run build
npx cap sync
```

---

### Step 2.2: Android Deployment

1. **Prerequisites**: Android Studio (v2023.1+) and Android SDK (API 34+).
2. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```
3. **Configure Permissions** in `android/app/src/main/AndroidManifest.xml`:
   - Camera: For QR Scanner (`android.permission.CAMERA`).
   - Call phone: For direct driver dial (`android.permission.CALL_PHONE` or `android.intent.action.DIAL`).
   - Internet: For Appwrite Realtime (`android.permission.INTERNET`).
4. **Build APK / AAB**:
   - In Android Studio: **Build** -> **Generate Signed Bundle / APK**.
   - Select **Android App Bundle** (for Google Play Store) or **APK** (for direct distribution).
   - Sign with your release keystore and export.

---

### Step 2.3: iOS Deployment (macOS only)

1. **Prerequisites**: macOS with Xcode 15+ and CocoaPods installed.
2. **Sync and Open**:
   ```bash
   npx cap open ios
   ```
3. **Configure Info.plist** in Xcode:
   - Add `NSCameraUsageDescription` (e.g., "Auto Bhaiya requires camera access to scan driver verification QR codes").
   - Add URL schemes for UPI apps if invoking native schemes.
4. **Signing & Capabilities**:
   - Select your Team and Apple Developer Provisioning Profile.
5. **Archive & Export**:
   - Product -> **Archive** -> Upload to App Store Connect / TestFlight.

---

## 3. Post-Deployment Checklist

- [ ] **Appwrite Web Platform Registration**: Verify that your production domain (`https://autobhaiya.nakprc.com` or custom Netlify/Vercel URL) is added to Appwrite Console -> Platforms -> Web Apps.
- [ ] **Payment Configuration**: Verify `public/data/payment.json` contains valid payee details (`upiId` & `payeeName`).
- [ ] **PWA / Standalone Installation**: Test mobile browser "Add to Home Screen" or launch the installed Capacitor APK.
- [ ] **Offline Resilience**: Turn off Wi-Fi/Mobile Data and verify that booking history displays saved trips from `localStorage`.
- [ ] **Camera Permissions**: Verify QR Scanner prompts for camera permission cleanly and handles denial gracefully.
