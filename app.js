// لا توجد رسائل alert هنا لكي يفتح التطبيق مباشرة
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("mainBtn");
    if (btn) {
        btn.addEventListener("click", function() {
            alert("رائع! الزر يعمل والتطبيق أصبح سريعاً.");
        });
    }
    console.log("التطبيق جاهز!");
});
