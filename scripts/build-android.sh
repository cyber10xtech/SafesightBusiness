#!/bin/bash

# Build script for generating both Android APKs
# Usage: ./scripts/build-android.sh [customer|professional|both]

set -e

APP=${1:-both}

build_customer() {
  echo "🔨 Building HandyConnect (Customer App)..."
  cp capacitor.config.customer.ts capacitor.config.ts
  npm run build
  npx cap sync android
  echo "✅ HandyConnect ready! Open Android Studio with: npx cap open android"
  echo "   Then: Build → Build Bundle(s) / APK(s) → Build APK(s)"
}

build_professional() {
  echo "🔨 Building ProConnect (Professional App)..."
  cp capacitor.config.professional.ts capacitor.config.ts
  npm run build
  npx cap sync android
  echo "✅ ProConnect ready! Open Android Studio with: npx cap open android"
  echo "   Then: Build → Build Bundle(s) / APK(s) → Build APK(s)"
}

case $APP in
  customer)
    build_customer
    ;;
  professional)
    build_professional
    ;;
  both)
    build_customer
    echo ""
    echo "⚠️  Save the APK before building the next app!"
    echo "   APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    read -p "Press Enter to continue building ProConnect..."
    build_professional
    ;;
  *)
    echo "Usage: ./scripts/build-android.sh [customer|professional|both]"
    exit 1
    ;;
esac
