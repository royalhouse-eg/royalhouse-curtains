:root{
  --bg:#ffffff;
  --text:#111;
  --muted:#6b6b6b;
  --line:#e7e7e7;
  --btn:#111;
  --btnText:#fff;
  --max:1100px;
}

*{box-sizing:border-box}
html{scroll-behavior:smooth}
html, body{width:100%; overflow-x:hidden}

body{
  margin:0;
  font-family:"Tajawal", system-ui, -apple-system, Segoe UI, Arial;
  background:var(--bg);
  color:var(--text);
}

img, iframe{max-width:100%; display:block}

.container{
  width:min(var(--max), calc(100% - 32px));
  margin-inline:auto;
}

a{color:inherit; text-decoration:none}
.muted{color:var(--muted); margin:0}
.hidden{display:none !important}

/* ================= Header (always mobile-like) ================= */
.header{
  --padY: 12px;
  --logoH: 56px;

  position:sticky;
  top:0;
  z-index:999;

  background:rgba(255,255,255,.92);
  backdrop-filter: blur(8px);
  border-bottom:1px solid var(--line);

  transition: background .25s ease, box-shadow .25s ease;
}

.header.shrink{
  --padY: 6px;
  --logoH: 42px;

  background:rgba(255,255,255,.97);
  box-shadow:0 6px 18px rgba(0,0,0,.08);
}

.header .container{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding: var(--padY) 0;
}

.logo{
  height: var(--logoH);
  width:auto;
  object-fit:contain;
}

.nav{display:none;}
.menu-toggle{
  display:block;
  font-size:28px;
  cursor:pointer;
  user-select:none;
  line-height:1;
}

.social-icons{
  flex:1;
  display:flex;
  justify-content:center;
  gap:10px;
}
.social-icons a{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  border:1px solid var(--line);
  border-radius:999px;
}

/* dropdown menu */
.nav.open{
  display:flex;
  flex-direction:column;
  gap:14px;

  position:absolute;
  top:100%;
  left:0;
  right:0;

  background:#fff;
  padding:16px;

  border-top:1px solid var(--line);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  z-index:999;
}
.nav.open a{
  font-size:16px;
  padding:10px 0;
  border-bottom:1px solid #f0f0f0;
}
.nav.open a:last-child{border-bottom:none}

/* ================= Hero ================= */
.hero{
  min-height:70vh;
  display:flex;
  align-items:center;
  justify-content:center;
  border-bottom:1px solid var(--line);
  background:
    linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)),
    url("../images/hero.jpeg") center / cover no-repeat;
}
.hero-content{
  text-align:center;
  padding:48px 16px;
  color:#fff;
}
.hero h1{
  margin:0;
  font-size:44px;
  letter-spacing:2px;
}
.hero p{
  margin:10px 0 22px;
  color:rgba(255,255,255,.85);
  font-size:16px;
}
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:12px 18px;
  border:1px solid #fff;
  background:transparent;
  color:#fff;
  border-radius:999px;
  font-size:15px;
  transition:.2s ease;
}
.btn:hover{background:#fff; color:#111}

/* ================= Sections ================= */
section{padding:54px 0}
h2{margin:0; font-size:26px; letter-spacing:.2px}

/* ================= Gallery ================= */
.gallery{
  border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);
}

.section-head{
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  gap:8px;
  margin-bottom:22px;
}
.section-head h2{
  font-size:26px;
  font-weight:500;
}
.section-head .muted{
  font-size:13px;
  font-weight:400;
  color:#777;
}

/* Category cards */
.filters.filter-grid{
  display:grid;
  grid-template-columns:1fr;
  gap:14px;
  margin:18px 0 24px;
}

.filter-btn.filter-card{
  width:100%;
  border:none;
  background:#f6f6f6;
  border-radius:18px;
  padding:16px 16px;
  cursor:pointer;

  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;

  box-shadow:0 10px 28px rgba(0,0,0,0.08);
  transition:.2s ease;
  -webkit-tap-highlight-color: transparent;

  color:#111;
}
.filter-btn.filter-card .cat-title{
  font-size:20px;     /* واضح ومش مبالغ */
  font-weight:500;    /* زي عنوان معرض الصور */
  letter-spacing:.2px;
  color:#111;
}
.filter-btn.filter-card:active{transform:scale(0.98)}
.filter-btn.filter-card.active{background:#111}
.filter-btn.filter-card.active .cat-title{color:#fff}

/* امنع الـ focus يغمّق */
.filter-btn.filter-card:focus,
.filter-btn.filter-card:focus-visible{
  outline:none;
  background:#f6f6f6;
}

/* Gallery grid */
.gallery-grid{
  display:grid;
  grid-template-columns:repeat(2, minmax(0, 1fr));
  gap:12px;
}

.g-item{
  margin:0;
  border:1px solid var(--line);
  border-radius:16px;
  overflow:hidden;
  cursor:pointer;
  background:#fafafa;
  position:relative;
}
.g-item img{
  width:100%;
  height:220px;
  object-fit:cover;
  transition:transform .2s ease;
}
@media (hover:hover){
  .g-item:hover img{transform:scale(1.04)}
}

.g-item .order-btn{
  position:absolute;
  left:10px;
  bottom:10px;
  border:1px solid rgba(0,0,0,.25);
  background:rgba(255,255,255,.92);
  padding:8px 12px;
  border-radius:999px;
  font-size:13px;
  cursor:pointer;
  display:flex;
  gap:8px;
  align-items:center;
}

/* ================= Order Form (Android safe) ================= */
.order h2{text-align:center; margin-bottom:18px}

#orderForm{
  width:100%;
  max-width:720px;
  margin-inline:auto;
  display:grid;
  gap:12px;
}
#orderForm input,
#orderForm select,
#orderForm textarea,
#orderForm button{
  width:100%;
  max-width:100%;
}
#orderForm input,
#orderForm select,
#orderForm textarea{
  padding:14px;
  border:1px solid var(--line);
  border-radius:14px;
  font-family:inherit;
  font-size:16px;      /* مهم لأندرويد */
  line-height:1.2;
  outline:none;
  background:#fff;
}
#orderForm textarea{min-height:120px; resize:vertical}

#orderForm button{
  padding:14px 16px;
  border:1px solid var(--btn);
  background:var(--btn);
  color:var(--btnText);
  border-radius:999px;
  cursor:pointer;
  font-family:inherit;
  font-size:16px;
}

#orderForm .two{
  display:grid;
  grid-template-columns:1fr;
  gap:10px;
}

/* ================= Contact ================= */
.contact{text-align:center}
.contact-line{margin:10px 0; line-height:1.8}
.link{border-bottom:1px solid transparent; padding-bottom:2px}
.link:hover{border-bottom-color:var(--text)}

.map-wrap{
  width:min(900px, calc(100% - 32px));
  margin:18px auto 0;
  border:1px solid var(--line);
  border-radius:14px;
  overflow:hidden;
}
.contact iframe{width:100%; height:320px; border:0}

/* ================= Footer ================= */
.footer{
  border-top:1px solid var(--line);
  padding:18px 0;
  text-align:center;
  color:var(--muted);
}

/* ================= Lightbox ================= */
.lightbox{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.82);
  display:none;
  align-items:center;
  justify-content:center;
  z-index:999;
  padding:18px;
}
.lightbox.open{display:flex}
.lightbox img{
  max-width:min(980px, 92vw);
  max-height:82vh;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.18);
  background:#000;
}
.lb-close, .lb-nav{
  position:absolute;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.22);
  background:transparent;
  color:#fff;
  cursor:pointer;
  display:grid;
  place-items:center;
}
.lb-close{top:14px; right:14px; width:42px; height:42px}
.lb-nav{top:50%; transform:translateY(-50%); width:46px; height:46px}
.lb-prev{right:14px}
.lb-next{left:14px}

/* ================= Modal (Order from image) — One style for all ================= */
.modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.55);
  display:none;
  z-index:1000;

  padding:14px;
  padding-bottom:calc(14px + env(safe-area-inset-bottom));
  height:100dvh;
}
.modal.open{
  display:flex;
  align-items:center;
  justify-content:center;
}

.modal-card{
  width:min(520px, 96vw);       /* نفس شكل الموبايل على اللاب */
  background:#fff;
  border-radius:16px;
  border:1px solid rgba(0,0,0,.08);
  position:relative;
  overflow:hidden;

  max-height:calc(100dvh - 28px);
  display:flex;
  flex-direction:column;
}

.modal-close{
  position:absolute;
  top:10px; right:10px;
  width:40px; height:40px;
  border-radius:999px;
  border:1px solid rgba(0,0,0,.12);
  background:#fff;
  cursor:pointer;
  display:grid;
  place-items:center;
  z-index:10;
}

.modal-grid{
  display:flex;
  flex-direction:column;
  height:100%;
  min-height:0;
}

.modal-preview{
  padding:12px;
  background:#fafafa;
  border-bottom:1px solid #eee;
}
.modal-preview img{
  width:100%;
  height:220px;
  object-fit:cover;
  border-radius:12px;
  border:1px solid #eee;
}
#orderImgLabel{margin-top:8px}

.modal-form{
  padding:14px;
  display:flex;
  flex-direction:column;
  gap:10px;

  overflow:auto;
  -webkit-overflow-scrolling:touch;
  min-height:0;

  padding-bottom:calc(12px + env(safe-area-inset-bottom) + 76px);
}
.modal-form h3{margin:0 0 6px}

.modal-form input,
.modal-form select,
.modal-form textarea{
  width:100%;
  padding:12px;
  border:1px solid #e7e7e7;
  border-radius:12px;
  font-family:inherit;
  font-size:16px; /* Android */
  line-height:1.2;
}
.modal-form textarea{min-height:110px; resize:vertical}

.modal-form .two{
  display:grid;
  grid-template-columns:1fr; /* موبايل */
  gap:10px;
}

.btn-block{
  position:sticky;
  bottom:10px;
  z-index:2;

  padding:14px 16px;
  border:1px solid #111;
  background:#111;
  color:#fff;
  border-radius:999px;
  cursor:pointer;
  font-family:inherit;
  font-size:16px;

  box-shadow:0 10px 25px rgba(0,0,0,.15);
}
