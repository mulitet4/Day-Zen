import { Slot, SplashScreen } from "expo-router";
import { useFonts, fontError } from 'expo-font';
import { useEffect } from "react";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function () {
  const [fontsLoaded] = useFonts({
    'Archivo': require('../assets/fonts/Archivo.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Render the children routes now that all the assets are loaded.
  return <Slot />;
}