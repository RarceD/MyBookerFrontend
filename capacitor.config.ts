import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'meApunto.online',
  appName: 'MeApunto.Online',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
