import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { CallSheet } from "@/components/CallSheet";
import { Header } from "@/components/Header";
import { MemberCard } from "@/components/MemberCard";
import { Member, useMembers } from "@/context/MembersContext";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const [selectedAkka, setSelectedAkka] = useState<string | null>(null);
  const [callMember, setCallMember] = useState<Member | null>(null);
  const [callVisible, setCallVisible] = useState(false);
  const { members, getAkkas } = useMembers();
  const colors = useColors();
  const tabBarHeight = useBottomTabBarHeight();

  const akkas = getAkkas();
  const filtered = selectedAkka ? members.filter((m) => m.akka === selectedAkka) : [];

  function handleCall(member: Member) {
    setCallMember(member);
    setCallVisible(true);
  }

  // When no akka selected, show akka cards with member counts
  const AkkaCards = () => (
    <View style={styles.akkaCardsWrap}>
      <Text style={[styles.browsTitle, { color: colors.foreground }]}>
        Browse by Surname
      </Text>
      <Text style={[styles.browsSub, { color: colors.mutedForeground }]}>
        Select a community surname to connect with members
      </Text>
      <View style={styles.akkaGrid}>
        {akkas.map((a) => {
          const count = members.filter((m) => m.akka === a).length;
          return (
            <TouchableOpacity
              key={a}
              style={[styles.akkaCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setSelectedAkka(a)}
              activeOpacity={0.82}
            >
              <View style={[styles.akkaIconWrap, { backgroundColor: colors.primary }]}>
                <Text style={[styles.akkaInitial, { color: colors.primaryForeground }]}>
                  {a[0]}
                </Text>
              </View>
              <Text style={[styles.akkaName, { color: colors.foreground }]} numberOfLines={1}>
                {a}
              </Text>
              <View style={[styles.akkaBadge, { backgroundColor: colors.muted }]}>
                <Text style={[styles.akkaBadgeText, { color: colors.accent }]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const ListHeader = (
    <>
      {/* Surname filter chips */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.clearChip, { backgroundColor: colors.muted }]}
          onPress={() => setSelectedAkka(null)}
        >
          <Feather name="grid" size={14} color={colors.mutedForeground} />
          <Text style={[styles.clearChipText, { color: colors.mutedForeground }]}>All Surnames</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {akkas.map((akka) => (
            <TouchableOpacity
              key={akka}
              style={[
                styles.chip,
                { backgroundColor: selectedAkka === akka ? colors.primary : colors.secondary, borderColor: selectedAkka === akka ? colors.primary : colors.border },
              ]}
              onPress={() => setSelectedAkka(akka === selectedAkka ? null : akka)}
            >
              <Text style={[styles.chipText, { color: selectedAkka === akka ? colors.primaryForeground : colors.foreground }]}>
                {akka}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedAkka && (
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionAkkaTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.sectionAkkaText, { color: colors.primaryForeground }]}>
              {selectedAkka} Family
            </Text>
          </View>
          <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
            {filtered.length} member{filtered.length !== 1 ? "s" : ""}
          </Text>
        </View>
      )}
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Header subtitle="Pakistan & Worldwide" />

      {!selectedAkka ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
          showsVerticalScrollIndicator={false}
        >
          {ListHeader}
          <AkkaCards />
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MemberCard member={item} onCall={handleCall} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="users" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No members found</Text>
              <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
                No members found in this akka group yet
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CallSheet member={callMember} visible={callVisible} onClose={() => setCallVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  filterBar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, gap: 10 },
  clearChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  clearChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  chipsRow: { gap: 8, alignItems: "center", paddingVertical: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionAkkaTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sectionAkkaText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  sectionCount: { fontSize: 13, fontFamily: "Inter_400Regular" },
  akkaCardsWrap: { paddingHorizontal: 16, paddingTop: 20 },
  browsTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 4 },
  browsSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 18 },
  akkaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  akkaCard: {
    width: "47%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  akkaIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  akkaInitial: { fontSize: 22, fontFamily: "Inter_700Bold" },
  akkaName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  akkaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  akkaBadgeText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
