import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.revolab.propaganda',
  appName: 'Propaganda',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    // Capacitor to open URLs belonging to these hosts inside its WebView.
    allowNavigation: [
      "steamcommunity.com",
      "mirrorlayers.com",
    ]
  }
};

export default config;
