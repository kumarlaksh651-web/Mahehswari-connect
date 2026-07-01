import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { Country, CountryCodePicker, COUNTRIES } from "@/components/CountryCodePicker";

const AKKAS = [
  "Bhansali", "Chandak", "Daga", "Dugar", "Kasliwal",
  "Ladha", "Mansinghka", "Murarka", "Ranka", "Singhvi",
];

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  // Step 1 — Personal info
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [akka, setAkka] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [city, setCity] = useState("");
  const [qualification, setQualification] = useState("");
  // Step 2 — Account
  const [phoneCountry, setPhoneCountry] = useState<Country>(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function handleNext() {
    if (!name.trim()) { Alert.alert("Required", "Please enter your full name."); return; }
    if (!akka) { Alert.alert("Required", "Please select your Akka (surname)."); return; }
    if (!country.trim()) { Alert.alert("Required", "Please enter your country."); return; }
    setStep(2);
  }

  async function handleRegister() {
    if (!phone.trim()) { Alert.alert("Required", "Please enter your phone number."); return; }
    if (!email.trim()) { Alert.alert("Required", "Please enter your email address."); return; }
    if (password.length < 6) { Alert.alert("Weak Password", "Password must be at least 6 characters."); return; }
    if (password !== confirm) { Alert.alert("Mismatch", "Passwords do not match."); return; }
    setLoading(true);
    const result = await register(email.trim().toLowerCase(), password, {
      name: name.trim(),
      fatherName: fatherName.trim(),
      akka,
      country: country.trim(),
      city: city.trim(),
      qualification: qualification.trim(),
      phone: phone.trim(),
      countryCode: phoneCountry.code,
    });
    setLoading(false);
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Registration Failed", result.error ?? "Something went wrong.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 12, paddingBottom: botPad + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={() => step === 2 ? setStep(1) : router.back()}
          >
            <Feather name="arrow-left" size={20} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
            <View style={[styles.stepLine, { backgroundColor: step >= 2 ? colors.primary : colors.border }]} />
            <View style={[styles.stepDot, { backgroundColor: step >= 2 ? colors.primary : colors.border }]} />
          </View>
          <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>{step}/2</Text>
        </View>

        {/* Header */}
        <LinearGradient
          colors={[colors.primary, "#6B1010"]}
          style={styles.headerCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerUrdu}>دھت مہیشوری</Text>
          <Text style={styles.headerTitle}>
            {step === 1 ? "Your Profile" : "Create Account"}
          </Text>
          <Text style={styles.headerSub}>
            {step === 1
              ? "Tell the community about yourself"
              : "Set up your login credentials"}
          </Text>
        </LinearGradient>

        {step === 1 ? (
          <View style={styles.form}>
            <Field
              label="Full Name *"
              value={name}
              onChange={setName}
              placeholder="e.g. Ramesh Kumar Bhansali"
              colors={colors}
            />
            <Field
              label="Father's Name"
              value={fatherName}
              onChange={setFatherName}
              placeholder="e.g. Govind Das Bhansali"
              colors={colors}
            />

            <View>
              <Text style={[styles.label, { color: colors.foreground }]}>Surname / Akka *</Text>
              <Text style={[styles.labelSub, { color: colors.mutedForeground }]}>
                Select your community akka (gotra/surname)
              </Text>
              <View style={styles.akkaGrid}>
                {AKKAS.map((a) => (
                  <TouchableOpacity
                    key={a}
                    style={[
                      styles.akkaChip,
                      {
                        backgroundColor: akka === a ? colors.primary : colors.secondary,
                        borderColor: akka === a ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setAkka(a)}
                  >
                    <Text style={[styles.akkaChipText, { color: akka === a ? colors.primaryForeground : colors.foreground }]}>
                      {a}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Field
              label="Country *"
              value={country}
              onChange={setCountry}
              placeholder="e.g. Pakistan, UAE, UK"
              colors={colors}
            />
            <Field
              label="City"
              value={city}
              onChange={setCity}
              placeholder="e.g. Karachi, Hyderabad, Mithi"
              colors={colors}
            />
            <Field
              label="Qualification / Profession"
              value={qualification}
              onChange={setQualification}
              placeholder="e.g. MBBS, MBA, Gold Trader"
              colors={colors}
            />

            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={[styles.nextBtnText, { color: colors.primaryForeground }]}>Continue</Text>
              <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <View>
              <Text style={[styles.label, { color: colors.foreground }]}>Phone Number *</Text>
              <View style={styles.phoneRow}>
                <CountryCodePicker selected={phoneCountry} onChange={setPhoneCountry} />
                <TextInput
                  style={[styles.input, styles.phoneInput, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
                  placeholder="3XX XXXXXXX"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <View>
              <Text style={[styles.label, { color: colors.foreground }]}>Email Address *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text style={[styles.label, { color: colors.foreground }]}>Password *</Text>
              <View>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border, paddingRight: 50 }]}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
                  <Feather name={showPass ? "eye-off" : "eye"} size={20} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={[styles.label, { color: colors.foreground }]}>Confirm Password *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
              />
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.primary, opacity: loading ? 0.75 : 1 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <>
                  <Text style={[styles.nextBtnText, { color: colors.primaryForeground }]}>Create Account</Text>
                  <Feather name="check" size={18} color={colors.primaryForeground} />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>Already a member? </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChange, placeholder, colors }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; colors: any;
}) {
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

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, flexGrow: 1 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  backCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#F4E8E8", justifyContent: "center", alignItems: "center" },
  stepIndicator: { flexDirection: "row", alignItems: "center", gap: 6 },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { width: 40, height: 3, borderRadius: 2 },
  stepLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  headerCard: { borderRadius: 20, padding: 24, marginBottom: 28, gap: 4 },
  headerUrdu: { fontSize: 18, color: "#C9A844", fontFamily: "Inter_400Regular", marginBottom: 4 },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 14, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  form: { gap: 18, marginBottom: 24 },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  labelSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 8, marginTop: -4 },
  input: { paddingHorizontal: 16, paddingVertical: 15, borderRadius: 14, fontSize: 15, fontFamily: "Inter_400Regular", borderWidth: 1 },
  phoneRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  phoneInput: { flex: 1 },
  eyeBtn: { position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" },
  akkaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  akkaChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1 },
  akkaChipText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 18, borderRadius: 14, gap: 8, marginTop: 8 },
  nextBtnText: { fontSize: 17, fontFamily: "Inter_700Bold" },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  footerText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  footerLink: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
