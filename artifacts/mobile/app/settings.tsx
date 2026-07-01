import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { Country, CountryCodePicker, COUNTRIES } from "@/components/CountryCodePicker";

type Tab = "profile" | "social" | "app";

function findCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export default function SettingsScreen() {
  const { user, updateProfile, logout } = useAuth();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile fields — pre-filled from signup data
  const [name, setName] = useState(user?.name ?? "");
  const [fatherName, setFatherName] = useState(user?.fatherName ?? "");
  const [akka, setAkka] = useState(user?.akka ?? "");
  const [country, setCountry] = useState(user?.country ?? "Pakistan");
  const [city, setCity] = useState(user?.city ?? "");
  const [qualification, setQualification] = useState(user?.qualification ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [phoneCountry, setPhoneCountry] = useState<Country>(findCountry(user?.countryCode ?? "+92"));
  const [photo, setPhoto] = useState<string | undefined>(user?.photo);
  const [saving, setSaving] = useState(false);

  // Social media fields
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? "");
  const [instagram, setInstagram] = useState(user?.instagram ?? "");
  const [facebook, setFacebook] = useState(user?.facebook ?? "");

  // App settings
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifWelfare, setNotifWelfare] = useState(true);
  const [notifNews, setNotifNews] = useState(true);

  // Keep fields synced with user context
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setFatherName(user.fatherName ?? "");
      setAkka(user.akka ?? "");
      setCountry(user.country ?? "Pakistan");
      setCity(user.city ?? "");
      setQualification(user.qualification ?? "");
      setPhone(user.phone ?? "");
      setPhoneCountry(findCountry(user.countryCode ?? "+92"));
      setPhoto(user.photo);
      setWhatsapp(user.whatsapp ?? "");
      setInstagram(user.instagram ?? "");
      setFacebook(user.facebook ?? "");
    }
  }, [user?.id]);

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permission needed", "Please allow access to your photos."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: "images", allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  }

  async function handleSaveProfile() {
    if (!name.trim()) { Alert.alert("Required", "Please enter your full name."); return; }
    setSaving(true);
    await updateProfile({ name: name.trim(), fatherName: fatherName.trim(), akka: akka.trim(), country: country.trim(), city: city.trim(), qualification: qualification.trim(), phone: phone.trim(), countryCode: phoneCountry.code, photo });
    setSaving(false);
    Alert.alert("Saved", "Your personal details have been updated.");
  }

  async function handleSaveSocial() {
    setSaving(true);
    await updateProfile({ whatsapp: whatsapp.trim(), instagram: instagram.trim(), facebook: facebook.trim() });
    setSaving(false);
    Alert.alert("Saved", "Your social media links have been updated.");
  }

  async function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: async () => { await logout(); router.replace("/(auth)/welcome"); } },
    ]);
  }

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPad + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Account card */}
      <View style={[styles.accountCard, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={pickPhoto} style={styles.avatarWrap}>
          {photo ? (
            <Image source={{ uri: photo }} style={[styles.avatarImg, { borderColor: colors.accent }]} contentFit="cover" />
          ) : (
            <View style={[styles.avatarCircle, { backgroundColor: colors.accent }]}>
              <Text style={[styles.avatarInitials, { color: colors.primary }]}>{initials}</Text>
            </View>
          )}
          <View style={[styles.cameraIcon, { backgroundColor: "rgba(255,255,255,0.9)" }]}>
            <Feather name="camera" size={12} color={colors.primary} />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.accountName}>{name || "Complete your profile"}</Text>
          <Text style={styles.accountEmail}>{user?.email}</Text>
          {akka ? <Text style={[styles.accountAkka, { color: colors.accent }]}>{akka} Akka • {city || country}</Text> : null}
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { backgroundColor: colors.secondary, borderBottomColor: colors.border }]}>
        {(["profile", "social", "app"] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={[styles.tabBtn, activeTab === t && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => setActiveTab(t)}>
            <Text style={[styles.tabLabel, { color: activeTab === t ? colors.primary : colors.mutedForeground }]}>
              {t === "profile" ? "Personal" : t === "social" ? "Social Media" : "App Settings"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: botPad + 40 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {activeTab === "profile" && (
          <View style={styles.section}>
            <FormField label="Full Name *" value={name} onChange={setName} placeholder="Your full name" colors={colors} />
            <FormField label="Father's Name" value={fatherName} onChange={setFatherName} placeholder="Father's full name" colors={colors} />
            <FormField label="Surname / Akka" value={akka} onChange={setAkka} placeholder="e.g. Bhansali, Chandak" colors={colors} />
            <FormField label="Country" value={country} onChange={setCountry} placeholder="e.g. Pakistan, UAE" colors={colors} />
            <FormField label="City" value={city} onChange={setCity} placeholder="e.g. Karachi, Hyderabad" colors={colors} />
            <FormField label="Qualification / Profession" value={qualification} onChange={setQualification} placeholder="e.g. MBBS, Gold Trader" colors={colors} />
            <View>
              <Text style={[styles.label, { color: colors.foreground }]}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <CountryCodePicker selected={phoneCountry} onChange={setPhoneCountry} />
                <TextInput
                  style={[styles.input, styles.phoneInput, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
                  placeholder="Phone number"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
            {/* Email read-only */}
            <View>
              <Text style={[styles.label, { color: colors.foreground }]}>Email Address</Text>
              <View style={[styles.input, styles.readOnly, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.readOnlyText, { color: colors.mutedForeground }]}>{user?.email}</Text>
                <Feather name="lock" size={14} color={colors.mutedForeground} />
              </View>
            </View>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.75 : 1 }]} onPress={handleSaveProfile} disabled={saving} activeOpacity={0.85}>
              {saving ? <ActivityIndicator color={colors.primaryForeground} /> : <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>Save Personal Details</Text>}
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "social" && (
          <View style={styles.section}>
            <Text style={[styles.socialHint, { color: colors.mutedForeground }]}>
              Add your social media handles so community members can connect with you. These will be shown on your profile.
            </Text>
            <SocialField
              icon="message-circle"
              label="WhatsApp Number"
              value={whatsapp}
              onChange={setWhatsapp}
              placeholder="+92 3XX XXXXXXX"
              color="#25D366"
              colors={colors}
            />
            <SocialField
              icon="instagram"
              label="Instagram"
              value={instagram}
              onChange={setInstagram}
              placeholder="@yourhandle"
              color="#E1306C"
              colors={colors}
            />
            <SocialField
              icon="facebook"
              label="Facebook"
              value={facebook}
              onChange={setFacebook}
              placeholder="Facebook profile name or URL"
              color="#1877F2"
              colors={colors}
            />
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.75 : 1 }]} onPress={handleSaveSocial} disabled={saving} activeOpacity={0.85}>
              {saving ? <ActivityIndicator color={colors.primaryForeground} /> : <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>Save Social Media</Text>}
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "app" && (
          <View style={styles.section}>
            <Text style={[styles.sectionGroupLabel, { color: colors.mutedForeground }]}>NOTIFICATIONS</Text>
            <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ToggleRow icon="calendar" label="Community Events" value={notifEvents} onChange={setNotifEvents} colors={colors} />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <ToggleRow icon="heart" label="Welfare Updates" value={notifWelfare} onChange={setNotifWelfare} colors={colors} />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <ToggleRow icon="bell" label="Community News" value={notifNews} onChange={setNotifNews} colors={colors} />
            </View>

            <Text style={[styles.sectionGroupLabel, { color: colors.mutedForeground, marginTop: 24 }]}>ABOUT</Text>
            <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <InfoRow icon="info" label="Version" value="1.0.0" colors={colors} />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <TouchableOpacity style={styles.row} onPress={() => Alert.alert("Contact", "Email: support@dhatmaheshwari.com")} activeOpacity={0.7}>
                <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}><Feather name="mail" size={16} color={colors.primary} /></View>
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>Contact Support</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.destructive }]} onPress={handleLogout} activeOpacity={0.8}>
              <Feather name="log-out" size={18} color={colors.destructive} />
              <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, value, onChange, placeholder, colors }: any) {
  return (
    <View>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

function SocialField({ icon, label, value, onChange, placeholder, color, colors }: any) {
  return (
    <View>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.socialInputRow}>
        <View style={[styles.socialIconBox, { backgroundColor: color }]}>
          <Feather name={icon} size={16} color="#fff" />
        </View>
        <TextInput
          style={[styles.input, styles.socialInput, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

function ToggleRow({ icon, label, value, onChange, colors }: any) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}><Feather name={icon} size={16} color={colors.primary} /></View>
      <Text style={[styles.rowLabel, { color: colors.foreground, flex: 1 }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />
    </View>
  );
}

function InfoRow({ icon, label, value, colors }: any) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}><Feather name={icon} size={16} color={colors.primary} /></View>
      <Text style={[styles.rowLabel, { color: colors.foreground, flex: 1 }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center", marginLeft: -6 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  accountCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  avatarWrap: { position: "relative" },
  avatarImg: { width: 60, height: 60, borderRadius: 30, borderWidth: 2 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  avatarInitials: { fontSize: 22, fontFamily: "Inter_700Bold" },
  cameraIcon: { position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  accountName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  accountEmail: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
  accountAkka: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 13, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  scroll: { paddingHorizontal: 16, paddingTop: 20 },
  section: { gap: 16 },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 7 },
  input: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, fontSize: 15, fontFamily: "Inter_400Regular", borderWidth: 1 },
  phoneRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  phoneInput: { flex: 1 },
  readOnly: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  readOnlyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  saveBtn: { paddingVertical: 18, borderRadius: 14, alignItems: "center", marginTop: 4 },
  saveBtnText: { fontSize: 17, fontFamily: "Inter_700Bold" },
  socialHint: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginBottom: 4 },
  socialInputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  socialIconBox: { width: 46, height: 46, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  socialInput: { flex: 1 },
  sectionGroupLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  group: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  divider: { height: 1, marginLeft: 60 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  rowLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  rowValue: { fontSize: 14, fontFamily: "Inter_400Regular" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 14, borderWidth: 1.5, marginTop: 24 },
  logoutText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
