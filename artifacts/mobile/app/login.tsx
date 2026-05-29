import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError(t("invalidCredentials"));
      return;
    }
    setLoading(true);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.replace("/(tabs)/dashboard");
    } else {
      setError(t("invalidCredentials"));
    }
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langBtn, language === "en" && styles.langBtnActive]}
          onPress={() => setLanguage("en")}
        >
          <Text style={[styles.langBtnText, language === "en" && styles.langBtnTextActive]}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langBtn, language === "ar" && styles.langBtnActive]}
          onPress={() => setLanguage("ar")}
        >
          <Text style={[styles.langBtnText, language === "ar" && styles.langBtnTextActive]}>عر</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="logo-bitcoin" size={44} color={colors.light.gold} />
            </View>
            <Text style={[styles.appName, isRTL && styles.rtl]}>{t("appName")}</Text>
            <Text style={[styles.tagline, isRTL && styles.rtl]}>{t("tagline")}</Text>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, isRTL && styles.rtl]}>{t("welcomeBack")}</Text>
            <Text style={[styles.cardSubtitle, isRTL && styles.rtl]}>{t("loginSubtitle")}</Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, isRTL && styles.rtl]}>{t("email")}</Text>
              <View style={[styles.inputWrapper, isRTL && styles.inputWrapperRTL]}>
                <Ionicons name="mail-outline" size={18} color={colors.light.mutedForeground} />
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.light.mutedForeground}
                  textAlign={isRTL ? "right" : "left"}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, isRTL && styles.rtl]}>{t("password")}</Text>
              <View style={[styles.inputWrapper, isRTL && styles.inputWrapperRTL]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.light.mutedForeground} />
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.light.mutedForeground}
                  textAlign={isRTL ? "right" : "left"}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.light.mutedForeground}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={14} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.demoHint}>
              <Ionicons name="information-circle-outline" size={14} color={colors.light.mutedForeground} />
              <Text style={[styles.demoText, isRTL && styles.rtl]}>{t("demoHint")}</Text>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.loginButtonText}>...</Text>
              ) : (
                <>
                  <Text style={[styles.loginButtonText, isRTL && styles.rtl]}>{t("signIn")}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.primary,
  },
  langRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  langBtnActive: {
    backgroundColor: "#fff",
  },
  langBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.8)",
  },
  langBtnTextActive: {
    color: colors.light.primary,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    gap: 28,
  },
  heroSection: {
    alignItems: "center",
    gap: 10,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  appName: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    marginTop: -8,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.foreground,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.light.surface,
  },
  inputWrapperRTL: {
    flexDirection: "row-reverse",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: colors.light.foreground,
  },
  inputRTL: {
    textAlign: "right",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    color: "#ef4444",
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  demoHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.light.secondary,
    borderRadius: 8,
    padding: 10,
  },
  demoText: {
    fontSize: 12,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.light.primary,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  rtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});
