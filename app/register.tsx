import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { registerStyles } from "../style/Style";

export default function RegisterScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // Validasi input
    if (!name.trim()) {
      Alert.alert("Error", "Nama tidak boleh kosong");
      return;
    }
    
    if (!email.trim()) {
      Alert.alert("Error", "Email tidak boleh kosong");
      return;
    }
    
    if (!password) {
      Alert.alert("Error", "Password tidak boleh kosong");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status !== 200 && response.status !== 201) {
        Alert.alert("Register Failed", data.message || "Terjadi kesalahan");
        return;
      }

      Alert.alert("Success", "Register berhasil! Silakan login.", [
        { text: "OK", onPress: () => router.replace("/auth") }
      ]);
    } catch (error) {
      Alert.alert("Error", "Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={registerStyles.container}
    >
      <View style={registerStyles.innerContainer}>
        {/* Logo/Ikon Aplikasi */}
        <Image 
          source={require('../assets/images/images-removebg-preview.png')}
          style={registerStyles.logo}
        />
        
        {/* Judul Aplikasi */}
        <Text style={registerStyles.title}>
          Sistem Prediksi Penjualan
        </Text>
        <Text style={registerStyles.subtitle}>
          Barang Bekas
        </Text>

        {/* Card Form */}
        <View style={registerStyles.card}>
          <TextInput
            label="Nama Lengkap"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={registerStyles.input}
            theme={{ colors: { primary: '#6CC24A' } }}
            left={<TextInput.Icon icon="account" color="#6CC24A" />}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            style={registerStyles.input}
            theme={{ colors: { primary: '#6CC24A' } }}
            left={<TextInput.Icon icon="email" color="#6CC24A" />}
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            style={registerStyles.input}
            theme={{ colors: { primary: '#6CC24A' } }}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
                color="#6CC24A"
              />
            }
            left={<TextInput.Icon icon="lock" color="#6CC24A" />}
          />

          <TextInput
            label="Konfirmasi Password"
            mode="outlined"
            secureTextEntry={!confirmVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={registerStyles.input}
            theme={{ colors: { primary: '#6CC24A' } }}
            right={
              <TextInput.Icon
                icon={confirmVisible ? "eye-off" : "eye"}
                onPress={() => setConfirmVisible(!confirmVisible)}
                color="#6CC24A"
              />
            }
            left={<TextInput.Icon icon="lock-check" color="#6CC24A" />}
          />

          <Button 
            mode="contained" 
            onPress={handleRegister} 
            style={registerStyles.button}
            labelStyle={registerStyles.buttonLabel}
            loading={loading}
            disabled={loading}
          >
            Sign Up
          </Button>

          <Button
            mode="text"
            textColor="#6CC24A"
            onPress={() => router.push("/auth")}
            style={registerStyles.textButton}
          >
            Already have an account? Sign In
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}