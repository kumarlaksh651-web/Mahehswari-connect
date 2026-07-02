import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Member } from "@/context/MembersContext";
import { useColors } from "@/hooks/useColors";

interface MemberCardProps {
  member: Member;
  onCall: (member: Member) => void;
}

export function MemberCard({ member, onCall }: MemberCardProps) {
  const colors = useColors();
  const router = useRouter();

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/member/${member.id}`)}
      activeOpacity={0.78}
    >
      <View style={styles.avatarWrap}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
          <Text style={[styles.initials, { color: colors.primaryForeground }]}>{initials}</Text>
        </View>
        {member.online && (
          <View style={[styles.onlineDot, { borderColor: colors.card }]} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {member.name}
        </Text>
        <Text style={[styles.location, { color: colors.mutedForeground }]}>
          {member.countryFlag} {member.city}, {member.country}
        </Text>
        {member.qualification ? (
          <Text style={[styles.qual, { color: colors.mutedForeground }]} numberOfLines={1}>
            {member.qualification}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.callBtn, { backgroundColor: colors.primary }]}
        onPress={() => onCall(member)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name="phone" size={17} color={colors.primaryForeground} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrap: { position: "relative" },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: { fontSize: 17, fontFamily: "Inter_700Bold" },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
  },
  info: { flex: 1, marginLeft: 12, gap: 3 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  location: { fontSize: 13, fontFamily: "Inter_400Regular" },
  qual: { fontSize: 12, fontFamily: "Inter_400Regular" },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
