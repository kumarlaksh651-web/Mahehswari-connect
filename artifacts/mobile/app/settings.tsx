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

  // Profile
  const [name, setName] = useState(user?.name ?? "");
  const [fatherName, setFatherName] = useState(user?.fatherName ?? "");
  const [akka, setAkka] = useState(user?.akka ?? "");
  const [country, setCountry] = useState(user?.country ?? "Pakistan");
  const [city, setCity] = useState(user?.city ?? "");
  const [qualification, setQualification] = useState(user?.qualification ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [phoneCountry, setPhoneCountry] = useState<Country>(findCountry(user?.countryCode ?? "+92"));
  const [photo, setPhoto] = useState<string | undefined>(user?.photo);
  // Social
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? "");
  const [instagram, setInstagram] = useState(user?.instagram ?? "");
  const [facebook, setFacebook] = useState(user?.facebook ?? "");
  // App
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifWelfare, setNotifWelfare] = useState(true);
  const [notifNews, setNotifNews] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);

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
    setSavingProfile(true);
    await updateProfile({ name: name.trim(), fatherName: fatherName.trim(), akka: akka.trim(), country: country.trim(), city: city.trim(), qualification: qualification.trim(), phone: phone.trim(), countryCode: phoneCountry.code, photo });
    setSavingProfile(false);
    Alert.alert("Saved", "Personal details updated successfully.");
  }

  async function handleSaveSocial() {
    setSavingSocial(true);
    await updateProfile({ whatsapp: whatsapp.trim(), instagram: instagram.trim(), facebook: facebook.trim() });
    setSavingSocial(false);
    Alert.alert("Saved", "Social media links updated successfully.");
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
      {/* Maroon header */}
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: botPad + 40 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Profile card at top ── */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity onPress={pickPhoto} style={styles.avatarWrap} activeOpacity={0.85}>
            {photo ? (
              <Image source={{ uri: photo }} style={[styles.avatarImg, { borderColor: colors.primary }]} contentFit="cover" />
            ) : (
              <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
                <Text style={[styles.avatarInitials, { color: colors.primaryForeground }]}>{initials}</Text>
              </View>
            )}
            <View style={[styles.cameraOverlay, { backgroundColor: colors.accent }]}>
              <Feather name="camera" size={11} color={colors.primary} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>{name || "Complete your profile"}</Text>
            <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>{user?.email}</Text>
            {akka ? <Text style={[styles.profileAkka, { color: colors.primary }]}>{akka} Akka{city ? ` · ${city}` : ""}</Text> : null}
          </View>
        </View>

        {/* ── Personal Information ── */}
        <SettingGroupLabel label="Personal Information" icon="user" colors={colors} />
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FormField label="Full Name *" value={name} onChange={setName} placeholder="Your full name" colors={colors} />
          <FDivider colors={colors} />
          <FormField label="Father's Name" value={fatherName} onChange={setFatherName} placeholder="Father's full name" colors={colors} />
          <FDivider colors={colors} />
          <FormField label="Surname / Akka" value={akka} onChange={setAkka} placeholder="e.g. Bhansali, Chandak" colors={colors} />
          <FDivider colors={colors} />
          <FormField label="Country" value={country} onChange={setCountry} placeholder="e.g. Pakistan, UAE" colors={colors} />
          <FDivider colors={colors} />
          <FormField label="City" value={city} onChange={setCity} placeholder="e.g. Karachi, Hyderabad" colors={colors} />
          <FDivider colors={colors} />
          <FormField label="Qualification / Profession" value={qualification} onChange={setQualification} placeholder="e.g. MBBS, Gold Trader" colors={colors} />
          <FDivider colors={colors} />
          <View style={styles.formFieldWrap}>
            <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>Phone Number</Text>
            <View style={styles.phoneRow}>
              <CountryCodePicker selected={phoneCountry} onChange={setPhoneCountry} />
              <TextInput
                style={[styles.inlineInput, styles.phoneInput, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
                placeholder="Phone number"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>
          <FDivider colors={colors} />
          <View style={styles.formFieldWrap}>
            <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>Email (read-only)</Text>
            <Text style={[styles.formValue, { color: colors.foreground }]}>{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: savingProfile ? 0.75 : 1 }]}
          onPress={handleSaveProfile}
          disabled={savingProfile}
          activeOpacity={0.85}
        >
          {savingProfile ? <ActivityIndicator color={colors.primaryForeground} /> : <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>Save Personal Details</Text>}
        </TouchableOpacity>

        {/* ── Social Media ── */}
        <SettingGroupLabel label="Social Media" icon="share-2" colors={colors} />
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SocialField icon="message-circle" label="WhatsApp" value={whatsapp} onChange={setWhatsapp} placeholder="+92 3XX XXXXXXX" iconColor="#25D366" colors={colors} />
          <FDivider colors={colors} />
          <SocialField icon="instagram" label="Instagram" value={instagram} onChange={setInstagram} placeholder="@yourhandle" iconColor="#E1306C" colors={colors} />
          <FDivider colors={colors} />
          <SocialField icon="facebook" label="Facebook" value={facebook} onChange={setFacebook} placeholder="Facebook name or URL" iconColor="#1877F2" colors={colors} />
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: savingSocial ? 0.75 : 1 }]}
          onPress={handleSaveSocial}
          disabled={savingSocial}
          activeOpacity={0.85}
        >
          {savingSocial ? <ActivityIndicator color={colors.primaryForeground} /> : <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>Save Social Media</Text>}
        </TouchableOpacity>

        {/* ── App Settings ── */}
        <SettingGroupLabel label="App Settings" icon="settings" colors={colors} />
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ToggleRow icon="calendar" label="Community Events" value={notifEvents} onChange={setNotifEvents} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <ToggleRow icon="heart" label="Welfare Updates" value={notifWelfare} onChange={setNotifWelfare} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <ToggleRow icon="bell" label="Community News" value={notifNews} onChange={setNotifNews} colors={colors} />
        </View>

        {/* ── About ── */}
        <SettingGroupLabel label="About" icon="info" colors={colors} />
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <InfoRow icon="info" label="App Version" value="1.0.0" colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert("Contact", "Email: support@dhatmaheshwari.com")} activeOpacity={0.7}>
            <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}><Feather name="mail" size={16} color={colors.primary} /></View>
            <Text style={[styles.rowLabel, { color: colors.foreground, flex: 1 }]}>Contact Support</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.destructive }]} onPress={handleLogout} activeOpacity={0.8}>
          <Feather name="log-out" size={18} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SettingGroupLabel({ label, icon, colors }: { label: string; icon: any; colors: any }) {
  return (
    <View style={styles.groupLabelRow}>
      <Feather name={icon} size={14} color={colors.primary} />
      <Text style={[styles.groupLabel, { color: colors.primary }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

function FDivider({ colors }: { colors: any }) {
  return <View style={[styles.formDivider, { backgroundColor: colors.border }]} />;
}

function FormField({ label, value, onChange, placeholder, colors }: any) {
  return (
    <View style={styles.formFieldWrap}>
      <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        style={[styles.inlineInput, { backgroundColor: "transparent", color: colors.foreground, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0, flex: 1 }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

function SocialField({ icon, label, value, onChange, placeholder, iconColor, colors }: any) {
  return (
    <View style={styles.formFieldWrap}>
      <View style={[styles.socialIconBox, { backgroundColor: iconColor }]}>
        <Feather name={icon} size={14} color="#fff" />
      </View>
      <Text style={[styles.formLabel, { color: colors.mutedForeground, flex: 0, marginLeft: 8 }]}>{label}</Text>
      <TextInput
        style={[styles.inlineInput, { backgroundColor: "transparent", color: colors.foreground, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0, flex: 1, textAlign: "right" }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
      />
    </View>
  );
}

function ToggleRow({ icon, label, value, onChange, colors }: any) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}><Feather name={icon} size={16} color={colors.primary} /></View>
      <Text style={[styles.rowLabel, { color: colors.foreground, flex: 1 }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />
    </View>
  );
}

function InfoRow({ icon, label, value, colors }: any) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}><Feather name={icon} size={16} color={colors.primary} /></View>
      <Text style={[styles.rowLabel, { color: colors.foreground, flex: 1 }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  avatarWrap: { position: "relative" },
  avatarImg: { width: 62, height: 62, borderRadius: 31, borderWidth: 2 },
  avatarCircle: { width: 62, height: 62, borderRadius: 31, justifyContent: "center", alignItems: "center" },
  avatarInitials: { fontSize: 24, fontFamily: "Inter_700Bold" },
  cameraOverlay: { position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  profileName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  profileEmail: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  profileAkka: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 3 },
  groupLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 22, marginBottom: 8 },
  groupLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  formCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", paddingHorizontal: 14 },
  formFieldWrap: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 8 },
  formDivider: { height: 1 },
  formLabel: { fontSize: 13, fontFamily: "Inter_500Medium", width: 110 },
  formValue: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  inlineInput: { fontSize: 14, fontFamily: "Inter_400Regular", paddingHorizontal: 0, paddingVertical: 0 },
  phoneRow: { flexDirection: "row", gap: 8, flex: 1, alignItems: "center" },
  phoneInput: { flex: 1, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  socialIconBox: { width: 26, height: 26, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  saveBtn: { paddingVertical: 16, borderRadius: 14, alignItems: "center", marginTop: 10 },
  saveBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  group: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  divider: { height: 1, marginLeft: 56 },
  settingRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  rowLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  rowValue: { fontSize: 14, fontFamily: "Inter_400Regular" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 14, borderWidth: 1.5, marginTop: 24 },
  logoutText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
