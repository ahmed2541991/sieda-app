import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, where, serverTimestamp, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ShieldCheck, Plus, Camera, Phone, MessageCircle, X, Trash2, CheckCircle, Lock, ImageIcon } from 'lucide-react-native';

// --- 1. إعدادات Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSy...", // ضع مفتاحك هنا
  authDomain: "sieda-app.firebaseapp.com",
  projectId: "sieda-app",
  storageBucket: "sieda-app.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export default function SiedaApp() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newAd, setNewAd] = useState({ model: '', price: '', image: null });
  const [idCardImage, setIdCardImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [pendingAds, setPendingAds] = useState([]);
  const ADMIN_KEY = "Ab@12390";

  // 1. جلب الإعلانات الموثقة
  useEffect(() => {
    const q = query(
      collection(db, "ads"),
      where("verification.status", "==", "verified"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPhones(snapshot.docs.map(doc => ({...doc.data(), id: doc.id })));
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      Alert.alert("خطأ", "فشل جلب البيانات. تأكد من إنشاء Index في Firestore");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. جلب الإعلانات المعلقة للمدير
  useEffect(() => {
    if (isAdminLoggedIn) {
      const q = query(collection(db, "ads"), where("verification.status", "==", "pending"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPendingAds(snapshot.docs.map(doc => ({...doc.data(), id: doc.id })));
      });
      return () => unsubscribe();
    }
  }, [isAdminLoggedIn]);

  // رفع الصور إلى Storage
  const uploadImageAsync = async (uri, folderName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `${folderName}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === 'product') setNewAd({...newAd, image: uri });
      if (type === 'id') setIdCardImage(uri);
      if (type === 'selfie') setSelfieImage(uri);
    }
  };

  const handleSaveAd = async () => {
    if (!newAd.model ||!newAd.price) return Alert.alert("خطأ", "أدخل اسم الموديل والسعر");
    if (!newAd.image ||!idCardImage ||!selfieImage) return Alert.alert("خطأ", "الرجاء إكمال كافة الصور المطلوبة للتوثيق");

    setIsUploading(true);
    try {
      const productUrl = await uploadImageAsync(newAd.image, 'products');
      const idCardUrl = await uploadImageAsync(idCardImage, 'identity_cards');
      const selfieUrl = await uploadImageAsync(selfieImage, 'selfies');

      await addDoc(collection(db, "ads"), {
        model: newAd.model,
        price: Number(newAd.price),
        image: productUrl,
        verification: {
          idCard: idCardUrl,
          selfie: selfieUrl,
          status: "pending"
        },
        createdAt: serverTimestamp()
      });

      setIsModalOpen(false);
      setNewAd({ model: '', price: '', image: null });
      setIdCardImage(null);
      setSelfieImage(null);
      Alert.alert("تم", "تم إرسال إعلانك للمراجعة بنجاح");
    } catch (error) {
      Alert.alert("خطأ", "فشل الرفع: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifyAd = async (adId, approve) => {
    try {
      const adRef = doc(db, "ads", adId);
      if (approve) {
        await updateDoc(adRef, { "verification.status": "verified" });
      } else {
        Alert.alert("تأكيد", "حذف الطلب نهائياً؟", [
          { text: "إلغاء" },
          { text: "حذف", onPress: async () => await deleteDoc(adRef) }
        ]);
      }
    } catch (error) {
      Alert.alert("خطأ", "فشل التحديث: " + error.message);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_KEY) {
      setIsAdminLoggedIn(true);
      setAdminPassword("");
      setIsAdminMode(false);
    } else {
      Alert.alert("خطأ", "كلمة المرور خاطئة!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.logo} onPress={() => setIsAdminMode(true)}>
          <ShieldCheck color="#2563eb" size={24} />
          <Text style={styles.headerTitle}>أعمال أبو كمال</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsModalOpen(true)} style={styles.addBtn}>
          <Plus color="white" size={18} />
          <Text style={styles.addBtnText}>إضافة إعلان</Text>
        </TouchableOpacity>
      </View>

      {!isAdminLoggedIn? (
        loading? (
          <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {phones.length === 0 && <Text style={styles.emptyText}>لا توجد إعلانات موثقة حالياً</Text>}
            {phones.map((phone) => (
              <View key={phone.id} style={styles.card}>
                <Image source={{ uri: phone.image }} style={styles.cardImage} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{phone.model}</Text>
                    <ShieldCheck size={16} color="#2563eb" fill="#dbeafe" />
                  </View>
                  <Text style={styles.cardPrice}>{phone.price} ج.س</Text>
                  <View style={styles.btnRow}>
                    <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/249912345678?text=استفسار عن ${phone.model}`)} style={[styles.contactBtn, { backgroundColor: '#22c55e' }]}>
                      <MessageCircle size={16} color="white" />
                      <Text style={styles.contactBtnText}>واتساب</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:+249912345678`)} style={[styles.contactBtn, { backgroundColor: '#2563eb' }]}>
                      <Phone size={16} color="white" />
                      <Text style={styles.contactBtnText}>اتصال</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )
      ) : (
        <ScrollView style={styles.modalBody}>
          <View style={styles.adminHeader}>
            <Text style={styles.modalTitle}>طلبات معلقة: {pendingAds.length}</Text>
            <TouchableOpacity onPress={() => setIsAdminLoggedIn(false)}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>خروج</Text>
            </TouchableOpacity>
          </View>
          {pendingAds.length === 0 && <Text style={styles.emptyText}>لا توجد طلبات معلقة</Text>}
          {pendingAds.map((ad) => (
            <View key={ad.id} style={styles.adminCard}>
              <Image source={{ uri: ad.image }} style={styles.adminCardImage} />
              <Text style={styles.adminCardTitle}>{ad.model} - {ad.price} ج.س</Text>
              <Text style={styles.adminLabel}>الهوية:</Text>
              <Image source={{ uri: ad.verification.idCard }} style={styles.adminCardImage} />
              <Text style={styles.adminLabel}>السيلفي:</Text>
              <Image source={{ uri: ad.verification.selfie }} style={styles.adminCardImage} />
              <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.adminBtn, { backgroundColor: '#22c55e' }]} onPress={() => handleVerifyAd(ad.id, true)}>
                  <CheckCircle color="white" size={18} />
                  <Text style={styles.contactBtnText}>قبول</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.adminBtn, { backgroundColor: '#ef4444' }]} onPress={() => handleVerifyAd(ad.id, false)}>
                  <Trash2 color="white" size={18} />
                  <Text style={styles.contactBtnText}>رفض</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={isModalOpen} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>إضافة إعلان جديد</Text>
            <TouchableOpacity onPress={() => setIsModalOpen(false)}><X size={24} color="#333" /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>اسم الموديل</Text>
            <TextInput style={styles.input} placeholder="مثال: iPhone 14 Pro" value={newAd.model} onChangeText={(text) => setNewAd({...newAd, model: text })} />
            <Text style={styles.label}>السعر بالجنيه</Text>
            <TextInput style={styles.input} placeholder="مثال: 450000" keyboardType="numeric" value={newAd.price} onChangeText={(text) => setNewAd({...newAd, price: text })} />
            <Text style={styles.label}>صورة المنتج</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('product')}>
              {newAd.image? <Image source={{ uri: newAd.image }} style={styles.preview} /> :
                <View style={styles.imagePickerContent}><Camera color="#666" /><Text>اختر صورة المنتج</Text></View>}
            </TouchableOpacity>
            <Text style={styles.label}>صورة الهوية للتوثيق</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('id')}>
              {idCardImage? <Image source={{ uri: idCardImage }} style={styles.preview} /> :
                <View style={styles.imagePickerContent}><Camera color="#666" /><Text>اختر صورة الهوية</Text></View>}
            </TouchableOpacity>
            <Text style={styles.label}>صورة سيلفي مع الهوية</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('selfie')}>
              {selfieImage? <Image source={{ uri: selfieImage }} style={styles.preview} /> :
                <View style={styles.imagePickerContent}><Camera color="#666" /><Text>اختر صورة سيلفي</Text></View>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSaveAd} disabled={isUploading}>
              {isUploading? <ActivityIndicator color="white" /> : <Text style={styles.submitBtnText}>إرسال للمراجعة</Text>}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={isAdminMode &&!isAdminLoggedIn} transparent animationType="fade">
        <View style={styles.adminLoginOverlay}>
          <View style={styles.adminLoginBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>دخول المدير</Text>
              <TouchableOpacity onPress={() => setIsAdminMode(false)}><X size={24} color="#333" /></TouchableOpacity>
            </View>
            <Lock size={40} color="#2563eb" style={{ alignSelf: 'center', marginVertical: 10 }} />
            <TextInput style={styles.input} placeholder="كلمة المرور" secureTextEntry value={adminPassword} onChangeText={setAdminPassword} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAdminLogin}>
              <Text style={styles.submitBtnText}>دخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee' },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  addBtn: { flexDirection: 'row', backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems: 'center', gap: 6 },
  addBtnText: { color: 'white', fontWeight: 'bold' },
  list: { padding: 16, gap: 16 },
  card: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 16, elevation: 2 },
  cardImage: { width: '100%', height: 200 },
  cardBody: { padding: 16 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#2563eb', marginBottom: 12 },
  btnRow: { flexDirection: 'row', gap: 8 },
  contactBtn: { flex: 1, flexDirection: 'row', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 6 },
  contactBtnText: { color: 'white', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6b7280' },
  modalContainer: { flex: 1, backgroundColor: 'white' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalBody: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#f9fafb', textAlign: 'right' },
  imagePicker: { height: 150, borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  imagePickerContent: { alignItems: 'center', gap: 8 },
  preview: { width: '100%', height: '100%', borderRadius: 8 },
  submitBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  adminLoginOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  adminLoginBox: { backgroundColor: 'white', borderRadius: 16, padding: 16 },
  adminHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  adminCard: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginBottom: 16 },
  adminCardImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8 },
  adminCardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  adminLabel: { fontWeight: '600', marginTop: 8, marginBottom: 4 },
  adminBtn: { flex: 1, flexDirection: 'row', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 6 },
});
