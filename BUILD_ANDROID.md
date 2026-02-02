# Building Android APKs

This project contains two apps:
- **HandyConnect** - Customer app for finding professionals
- **ProConnect** - Professional app for managing bookings

## Prerequisites

1. [Node.js](https://nodejs.org/) (v18+)
2. [Android Studio](https://developer.android.com/studio) with SDK installed
3. Java JDK 17+

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

### 2. Add Android Platform (first time only)

```bash
npx cap add android
```

### 3. Build an APK

**Option A: Using the build script (Linux/Mac)**

```bash
chmod +x scripts/build-android.sh

# Build customer app only
./scripts/build-android.sh customer

# Build professional app only  
./scripts/build-android.sh professional

# Build both (one at a time)
./scripts/build-android.sh both
```

**Option B: Manual steps (Windows/all platforms)**

For HandyConnect (Customer):
```bash
copy capacitor.config.customer.ts capacitor.config.ts
npm run build
npx cap sync android
npx cap open android
```

For ProConnect (Professional):
```bash
copy capacitor.config.professional.ts capacitor.config.ts
npm run build
npx cap sync android
npx cap open android
```

### 4. Generate APK in Android Studio

1. Wait for Gradle sync to complete
2. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Click "locate" in the notification to find your APK
4. Default location: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Rename and Save

After building each app, rename the APK:
- `app-debug.apk` → `HandyConnect.apk`
- `app-debug.apk` → `ProConnect.apk`

## Troubleshooting

**Gradle sync fails:**
- Ensure Android SDK is installed via Android Studio SDK Manager
- Set `ANDROID_HOME` environment variable

**Build fails:**
- Run `npx cap sync android` again
- Check for Java version compatibility (JDK 17 recommended)

## Production Builds

For Play Store releases, you'll need to:
1. Create a signing key
2. Build a release APK/AAB via **Build → Generate Signed Bundle / APK**
