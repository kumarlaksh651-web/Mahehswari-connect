import { useEffect, useRef } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function WelcomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 700, useNativeDriver: false }),
      Animated.timing(textAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
      Animated.timing(btnAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Image source={require("@/assets/images/splash.png")} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={["rgba(139,26,26,0.45)", "rgba(139,26,26,0.85)", "rgba(80,6,6,1)"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: topPad + 50, paddingBottom: botPad + 28 }]}>
        {/* Logo */}
        <Animated.View
          style={[styles.heroSection, {
            opacity: logoAnim,
            transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
          }]}
        >
          <View style={[styles.logoRing, { borderColor: "rgba(201,168,68,0.5)" }]}>
            <View style={[styles.logoInner, { borderColor: "rgba(201,168,68,0.25)", backgroundColor: "rgba(255,255,255,0.1)" }]}>
              <Image source={require("@/assets/images/icon.png")} style={styles.logo} contentFit="contain" />
            </View>
          </View>
        </Animated.View>

        {/* Text block */}
        <Animated.View
          style={[styles.textBlock, {
            opacity: textAnim,
            transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }]}
        >
          <Text style={styles.appName}>Dhat Maheshwari</Text>
          <Text style={[styles.urduName, { color: colors.accent }]}>دھت مہیشوری</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.accent }]} />
          <Text style={styles.tagline}>
            Connecting the Dhatki Maheshwari community{"\n"}across Pakistan and the world
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[styles.actions, {
            opacity: btnAnim,
            transform: [{ translateY: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }]}
        >
          <TouchableOpacity
            style={[styles.joinBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push("/(auth)/register")}
            activeOpacity={0.85}
          >
            <Text style={[styles.joinText, { color: colors.primary }]}>Join the Community</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.85}
          >
            <Text style={styles.loginText}>Already a Member? Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Proudly serving Maheshwari families since 2000
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: "space-between" },
  heroSection: { alignItems: "center" },
  logoRing: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 2,
    justifyContent: "center", alignItems: "center",
  },
  logoInner: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 1,
    justifyContent: "center", alignItems: "center",
  },
  logo: { width: 72, height: 72 },
  textBlock: { alignItems: "center", gap: 10 },
  appName: { fontSize: 36, fontFamily: "Inter_700Bold", color: "#fff", textAlign: "center", letterSpacing: -0.5 },
  urduName: { fontSize: 28, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  dividerLine: { width: 48, height: 2, borderRadius: 1, marginVertical: 4 },
  tagline: { fontSize: 15, color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 23, fontFamily: "Inter_400Regular" },
  actions: { gap: 12 },
  joinBtn: { paddingVertical: 18, borderRadius: 16, alignItems: "center", shadowColor: "#C9A844", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  joinText: { fontSize: 17, fontFamily: "Inter_700Bold" },
  loginBtn: { paddingVertical: 17, borderRadius: 16, alignItems: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.35)" },
  loginText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  footerNote: { textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
});
