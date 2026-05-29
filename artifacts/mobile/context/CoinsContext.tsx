import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Transaction {
  id: string;
  type: "ad_reward" | "daily_bonus";
  amount: number;
  label: string;
  timestamp: number;
}

interface CoinsContextType {
  coins: number;
  transactions: Transaction[];
  adsWatchedToday: number;
  dailyBonusClaimed: boolean;
  addCoins: (amount: number, type: Transaction["type"], label: string) => Promise<void>;
  claimDailyBonus: () => Promise<boolean>;
  canWatchAd: boolean;
}

const DAILY_AD_LIMIT = 10;

const CoinsContext = createContext<CoinsContextType>({
  coins: 0,
  transactions: [],
  adsWatchedToday: 0,
  dailyBonusClaimed: false,
  addCoins: async () => {},
  claimDailyBonus: async () => false,
  canWatchAd: true,
});

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

export function CoinsProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coinsData, txData, adsData, bonusData] = await Promise.all([
        AsyncStorage.getItem("coins"),
        AsyncStorage.getItem("transactions"),
        AsyncStorage.getItem(`adsWatched_${todayKey()}`),
        AsyncStorage.getItem(`dailyBonus_${todayKey()}`),
      ]);
      if (coinsData) setCoins(parseInt(coinsData, 10));
      if (txData) setTransactions(JSON.parse(txData));
      if (adsData) setAdsWatchedToday(parseInt(adsData, 10));
      if (bonusData) setDailyBonusClaimed(bonusData === "1");
    } catch {}
  };

  const addCoins = async (amount: number, type: Transaction["type"], label: string) => {
    const newCoins = coins + amount;
    const tx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      type,
      amount,
      label,
      timestamp: Date.now(),
    };
    const newTx = [tx, ...transactions].slice(0, 100);

    setCoins(newCoins);
    setTransactions(newTx);

    await Promise.all([
      AsyncStorage.setItem("coins", newCoins.toString()),
      AsyncStorage.setItem("transactions", JSON.stringify(newTx)),
    ]);

    if (type === "ad_reward") {
      const newCount = adsWatchedToday + 1;
      setAdsWatchedToday(newCount);
      await AsyncStorage.setItem(`adsWatched_${todayKey()}`, newCount.toString());
    }
  };

  const claimDailyBonus = async (): Promise<boolean> => {
    if (dailyBonusClaimed) return false;
    setDailyBonusClaimed(true);
    await AsyncStorage.setItem(`dailyBonus_${todayKey()}`, "1");
    await addCoins(250, "daily_bonus", "Daily Login Bonus");
    return true;
  };

  const canWatchAd = adsWatchedToday < DAILY_AD_LIMIT;

  return (
    <CoinsContext.Provider
      value={{
        coins,
        transactions,
        adsWatchedToday,
        dailyBonusClaimed,
        addCoins,
        claimDailyBonus,
        canWatchAd,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
}

export function useCoins() {
  return useContext(CoinsContext);
}

export const DAILY_AD_LIMIT_EXPORT = DAILY_AD_LIMIT;
