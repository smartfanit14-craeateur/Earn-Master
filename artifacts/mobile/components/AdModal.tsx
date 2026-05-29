import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";

interface AdModalProps {
  visible: boolean;
  onComplete: () => void;
  onDismiss: () => void;
}

const AD_DURATION = 10;

export function AdModal({ visible, onComplete, onDismiss }: AdModalProps) {
  const { t, isRTL } = useLanguage();
  const [phase, setPhase] = useState<"loading" | "playing" | "complete">("loading");
  const [countdown, setCountdown] = useState(AD_DURATION);
  const progress = useRef(new Animated.Value(0)).current;
  const coinScale = useRef(new Animated.Value(0)).current;
  const coinOpacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      setPhase("loading");
      setCountdown(AD_DURATION);
      progress.setValue(0);
      coinScale.setValue(0);
      coinOpacity.setValue(0);

      const loadingTimeout = setTimeout(() => {
        setPhase("playing");
        startCountdown();
      }, 1500);

      return () => {
        clearTimeout(loadingTimeout);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [visible]);

  const startCountdown = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: AD_DURATION * 1000,
      useNativeDriver: false,
    }).start();

    let remaining = AD_DURATION;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("complete");
        animateCoin();
      }
    }, 1000);
  };

  const animateCoin = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Animated.parallel([
      Animated.spring(coinScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(coinOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleClaim = () => {
    onComplete();
    setPhase("loading");
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {phase === "loading" && (
            <View style={styles.centerContent}>
              <View style={styles.adIcon}>
                <Ionicons name="play-circle" size={56} color={colors.light.primary} />
              </View>
              <Text style={[styles.loadingText, isRTL && styles.rtl]}>
                Loading ad...
              </Text>
              <View style={styles.loadingDots}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={styles.dot} />
                ))}
              </View>
            </View>
          )}

          {phase === "playing" && (
            <View style={styles.playingContent}>
              <View style={styles.adBanner}>
                <View style={styles.adBannerInner}>
                  <Ionicons name="videocam" size={32} color={colors.light.primary} />
                  <Text style={styles.adBannerText}>Sponsored Ad</Text>
                  <Text style={styles.adBannerSub}>Google AdMob · Unity Ads · AppLovin</Text>
                </View>
                <View style={styles.adNetworkRow}>
                  {["AdMob", "Unity", "AppLovin", "StartApp"].map((n) => (
                    <View key={n} style={styles.networkBadge}>
                      <Text style={styles.networkBadgeText}>{n}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.countdownRow}>
                  <Ionicons name="time-outline" size={16} color={colors.light.mutedForeground} />
                  <Text style={styles.countdownText}>
                    {t("adCountdown")} {countdown}{t("seconds")}
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[styles.progressFill, { width: progressWidth }]}
                  />
                </View>
              </View>

              <View style={styles.rewardPreview}>
                <Ionicons name="logo-bitcoin" size={20} color={colors.light.gold} />
                <Text style={[styles.rewardText, isRTL && styles.rtl]}>
                  {t("earnCoins")}
                </Text>
              </View>
            </View>
          )}

          {phase === "complete" && (
            <View style={styles.centerContent}>
              <Animated.View
                style={[
                  styles.successCircle,
                  { opacity: coinOpacity, transform: [{ scale: coinScale }] },
                ]}
              >
                <Ionicons name="logo-bitcoin" size={56} color={colors.light.gold} />
              </Animated.View>
              <Text style={[styles.completeTitle, isRTL && styles.rtl]}>
                {t("adComplete")}
              </Text>
              <Text style={[styles.completeSubtitle, isRTL && styles.rtl]}>
                {t("coinsAdded")}
              </Text>
              <TouchableOpacity style={styles.claimButton} onPress={handleClaim} activeOpacity={0.8}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.claimButtonText}>{t("claim")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 380,
    overflow: "hidden",
    minHeight: 300,
    justifyContent: "center",
  },
  centerContent: {
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  playingContent: {
    padding: 24,
    gap: 20,
  },
  adIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.light.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_500Medium",
  },
  loadingDots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.light.primary,
  },
  adBanner: {
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 12,
  },
  adBannerInner: {
    alignItems: "center",
    gap: 6,
  },
  adBannerText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.foreground,
  },
  adBannerSub: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
  },
  adNetworkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  networkBadge: {
    backgroundColor: colors.light.secondary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  networkBadgeText: {
    fontSize: 10,
    color: colors.light.darkGreen,
    fontFamily: "Inter_500Medium",
  },
  progressSection: {
    gap: 8,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "center",
  },
  countdownText: {
    fontSize: 13,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_500Medium",
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.light.secondary,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.light.primary,
    borderRadius: 3,
  },
  rewardPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.light.goldLight,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rewardText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#92400e",
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.light.goldLight,
    justifyContent: "center",
    alignItems: "center",
  },
  completeTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  completeSubtitle: {
    fontSize: 14,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  claimButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  claimButtonText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  rtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});
