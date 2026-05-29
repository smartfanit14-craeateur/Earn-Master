import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
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
import { useCoins, DAILY_AD_LIMIT_EXPORT } from "@/context/CoinsContext";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardScreen() {
  const { user } = useAuth();
  const { coins, adsWatchedToday, transactions, claimDailyBonus, dailyBonusClaimed } = useCoins();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const coinAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(coinAnim, { toValue: 1.08, duration: 150, useNativeDriver: true }),
      Animated.timing(coinAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [coins]);

  const handleClaimBonus = async () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await claimDailyBonus();
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const recentTx = transactions.slice(0, 5);

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[styles.greeting, isRTL && styles.rtl]}>
            {t("greeting")}, {user?.name ?? "User"} 👋
          </Text>
          <Text style={[styles.subGreeting, isRTL && styles.rtl]}>{t("keepEarning")}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coinCard}>
          <View style={styles.coinCardHeader}>
            <Text style={[styles.coinLabel, isRTL && styles.rtl]}>{t("totalCoins")}</Text>
            <View style={styles.coinBadge}>
              <Ionicons name="logo-bitcoin" size={12} color={colors.light.gold} />
              <Text style={styles.coinBadgeText}>EarnMaster</Text>
            </View>
          </View>
          <Animated.View style={[styles.coinRow, { transform: [{ scale: coinAnim }] }]}>
            <Ionicons name="logo-bitcoin" size={40} color={colors.light.gold} />
            <Text style={styles.coinNumber}>{coins.toLocaleString()}</Text>
          </Animated.View>
          <Text style={styles.coinValueHint}>{t("coinValueDesc")}</Text>
          <TouchableOpacity
            style={styles.cashOutButton}
            onPress={() => router.push("/(tabs)/wallet")}
            activeOpacity={0.85}
          >
            <Ionicons name="wallet-outline" size={16} color="#fff" />
            <Text style={[styles.cashOutText, isRTL && styles.rtl]}>{t("wallet")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Ionicons name="play-circle" size={22} color={colors.light.primary} />
            <Text style={styles.statValue}>{adsWatchedToday}</Text>
            <Text style={[styles.statLabel, isRTL && styles.rtl]}>{t("adsWatchedToday")}</Text>
            <Text style={styles.statSub}>{t("of")} {DAILY_AD_LIMIT_EXPORT}</Text>
          </View>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Ionicons name="trending-up" size={22} color={colors.light.primary} />
            <Text style={styles.statValue}>{adsWatchedToday * 100}</Text>
            <Text style={[styles.statLabel, isRTL && styles.rtl]}>{t("coinsEarned")}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bonusCard, dailyBonusClaimed && styles.bonusCardClaimed]}
          onPress={handleClaimBonus}
          activeOpacity={dailyBonusClaimed ? 1 : 0.85}
          disabled={dailyBonusClaimed}
        >
          <View style={styles.bonusLeft}>
            <View style={[styles.bonusIconBox, dailyBonusClaimed && styles.bonusIconBoxClaimed]}>
              <Ionicons
                name={dailyBonusClaimed ? "checkmark-circle" : "gift"}
                size={24}
                color={dailyBonusClaimed ? colors.light.mutedForeground : colors.light.gold}
              />
            </View>
            <View>
              <Text style={[styles.bonusTitle, isRTL && styles.rtl]}>
                {dailyBonusClaimed ? t("bonusClaimed") : t("claimBonus")}
              </Text>
              <Text style={[styles.bonusSub, isRTL && styles.rtl]}>+250 {t("coins")}</Text>
            </View>
          </View>
          {!dailyBonusClaimed && (
            <View style={styles.bonusArrow}>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.watchAdCta}
          onPress={() => router.push("/(tabs)/tasks")}
          activeOpacity={0.85}
        >
          <View style={styles.watchAdCtaLeft}>
            <Ionicons name="play-circle" size={28} color="#fff" />
            <View>
              <Text style={[styles.watchAdCtaTitle, isRTL && styles.rtl]}>{t("watchAd")}</Text>
              <Text style={[styles.watchAdCtaSub, isRTL && styles.rtl]}>{t("watchAdDesc")}</Text>
            </View>
          </View>
          <View style={styles.watchAdCtaRight}>
            <Text style={styles.watchAdCtaCoins}>{t("earnCoins")}</Text>
          </View>
        </TouchableOpacity>

        {recentTx.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t("transactions")}</Text>
            {recentTx.map((tx) => (
              <View key={tx.id} style={styles.txItem}>
                <View style={styles.txIconBox}>
                  <Ionicons
                    name={tx.type === "daily_bonus" ? "gift" : "play-circle"}
                    size={18}
                    color={colors.light.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.txLabel, isRTL && styles.rtl]}>{tx.label}</Text>
                  <Text style={[styles.txTime, isRTL && styles.rtl]}>
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
                <Text style={styles.txAmount}>+{tx.amount}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: colors.light.background,
  },
  greeting: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  subGreeting: {
    fontSize: 13,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  headerRight: {},
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 14,
  },
  coinCard: {
    backgroundColor: colors.light.primary,
    borderRadius: 20,
    padding: 22,
    gap: 10,
    shadowColor: colors.light.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  coinCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_500Medium",
  },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  coinBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontFamily: "Inter_500Medium",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinNumber: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  coinValueHint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    fontFamily: "Inter_400Regular",
  },
  cashOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  cashOutText: {
    fontSize: 13,
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  statValue: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  statSub: {
    fontSize: 11,
    color: colors.light.primary,
    fontFamily: "Inter_600SemiBold",
  },
  bonusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: colors.light.gold,
    shadowColor: colors.light.gold,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  bonusCardClaimed: {
    borderColor: colors.light.border,
    shadowOpacity: 0,
  },
  bonusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  bonusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.light.goldLight,
    justifyContent: "center",
    alignItems: "center",
  },
  bonusIconBoxClaimed: {
    backgroundColor: colors.light.muted,
  },
  bonusTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.foreground,
  },
  bonusSub: {
    fontSize: 12,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
  },
  bonusArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  watchAdCta: {
    backgroundColor: colors.light.darkGreen,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  watchAdCtaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  watchAdCtaTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  watchAdCtaSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  watchAdCtaRight: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  watchAdCtaCoins: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: colors.light.gold,
  },
  section: {
    gap: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  txItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.light.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  txLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.foreground,
  },
  txTime: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
  },
  txAmount: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
  },
  rtl: { textAlign: "right", writingDirection: "rtl" },
});
