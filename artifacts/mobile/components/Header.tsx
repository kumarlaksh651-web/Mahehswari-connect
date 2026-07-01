import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface HeaderProps {
  subtitle?: string;
}

export function Header({ subtitle }: HeaderProps) {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary, paddingTop: topPadding }]}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <Feather name="menu" size={24} color={colors.primaryForeground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push("/search")}
          activeOpacity={0.8}
        >
          <Feather name="search" size={15} color="rgba(255,255,255,0.75)" />
          <Text style={styles.searchPlaceholder}>Search members...</Text>
        </TouchableOpacity>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", paddingBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  iconButton: { width: 38, height: 38, justifyContent: "center", alignItems: "center" },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    gap: 8,
  },
  searchPlaceholder: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  subtitle: { color: "rgba(255,255,255,0.65)", fontSize: 12, fontFamily: "Inter_400Regular", paddingHorizontal: 16, paddingBottom: 6 },
});
