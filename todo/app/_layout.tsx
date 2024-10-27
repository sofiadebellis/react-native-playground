import "@/global.css";
import { Slot, Stack, Tabs } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Slot />
        </GestureHandlerRootView>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
