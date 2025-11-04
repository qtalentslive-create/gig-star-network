import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "live.qtalent.app",
  appName: "qtalent",
  webDir: "dist",

  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0A0118",
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
    },
    Keyboard: {
      resize: "native",
      style: "dark",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
