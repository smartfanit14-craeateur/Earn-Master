import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AdModal } from "@/components/AdModal";
import colors from "@/constants/colors";
import { useCoins, DAILY_AD_LIMIT_EXPORT } from "@/context/CoinsContext";
import { useLanguage } from "@/context/LanguageContext";

export default function TasksScreen() {
  const { coins, adsWatchedToday, canWatchAd, addCoins } = useCoins();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [adVisible, setAdVisible] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleWatchAd = () => {
    if (!canWatchAd) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAdVisible(true);
  };

  const handleAdComplete = async () => {
    setAdVisible(false);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addCoins(100, "ad_reward", t("earnedFromAd"));
  };

  const progressPct = adsWatchedToday / DAILY_AD_LIMIT_EXPORT;

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && styles.rtl]}>{t("tasks")}</Text>
        <View style={styles.coinsChip}>
          <Ionicons name="logo-bitcoin" size={14} color={colors.light.gold} />
          <Text style={styles.coinsChipText}>{coins.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, isRTL && styles.rtl]}>{t("dailyLimit")}</Text>
            <Text style={styles.progressCount}>
              {adsWatchedToday} / {DAILY_AD_LIMIT_EXPORT}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
          </View>
          <Text style={[styles.progressSub, isRTL && styles.rtl]}>
            {t("adsWatchedToday")}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t("availableTasks")}</Text>

        <View style={[styles.taskCard, !canWatchAd && styles.taskCardDisabled]}>
          <View style={styles.taskHeader}>
            <View style={[styles.taskIconBox, !canWatchAd && styles.taskIconBoxDisabled]}>
              <Ionicons
                name="play-circle"
                size={28}
                color={canWatchAd ? colors.light.primary : colors.light.mutedForeground}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, isRTL && styles.rtl, !canWatchAd && styles.disabledText]}>
                {t("watchAd")}
              </Text>
              <Text style={[styles.taskDesc, isRTL && styles.rtl]}>
                {canWatchAd ? t("watchAdDesc") : t("limitReachedDesc")}
              </Text>
            </View>
            <View style={[styles.rewardBadge, !canWatchAd && styles.rewardBadgeDisabled]}>
              <Ionicons
                name="logo-bitcoin"
                size={12}
                color={canWatchAd ? colors.light.gold : colors.light.mutedForeground}
              />
              <Text style={[styles.rewardBadgeText, !canWatchAd && styles.disabledText]}>
                +100
              </Text>
            </View>
          </View>

          <View style={styles.networkRow}>
            {["AdMob", "Unity Ads", "AppLovin", "StartApp"].map((n) => (
              <View key={n} style={styles.networkTag}>
                <Text style={styles.networkTagText}>{n}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.watchButton, !canWatchAd && styles.watchButtonDisabled]}
            onPress={handleWatchAd}
            activeOpacity={canWatchAd ? 0.85 : 1}
            disabled={!canWatchAd}
          >
            {canWatchAd ? (
              <>
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={[styles.watchButtonText, isRTL && styles.rtl]}>{t("watchAd")}</Text>
              </>
            ) : (
              <>
                <Ionicons name="time-outline" size={16} color={colors.light.mutedForeground} />
                <Text style={[styles.watchButtonTextDisabled, isRTL && styles.rtl]}>{t("limitReached")}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.light.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, isRTL && styles.rtl]}>Ad Networks</Text>
            <Text style={[styles.infoDesc, isRTL && styles.rtl]}>
              Powered by Google AdMob mediation with Unity Ads, AppLovin MAX, and StartApp. Test ad IDs are active.
            </Text>
          </View>
        </View>
      </ScrollView>

      <AdModal
        visible={adVisible}
        onComplete={handleAdComplete}
        onDismiss={() => setAdVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  coinsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.light.goldLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coinsChipText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#92400e",
  },
  content: { paddingHorizontal: 20, gap: 14 },
  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
  },
  progressCount: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.light.secondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.light.primary,
    borderRadius: 4,
  },
  progressSub: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
    marginTop: 4,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    gap: 14,
    borderWidth: 1.5,
    borderColor: colors.light.primary,
    shadowColor: colors.light.primary,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  taskCardDisabled: {
    borderColor: colors.light.border,
    shadowOpacity: 0,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taskIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.light.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  taskIconBoxDisabled: { backgroundColor: colors.light.muted },
  taskTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  taskDesc: {
    fontSize: 12,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  disabledText: { color: colors.light.mutedForeground },
  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.light.goldLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rewardBadgeDisabled: { backgroundColor: colors.light.muted },
  rewardBadgeText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#92400e",
  },
  networkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  networkTag: {
    backgroundColor: colors.light.secondary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  networkTagText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: colors.light.darkGreen,
  },
  watchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.light.primary,
    borderRadius: 13,
    paddingVertical: 14,
  },
  watchButtonDisabled: { backgroundColor: colors.light.muted },
  watchButtonText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  watchButtonTextDisabled: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.mutedForeground,
  },
  infoCard: {
    backgroundColor: colors.light.secondary,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  infoTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.darkGreen,
    marginBottom: 2,
  },
  infoDesc: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  rtl: { textAlign: "right", writingDirection: "rtl" },
});
