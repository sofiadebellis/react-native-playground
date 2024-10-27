import "@/global.css";
import { Slot } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import Header from "./header";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <SafeAreaView style={{ flex: 1 }}>
          <Header />
          <Slot />
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
