import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { historyStyles } from "../../style/Style";

export default function History({ navigation }: any) {
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/api/v1/predictions/history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      // pastikan items adalah array
      if (data?.data?.items) {
        setHistory(data.data.items);
      }

    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hari ini";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Kemarin";
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <ScrollView style={historyStyles.container}>
      <View style={historyStyles.header}>
        <Text style={historyStyles.headerTitle}>Riwayat Prediksi</Text>
      </View>

      {history.length === 0 ? (
        <View style={historyStyles.emptyContainer}>
          <Text style={historyStyles.emptyText}>Belum ada riwayat prediksi</Text>
        </View>
      ) : (
        <View style={historyStyles.historyContainer}>
          {history.map((item: any) => (
            <Card key={item.id} style={historyStyles.card}>
              <View style={historyStyles.cardHeader}>
                <View>
                  <Text style={historyStyles.brandText}>{item.brand}</Text>
                  <Text style={historyStyles.seriesText}>{item.series}</Text>
                </View>

                <View style={historyStyles.priceContainer}>
                  <Text style={historyStyles.priceText}>
                    Rp {item.price.toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>

              <Divider style={historyStyles.divider} />

              <View style={historyStyles.specContainer}>
                <Text style={historyStyles.specText}>
                  {item.ram_gb}GB RAM • {item.storage_gb}GB • {item.screen}
                </Text>
              </View>

              <Text style={historyStyles.dateText}>
                {formatDate(item.created_at)}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
