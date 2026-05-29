import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useCoins } from "@/context/CoinsContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { coins, transactions } = useCoins();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogout = () => {
    if (Platform.OS === "web") {
      logout().then(() => router.replace("/login"));
      return;
    }
    Alert.alert(t("logout"), "", [
      { text: "Cancel", style: "cancel" },
      {
        text: t("logout"),
        style: "destructive",
        onPress: async () => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const initials = (user?.name ?? "U").slice(0, 2).toUpperCase();

  const rows = [
    { icon: "language-outline" as const, label: "language", isLanguageRow: true },
    { icon: "logo-bitcoin" as const, label: "coinValue", value: t("coinValueDesc"), isLanguageRow: false },
    { icon: "information-circle-outline" as const, label: "version", value: "1.0.0", isLanguageRow: false },
  ];

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && styles.rtl]}>{t("profile")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, isRTL && styles.rtl]}>{user?.name ?? "User"}</Text>
            <Text style={[styles.userEmail, isRTL && styles.rtl]}>{user?.email ?? ""}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="logo-bitcoin" size={20} color={colors.light.gold} />
            <Text style={styles.statNum}>{coins.toLocaleString()}</Text>
            <Text style={[styles.statLabel, isRTL && styles.rtl]}>{t("totalCoins")}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Ionicons name="receipt-outline" size={20} color={colors.light.primary} />
            <Text style={styles.statNum}>{transactions.length}</Text>
            <Text style={[styles.statLabel, isRTL && styles.rtl]}>{t("transactions")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t("settings")}</Text>
          <View style={styles.settingsCard}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="language-outline" size={18} color={colors.light.primary} />
                </View>
                <Text style={[styles.settingLabel, isRTL && styles.rtl]}>{t("language")}</Text>
              </View>
              <View style={styles.langToggle}>
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
            </View>

            <View style={styles.divider} />

            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="logo-bitcoin" size={18} color={colors.light.primary} />
                </View>
                <Text style={[styles.settingLabel, isRTL && styles.rtl]}>{t("coinValue")}</Text>
              </View>
              <Text style={styles.settingValue}>{t("coinValueDesc")}</Text>
            </View>

            <View style={styles.divider} />

            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="information-circle-outline" size={18} color={colors.light.primary} />
                </View>
                <Text style={[styles.settingLabel, isRTL && styles.rtl]}>{t("version")}</Text>
              </View>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color={colors.light.destructive} />
          <Text style={[styles.logoutText, isRTL && styles.rtl]}>{t("logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.light.background },
  header: { paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  content: { paddingHorizontal: 20, gap: 16 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  userName: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  userEmail: {
    fontSize: 13,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  statsRow: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.light.border,
  },
  statNum: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  statLabel: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  settingRowRTL: { flexDirection: "row-reverse" },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.light.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.foreground,
  },
  settingValue: {
    fontSize: 12,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    maxWidth: 120,
    textAlign: "right",
  },
  langToggle: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: colors.light.muted,
    borderRadius: 8,
    padding: 2,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  langBtnActive: { backgroundColor: colors.light.primary },
  langBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.mutedForeground,
  },
  langBtnTextActive: { color: "#fff" },
  divider: { height: 1, backgroundColor: colors.light.border, marginHorizontal: 16 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: colors.light.destructive,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: colors.light.destructive,
  },
  rtl: { textAlign: "right", writingDirection: "rtl" },
});
