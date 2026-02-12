// =====================================================
// CONFIG
// =====================================================
const WHATSAPP_NUMBER = "201061533348";

// =====================================================
// HELPERS
// =====================================================
function catToArabic(cat) {
  return {
    classic: "كلاسيك",
    modern: "مودرن",
    accessories: "اكسسوارات",
    blackout: "بلاك اوت / كتان",
    roller: "رول / بلاك / زبرا",
  }[cat] || cat;
}

// =====================================================
// ORDER FORM (General)
// =====================================================
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

    const msg = `طلب جديد - ROYAL HOUSE
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
// GALLERY (Build only selected category) ✅
// =====================================================
const galleryGrid = document.getElementById("galleryGrid");

const GALLERY_COUNTS = {
  classic: 50,
  modern: 50,
  accessories: 20,
  blackout: 20,
  roller: 20,
};

let activeFilter = null;

function buildGalleryFor(filter) {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = ""; // امسح القديم (يخفف جدًا)

  const count = GALLERY_COUNTS[filter];
  if (!count) return;

  for (let i = 1; i <= count; i++) {
    const fig = document.createElement("figure");
    fig.className = "g-item";
    fig.dataset.cat = filter;

    const img = document.createElement("img");
    img.src = `images/${filter}/${i}.jpg`;
    img.alt = filter;
    img.loading = "lazy";
    img.onerror = () => fig.remove();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "order-btn";
    btn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> اطلب`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openOrderModal(filter, img.src);
    });

    fig.appendChild(img);
    fig.appendChild(btn);
    galleryGrid.appendChild(fig);
  }
}

// =====================================================
// FILTERS (Toggle open / close)
// =====================================================
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (!filterBtns.length) return;

  // مهم: أول ما الصفحة تفتح مفيش active نهائي
  filterBtns.forEach((b) => b.classList.remove("active"));

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // اقفل لو نفس التصنيف
      if (activeFilter === filter) {
        activeFilter = null;
        filterBtns.forEach((b) => b.classList.remove("active"));
        if (galleryGrid) galleryGrid.innerHTML = ""; // امسح الصور بدل اخفائها
        btn.blur();
        return;
      }

      // افتح تصنيف جديد
      activeFilter = filter;
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      buildGalleryFor(filter);

      btn.blur();
    });
  });
}

initFilters();

// =====================================================
// LIGHTBOX (init once) ✅
// =====================================================
let lightboxInited = false;

function initLightbox() {
  if (lightboxInited) return; // يمنع تكرار listeners
  lightboxInited = true;

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let visible = [];
  let index = 0;

  const refresh = () => {
    visible = [...document.querySelectorAll(".g-item img")]; // الموجود حاليًا بس
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

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".g-item img");
    if (!img) return;
    refresh();
    open(visible.findIndex((v) => v.src === img.src));
  });

  lbClose?.addEventListener("click", close);
  lightbox?.addEventListener("click", (e) => e.target === lightbox && close());

  lbNext?.addEventListener("click", () => {
    refresh();
    if (!visible.length) return;
    index = (index + 1) % visible.length;
    lbImg.src = visible[index].src;
  });

  lbPrev?.addEventListener("click", () => {
    refresh();
    if (!visible.length) return;
    index = (index - 1 + visible.length) % visible.length;
    lbImg.src = visible[index].src;
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") lbNext?.click();
    if (e.key === "ArrowRight") lbPrev?.click();
  });
}

initLightbox();

// =====================================================
// ORDER MODAL
// =====================================================
const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderImg = document.getElementById("orderImg");
const orderImgLabel = document.getElementById("orderImgLabel");
const orderModalForm = document.getElementById("orderModalForm");

let selectedImg = "";
let selectedCat = "";

function openOrderModal(cat, img) {
  selectedCat = cat;
  selectedImg = img;

  if (orderImg) orderImg.src = img;
  if (orderImgLabel) orderImgLabel.textContent = `التصنيف: ${catToArabic(cat)}`;

  const mType = document.getElementById("mType");
  if (mType) mType.value = cat;

  orderModal?.classList.add("open");
  orderModal?.setAttribute("aria-hidden", "false");
}

function closeOrderModal() {
  orderModal?.classList.remove("open");
  orderModal?.setAttribute("aria-hidden", "true");
}

orderClose?.addEventListener("click", closeOrderModal);
orderModal?.addEventListener("click", (e) => e.target === orderModal && closeOrderModal());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && orderModal?.classList.contains("open")) closeOrderModal();
});

orderModalForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const mName = document.getElementById("mName").value.trim();
  const mPhone = document.getElementById("mPhone").value.trim();
  const mWidth = document.getElementById("mWidth").value.trim();
  const mHeight = document.getElementById("mHeight").value.trim();
  const mNotes = document.getElementById("mNotes").value.trim();

  const msg = `طلب من المعرض - ROYAL HOUSE
التصنيف: ${catToArabic(selectedCat)}
الصورة: ${selectedImg}

الاسم: ${mName}
الموبايل: ${mPhone}
العرض: ${mWidth} سم
الارتفاع: ${mHeight} سم
ملاحظات: ${mNotes || "—"}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
});

// =====================================================
// MOBILE MENU
// =====================================================
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => navMenu?.classList.toggle("open"));
navMenu?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navMenu.classList.remove("open"))
);

// =====================================================
// HEADER SHRINK (FINAL)
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
