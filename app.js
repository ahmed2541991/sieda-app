import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, where, serverTimestamp, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { ShieldCheck, Plus, Loader2, Send, MessageCircle, X, User, Trash2, Camera, Phone, Lock, Eye, CheckCircle, Image as ImageIcon } from 'lucide-react';

// --- إعدادات Firebase ---
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
  // الحالات (States)
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  
  // حالات الإضافة والتوثيق
  const [newAd, setNewAd] = useState({ model: '', price: '', image: '' });
  const [idCardImage, setIdCardImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // حالات لوحة التحكم (Admin)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [pendingAds, setPendingAds] = useState([]);
  const ADMIN_KEY = "Ab@12390"; 

  // 1. جلب الإعلانات الموثقة للمستخدمين
  useEffect(() => {
    const q = query(
      collection(db, "ads"), 
      where("verification.status", "==", "verified"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPhones(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. جلب الإعلانات المعلقة للمدير
  useEffect(() => {
    if (isAdminLoggedIn) {
      const q = query(collection(db, "ads"), where("verification.status", "==", "pending"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPendingAds(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });
      return () => unsubscribe();
    }
  }, [isAdminLoggedIn]);

  // دالة مساعدة لرفع الصور إلى Storage
  const uploadImageAndGetURL = async (base64String, folderName) => {
    if (!base64String) return null;
    const storageRef = ref(storage, `${folderName}/${Date.now()}-${Math.random().toString(36).substring(7)}`);
    const snapshot = await uploadString(storageRef, base64String, 'data_url');
    return await getDownloadURL(snapshot.ref);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'product') setNewAd({ ...newAd, image: reader.result });
        if (type === 'id') setIdCardImage(reader.result);
        if (type === 'selfie') setSelfieImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAd = async (e) => {
    e.preventDefault();
    if (!newAd.image || !idCardImage || !selfieImage) return alert("الرجاء إكمال كافة الصور المطلوبة للتوثيق");
    
    setIsUploading(true);
    try {
      // رفع الصور والحصول على الروابط
      const productUrl = await uploadImageAndGetURL(newAd.image, 'products');
      const idCardUrl = await uploadImageAndGetURL(idCardImage, 'identity_cards');
      const selfieUrl = await uploadImageAndGetURL(selfieImage, 'selfies');

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
      setNewAd({ model: '', price: '', image: '' });
      setIdCardImage(null);
      setSelfieImage(null);
      alert("تم إرسال إعلانك للمراجعة بنجاح");
    } catch (error) {
      alert("حدث خطأ أثناء الرفع: " + error.message);
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
        if(window.confirm("حذف الطلب نهائياً؟")) await deleteDoc(adRef);
      }
    } catch (error) {
      alert("خطأ في التحديث: " + error.message);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_KEY) {
      setIsAdminLoggedIn(true);
    } else {
      alert("كلمة المرور خاطئة!");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-right pb-20">
      {/* الهيدر */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-40 border-b flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAdminMode(true)}>
          <ShieldCheck className="text-blue-600" size={24} />
          <h1 className="text-lg font-bold text-gray-800">أعمال أبو كمال</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md font-bold">
          <Plus size={18} /> <span>إضافة إعلان</span>
        </button>
      </nav>

      {/* المحتوى الرئيسي للمستخدمين */}
      {!isAdminLoggedIn && (
        <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="flex justify-center py-20 col-span-full"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
          ) : phones.length > 0 ? (
            phones.map((phone) => (
              <div key={phone.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                <img src={phone.image} className="w-full h-52 object-cover" alt={phone.model} />
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-bold text-gray-800">{phone.model}</h3>
                    <ShieldCheck size={16} className="text-blue-600 fill-blue-50" />
                  </div>
                  <p className="text-blue-600 font-bold text-lg">{phone.price} ج.س</p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <a href={`https://wa.me/249xxxxxxxxx?text=استفسار عن ${phone.model}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold">
                      <MessageCircle size={16} /> واتساب
                    </a>
                    <a href="tel:+249xxxxxxxxx" className="bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold">
                      <Phone size={16} /> اتصال
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full py-10 text-gray-500">لا توجد إعلانات موثقة حالياً</p>
          )}
        </main>
      )}

      {/* واجهة المدير (عند تسجيل الدخول) */}
      {isAdminLoggedIn && (
        <main className="p-4 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl">طلبات التوثيق المعلقة ({pendingAds.length})</h2>
            <button onClick={() => setIsAdminLoggedIn(false)} className="text-red-500 font-bold">خروج</button>
          </div>
          {pendingAds.map((ad) => (
            <div key={ad.id} className="bg-white border-2 border-orange-100 rounded-2xl p-4 mb-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">{ad.model} - {ad.price} ج.س</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500">المنتج</p>
                  <img src={ad.image} className="w-full h-20 object-cover rounded-md cursor-pointer border" onClick={() => window.open(ad.image)} alt="product" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500">الهوية</p>
                  <img src={ad.verification.idCard} className="w-full h-20 object-cover rounded-md cursor-pointer border" onClick={() => window.open(ad.verification.idCard)} alt="id" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500">السيلفي</p>
                  <img src={ad.verification.selfie} className="w-full h-20 object-cover rounded-md cursor-pointer border" onClick={() => window.open(ad.verification.selfie)} alt="selfie" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleVerifyAd(ad.id, true)} className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-1">
                  <CheckCircle size={16} /> قبول
                </button>
                <button onClick={() => handleVerifyAd(ad.id, false)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl font-bold border border-red-100 flex items-center justify-center gap-1">
                  <X size={16} /> رفض
                </button>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* مودال إضافة إعلان */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 my-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">إضافة إعلان جديد موثق</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSaveAd} className="space-y-4">
              <input 
                type="text" placeholder="نوع الجهاز (مثال: iPhone 13)" required 
                className="w-full p-3 border rounded-xl"
                value={newAd.model} onChange={(e) => setNewAd({...newAd, model: e.target.value})}
              />
              <input 
                type="number" placeholder="السعر" required 
                className="w-full p-3 border rounded-xl"
                value={newAd.price} onChange={(e) => setNewAd({...newAd, price: e.target.value})}
              />
              
              <div className="grid grid-cols-1 gap-3">
                <label className="border-2 border-dashed rounded-xl p-3 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                  <ImageIcon className="text-gray-400" />
                  <span className="text-sm mt-1">{newAd.image ? "تم اختيار صورة المنتج" : "اختر صورة المنتج"}</span>
                  <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'product')} />
                </label>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700 font-bold mb-2 text-center">متطلبات الأمان للتوثيق</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="bg-white p-2 rounded-lg border text-center cursor-pointer text-[10px]">
                      {idCardImage ? "✅ الهوية" : "📷 صورة الهوية"}
                      <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'id')} />
                    </label>
                    <label className="bg-white p-2 rounded-lg border text-center cursor-pointer text-[10px]">
                      {selfieImage ? "✅ السيلفي" : "📷 سيلفي مع الهوية"}
                      <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'selfie')} />
                    </label>
                  </div>
                </div>
              </div>

              <button 
                disabled={isUploading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {isUploading ? <Loader2 className="animate-spin" size={20} /> : "إرسال للمراجعة"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* مودال دخول المدير */}
      {isAdminMode && !isAdminLoggedIn && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4">
          <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-red-600"><Lock size={18}/> دخول الإدارة</h2>
            <input 
              type="password" 
              placeholder="كلمة السر" 
              className="w-full p-3 border rounded-xl mb-4"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-gray-800 text-white py-2 rounded-xl font-bold">دخول</button>
              <button type="button" onClick={() => setIsAdminMode(false)} className="flex-1 bg-gray-100 py-2 rounded-xl">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
