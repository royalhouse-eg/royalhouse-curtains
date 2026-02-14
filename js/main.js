// ================= CONFIG =================
const WHATSAPP_NUMBER = "201061533348";

const GALLERY_COUNTS = {
  classic: 50,
  modern: 50,
  accessories: 20,
  blackout: 20,
  roller: 20
};

const CATEGORY_ORDER = ["classic", "modern", "accessories", "blackout", "roller"];

// ================= HELPERS =================
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return document.querySelectorAll(sel); }

function catToArabic(cat){
  return ({
    classic:"كلاسيك",
    modern:"مودرن",
    accessories:"اكسسوارات",
    blackout:"بلاك اوت / كتان",
    roller:"رول / بلاك / زبرا"
  })[cat] || cat;
}


// ================= MOBILE MENU =================
const menuToggle = qs(".menu-toggle");
const navMenu = qs(".nav");

menuToggle?.addEventListener("click", () => {
  navMenu?.classList.toggle("open");
});
qsa(".nav a").forEach(link=>{
  link.addEventListener("click",()=> navMenu?.classList.remove("open"));
});

// ================= BUILD GALLERY (AUTO) =================
function buildGallery(){
  const grid = qs("#galleryGrid");
  if(!grid) return;

  grid.innerHTML = "";
  const frag = document.createDocumentFragment();

  for(const cat of CATEGORY_ORDER){
    const count = GALLERY_COUNTS[cat] || 0;

    for(let i=1; i<=count; i++){
      const fig = document.createElement("figure");
      fig.className = "g-item hidden";   // يبدأ مخفي
      fig.dataset.cat = cat;

      const img = document.createElement("img");
      img.src = `images/${cat}/${i}.jpg`;
      img.alt = catToArabic(cat);
      img.loading = "lazy";
      img.decoding = "async";

      // لو الصورة مش موجودة: احذف العنصر
      img.onerror = () => fig.remove();

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "order-btn";
      btn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> اطلب`;

      fig.appendChild(img);
      fig.appendChild(btn);

      frag.appendChild(fig);
    }
  }

  grid.appendChild(frag);
}

// ================= FILTERS (OPEN/CLOSE) =================
function initFilters(){
  const buttons = qsa(".filter-btn");
  const items = qsa(".g-item");
  let active = null;

  // مهم: أول ما الصفحة تفتح مفيش Active
  buttons.forEach(b => b.classList.remove("active"));

  buttons.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const cat = btn.dataset.filter;

      // اقفل لو نفس التصنيف
      if(active === cat){
        active = null;
        buttons.forEach(b=>b.classList.remove("active"));
        items.forEach(i=>i.classList.add("hidden"));
        btn.blur();
        return;
      }

      // افتح تصنيف
      active = cat;
      buttons.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      items.forEach(item=>{
        item.classList.toggle("hidden", item.dataset.cat !== cat);
      });

      btn.blur();
    });
  });
}

// ================= LIGHTBOX =================
function initLightbox(){
  const lightbox = qs("#lightbox");
  const lbImg = qs("#lbImg");
  const lbClose = qs("#lbClose");
  const lbPrev = qs("#lbPrev");
  const lbNext = qs("#lbNext");
  if(!lightbox || !lbImg) return;

  let images = [];
  let index = 0;

  function refresh(){
    images = [...qsa(".g-item:not(.hidden) img")];
  }

  function open(i){
    refresh();
    if(!images.length) return;
    index = Math.max(0, Math.min(i, images.length-1));
    lbImg.src = images[index].src;
    lightbox.classList.add("open");
  }

  function close(){
    lightbox.classList.remove("open");
    lbImg.src = "";
  }

  document.addEventListener("click",(e)=>{
    // افتح فقط لو ضغط على صورة
    const img = e.target.closest(".g-item img");
    if(!img) return;

    refresh();
    const i = images.findIndex(im=>im.src===img.src);
    open(i >= 0 ? i : 0);
  });

  lbClose?.addEventListener("click", close);
  lightbox.addEventListener("click",(e)=>{
    if(e.target === lightbox) close();
  });

  lbNext?.addEventListener("click",()=>{
    refresh();
    if(!images.length) return;
    index = (index+1) % images.length;
    lbImg.src = images[index].src;
  });

  lbPrev?.addEventListener("click",()=>{
    refresh();
    if(!images.length) return;
    index = (index-1+images.length)%images.length;
    lbImg.src = images[index].src;
  });

  document.addEventListener("keydown",(e)=>{
    if(!lightbox.classList.contains("open")) return;
    if(e.key==="Escape") close();
    if(e.key==="ArrowLeft") lbNext?.click();
    if(e.key==="ArrowRight") lbPrev?.click();
  });
}

// ================= GENERAL ORDER FORM =================
const orderForm = qs("#orderForm");
orderForm?.addEventListener("submit",(e)=>{
  e.preventDefault();

  const name   = qs("#custName")?.value.trim();
  const phone  = qs("#custPhone")?.value.trim();
  const width  = qs("#width")?.value.trim();
  const height = qs("#height")?.value.trim();
  const type   = qs("#type")?.value.trim();
  const notes  = qs("#notes")?.value.trim();

  const msg =
`طلب جديد - ROYAL HOUSE
التصنيف: ${catToArabic(type)}

الاسم: ${name}
الموبايل: ${phone}
العرض: ${width} سم
الارتفاع: ${height} سم
ملاحظات: ${notes || "—"}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
});

// ================= IMAGE ORDER MODAL =================
const orderModal = qs("#orderModal");
const orderClose = qs("#orderClose");
const orderImg = qs("#orderImg");
const orderImgLabel = qs("#orderImgLabel");
const orderModalForm = qs("#orderModalForm");

let selectedCat = "";
let selectedImg = "";

function openOrderModal(cat, imgSrc){
  selectedCat = cat;
  selectedImg = imgSrc;

  orderImg.src = imgSrc;
  orderImgLabel.textContent = `التصنيف: ${catToArabic(cat)}`;
  qs("#mType").value = cat;

  orderModal.classList.add("open");
}

function closeOrderModal(){
  orderModal.classList.remove("open");
}

orderClose?.addEventListener("click",closeOrderModal);
orderModal?.addEventListener("click",(e)=>{
  if(e.target === orderModal) closeOrderModal();
});

// زر اطلب (delegation) — مهم: يمنع فتح اللايتبوكس
document.addEventListener("click",(e)=>{
  const btn = e.target.closest(".order-btn");
  if(!btn) return;
  e.stopPropagation();

  const fig = btn.closest(".g-item");
  const cat = fig?.dataset.cat;
  const img = fig?.querySelector("img")?.src;
  if(!cat || !img) return;

  openOrderModal(cat, img);
});

orderModalForm?.addEventListener("submit",(e)=>{
  e.preventDefault();

  const name   = qs("#mName")?.value.trim();
  const phone  = qs("#mPhone")?.value.trim();
  const width  = qs("#mWidth")?.value.trim();
  const height = qs("#mHeight")?.value.trim();
  const type   = qs("#mType")?.value.trim();
  const notes  = qs("#mNotes")?.value.trim();

  const msg =
`طلب من المعرض - ROYAL HOUSE
التصنيف: ${catToArabic(type)}
الصورة: ${selectedImg}

الاسم: ${name}
الموبايل: ${phone}
العرض: ${width} سم
الارتفاع: ${height} سم
ملاحظات: ${notes || "—"}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
});

// ================= INIT =================
document.addEventListener("DOMContentLoaded",()=>{
  buildGallery();   // ✅ يبني الصور
  initFilters();    // ✅ الفلاتر
  initLightbox();   // ✅ لايت بوكس
});

