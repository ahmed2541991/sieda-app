// 1. قاعدة بيانات تجريبية (محاكاة للجداول)
let products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        category: "موبايل",
        price: "850,000",
        condition: "جديد",
        verified: true,
        image: "https://via.placeholder.com/300x300.png?text=iPhone+15"
    },
    {
        id: 2,
        name: "شاشة سامسونج 55 بوصة",
        category: "أجهزة كهربائية",
        price: "420,000",
        condition: "مستعمل نظيف",
        verified: false,
        image: "https://via.placeholder.com/300x300.png?text=Smart+TV"
    }
];

// 2. وظيفة عرض المنتجات في الصفحة
function displayProducts(items) {
    const productContainer = document.querySelector('.row.g-4');
    productContainer.innerHTML = ''; // مسح المحتوى القديم

    items.forEach(product => {
        const productHtml = `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card card-product h-100">
                    <img src="${product.image}" class="card-img-top p-3" alt="${product.name}">
                    <div class="card-body">
                        ${product.verified ? '<span class="badge badge-verified mb-2">بائع موثوق ✓</span>' : ''}
                        <h6 class="card-title">${product.name}</h6>
                        <p class="text-muted small">الحالة: ${product.condition}</p>
                        <p class="price-tag">${product.price} ج.س</p>
                        <button class="btn btn-sm btn-dark w-100" onclick="viewDetails(${product.id})">تفاصيل المنتج</button>
                    </div>
                </div>
            </div>
        `;
        productContainer.insertAdjacentHTML('beforeend', productHtml);
    });
}

// 3. وظيفة معالجة فيديو التوثيق
function handleVerification() {
    const videoInput = document.querySelector('input[type="file"]');
    if (videoInput.files.length > 0) {
        const file = videoInput.files[0];
        // محاكاة عملية الرفع
        alert("جاري رفع فيديو التوثيق (مدته: " + file.name + "). سيتم مراجعته من قبل الإدارة.");
        
        // إغلاق النافذة المنبثقة بعد الرفع
        const modal = bootstrap.Modal.getInstance(document.getElementById('verifyModal'));
        modal.hide();
    } else {
        alert("يرجى اختيار فيديو أولاً.");
    }
}

// 4. وظيفة البحث عن الأجهزة
function searchProducts() {
    const searchTerm = document.querySelector('input[type="text"]').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
}

// 5. ربط الأزرار بالوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // عرض المنتجات الأولية
    displayProducts(products);

    // ربط زر البحث
    const searchBtn = document.querySelector('.btn-primary');
    searchBtn.addEventListener('click', searchProducts);

    // ربط زر إرسال التوثيق
    const verifyBtn = document.querySelector('.btn-verify');
    verifyBtn.addEventListener('click', handleVerification);
});

// وظيفة تفاصيل المنتج (محاكاة)
function viewDetails(id) {
    const product = products.find(p => p.id === id);
    alert("تفاصيل الجهاز: " + product.name + "\nالسعر: " + product.price + " ج.س");
}
