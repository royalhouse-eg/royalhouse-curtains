// =====================================================
// CONFIG
// =====================================================
const WHATSAPP_NUMBER = "201061533348";

// عدد الصور اللي تتحمّل في أول مرة + كل مرة "تحميل المزيد"
const LOAD_STEP = 12;

// عدد الصور الموجود فعليًا في كل فولدر (عدّلهم حسب صورك)
const GALLERY_COUNTS = {
  classic: 50,
  modern: 50,
  accessories: 20,
  blackout: 20,
  roller: 20
};

// =====================================================
// HELPERS
// =====================================================
function catToArabic(cat){
  return ({
    classic: "كلاسيك",
    modern: "مودرن",
    accessories: "اكسسوارات",
    blackout: "بلاك اوت / كتان",
    roller: "رول / بلاك / زبرا"
  })[cat] || cat;
}

function safeGet(id){
  return document.getElementById(id);
}

// =====================================================
// ORDER FORM (General)
// =====================================================
const orderForm = safeGet("orderForm");
if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name   = safeGet("custName")?.value.trim();
    const phone  = safeGet("custPhone")?.value.trim();
    const width  = safeGet("width")?.value.trim();
    const height = safeGet("height")?.value.trim();
    const type   = safeGet("type")?.value.trim();
    const notes  = safeGet("notes")?.value.trim();

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

// =====================================================
// GALLERY (Load by category - batches)
// =====================================================
const galleryGrid = safeGet("galleryGrid");
let loadedCount = {};       // { classic: 12, modern: 24 ... }
let activeFilter = null;    // current opened category

function clearGalleryUI(){
  if (galleryGrid) galleryGrid.innerHTML = "";
  const moreBtn = safeGet("loadMoreBtn");
  if (moreBtn) moreBtn.remove();
}

function createGalleryItem(cat, i){
  const fig = document.createElement("figure");
  fig.className = "g-item";
  fig.dataset.cat = cat;

  const img = document.createElement("img");
  img.src = `images/${cat}/${i}.jpg`;
  img.alt = cat;
  img.loading = "lazy";
  img.decoding = "async";
  img.onerror = () => fig.remove();

  // زر "اطلب"
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "order-btn";
  btn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> اطلب`;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openOrderModal(cat, img.src);
  });

  fig.appendChild(img);
  fig.appendChild(btn);
  return fig;
}

function renderLoadMoreButton(cat){
  // شيل زر قديم لو موجود
  const old = safeGet("loadMoreBtn");
  if (old) old.remove();

  const total = GALLERY_COUNTS[cat] || 0;
  const current = loadedCount[cat] || 0;

  if (current >= total) return;

  const btn = document.createElement("button");
  btn.id = "loadMoreBtn";
  btn.type = "button";
  btn.className = "btn-block";
  btn.textContent = "تحميل المزيد";
  btn.style.margin = "18px auto 0";
  btn.style.display = "block";
  btn.addEventListener("click", () => loadMore(cat));

  // نحطه بعد الجاليري
  galleryGrid?.parentElement?.appendChild(btn);
}

function loadMore(cat, reset = false){
  if (!galleryGrid) return;

  if (reset) {
    clearGalleryUI();
    loadedCount[cat] = 0;
  }

  const total = GALLERY_COUNTS[cat] || 0;
  const start = loadedCount[cat] || 0;
  const end = Math.min(start + LOAD_STEP, total);

  // استخدم fragment للسرعة
  const frag = document.createDocumentFragment();
  for (let i = start + 1; i <= end; i++) {
    frag.appendChild(createGalleryItem(cat, i));
  }
  galleryGrid.appendChild(frag);

  loadedCount[cat] = end;
  renderLoadMoreButton(cat);
}

// =====================================================
// FILTERS (Toggle open / close)
// =====================================================
function initFiltersToggle(){
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (!filterBtns.length) return;

  // اضمن مفيش زر active أول ما الصفحة تفتح
  filterBtns.forEach(b => b.classList.remove("active"));

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // لو ضغط نفس التصنيف المفتوح -> اقفل
      if (activeFilter === filter) {
        activeFilter = null;
        filterBtns.forEach(b => b.classList.remove("active"));
        clearGalleryUI();
        btn.blur();
        return;
      }

      // افتح تصنيف جديد
      activeFilter = filter;
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      btn.blur();

      // ابني صور التصنيف على دفعات (أول دفعة)
      loadMore(filter, true);
    });
  });
}

// =====================================================
// LIGHTBOX (works with current loaded images only)
// =====================================================
function initLightbox(){
  const lightbox = safeGet("lightbox");
  const lbImg = safeGet("lbImg");
  const lbClose = safeGet("lbClose");
  const lbPrev = safeGet("lbPrev");
  const lbNext = safeGet("lbNext");

  if (!lightbox || !lbImg) return;

  let visible = [];
  let index = 0;

  const refresh = () => {
    visible = [...document.querySelectorAll(".g-item img")];
  };

  const open = (i) => {
    refresh();
    if (!visible.length) return;
    index = Math.max(0, Math.min(i, visible.length - 1));
    lbImg.src = visible[index].src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  };

  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lbImg.src = "";
  };

  // فتح اللايتبوكس عند الضغط على صورة داخل الجاليري
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".g-item img");
    if (!img) return;
    refresh();
    const idx = visible.findIndex(v => v.src === img.src);
    open(idx >= 0 ? idx : 0);
  });

  lbClose?.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  const next = () => {
    refresh();
    if (!visible.length) return;
    index = (index + 1) % visible.length;
    lbImg.src = visible[index].src;
  };

  const prev = () => {
    refresh();
    if (!visible.length) return;
    index = (index - 1 + visible.length) % visible.length;
    lbImg.src = visible[index].src;
  };

  lbNext?.addEventListener("click", next);
  lbPrev?.addEventListener("click", prev);

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") next();
    if (e.key === "ArrowRight") prev();
  });
}

// =====================================================
// ORDER MODAL (from image)
// =====================================================
const orderModal = safeGet("orderModal");
const orderClose = safeGet("orderClose");
const orderImg = safeGet("orderImg");
const orderImgLabel = safeGet("orderImgLabel");
const orderModalForm = safeGet("orderModalForm");

let selectedImageSrc = "";
let selectedCat = "";

function openOrderModal(cat, imgSrc){
  selectedCat = cat;
  selectedImageSrc = imgSrc;

  if (orderImg) orderImg.src = imgSrc;
  if (orderImgLabel) orderImgLabel.textContent = `التصنيف: ${catToArabic(cat)}`;

  const mType = safeGet("mType");
  if (mType) mType.value = cat;

  orderModal?.classList.add("open");
  orderModal?.setAttribute("aria-hidden", "false");
}

function closeOrderModal(){
  orderModal?.classList.remove("open");
  orderModal?.setAttribute("aria-hidden", "true");
}

orderClose?.addEventListener("click", closeOrderModal);
orderModal?.addEventListener("click", (e) => {
  if (e.target === orderModal) closeOrderModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && orderModal?.classList.contains("open")) closeOrderModal();
});

orderModalForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = safeGet("mName")?.value.trim();
  const phone = safeGet("mPhone")?.value.trim();
  const width = safeGet("mWidth")?.value.trim();
  const height = safeGet("mHeight")?.value.trim();
  const type = safeGet("mType")?.value.trim();
  const notes = safeGet("mNotes")?.value.trim();

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

// =====================================================
// MOBILE MENU (Header)
// =====================================================
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });

  document.addEventListener("click", (e) => {
    const clickedInsideHeader = e.target.closest(".header");
    if (!clickedInsideHeader) navMenu.classList.remove("open");
  });
}

// =====================================================
// HEADER SHRINK (ONE - reliable)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("shrink", window.scrollY > 60);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

// =====================================================
// INIT
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  initFiltersToggle();
  initLightbox();
  clearGalleryUI(); // يبدأ فاضي (مفيش تصنيف مفتوح)
});
