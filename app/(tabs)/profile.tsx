import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Paragraph,
  Text,
  TextInput
} from "react-native-paper";
import { profileStyles } from "../../style/Style";


export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchDataProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/api/v1/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.status === 200) {
        setProfile({
          name: data.data.name || "",
          email: data.data.email || ""
        });
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem('token');
      // console.log("Token:", token);
      if (!token) return;
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/api/v1/users`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      console.log(profile)
      
      if (response.ok) {
        Alert.alert("Berhasil", "Profil berhasil diperbarui!");
      } else {
        Alert.alert("Gagal", "Gagal memperbarui profil");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert("Error", "Terjadi kesalahan");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Password baru dan konfirmasi tidak cocok");
      return;
    }
    
    setChangingPassword(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/api/v1/users/me/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword
        })
      });
      
      if (response.ok) {
        Alert.alert("Berhasil", "Password berhasil diubah!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        AsyncStorage.removeItem('token');
        router.replace('/auth');
      } else {
        Alert.alert("Gagal", "Gagal mengubah password");
      }
    } catch (error) {
      console.log("Error changing password:", error);
      Alert.alert("Error", "Terjadi kesalahan");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setShowLogoutDialog(false);
    // Navigasi ke halaman login
    router.navigate('/auth');
  };

  useEffect(() => {
    fetchDataProfile();
  }, []);

  return (
    <ScrollView style={profileStyles.container}>
      {/* Profile Header */}
      <Card style={profileStyles.profileCard}>
        <View style={profileStyles.profileHeader}>
          <Avatar.Text
            size={80}
            label={profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            style={profileStyles.avatar}
          />
          <View style={profileStyles.profileInfo}>
            <Text style={profileStyles.profileName}>{profile.name || "Nama User"}</Text>
            <Text style={profileStyles.profileEmail}>{profile.email || "email@example.com"}</Text>
          </View>
        </View>
      </Card>

      {/* Profile Form */}
      <Card style={profileStyles.formCard}>
        <Text style={profileStyles.sectionTitle}>Informasi Pengguna</Text>
        
        <TextInput
          label="Nama Lengkap"
          mode="outlined"
          value={profile.name}
          onChangeText={(text) => setProfile({...profile, name: text})}
          style={profileStyles.input}
        />

        <TextInput
          label="Email"
          mode="outlined"
          value={profile.email}
          onChangeText={(text) => setProfile({...profile, email: text})}
          keyboardType="email-address"
          style={profileStyles.input}
        />

        <Button
          mode="contained"
          onPress={handleUpdateProfile}
          loading={updating}
          disabled={updating}
          style={profileStyles.button}
        >
          Simpan Profil
        </Button>
      </Card>

      {/* Password Form */}
      <Card style={profileStyles.formCard}>
        <Text style={profileStyles.sectionTitle}>Ubah Password</Text>
        
        <TextInput
          label="Password saat ini"
          secureTextEntry
          mode="outlined"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          style={profileStyles.input}
        />
        
        <TextInput
          label="Password baru"
          secureTextEntry
          mode="outlined"
          value={newPassword}
          onChangeText={setNewPassword}
          style={profileStyles.input}
        />
        
        <TextInput
          label="Konfirmasi password"
          secureTextEntry
          mode="outlined"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={profileStyles.input}
        />

        <Button
          mode="contained"
          onPress={handleChangePassword}
          loading={changingPassword}
          disabled={changingPassword}
          style={profileStyles.button}
        >
          Simpan Password Baru
        </Button>
      </Card>

      {/* Logout Button */}
      <Button
        mode="outlined"
        onPress={() => setShowLogoutDialog(true)}
        style={profileStyles.logoutButton}
        labelStyle={profileStyles.logoutButtonText}
      >
        Keluar Akun
      </Button>

      {/* Logout Confirmation Dialog */}
      <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
        <Dialog.Title>Konfirmasi Logout</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Apakah Anda yakin ingin keluar dari akun?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowLogoutDialog(false)}>Batal</Button>
          <Button onPress={handleLogout}>Keluar</Button>
        </Dialog.Actions>
      </Dialog>
    </ScrollView>
  );
}