// 1. البيانات
let products = [
    { id: 1, name: "iPhone 15 Pro Max", category: "موبايل", price: 850000, condition: "جديد", verified: true, image: "https://via.placeholder.com/300" },
    { id: 2, name: "شاشة سامسونج 55 بوصة", category: "أجهزة", price: 420000, condition: "مستعمل", verified: false, image: "https://via.placeholder.com/300" }
];

// 2. العرض المحسن
function displayProducts(items) {
    const productContainer = document.querySelector('.row.g-4');
    if (!productContainer) return; // حماية من خطأ 500 إذا لم يجد الحاوية

    productContainer.innerHTML = items.map(product => `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="card h-100 border-0 shadow-sm">
                <img src="${product.image}" class="card-img-top p-2" alt="${product.name}">
                <div class="card-body p-2">
                    ${product.verified ? '<small class="text-primary d-block mb-1">✓ بائع موثوق</small>' : ''}
                    <h6 class="card-title h6 small">${product.name}</h6>
                    <p class="price-tag fw-bold text-success mb-2">${product.price.toLocaleString()} ج.س</p>
                    <button class="btn btn-sm btn-outline-dark w-100" onclick="viewDetails(${product.id})">التفاصيل</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. البحث
function searchProducts() {
    const term = document.querySelector('input[type="text"]')?.value.toLowerCase() || "";
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    displayProducts(filtered);
}

// 4. التشغيل عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    
    // ربط الأزرار مع حماية إذا لم تكن موجودة في صفحة معينة
    document.querySelector('.btn-primary')?.addEventListener('click', searchProducts);
    document.querySelector('.btn-verify')?.addEventListener('click', handleVerification);
});

function viewDetails(id) {
    const p = products.find(x => x.id === id);
    if(p) alert(`جهاز: ${p.name}\nالسعر: ${p.price.toLocaleString()} ج.س`);
}
