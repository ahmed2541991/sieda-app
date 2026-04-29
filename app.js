import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, ScrollView, 
  TouchableOpacity, TextInput, Image, Alert, ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { 
  ShieldCheck, Camera, Smartphone, UserCheck, 
  MessageCircle, CreditCard, UploadCloud, CheckCircle 
} from 'lucide-react-native';

export default function App() {
  // حالات التوثيق والبيانات
  const [nationalID, setNationalID] = useState('');
  const [phoneModel, setPhoneModel] = useState('');
  const [status, setStatus] = useState('جديد');
  const [idImage, setIdImage] = useState(null);
  const [paymentImage, setPaymentImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // وظيفة اختيار الصور (للهوية أو الإشعار)
  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      if (type === 'ID') setIdImage(result.assets[0].uri);
      if (type === 'PAYMENT') setPaymentImage(result.assets[0].uri);
    }
  };

  const handleFinalSubmit = () => {
    if (!nationalID || !idImage || !paymentImage || !phoneModel) {
      Alert.alert("بيانات ناقصة", "لضمان المصداقية، يرجى إكمال التوثيق، رفع الإشعار، وبيانات الهاتف.");
      return;
    }
    setLoading(true);
    // محاكاة الإرسال لـ Firebase
    setTimeout(() => {
      setLoading(false);
      Alert.alert("تم الإرسال بنجاح", "شكراً لك. فريق 'سيدا' سيراجع بياناتك ويتم توثيق حسابك بالعلامة الخضراء فور التأكد.");
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* الهيدر الرئيسي */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <ShieldCheck color="#28a745" size={28} />
          <Text style={styles.headerTitle}>سيدا - SIEDA</Text>
        </View>
        <Text style={styles.headerSub}>سوق الهواتف الموثوق</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 1. قسم التوثيق الشخصي */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <UserCheck color="#007bff" size={20} />
            <Text style={styles.cardTitle}>توثيق الهوية (المصداقية)</Text>
          </View>
          <TextInput 
            style={styles.input} 
            placeholder="الرقم الوطني المكون من 11 رقم" 
            keyboardType="numeric"
            value={nationalID}
            onChangeText={setNationalID}
          />
          <TouchableOpacity style={styles.uploadArea} onPress={() => pickImage('ID')}>
            {idImage ? (
              <Image source={{ uri: idImage }} style={styles.fullPreview} />
            ) : (
              <View style={styles.placeholderBox}>
                <Camera color="#666" size
