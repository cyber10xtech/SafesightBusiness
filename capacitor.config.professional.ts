import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.proconnect',
  appName: 'ProConnect',
  webDir: 'dist',
  server: {
    url: 'https://e0223ea6-6a9e-4635-95ad-ee74eddc58bb.lovableproject.com/dashboard?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
