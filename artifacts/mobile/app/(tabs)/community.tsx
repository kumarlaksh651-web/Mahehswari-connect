import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Header } from "@/components/Header";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

const ORGS = [
  {
    id: "pgmf",
    name: "Pak Global Maheshwaris Forum",
    short: "PGMF",
    desc: "The premier digital community platform connecting Maheshwari families across Pakistan and the global diaspora. Runs free medical camps in Tharparkar and Umerkot, funds student scholarships, and drives interfaith civic initiatives.",
    services: [
      "Free medical camps in Tharparkar & Umerkot",
      "Annual student scholarship awards",
      "Community emergency relief coordination",
      "Diaspora networking & reunion events",
    ],
    fb: "https://www.facebook.com/groups/PakGlobalMaheshwaris",
    fbLabel: "Join Facebook Group",
    color: "#1877F2",
  },
  {
    id: "maf",
    name: "Maheshwari Action Forum",
    short: "MAF",
    desc: "An advocacy and action platform championing the rights, cultural preservation, and civic participation of the Dhat Maheshwari community in Pakistan and abroad. Focuses on legal assistance, interfaith dialogue, and community representation.",
    services: [
      "Legal aid and rights advocacy",
      "Interfaith dialogue programs",
      "Cultural heritage documentation",
      "Community representation in civic matters",
    ],
    fb: "https://www.facebook.com/MaheshwariActionForum",
    fbLabel: "Follow on Facebook",
    color: "#1877F2",
  },
];

const ACHIEVEMENTS = [
  {
    id: "a1",
    title: "Tharparkar Free Medical Camp 2024",
    body: "Pak Global Maheshwaris Forum organized a 3-day free medical camp in Mithi, Tharparkar, serving over 1,200 patients from Maheshwari and neighboring communities. Specialist doctors from Karachi volunteered their services.",
    date: "Dec 2024",
    icon: "heart",
  },
  {
    id: "a2",
    title: "Scholarship Awards Ceremony 2024",
    body: "12 deserving Maheshwari students from Sindh received annual scholarships for medicine and engineering studies. The ceremony was held in Karachi with participation from community elders and PGMF members worldwide.",
    date: "Aug 2024",
    icon: "book",
  },
  {
    id: "a3",
    title: "Mahesh Navami Celebrations",
    body: "The community celebrated Mahesh Navami, the most sacred Maheshwari festival, with traditional rituals, Vedic prayers, and community gatherings in Karachi, Hyderabad, and Mithi. Online participation from diaspora worldwide.",
    date: "Jun 2024",
    icon: "star",
  },
  {
    id: "a4",
    title: "MAF Interfaith Harmony Initiative",
    body: "Maheshwari Action Forum partnered with civil society organizations for a series of interfaith harmony events across Sindh, highlighting the peaceful coexistence of the Maheshwari Hindu community in Pakistan.",
    date: "Apr 2024",
    icon: "globe",
  },
];

const SOCIALS = [
  {
    name: "Instagram",
    handle: "@dhatmaheshwaripakistan",
    icon: "instagram" as const,
    color: "#E1306C",
    url: "https://www.instagram.com/dhatmaheshwaripakistan",
  },
  {
    name: "Facebook",
    handle: "Dhat Maheshwari Pakistan",
    icon: "facebook" as const,
    color: "#1877F2",
    url: "https://www.facebook.com/dhatmaheshwaripakistan",
  },
];

interface Thought {
  id: string;
  author: string;
  text: string;
  time: string;
}

const SAMPLE_THOUGHTS: Thought[] = [
  {
    id: "t1",
    author: "Ramesh Bhansali",
    text: "Proud to be part of this beautiful Dhatki Maheshwari community. Our culture and traditions are a treasure that we must preserve for generations to come. Jai Mahesh!",
    time: "2 days ago",
  },
  {
    id: "t2",
    author: "Vijay Chandak",
    text: "The PGMF medical camp in Tharparkar was truly inspiring. Our community coming together to serve others reflects the best of Maheshwari values.",
    time: "1 week ago",
  },
];

export default function CommunityScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const [thoughts, setThoughts] = useState<Thought[]>(SAMPLE_THOUGHTS);
  const [thoughtInput, setThoughtInput] = useState("");

  function submitThought() {
    const text = thoughtInput.trim();
    if (!text) return;
    if (!user?.name) {
      Alert.alert("Profile Required", "Please complete your profile before sharing a thought.");
      return;
    }
    setThoughts([
      {
        id: Date.now().toString(),
        author: user.name,
        text,
        time: "Just now",
      },
      ...thoughts,
    ]);
    setThoughtInput("");
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Header subtitle="Community • Culture • Legacy" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
      >
        {/* Banner */}
        <View style={styles.bannerWrap}>
          <Image
            source={require("@/assets/images/community_hero.png")}
            style={styles.bannerImg}
            contentFit="cover"
          />
          <LinearGradient colors={["transparent", "rgba(100,10,10,0.92)"]} style={StyleSheet.absoluteFill} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Dhat Maheshwari</Text>
            <Text style={styles.bannerSub}>Tharparkar · Umerkot · Karachi · Hyderabad · Worldwide</Text>
          </View>
        </View>

        {/* About */}
        <SectionTitle title="About Our Community" colors={colors} />
        <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>
            The Dhatki Maheshwari community of Pakistan is an elite, highly traditional Hindu merchant class
            primarily native to the Tharparkar and Umerkot districts of Sindh, with strong urban centers in
            Karachi and Hyderabad. Distinct from any regional tribal or artisan sub-groups, they represent the
            ancestral, aristocratic Vaishya (Baniya) lineage, defining their identity through strict cultural
            purity, traditional business ventures, and their mother tongue, Dhatki — a unique Rajasthani-Marwari
            dialect of the Thar desert.{"\n\n"}
            The community is highly urbanized, holding prominent roles in wholesale textile trading, gold markets,
            commodity imports, and modern healthcare and corporate sectors across Sindh. Highly educated and
            cohesive, they leverage powerful networks like the Pak Global Maheshwaris Forum to run philanthropic
            medical societies, fund student scholarships, and drive impactful interfaith civic initiatives.
            They maintain an influential socio-economic footprint while firmly safeguarding their distinct
            Dhatki-Maheshwari ancestral legacy.
          </Text>
        </View>

        {/* Community Organizations */}
        <SectionTitle title="Community Organizations" colors={colors} />
        {ORGS.map((org) => (
          <View key={org.id} style={[styles.orgCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.orgHeader}>
              <View style={[styles.orgBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.orgShort, { color: colors.primaryForeground }]}>{org.short}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.orgName, { color: colors.foreground }]}>{org.name}</Text>
              </View>
            </View>
            <Text style={[styles.orgDesc, { color: colors.mutedForeground }]}>{org.desc}</Text>
            <View style={[styles.servicesList, { borderColor: colors.border }]}>
              {org.services.map((s, i) => (
                <View key={i} style={styles.serviceItem}>
                  <View style={[styles.serviceDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.serviceText, { color: colors.foreground }]}>{s}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.fbBtn, { backgroundColor: org.color }]}
              onPress={() => Linking.openURL(org.fb)}
              activeOpacity={0.85}
            >
              <Feather name="facebook" size={15} color="#fff" />
              <Text style={styles.fbBtnText}>{org.fbLabel}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Community Achievements */}
        <SectionTitle title="Community Achievements" colors={colors} />
        {ACHIEVEMENTS.map((item) => (
          <View key={item.id} style={[styles.achieveCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.achieveTop}>
              <View style={[styles.achieveIcon, { backgroundColor: colors.muted }]}>
                <Feather name={item.icon as any} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.achieveTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.achieveDate, { color: colors.accent }]}>{item.date}</Text>
              </View>
            </View>
            <Text style={[styles.achieveBody, { color: colors.mutedForeground }]}>{item.body}</Text>
          </View>
        ))}

        {/* Share Thoughts */}
        <SectionTitle title="Share Your Thoughts" colors={colors} />
        <View style={[styles.thoughtInputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.thoughtInput, { color: colors.foreground, borderColor: colors.border }]}
            placeholder="Share something with the community..."
            placeholderTextColor={colors.mutedForeground}
            value={thoughtInput}
            onChangeText={setThoughtInput}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[styles.thoughtSubmit, { backgroundColor: colors.primary }]}
            onPress={submitThought}
            activeOpacity={0.85}
          >
            <Feather name="send" size={16} color={colors.primaryForeground} />
            <Text style={[styles.thoughtSubmitText, { color: colors.primaryForeground }]}>Share</Text>
          </TouchableOpacity>
        </View>
        {thoughts.map((t) => (
          <View key={t.id} style={[styles.thoughtCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.thoughtMeta}>
              <View style={[styles.thoughtAvatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.thoughtAvatarText, { color: colors.primaryForeground }]}>
                  {t.author[0]}
                </Text>
              </View>
              <View>
                <Text style={[styles.thoughtAuthor, { color: colors.foreground }]}>{t.author}</Text>
                <Text style={[styles.thoughtTime, { color: colors.mutedForeground }]}>{t.time}</Text>
              </View>
            </View>
            <Text style={[styles.thoughtText, { color: colors.foreground }]}>{t.text}</Text>
          </View>
        ))}

        {/* Connect With Us */}
        <SectionTitle title="Connect With Us" colors={colors} />
        <View style={styles.socialsGrid}>
          {SOCIALS.map((s) => (
            <TouchableOpacity
              key={s.name}
              style={[styles.socialCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => Linking.openURL(s.url)}
              activeOpacity={0.85}
            >
              <View style={[styles.socialIconWrap, { backgroundColor: s.color }]}>
                <Feather name={s.icon} size={24} color="#fff" />
              </View>
              <Text style={[styles.socialName, { color: colors.foreground }]}>{s.name}</Text>
              <Text style={[styles.socialHandle, { color: colors.accent }]}>{s.handle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title, colors }: { title: string; colors: any }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bannerWrap: { height: 190, position: "relative" },
  bannerImg: { width: "100%", height: "100%" },
  bannerContent: { position: "absolute", bottom: 16, left: 16, right: 16 },
  bannerTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#fff" },
  bannerSub: { fontSize: 12, color: "rgba(255,255,255,0.82)", fontFamily: "Inter_400Regular", marginTop: 2 },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 10 },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold" },
  aboutCard: { marginHorizontal: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  aboutText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 23 },
  orgCard: { marginHorizontal: 16, marginBottom: 14, padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
  orgHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  orgBadge: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  orgShort: { fontSize: 12, fontFamily: "Inter_700Bold" },
  orgName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  orgDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  servicesList: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 },
  serviceItem: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  serviceDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  serviceText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  fbBtn: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, alignSelf: "flex-start" },
  fbBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  achieveCard: { marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 16, borderWidth: 1, gap: 10 },
  achieveTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  achieveIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  achieveTitle: { fontSize: 15, fontFamily: "Inter_700Bold", flex: 1 },
  achieveDate: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  achieveBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  thoughtInputCard: { marginHorizontal: 16, marginBottom: 12, padding: 14, borderRadius: 16, borderWidth: 1, gap: 10 },
  thoughtInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 72, textAlignVertical: "top" },
  thoughtSubmit: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: "flex-end" },
  thoughtSubmitText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  thoughtCard: { marginHorizontal: 16, marginBottom: 10, padding: 14, borderRadius: 16, borderWidth: 1, gap: 10 },
  thoughtMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  thoughtAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  thoughtAvatarText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  thoughtAuthor: { fontSize: 14, fontFamily: "Inter_700Bold" },
  thoughtTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
  thoughtText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  socialsGrid: { flexDirection: "row", paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  socialCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: "center", gap: 8 },
  socialIconWrap: { width: 52, height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center" },
  socialName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  socialHandle: { fontSize: 11, fontFamily: "Inter_500Medium", textAlign: "center" },
});
