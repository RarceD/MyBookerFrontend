import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.de.reservas',
  appName: 'appdereservas',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
