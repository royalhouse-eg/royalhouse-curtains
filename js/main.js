// ===== WhatsApp Number (مرة واحدة فقط) =====
const WHATSAPP_NUMBER = "201061533348";

// =========================
// WhatsApp Order Form (عام)
// =========================
const orderForm = document.getElementById("orderForm");
if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const width = document.getElementById("width").value.trim();
    const height = document.getElementById("height").value.trim();
    const type = document.getElementById("type").value.trim();
    const notes = document.getElementById("notes").value.trim();

    const msg =
`طلب جديد - ROYAL HOUSE
التصنيف: ${catToArabic(type)}

الاسم: ${name}
الموبايل: ${phone}
العرض: ${width} سم
الارتفاع: ${height} سم
ملاحظات: ${notes || "—"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

// =========================
// Gallery Auto (Loop بالأرقام)
// =========================
const galleryGrid = document.getElementById("galleryGrid");

const GALLERY_COUNTS = {
  classic: 50,
  modern: 50,
  accessories: 20,
  blackout: 20,
  roller: 20
};

function buildGallery() {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  const order = ["classic", "modern", "accessories", "blackout", "roller"];

  for (const cat of order) {
    const count = GALLERY_COUNTS[cat];

    for (let i = 1; i <= count; i++) {
      const fig = document.createElement("figure");
      fig.className = "g-item";
      fig.dataset.cat = cat;

      const img = document.createElement("img");
      img.src = `images/${cat}/${i}.jpg`;
      img.alt = cat;
      img.loading = "lazy";

      // لو الصورة مش موجودة: نشيل العنصر كله
      img.onerror = () => fig.remove();

      // زر "اطلب" على كل صورة
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "order-btn";
      btn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> اطلب`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // يمنع فتح اللايتبوكس
        openOrderModal(cat, img.src);
      });

      fig.appendChild(img);
      fig.appendChild(btn);
      galleryGrid.appendChild(fig);
    }
  }

  // نخفي كل الصور عند تحميل الصفحة (مش هتظهر إلا بعد اختيار تصنيف)
  document.querySelectorAll(".g-item").forEach(item => item.classList.add("hidden"));

  initFiltersToggle();
  initLightbox();
}

buildGallery();

// =========================
// Filters (Toggle)
// - تضغط تصنيف: يفتح
// - تضغط نفس التصنيف: يقفل
// =========================
function initFiltersToggle() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".g-item");

  let activeFilter = null;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // لو ضغط نفس التصنيف المفتوح -> اقفل
      if (activeFilter === filter) {
        activeFilter = null;
        filterBtns.forEach(b => b.classList.remove("active"));
        galleryItems.forEach(item => item.classList.add("hidden"));
        return;
      }

      // افتح التصنيف الجديد
      activeFilter = filter;
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach(item => {
        const cat = item.dataset.cat;
        if (filter === "all" || cat === filter) item.classList.remove("hidden");
        else item.classList.add("hidden");
      });
    });
  });
}

// =========================
// Lightbox (يفتح عند الضغط على الصورة فقط)
// =========================
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let visibleImages = [];
  let currentIndex = 0;

  function refreshVisibleImages() {
    visibleImages = Array.from(document.querySelectorAll(".g-item:not(.hidden) img"));
  }

  function openLightboxByIndex(idx) {
    refreshVisibleImages();
    if (!visibleImages.length) return;

    currentIndex = Math.max(0, Math.min(idx, visibleImages.length - 1));
    lbImg.src = visibleImages[currentIndex].src;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lbImg.src = "";
  }

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".g-item img");
    if (img) {
      refreshVisibleImages();
      const idx = visibleImages.findIndex(x => x.src === img.src);
      openLightboxByIndex(idx >= 0 ? idx : 0);
    }
  });

  lbClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function nextImg() {
    refreshVisibleImages();
    if (!visibleImages.length) return;
    currentIndex = (currentIndex + 1) % visibleImages.length;
    lbImg.src = visibleImages[currentIndex].src;
  }

  function prevImg() {
    refreshVisibleImages();
    if (!visibleImages.length) return;
    currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    lbImg.src = visibleImages[currentIndex].src;
  }

  lbNext?.addEventListener("click", nextImg);
  lbPrev?.addEventListener("click", prevImg);

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") nextImg();
    if (e.key === "ArrowRight") prevImg();
  });
}

// =========================
// Order from image (Modal)
// =========================
const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderImg = document.getElementById("orderImg");
const orderImgLabel = document.getElementById("orderImgLabel");
const orderModalForm = document.getElementById("orderModalForm");

let selectedImageSrc = "";
let selectedCat = "";

function catToArabic(cat){
  return ({
    classic: "كلاسيك",
    modern: "مودرن",
    accessories: "اكسسوارات",
    blackout: "بلاك اوت / كتان",
    roller: "رول / بلاك / زبرا"
  })[cat] || cat;
}

function openOrderModal(cat, imgSrc){
  selectedCat = cat;
  selectedImageSrc = imgSrc;

  orderImg.src = imgSrc;
  orderImgLabel.textContent = `التصنيف: ${catToArabic(cat)}`;
  document.getElementById("mType").value = cat;

  orderModal.classList.add("open");
  orderModal.setAttribute("aria-hidden", "false");
}

function closeOrderModal(){
  orderModal.classList.remove("open");
  orderModal.setAttribute("aria-hidden", "true");
}

orderClose?.addEventListener("click", closeOrderModal);
orderModal?.addEventListener("click", (e) => {
  if (e.target === orderModal) closeOrderModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && orderModal.classList.contains("open")) closeOrderModal();
});

orderModalForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("mName").value.trim();
  const phone = document.getElementById("mPhone").value.trim();
  const width = document.getElementById("mWidth").value.trim();
  const height = document.getElementById("mHeight").value.trim();
  const type = document.getElementById("mType").value.trim();
  const notes = document.getElementById("mNotes").value.trim();

  const msg =
`طلب من المعرض - ROYAL HOUSE
التصنيف: ${catToArabic(type)}
الصورة: ${selectedImageSrc}

الاسم: ${name}
الموبايل: ${phone}
العرض: ${width} سم
الارتفاع: ${height} سم
ملاحظات: ${notes || "—"}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});

// =========================
// Mobile Menu Toggle (Header)
// =========================
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav");

if (menuToggle && navMenu) {
  // فتح/قفل المنيو
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  // يقفل المنيو لما تدوس على لينك
  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });

  // يقفل المنيو لو ضغطت برا الهيدر
  document.addEventListener("click", (e) => {
    const clickedInsideHeader = e.target.closest(".header");
    if (!clickedInsideHeader) {
      navMenu.classList.remove("open");
    }
  });
}
