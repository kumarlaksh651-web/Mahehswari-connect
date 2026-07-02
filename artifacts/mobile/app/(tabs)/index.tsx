import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Alert,
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
import { MemberCard } from "@/components/MemberCard";
import { Member, useMembers } from "@/context/MembersContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

type FilterType = "all" | "city";

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
    conductors: "PGMF Medical Wing, Dr. Dilip Kumar Ladha (Houston, USA)",
    type: "medical",
  },
];

const EVENT_META: Record<CommunityEvent["type"], { bg: string; text: string; icon: React.ComponentProps<typeof Feather>["name"] }> = {
  medical:    { bg: "#FEE2E2", text: "#DC2626", icon: "heart" },
  scholarship:{ bg: "#FEF9C3", text: "#CA8A04", icon: "book" },
  meeting:    { bg: "#E0E7FF", text: "#4338CA", icon: "users" },
  cultural:   { bg: "#FCE7F3", text: "#BE185D", icon: "star" },
};

// Decorative diamond pattern row
function DiamondRow({ colors }: { colors: any }) {
  const diamonds = ["◆", "◇", "◆", "◇", "◆", "◇", "◆"];
  return (
    <View style={dStyles.diamondRow}>
      {diamonds.map((d, i) => (
        <Text key={i} style={[dStyles.diamond, { color: i % 2 === 0 ? colors.accent : colors.border, opacity: i % 2 === 0 ? 0.7 : 0.4 }]}>{d}</Text>
      ))}
    </View>
  );
}

const dStyles = StyleSheet.create({
  diamondRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 2 },
  diamond: { fontSize: 10 },
});

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [callMember, setCallMember] = useState<Member | null>(null);
  const [callVisible, setCallVisible] = useState(false);
  const [thought, setThought] = useState("");

  const { members } = useMembers();
  const { user } = useAuth();
  const colors = useColors();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const cities = [...new Set(members.map((m) => m.city))].sort();

  const isSearching = query.trim().length > 0 || selectedCity !== null;

  const filtered = isSearching
    ? members.filter((m) => {
        const q = query.toLowerCase();
        const matchQuery = !q || m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q) || m.country.toLowerCase().includes(q);
        const matchCity = !selectedCity || m.city === selectedCity;
        return matchQuery && matchCity;
      })
    : [];

  function handleCall(member: Member) { setCallMember(member); setCallVisible(true); }

  function clearFilters() { setQuery(""); setSelectedCity(null); setFilterType("all"); }

  function submitThought() {
    const t = thought.trim();
    if (!t) return;
    setThought("");
    Alert.alert("Shared!", "Your thought has been shared with the community.", [{ text: "OK" }]);
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "M";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Gradient Header ── */}
      <LinearGradient colors={[colors.primary, "#5A0808"]} style={styles.headerGradient}>
        {/* Top row */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => router.push("/settings")} activeOpacity={0.8}>
            <Feather name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Dhat Maheshwari</Text>
            <Text style={styles.headerSub}>Pakistan & Worldwide</Text>
          </View>
          <TouchableOpacity style={[styles.avatarBtn, { backgroundColor: colors.accent }]} onPress={() => router.push("/settings")} activeOpacity={0.8}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={styles.statNum}>{EVENTS.length}</Text>
            <Text style={styles.statLabel}>Upcoming{"\n"}Programs</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.2)" }]} />
          <View style={[styles.statCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={styles.statNum}>5</Text>
            <Text style={styles.statLabel}>Active Welfare{"\n"}Programs</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.2)" }]} />
          <View style={[styles.statCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>Community{"\n"}Organizations</Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Feather name="search" size={16} color="rgba(255,255,255,0.7)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members by name, city..."
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
            onPress={() => { setFilterType("all"); setSelectedCity(null); }}
          >
            <Text style={[styles.filterChipText, { color: filterType === "all" ? colors.primary : "rgba(255,255,255,0.8)" }]}>All Members</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterType === "city" && { backgroundColor: colors.accent }]}
            onPress={() => { setFilterType(filterType === "city" ? "all" : "city"); }}
          >
            <Text style={[styles.filterChipText, { color: filterType === "city" ? colors.primary : "rgba(255,255,255,0.8)" }]}>Filter by City</Text>
          </TouchableOpacity>
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

      {/* ── Body ── */}
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
              <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Try different search terms</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }} showsVerticalScrollIndicator={false}>

          {/* ── Upcoming Programs ── */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming Programs</Text>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          {EVENTS.map((ev) => {
            const meta = EVENT_META[ev.type];
            const [day, mon, yr] = ev.date.split(" ");
            return (
              <View key={ev.id} style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.eventTop}>
                  {/* Date badge */}
                  <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.dateBadgeDay, { color: colors.accent }]}>{day}</Text>
                    <Text style={[styles.dateBadgeMon, { color: colors.primaryForeground }]}>{mon}</Text>
                    <Text style={[styles.dateBadgeYr, { color: "rgba(255,255,255,0.6)" }]}>{yr}</Text>
                  </View>
                  {/* Content */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.eventTitleRow}>
                      <View style={[styles.typeIcon, { backgroundColor: meta.bg }]}>
                        <Feather name={meta.icon} size={13} color={meta.text} />
                      </View>
                      <Text style={[styles.eventTitle, { color: colors.foreground }]} numberOfLines={2}>{ev.title}</Text>
                    </View>
                    <View style={[styles.orgBadge, { backgroundColor: colors.muted }]}>
                      <Text style={[styles.orgBadgeText, { color: colors.primary }]}>{ev.orgShort}</Text>
                    </View>
                  </View>
                </View>
                {/* Details */}
                <View style={[styles.eventDetails, { borderTopColor: colors.border }]}>
                  <EventDetail icon="map-pin" text={ev.venue} colors={colors} />
                  <EventDetail icon="users" text={ev.conductors} colors={colors} />
                </View>
              </View>
            );
          })}

          {/* ── Decorative divider ── */}
          <View style={styles.decorDivider}>
            <View style={[styles.decorLine, { backgroundColor: colors.border }]} />
            <DiamondRow colors={colors} />
            <View style={[styles.decorLine, { backgroundColor: colors.border }]} />
          </View>

          {/* ── Share Your Thought ── */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Share Your Thought</Text>
          </View>

          <View style={[styles.thoughtCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Decorative top strip */}
            <LinearGradient colors={[colors.primary, "#6B1010"]} style={styles.thoughtStrip}>
              <Feather name="message-circle" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.thoughtStripText}>Say something to the community</Text>
            </LinearGradient>

            <View style={styles.thoughtBody}>
              <View style={[styles.thoughtAvatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.thoughtAvatarText, { color: colors.primaryForeground }]}>{initials}</Text>
              </View>
              <View style={{ flex: 1, gap: 10 }}>
                <TextInput
                  style={[styles.thoughtInput, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
                  placeholder={`Share a thought, Jai Mahesh! 🙏`}
                  placeholderTextColor={colors.mutedForeground}
                  value={thought}
                  onChangeText={setThought}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[styles.thoughtSendBtn, { backgroundColor: colors.primary, opacity: thought.trim() ? 1 : 0.5 }]}
                  onPress={submitThought}
                  activeOpacity={0.85}
                >
                  <Feather name="send" size={15} color={colors.primaryForeground} />
                  <Text style={[styles.thoughtSendText, { color: colors.primaryForeground }]}>Share with Community</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── Community banner ── */}
          <LinearGradient colors={[colors.primary, "#3D0000"]} style={[styles.communityBanner, { marginTop: 16 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>دھت مہیشوری</Text>
              <Text style={styles.bannerSub}>Connecting Pakistan's Dhatki Maheshwari families worldwide</Text>
            </View>
            <View style={styles.bannerOrbs}>
              <View style={[styles.orb, styles.orb1]} />
              <View style={[styles.orb, styles.orb2]} />
            </View>
            <View style={styles.bannerIcons}>
              <Feather name="globe" size={28} color="rgba(255,255,255,0.15)" />
            </View>
          </LinearGradient>

        </ScrollView>
      )}

      <CallSheet member={callMember} visible={callVisible} onClose={() => setCallVisible(false)} />
    </View>
  );
}

function EventDetail({ icon, text, colors }: { icon: any; text: string; colors: any }) {
  return (
    <View style={styles.eventDetailRow}>
      <Feather name={icon} size={12} color={colors.mutedForeground} style={{ marginTop: 2 }} />
      <Text style={[styles.eventDetailText, { color: colors.mutedForeground }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  headerGradient: { paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 54, paddingBottom: 14, gap: 12 },
  menuBtn: { width: 38, height: 38, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular" },
  avatarBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, fontFamily: "Inter_700Bold" },

  // Stats
  statsRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 14, borderRadius: 16, overflow: "hidden" },
  statCard: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, alignItems: "center", gap: 2 },
  statDivider: { width: 1 },
  statNum: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#C9A844" },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 14 },

  // Search
  searchWrap: { paddingHorizontal: 16, marginBottom: 10 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", color: "#fff" },

  // Filter chips
  filterChips: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)" },
  filterChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  // Search results
  resultsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  resultsTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  clearText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  // Section
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, gap: 10 },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold", flex: 1 },
  livePill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#DCFCE7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" },
  liveText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#16A34A", letterSpacing: 0.5 },

  // Event cards
  eventCard: {
    marginHorizontal: 16, marginBottom: 12, borderRadius: 18, borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  eventTop: { flexDirection: "row", gap: 12, padding: 14, alignItems: "flex-start" },
  dateBadge: { width: 50, paddingVertical: 8, borderRadius: 12, alignItems: "center", gap: 1 },
  dateBadgeDay: { fontSize: 20, fontFamily: "Inter_700Bold", lineHeight: 24 },
  dateBadgeMon: { fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  dateBadgeYr: { fontSize: 9, fontFamily: "Inter_400Regular" },
  eventTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 7 },
  typeIcon: { width: 24, height: 24, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 1, flexShrink: 0 },
  eventTitle: { fontSize: 14, fontFamily: "Inter_700Bold", flex: 1, lineHeight: 20 },
  orgBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  orgBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  eventDetails: { borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  eventDetailRow: { flexDirection: "row", alignItems: "flex-start", gap: 7 },
  eventDetailText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 17 },

  // Decorative divider
  decorDivider: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 10, marginVertical: 4 },
  decorLine: { flex: 1, height: 1 },

  // Thought box
  thoughtCard: {
    marginHorizontal: 16, borderRadius: 18, borderWidth: 1, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  thoughtStrip: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  thoughtStripText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.85)" },
  thoughtBody: { flexDirection: "row", gap: 12, padding: 14, alignItems: "flex-start" },
  thoughtAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginTop: 2 },
  thoughtAvatarText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  thoughtInput: {
    borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14,
    fontFamily: "Inter_400Regular", minHeight: 80, textAlignVertical: "top",
  },
  thoughtSendBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 7, paddingVertical: 12, borderRadius: 12,
  },
  thoughtSendText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  // Community banner
  communityBanner: {
    marginHorizontal: 16, marginBottom: 4, borderRadius: 18, padding: 20,
    overflow: "hidden", position: "relative",
    flexDirection: "row", alignItems: "center", gap: 12,
  },
  bannerContent: { flex: 1, gap: 6 },
  bannerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#C9A844" },
  bannerSub: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular", lineHeight: 18 },
  bannerOrbs: { position: "absolute", top: -20, right: -20 },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)" },
  orb1: { width: 90, height: 90, top: 0, right: 0 },
  orb2: { width: 60, height: 60, top: 20, right: 20 },
  bannerIcons: { position: "absolute", bottom: 12, right: 16 },

  // Empty state
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
