import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { CallSheet } from "@/components/CallSheet";
import { Header } from "@/components/Header";
import { MemberCard } from "@/components/MemberCard";
import { Member, useMembers } from "@/context/MembersContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

type FilterType = "all" | "akka" | "city";

interface CommunityEvent {
  id: string;
  title: string;
  org: string;
  orgShort: string;
  date: string;
  city: string;
  venue: string;
  conductors: string;
  type: "medical" | "scholarship" | "meeting" | "cultural";
}

const EVENTS: CommunityEvent[] = [
  {
    id: "e1",
    title: "Free Medical Camp — Tharparkar",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    date: "15 Jul 2026",
    city: "Mithi, Tharparkar",
    venue: "Maheshwari Community Hall, Near Shiv Mandir, Mithi",
    conductors: "Dr. Ramesh Bhansali, Dr. Vijay Chandak & PGMF Medical Team",
    type: "medical",
  },
  {
    id: "e2",
    title: "Annual Scholarship Award Ceremony",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    date: "20 Aug 2026",
    city: "Karachi",
    venue: "Avari Towers, Club Road, Karachi",
    conductors: "PGMF Executive Committee & Community Elders",
    type: "scholarship",
  },
  {
    id: "e3",
    title: "MAF Community Town Hall",
    org: "Maheshwari Action Forum",
    orgShort: "MAF",
    date: "10 Jul 2026",
    city: "Hyderabad",
    venue: "Mehran Hotel, Saddar, Hyderabad",
    conductors: "MAF Advisory Board, Deepak Singhvi & Tarachand Singhvi",
    type: "meeting",
  },
  {
    id: "e4",
    title: "Mahesh Navami Celebration 2026",
    org: "Community",
    orgShort: "COMM",
    date: "28 Jul 2026",
    city: "Karachi",
    venue: "Shri Maheshwari Sabha, Lines Area, Karachi",
    conductors: "Community Elders, Pandit Suresh Daga & Pandit Kishanlal Daga",
    type: "cultural",
  },
  {
    id: "e5",
    title: "Umerkot Medical & Welfare Camp",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    date: "5 Sep 2026",
    city: "Umerkot, Sindh",
    venue: "Umerkot Hindu Panchayat Hall, near Main Chowk",
    conductors: "PGMF Medical Wing, Dr. Dilip Kumar Ladha (Houston, USA) — Remote Support",
    type: "medical",
  },
];

const EVENT_COLORS: Record<CommunityEvent["type"], { bg: string; text: string; icon: React.ComponentProps<typeof Feather>["name"] }> = {
  medical: { bg: "#FEE2E2", text: "#DC2626", icon: "heart" },
  scholarship: { bg: "#FEF9C3", text: "#CA8A04", icon: "book" },
  meeting: { bg: "#E0E7FF", text: "#4338CA", icon: "users" },
  cultural: { bg: "#FCE7F3", text: "#BE185D", icon: "star" },
};

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedAkka, setSelectedAkka] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [callMember, setCallMember] = useState<Member | null>(null);
  const [callVisible, setCallVisible] = useState(false);

  const { members, getAkkas } = useMembers();
  const { user } = useAuth();
  const colors = useColors();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const akkas = getAkkas();
  const cities = [...new Set(members.map((m) => m.city))].sort();

  const isSearching = query.trim().length > 0 || selectedAkka !== null || selectedCity !== null;

  const filtered = isSearching
    ? members.filter((m) => {
        const q = query.toLowerCase();
        const matchQuery = !q || m.name.toLowerCase().includes(q) || m.akka.toLowerCase().includes(q) || m.city.toLowerCase().includes(q) || m.country.toLowerCase().includes(q);
        const matchAkka = !selectedAkka || m.akka === selectedAkka;
        const matchCity = !selectedCity || m.city === selectedCity;
        return matchQuery && matchAkka && matchCity;
      })
    : [];

  function handleCall(member: Member) {
    setCallMember(member);
    setCallVisible(true);
  }

  function clearFilters() {
    setQuery("");
    setSelectedAkka(null);
    setSelectedCity(null);
    setFilterType("all");
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Maroon header with search */}
      <LinearGradient colors={[colors.primary, "#6B1010"]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => router.push("/settings")} activeOpacity={0.8}>
            <Feather name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Dhat Maheshwari</Text>
            <Text style={styles.headerSub}>Pakistan & Worldwide</Text>
          </View>
          <TouchableOpacity style={[styles.avatarBtn, { backgroundColor: colors.accent }]} onPress={() => router.push("/settings")} activeOpacity={0.8}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "M"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Feather name="search" size={16} color="rgba(255,255,255,0.7)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members by name, city, akka..."
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Feather name="x" size={16} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          <TouchableOpacity
            style={[styles.filterChip, filterType === "all" && { backgroundColor: colors.accent }]}
            onPress={() => { setFilterType("all"); setSelectedAkka(null); setSelectedCity(null); }}
          >
            <Text style={[styles.filterChipText, { color: filterType === "all" ? colors.primary : "rgba(255,255,255,0.8)" }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterType === "akka" && { backgroundColor: colors.accent }]}
            onPress={() => { setFilterType(filterType === "akka" ? "all" : "akka"); setSelectedCity(null); }}
          >
            <Text style={[styles.filterChipText, { color: filterType === "akka" ? colors.primary : "rgba(255,255,255,0.8)" }]}>By Surname</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterType === "city" && { backgroundColor: colors.accent }]}
            onPress={() => { setFilterType(filterType === "city" ? "all" : "city"); setSelectedAkka(null); }}
          >
            <Text style={[styles.filterChipText, { color: filterType === "city" ? colors.primary : "rgba(255,255,255,0.8)" }]}>By City</Text>
          </TouchableOpacity>
          {filterType === "akka" && akkas.map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.filterChip, selectedAkka === a && { backgroundColor: "#fff" }]}
              onPress={() => setSelectedAkka(selectedAkka === a ? null : a)}
            >
              <Text style={[styles.filterChipText, { color: selectedAkka === a ? colors.primary : "rgba(255,255,255,0.9)" }]}>{a}</Text>
            </TouchableOpacity>
          ))}
          {filterType === "city" && cities.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.filterChip, selectedCity === c && { backgroundColor: "#fff" }]}
              onPress={() => setSelectedCity(selectedCity === c ? null : c)}
            >
              <Text style={[styles.filterChipText, { color: selectedCity === c ? colors.primary : "rgba(255,255,255,0.9)" }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Body */}
      {isSearching ? (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <MemberCard member={item} onCall={handleCall} />}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Text style={[styles.resultsTitle, { color: colors.foreground }]}>
                {filtered.length} member{filtered.length !== 1 ? "s" : ""} found
              </Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={[styles.clearText, { color: colors.primary }]}>Clear</Text>
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="search" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No members found</Text>
              <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Try different filters or search terms</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }} showsVerticalScrollIndicator={false}>
          {/* Community Events */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming Programs</Text>
            <View style={[styles.liveDot, { backgroundColor: "#22C55E" }]} />
            <Text style={[styles.liveLabel, { color: "#22C55E" }]}>Live</Text>
          </View>

          {EVENTS.map((ev) => {
            const c = EVENT_COLORS[ev.type];
            return (
              <View key={ev.id} style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.eventTop}>
                  <View style={[styles.eventIcon, { backgroundColor: c.bg }]}>
                    <Feather name={c.icon} size={20} color={c.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.eventTitle, { color: colors.foreground }]}>{ev.title}</Text>
                    <View style={[styles.orgTag, { backgroundColor: colors.muted }]}>
                      <Text style={[styles.orgTagText, { color: colors.primary }]}>{ev.orgShort}</Text>
                    </View>
                  </View>
                  <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.dateBadgeText, { color: colors.primaryForeground }]}>{ev.date.split(" ")[0]}</Text>
                    <Text style={[styles.dateBadgeMon, { color: colors.accent }]}>{ev.date.split(" ")[1]}</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <EventDetail icon="map-pin" text={ev.city} colors={colors} />
                  <EventDetail icon="home" text={ev.venue} colors={colors} />
                  <EventDetail icon="users" text={ev.conductors} colors={colors} />
                </View>
              </View>
            );
          })}

          {/* Browse Members hint */}
          <View style={[styles.browseMembersCard, { backgroundColor: colors.primary }]}>
            <View>
              <Text style={styles.browseMembersTitle}>Browse Members</Text>
              <Text style={styles.browseMembersSub}>Use the search bar or surname filter above to find community members</Text>
            </View>
            <Feather name="search" size={28} color="rgba(255,255,255,0.4)" />
          </View>
        </ScrollView>
      )}

      <CallSheet member={callMember} visible={callVisible} onClose={() => setCallVisible(false)} />
    </View>
  );
}

function EventDetail({ icon, text, colors }: { icon: any; text: string; colors: any }) {
  return (
    <View style={styles.eventDetailRow}>
      <Feather name={icon} size={13} color={colors.mutedForeground} style={{ marginTop: 1 }} />
      <Text style={[styles.eventDetailText, { color: colors.mutedForeground }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerGradient: { paddingBottom: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 54, paddingBottom: 10, gap: 12 },
  menuBtn: { width: 38, height: 38, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular" },
  avatarBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  searchWrap: { paddingHorizontal: 16, marginBottom: 10 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", color: "#fff" },
  filterChips: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)" },
  filterChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  resultsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  resultsTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  clearText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, gap: 8 },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold", flex: 1 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveLabel: { fontSize: 12, fontFamily: "Inter_700Bold" },
  eventCard: { marginHorizontal: 16, marginBottom: 12, padding: 14, borderRadius: 18, borderWidth: 1, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  eventTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  eventIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  eventTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4, flex: 1 },
  orgTag: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  orgTagText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.4 },
  dateBadge: { alignItems: "center", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, minWidth: 46 },
  dateBadgeText: { fontSize: 18, fontFamily: "Inter_700Bold", lineHeight: 22 },
  dateBadgeMon: { fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase" },
  eventDetails: { gap: 6, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)", paddingTop: 10 },
  eventDetailRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  eventDetailText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 18 },
  browseMembersCard: { marginHorizontal: 16, marginTop: 6, marginBottom: 4, padding: 20, borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  browseMembersTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 4 },
  browseMembersSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", maxWidth: 240, lineHeight: 18 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
