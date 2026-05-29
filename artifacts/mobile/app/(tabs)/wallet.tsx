import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { Transaction, useCoins } from "@/context/CoinsContext";
import { useLanguage } from "@/context/LanguageContext";

export default function WalletScreen() {
  const { coins, transactions } = useCoins();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const dollarValue = (coins / 1000).toFixed(2);

  const renderTx = ({ item }: { item: Transaction }) => (
    <View style={[styles.txRow, isRTL && styles.txRowRTL]}>
      <View style={[styles.txIcon, item.type === "daily_bonus" && styles.txIconBonus]}>
        <Ionicons
          name={item.type === "daily_bonus" ? "gift" : "play-circle"}
          size={18}
          color={item.type === "daily_bonus" ? colors.light.gold : colors.light.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.txLabel, isRTL && styles.rtl]}>{item.label}</Text>
        <Text style={[styles.txTime, isRTL && styles.rtl]}>
          {new Date(item.timestamp).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text style={styles.txAmount}>+{item.amount}</Text>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && styles.rtl]}>{t("wallet")}</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={[styles.balanceLabel, isRTL && styles.rtl]}>{t("balance")}</Text>
        <View style={styles.balanceRow}>
          <Ionicons name="logo-bitcoin" size={36} color={colors.light.gold} />
          <Text style={styles.balanceNumber}>{coins.toLocaleString()}</Text>
        </View>
        <Text style={styles.dollarValue}>≈ ${dollarValue} USD</Text>
        <Text style={styles.coinValueNote}>{t("coinValueDesc")}</Text>

        <TouchableOpacity style={styles.cashOutBtn} activeOpacity={0.85}>
          <Ionicons name="card-outline" size={18} color={colors.light.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.cashOutTitle, isRTL && styles.rtl]}>{t("cashOut")}</Text>
            <Text style={[styles.cashOutSub, isRTL && styles.rtl]}>{t("comingSoon")}</Text>
          </View>
          <Ionicons name="lock-closed-outline" size={16} color={colors.light.mutedForeground} />
        </TouchableOpacity>
      </View>

      <View style={[styles.txSection, { paddingBottom: bottomPad + 100 }]}>
        <Text style={[styles.txSectionTitle, isRTL && styles.rtl]}>{t("transactions")}</Text>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={40} color={colors.light.mutedForeground} />
            <Text style={[styles.emptyText, isRTL && styles.rtl]}>{t("noTransactions")}</Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTx}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.light.background },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
  },
  balanceCard: {
    backgroundColor: colors.light.primary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 22,
    gap: 8,
    shadowColor: colors.light.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_500Medium",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  balanceNumber: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  dollarValue: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_600SemiBold",
  },
  coinValueNote: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
  },
  cashOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  cashOutTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.foreground,
  },
  cashOutSub: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
  },
  txSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  txSectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: colors.light.foreground,
    marginBottom: 4,
  },
  txRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  txRowRTL: { flexDirection: "row-reverse" },
  txIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.light.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  txIconBonus: { backgroundColor: colors.light.goldLight },
  txLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.foreground,
  },
  txTime: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: colors.light.mutedForeground,
    fontFamily: "Inter_400Regular",
  },
  rtl: { textAlign: "right", writingDirection: "rtl" },
});
