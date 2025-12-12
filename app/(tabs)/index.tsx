import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  Modal,
  Text,
  TextInput
} from "react-native-paper";
import { homeStyles } from "../../style/Style";

export default function Index() {

  // MANUAL INPUT (bukan modal lagi)
  const [brand, setBrand] = useState("");
  const [series, setSeries] = useState("");
  const [ramGb, setRamGb] = useState("");
  const [storageGb, setStorageGb] = useState("");
  const [year, setYear] = useState("");
  const [cpu, setCpu] = useState("");
  const [screenType, setScreenType] = useState("");
  const [screenSizeInch, setScreenSizeInch] = useState("");

  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [labelSold, setLabelSold] = useState("");
  const [reasonList, setReasonList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const handlePredict = async () => {
    if (
      !brand || !series || !ramGb ||
      !storageGb || !year || !cpu ||
      !screenType || !screenSizeInch
    ) {
      return;
    }

    const payload = {
      brand,
      series,
      ram_gb: Number(ramGb),
      storage_gb: Number(storageGb),
      year: Number(year),
      cpu,
      screen_type: screenType,
      screen_size_inch: Number(screenSizeInch)
    };

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/api/v1/predictions/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("RESPON:", data);

      if (data.status === true) {
        setPredictedPrice(data.data.price);
        setLabelSold(data.data.label);
        setReasonList(data.data.reason || []);
        setShowResultModal(true);
      }

    } catch (error) {
      console.error("Error posting prediction:", error);
    }

    setLoading(false);
  };

  const formatRupiah = (value: number) => 
    "Rp " + value.toLocaleString("id-ID");

  return (
    <ScrollView style={homeStyles.container}>

      {/* Header */}
      <View style={homeStyles.header}>
        <Text style={homeStyles.headerTitle}>CekHP Bekas</Text>
        <Text style={homeStyles.headerSubtitle}>
          Estimasi harga akurat dalam hitungan detik
        </Text>
      </View>

      <Card style={homeStyles.formCard}>
        <Card.Content>

          {/* MANUAL BRAND */}
          <Text style={homeStyles.label}>Brand</Text>
          <TextInput
            mode="outlined"
            value={brand}
            onChangeText={setBrand}
            style={homeStyles.input}
            placeholder="Contoh: Samsung / iPhone"
            dense
          />

          {/* MANUAL SERIES */}
          <Text style={homeStyles.label}>Series / Model</Text>
          <TextInput
            mode="outlined"
            value={series}
            onChangeText={setSeries}
            style={homeStyles.input}
            placeholder="Contoh: S21 Ultra / 11 Pro"
            dense
          />

          {/* RAM */}
          <Text style={homeStyles.label}>RAM (GB)</Text>
          <TextInput
            mode="outlined"
            value={ramGb}
            onChangeText={setRamGb}
            keyboardType="numeric"
            style={homeStyles.input}
            dense
          />

          {/* STORAGE */}
          <Text style={homeStyles.label}>Storage (GB)</Text>
          <TextInput
            mode="outlined"
            value={storageGb}
            onChangeText={setStorageGb}
            keyboardType="numeric"
            style={homeStyles.input}
            dense
          />

          {/* YEAR */}
          <Text style={homeStyles.label}>Tahun Rilis</Text>
          <TextInput
            mode="outlined"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            style={homeStyles.input}
            dense
          />

          <Divider style={homeStyles.divider} />

          {/* CPU */}
          <Text style={homeStyles.label}>CPU / Chipset</Text>
          <TextInput
            mode="outlined"
            value={cpu}
            onChangeText={setCpu}
            style={homeStyles.input}
            dense
          />

          {/* SCREEN TYPE */}
          <Text style={homeStyles.label}>Tipe Layar</Text>
          <TextInput
            mode="outlined"
            value={screenType}
            onChangeText={setScreenType}
            placeholder="OLED / AMOLED / LCD"
            style={homeStyles.input}
            dense
          />

          {/* SCREEN SIZE */}
          <Text style={homeStyles.label}>Ukuran Layar (inci)</Text>
          <TextInput
            mode="outlined"
            value={screenSizeInch}
            onChangeText={setScreenSizeInch}
            placeholder="Contoh: 6.7"
            keyboardType="numeric"
            style={homeStyles.input}
            dense
          />

          <Button
            mode="contained"
            onPress={handlePredict}
            loading={loading}
            disabled={loading}
            style={homeStyles.button}
          >
            Lihat Estimasi Harga
          </Button>

          <Button
            mode="text"
            textColor="#6CC24A"
            onPress={() => router.push("/(tabs)/history")}
          >
            Riwayat Prediksi
          </Button>

        </Card.Content>
      </Card>

      {/* ===================== RESULT MODAL ===================== */}
      <Modal
        visible={showResultModal}
        onDismiss={() => setShowResultModal(false)}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          marginHorizontal: 20,
          borderRadius: 16,
          elevation: 5
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
          Estimasi Harga Berhasil!
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 4 }}>
          {predictedPrice ? formatRupiah(predictedPrice) : ""}
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 10, color: "#6CC24A" }}>
          {labelSold.toUpperCase()}
        </Text>

        <Divider style={{ marginVertical: 10 }} />

        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>
          Alasan Prediksi:
        </Text>

        <View style={{ marginBottom: 15 }}>
          {reasonList.map((r, i) => (
            <Text key={i} style={{ fontSize: 14, marginBottom: 3 }}>
              • {r}
            </Text>
          ))}
        </View>

        <Button
          mode="contained"
          buttonColor="#6CC24A"
          style={{ marginBottom: 10 }}
          onPress={() => {
            setShowResultModal(false);
            router.push("/(tabs)/history");
          }}
        >
          Lihat Riwayat Prediksi
        </Button>

        <Button
          mode="text"
          textColor="#999"
          onPress={() => setShowResultModal(false)}
        >
          Tutup
        </Button>
      </Modal>

    </ScrollView>
  );
}
