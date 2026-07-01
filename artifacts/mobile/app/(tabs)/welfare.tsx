import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Header } from "@/components/Header";
import { useColors } from "@/hooks/useColors";

export interface WelfareProgram {
  id: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  org: string;
  orgShort: string;
  desc: string;
  raised: string;
  goal: string;
  progress: number;
  tag: string;
}

export const WELFARE_PROGRAMS: WelfareProgram[] = [
  {
    id: "medical",
    icon: "heart",
    title: "Free Medical Camps",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    desc: "Free medical camps, medicines, and specialist consultations organized by PGMF for underprivileged Maheshwari families in Tharparkar and Umerkot. Specialist doctors from Karachi volunteer their services.",
    raised: "PKR 2.4M",
    goal: "PKR 5M",
    progress: 0.48,
    tag: "Ongoing",
  },
  {
    id: "scholarship",
    icon: "book",
    title: "Student Scholarship Fund",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    desc: "Annual PGMF scholarships for Maheshwari students pursuing medicine, engineering, and commerce. Priority for students from rural Sindh (Tharparkar, Umerkot).",
    raised: "PKR 1.8M",
    goal: "PKR 3M",
    progress: 0.60,
    tag: "Ongoing",
  },
  {
    id: "relief",
    icon: "shield",
    title: "Emergency Relief Fund",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    desc: "PGMF-managed immediate financial support for Maheshwari families affected by natural disasters or medical emergencies. Applications are reviewed and disbursed within 72 hours.",
    raised: "PKR 900K",
    goal: "PKR 2M",
    progress: 0.45,
    tag: "Always Open",
  },
  {
    id: "legal",
    icon: "briefcase",
    title: "Legal Aid & Rights Advocacy",
    org: "Maheshwari Action Forum",
    orgShort: "MAF",
    desc: "MAF provides free legal assistance and advocacy for Maheshwari community members facing property disputes, civil rights issues, or discrimination in Pakistan.",
    raised: "PKR 650K",
    goal: "PKR 1.5M",
    progress: 0.43,
    tag: "Ongoing",
  },
  {
    id: "heritage",
    icon: "star",
    title: "Vedic Heritage Preservation",
    org: "Maheshwari Action Forum",
    orgShort: "MAF",
    desc: "MAF funds documentation of the Dhatki language, Vedic traditions, and Mahesh Navami celebrations. Also supports restoration of historic Maheshwari temples and cultural spaces in Sindh.",
    raised: "PKR 420K",
    goal: "PKR 1M",
    progress: 0.42,
    tag: "Ongoing",
  },
];

const DONATION_ACCOUNTS = [
  {
    id: "pgmf",
    name: "Pak Global Maheshwaris Forum",
    short: "PGMF",
    fb: "https://www.facebook.com/groups/PakGlobalMaheshwaris",
    desc: "General donations for PGMF programs — medical camps, scholarships, and community events.",
  },
  {
    id: "maf",
    name: "Maheshwari Action Forum",
    short: "MAF",
    fb: "https://www.facebook.com/MaheshwariActionForum",
    desc: "Support MAF advocacy, legal aid, and cultural preservation initiatives.",
  },
];

export default function WelfareScreen() {
  const colors = useColors();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Header subtitle="Community Welfare & Support" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
      >
        {/* Info bar */}
        <View style={[styles.infoBar, { backgroundColor: colors.primary }]}>
          <Feather name="info" size={15} color="rgba(255,255,255,0.85)" />
          <Text style={styles.infoText}>
            All welfare programs are run by PGMF and MAF. Your donations go directly to community programs.
          </Text>
        </View>

        {/* Welfare Programs */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Welfare Programs</Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>Tap Donate to contribute to any program</Text>
        </View>

        {WELFARE_PROGRAMS.map((program) => (
          <View key={program.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, { backgroundColor: colors.muted }]}>
                <Feather name={program.icon} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{program.title}</Text>
                <View style={[styles.orgTag, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.orgTagText, { color: colors.primary }]}>{program.orgShort}</Text>
                </View>
              </View>
              <View style={[styles.tagBadge, { backgroundColor: "#DCFCE7" }]}>
                <Text style={[styles.tagText, { color: "#16A34A" }]}>{program.tag}</Text>
              </View>
            </View>

            <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{program.desc}</Text>

            <View style={styles.progressSection}>
              <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${Math.round(program.progress * 100)}%` }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={[styles.raisedText, { color: colors.primary }]}>Raised: {program.raised}</Text>
                <Text style={[styles.goalText, { color: colors.mutedForeground }]}>Goal: {program.goal}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.donateBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push(`/donate/${program.id}`)}
              activeOpacity={0.85}
            >
              <Feather name="heart" size={16} color={colors.primary} />
              <Text style={[styles.donateBtnText, { color: colors.primary }]}>Donate to this Program</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Donations Section */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>General Donations</Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
            Donate directly to PGMF or MAF for unrestricted community use
          </Text>
        </View>

        {DONATION_ACCOUNTS.map((acc) => (
          <View key={acc.id} style={[styles.donationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.donationBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.donationShort, { color: colors.primaryForeground }]}>{acc.short}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.donationName, { color: colors.foreground }]}>{acc.name}</Text>
              <Text style={[styles.donationDesc, { color: colors.mutedForeground }]}>{acc.desc}</Text>
            </View>
            <View style={styles.donationActions}>
              <TouchableOpacity
                style={[styles.donateSmallBtn, { backgroundColor: colors.accent }]}
                onPress={() => router.push(`/donate/${acc.id}-general`)}
                activeOpacity={0.85}
              >
                <Feather name="heart" size={14} color={colors.primary} />
                <Text style={[styles.donateSmallText, { color: colors.primary }]}>Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fbSmallBtn, { backgroundColor: "#1877F2" }]}
                onPress={() => Linking.openURL(acc.fb)}
                activeOpacity={0.85}
              >
                <Feather name="facebook" size={14} color="#fff" />
                <Text style={styles.fbSmallText}>Page</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  infoBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 12 },
  infoText: { flex: 1, color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, gap: 3 },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: { marginHorizontal: 16, marginBottom: 14, padding: 16, borderRadius: 18, borderWidth: 1, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  iconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  orgTag: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  orgTagText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.4 },
  tagBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start" },
  tagText: { fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  cardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  progressSection: { gap: 6 },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  raisedText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  goalText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  donateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, marginTop: 4 },
  donateBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  donationCard: { marginHorizontal: 16, marginBottom: 12, padding: 14, borderRadius: 16, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  donationBadge: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  donationShort: { fontSize: 11, fontFamily: "Inter_700Bold" },
  donationName: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 2 },
  donationDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  donationActions: { gap: 6 },
  donateSmallBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10 },
  donateSmallText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  fbSmallBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10 },
  fbSmallText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
