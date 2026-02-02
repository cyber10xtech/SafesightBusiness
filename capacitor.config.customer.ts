import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.handyconnect',
  appName: 'HandyConnect',
  webDir: 'dist',
  server: {
    url: 'https://e0223ea6-6a9e-4635-95ad-ee74eddc58bb.lovableproject.com/customer/home?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
