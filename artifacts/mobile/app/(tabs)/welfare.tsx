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
  tag: string;
}

export const WELFARE_PROGRAMS: WelfareProgram[] = [
  {
    id: "medical",
    icon: "heart",
    title: "Free Medical Camps",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    desc: "PGMF organizes free medical camps, medicines, and specialist consultations in Tharparkar and Umerkot. Doctors from Karachi volunteer to serve underprivileged Maheshwari families in rural Sindh.",
    tag: "Active",
  },
  {
    id: "scholarship",
    icon: "book",
    title: "Student Scholarship Fund",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    desc: "Annual PGMF scholarships for Maheshwari students pursuing medicine, engineering, and commerce from Sindh. Priority given to students from Tharparkar and Umerkot districts.",
    tag: "Active",
  },
  {
    id: "relief",
    icon: "shield",
    title: "Emergency Relief Fund",
    org: "Pak Global Maheshwaris Forum",
    orgShort: "PGMF",
    desc: "PGMF provides immediate financial support for Maheshwari families affected by natural disasters or medical emergencies. Applications reviewed and disbursed within 72 hours.",
    tag: "Always Open",
  },
  {
    id: "legal",
    icon: "briefcase",
    title: "Legal Aid & Rights Advocacy",
    org: "Maheshwari Action Forum",
    orgShort: "MAF",
    desc: "MAF provides free legal assistance for Maheshwari community members facing property disputes, civil rights issues, or discrimination in Pakistan.",
    tag: "Active",
  },
  {
    id: "heritage",
    icon: "star",
    title: "Vedic Heritage & Culture",
    org: "Maheshwari Action Forum",
    orgShort: "MAF",
    desc: "MAF funds documentation of the Dhatki language, Vedic traditions, and Mahesh Navami celebrations. Supports restoration of historic Maheshwari cultural spaces in Sindh.",
    tag: "Active",
  },
];

const DONATION_PORTALS = [
  {
    id: "pgmf",
    short: "PGMF",
    name: "Pak Global Maheshwaris Forum",
    desc: "General fund for medical camps, scholarships, and community programs.",
    fb: "https://www.facebook.com/groups/PakGlobalMaheshwaris",
    color: "#1877F2",
  },
  {
    id: "maf",
    short: "MAF",
    name: "Maheshwari Action Forum",
    desc: "Support MAF's legal aid, cultural preservation, and advocacy initiatives.",
    fb: "https://www.facebook.com/MaheshwariActionForum",
    color: "#1877F2",
  },
];

export default function WelfareScreen() {
  const colors = useColors();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Header subtitle="Community Welfare & Support" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}>

        {/* Info bar */}
        <View style={[styles.infoBar, { backgroundColor: colors.primary }]}>
          <Feather name="info" size={15} color="rgba(255,255,255,0.85)" />
          <Text style={styles.infoText}>
            All programs are run by PGMF and MAF. Tap any program to donate directly.
          </Text>
        </View>

        {/* Programs */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Welfare Programs</Text>
        </View>

        {WELFARE_PROGRAMS.map((p) => (
          <View key={p.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, { backgroundColor: colors.muted }]}>
                <Feather name={p.icon} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{p.title}</Text>
                <View style={[styles.orgTag, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.orgTagText, { color: colors.primary }]}>{p.orgShort}</Text>
                </View>
              </View>
              <View style={[styles.tagBadge, { backgroundColor: "#DCFCE7" }]}>
                <Text style={[styles.tagText, { color: "#16A34A" }]}>{p.tag}</Text>
              </View>
            </View>
            <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{p.desc}</Text>
            <TouchableOpacity
              style={[styles.donateBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push(`/donate/${p.id}`)}
              activeOpacity={0.85}
            >
              <Feather name="heart" size={15} color={colors.primary} />
              <Text style={[styles.donateBtnText, { color: colors.primary }]}>Donate to this Program</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Separator */}
        <View style={[styles.separator, { backgroundColor: colors.border }]} />

        {/* General Donations — separate section at the bottom */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Make a Donation</Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
            Donate directly to PGMF or MAF for unrestricted use across all their welfare programs.
          </Text>
        </View>

        {DONATION_PORTALS.map((d) => (
          <View key={d.id} style={[styles.donationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.donationTop}>
              <View style={[styles.donationBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.donationShort, { color: colors.primaryForeground }]}>{d.short}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.donationName, { color: colors.foreground }]}>{d.name}</Text>
                <Text style={[styles.donationDesc, { color: colors.mutedForeground }]}>{d.desc}</Text>
              </View>
            </View>
            <View style={styles.donationBtns}>
              <TouchableOpacity
                style={[styles.donateFullBtn, { backgroundColor: colors.accent }]}
                onPress={() => router.push(`/donate/${d.id}`)}
                activeOpacity={0.85}
              >
                <Feather name="heart" size={16} color={colors.primary} />
                <Text style={[styles.donateFullBtnText, { color: colors.primary }]}>Donate to {d.short}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fbBtn, { backgroundColor: d.color }]}
                onPress={() => Linking.openURL(d.fb)}
                activeOpacity={0.85}
              >
                <Feather name="facebook" size={15} color="#fff" />
                <Text style={styles.fbBtnText}>Visit Page</Text>
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
  sectionHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold", marginBottom: 3 },
  sectionSub: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  card: { marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 18, borderWidth: 1, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  iconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  orgTag: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  orgTagText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.4 },
  tagBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start" },
  tagText: { fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  cardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  donateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 12, marginTop: 2 },
  donateBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  separator: { height: 1, marginHorizontal: 16, marginTop: 12 },
  donationCard: { marginHorizontal: 16, marginBottom: 14, padding: 16, borderRadius: 18, borderWidth: 1, gap: 14 },
  donationTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  donationBadge: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  donationShort: { fontSize: 12, fontFamily: "Inter_700Bold" },
  donationName: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 4 },
  donationDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  donationBtns: { flexDirection: "row", gap: 10 },
  donateFullBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 13, borderRadius: 12 },
  donateFullBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  fbBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 13, borderRadius: 12 },
  fbBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
