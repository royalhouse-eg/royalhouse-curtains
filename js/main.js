// =====================================================
// CONFIG
// =====================================================
const WHATSAPP_NUMBER = "201061533348";

// =====================================================
// ORDER FORM (General)
// =====================================================
const orderForm = document.getElementById("orderForm");

if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name   = document.getElementById("custName").value.trim();
    const phone  = document.getElementById("custPhone").value.trim();
    const width  = document.getElementById("width").value.trim();
    const height = document.getElementById("height").value.trim();
    const type   = document.getElementById("type").value.trim();
    const notes  = document.getElementById("notes").value.trim();

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
// GALLERY BUILD (Auto Images)
// =====================================================
const galleryGrid = document.getElementById("galleryGrid");

const GALLERY_COUNTS = {
  classic: 30,
  modern: 25,
  accessories: 12,
  blackout: 1,
  roller: 6
};

function buildGallery() {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  const order = ["classic", "modern", "accessories", "blackout", "roller"];

  order.forEach(cat => {
    const count = GALLERY_COUNTS[cat];

    for (let i = 1; i <= count; i++) {
      const fig = document.createElement("figure");
      fig.className = "g-item hidden";
      fig.dataset.cat = cat;

      const img = document.createElement("img");
      img.src = `images/${cat}/${i}.jpg`;
      img.alt = cat;
      img.loading = "lazy";
      img.onerror = () => fig.remove();

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
      galleryGrid.appendChild(fig);
    }
  });

  initFilters();
  initLightbox();

  // تأكيد مفيش زر واخد focus
  document.querySelectorAll(".filter-btn").forEach(b => b.blur());
}

buildGallery();

// =====================================================
// FILTERS (Toggle open / close)
// =====================================================
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".g-item");

  let activeFilter = null;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // اقفل لو نفس التصنيف
      if (activeFilter === filter) {
        activeFilter = null;
        filterBtns.forEach(b => b.classList.remove("active"));
        items.forEach(i => i.classList.add("hidden"));
        btn.blur();
        return;
      }

      // افتح تصنيف جديد
      activeFilter = filter;
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      items.forEach(item => {
        item.classList.toggle(
          "hidden",
          item.dataset.cat !== filter
        );
      });

      btn.blur();
    });
  });
}

// =====================================================
// LIGHTBOX
// =====================================================
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let visible = [];
  let index = 0;

  const refresh = () => {
    visible = [...document.querySelectorAll(".g-item:not(.hidden) img")];
  };

  const open = (i) => {
    refresh();
    if (!visible.length) return;
    index = i;
    lbImg.src = visible[index].src;
    lightbox.classList.add("open");
  };

  const close = () => {
    lightbox.classList.remove("open");
    lbImg.src = "";
  };

  document.addEventListener("click", e => {
    const img = e.target.closest(".g-item img");
    if (!img) return;
    refresh();
    open(visible.findIndex(v => v.src === img.src));
  });

  lbClose?.addEventListener("click", close);
  lightbox?.addEventListener("click", e => e.target === lightbox && close());

  lbNext?.addEventListener("click", () => {
    index = (index + 1) % visible.length;
    lbImg.src = visible[index].src;
  });

  lbPrev?.addEventListener("click", () => {
    index = (index - 1 + visible.length) % visible.length;
    lbImg.src = visible[index].src;
  });
}

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

function catToArabic(cat){
  return {
    classic:"كلاسيك",
    modern:"مودرن",
    accessories:"اكسسوارات",
    blackout:"بلاك اوت / كتان",
    roller:"رول / بلاك / زبرا"
  }[cat] || cat;
}

function openOrderModal(cat, img){
  selectedCat = cat;
  selectedImg = img;

  orderImg.src = img;
  orderImgLabel.textContent = `التصنيف: ${catToArabic(cat)}`;
  document.getElementById("mType").value = cat;

  orderModal.classList.add("open");
}

orderClose?.addEventListener("click", () => orderModal.classList.remove("open"));
orderModal?.addEventListener("click", e => e.target === orderModal && orderModal.classList.remove("open"));

orderModalForm?.addEventListener("submit", e => {
  e.preventDefault();

  const msg =
`طلب من المعرض - ROYAL HOUSE
التصنيف: ${catToArabic(selectedCat)}
الصورة: ${selectedImg}

الاسم: ${mName.value}
الموبايل: ${mPhone.value}
العرض: ${mWidth.value} سم
الارتفاع: ${mHeight.value} سم
ملاحظات: ${mNotes.value || "—"}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
});

// =====================================================
// MOBILE MENU
// =====================================================
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => navMenu.classList.toggle("open"));
navMenu?.querySelectorAll("a").forEach(a =>
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
  window.addEventListener("scroll", onScroll, { passive:true });
});

// ===== Android Keyboard / VisualViewport fix for modal height =====
(function () {
  const setVVH = () => {
    const vv = window.visualViewport;
    const h = vv ? vv.height : window.innerHeight;
    document.documentElement.style.setProperty("--vvh", h + "px");
  };

  setVVH();
  window.addEventListener("resize", setVVH);
  window.visualViewport?.addEventListener("resize", setVVH);
})();
