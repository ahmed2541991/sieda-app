import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, where, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { ShieldCheck, Plus, Loader2, Send, MessageCircle, X, User, Trash2, Camera } from 'lucide-react';

// --- إعدادات Firebase الخاصة بك ---
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "sieda-app.firebaseapp.com",
  projectId: "sieda-app",
  storageBucket: "sieda-app.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function SiedaApp() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newAd, setNewAd] = useState({ model: '', price: '', image: '' });
  
  const scrollRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPhones(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    const q = query(collection(db, "messages"), where("adId", "==", activeChat.id), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [activeChat]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAd({ ...newAd, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAd = async (e) => {
    e.preventDefault();
    if (!newAd.image) return alert("الرجاء اختيار صورة");
    await addDoc(collection(db, "ads"), {
      ...newAd,
      price: Number(newAd.price),
      createdAt: serverTimestamp()
    });
    setIsModalOpen(false);
    setNewAd({ model: '', price: '', image: '' });
  };

  const handleDeleteAd = async (adId, e) => {
    e.stopPropagation();
    if(window.confirm("حذف هذا المنتج؟")) {
      await deleteDoc(doc(db, "ads", adId));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      adId: activeChat.id,
      createdAt: serverTimestamp(),
      senderName: "زائر"
    });
    setNewMessage("");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-right pb-10">
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={24} />
          <h1 className="text-lg font-bold text-gray-800">أعمال أبو كمال</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-md">
          <Plus size={18} /> <span>إضافة</span>
        </button>
      </nav>

      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <div className="flex justify-center py-20 w-full"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
        ) : (
          phones.map((phone) => (
            <div key={phone.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group">
              <button onClick={(e) => handleDeleteAd(phone.id, e)} className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full">
                <Trash2 size={14} />
              </button>
              <img src={phone.image} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-gray-800">{phone.model}</h3>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-blue-600 font-bold">{phone.price} ج.س</span>
                  <button onClick={() => setActiveChat(phone)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-bold">
                    <MessageCircle size={16} /> <span>دردشة</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-center">إضافة هاتف</h2>
            <form onSubmit={handleSaveAd} className="space-y-4">
              <div className="relative border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                {newAd.image ? <img src={newAd.image} className="w-full h-full object-cover" /> : <Camera className="text-gray-400" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <input required placeholder="اسم الموديل" className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none" value={newAd.model} onChange={(e) => setNewAd({...newAd, model: e.target.value})} />
              <input required type="number" placeholder="السعر" className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none" value={newAd.price} onChange={(e) => setNewAd({...newAd, price: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">حفظ</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-gray-400 mt-2 text-sm">إلغاء</button>
            </form>
          </div>
        </div>
      )}

      {activeChat && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center shadow-sm">
            <span className="font-bold">{activeChat.model}</span>
            <button onClick={() => setActiveChat(null)} className="p-2"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm">{msg.text}</div>
            ))}
            <div ref={scrollRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2 mb-4">
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="اكتب رسالة..." className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none" />
            <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl"><Send size={20} /></button>
          </form>
        </div>
      )}
    </div>
  );
}
