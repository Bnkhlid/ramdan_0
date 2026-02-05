// PWA Install Logic
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Update UI to show install button if needed
  const installBtn = document.getElementById('installAppBtn');
  if (installBtn) installBtn.classList.remove('hidden');
});

async function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    deferredPrompt = null;
    const installBtn = document.getElementById('installAppBtn');
    if (installBtn) installBtn.classList.add('hidden');
  }
}

function injectNav(activePage = 'home') {
  // Inject notifications script if not present
  if (!document.querySelector('script[src*="notifications.js"]')) {
    const script = document.createElement('script');
    script.src = 'js/notifications.js?v=2';
    document.head.appendChild(script);

    // Auto init after load
    script.onload = () => {
      if (typeof initNotifications === 'function') initNotifications();
    };
  }

  const navHTML = `
    <nav class="fixed w-full z-40 bg-ramadan-dark/90 backdrop-blur-md border-b border-ramadan-gold/20">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3 group cursor-pointer" onclick="window.location.href='index.html'">
            <i class="fas fa-moon text-ramadan-gold text-2xl animate-float group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-all"></i>
            <span class="text-xl md:text-2xl font-bold text-gray-100 font-amiri group-hover:text-ramadan-gold transition-colors">رمضان كريم</span>
          </div>
          
          <div class="hidden xl:flex items-center gap-1">
            ${generateDesktopLinks(activePage)}
          </div>
          
          <button class="xl:hidden text-ramadan-gold p-2 hover:bg-white/5 rounded-lg transition-colors" onclick="toggleMobileMenu()" aria-label="قائمة التنقل">
            <i class="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>
      
      <div id="mobileMenu" class="hidden xl:hidden bg-ramadan-dark border-t border-ramadan-gold/20 h-[80vh] overflow-y-auto custom-scrollbar">
        <div class="flex flex-col p-4 gap-2">
            ${generateMobileLinks(activePage)}
        </div>
      </div>
    </nav>`;

  document.getElementById('nav-placeholder').innerHTML = navHTML;

  // FORCE DARK THEME - Remove any dynamic theme classes
  const body = document.body;
  body.classList.remove('theme-morning', 'theme-afternoon', 'theme-sunset', 'theme-night');
}

function generateDesktopLinks(active) {
  const links = [
    { id: 'home', href: 'index.html', text: 'الرئيسية' },
    { id: 'quran', href: 'quran.html', text: 'المصحف' },
    { id: 'bookmarks', href: 'bookmarks.html', text: 'المفضلة' },
    { id: 'prayer', href: 'prayer.html', text: 'مواقيت الصلاة' },
    { id: 'tracker', href: 'tracker.html', text: 'تتبع رمضان' },
    { id: 'tafsir', href: 'tafsir.html', text: 'التفسير' },
    { id: 'hadith', href: 'hadith.html', text: 'الأحاديث' },
    { id: 'quiz', href: 'quiz.html', text: 'مساعد الحفظ' },
    { id: 'reciters', href: 'reciters.html', text: 'القراء' },
    { id: 'radio', href: 'radio.html', text: 'الإذاعة' },
    { id: 'adhkar', href: 'adhkar.html', text: 'الأذكار' },
    { id: 'names', href: 'names.html', text: 'أسماء الله' },
    { id: 'tasbih', href: 'tasbih.html', text: 'السبحة' },
    { id: 'verse', href: 'verse.html', text: 'آية عشوائية' },
    { id: 'cards', href: 'cards.html', text: 'بطاقات' },
    { id: 'zakat', href: 'zakat.html', text: 'الزكاة' },
    { id: 'khatma', href: 'khatma.html', text: 'الختمة' },
    { id: 'moshaf', href: 'moshaf.html', text: 'تحميل المصحف' },
  ];

  return links.map(link => {
    const isActive = active === link.id;
    const classes = isActive
      ? 'text-ramadan-dark bg-ramadan-gold px-3 py-1.5 rounded-full font-bold shadow-[0_0_10px_rgba(251,191,36,0.4)]'
      : 'text-gray-300 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-full transition-all';

    return `<a href="${link.href}" class="${classes} text-[0.85rem] whitespace-nowrap flex items-center gap-1">
      ${link.icon ? `<i class="${link.icon}"></i>` : ''} ${link.text}
    </a>`;
  }).join('');
}

function generateMobileLinks(active) {
  const links = [
    { id: 'home', href: 'index.html', text: 'الرئيسية' },
    { id: 'quran', href: 'quran.html', text: 'المصحف الكريم' },
    { id: 'bookmarks', href: 'bookmarks.html', text: 'المفضلة' },
    { id: 'prayer', href: 'prayer.html', text: 'مواقيت الصلاة' },
    { id: 'tracker', href: 'tracker.html', text: 'تتبع عبادتك' },
    { id: 'tafsir', href: 'tafsir.html', text: 'تفسير القرآن' },
    { id: 'hadith', href: 'hadith.html', text: 'الأحاديث النبوية' },
    { id: 'quiz', href: 'quiz.html', text: 'مساعد الحفظ' },
    { id: 'reciters', href: 'reciters.html', text: 'قراء القرآن' },
    { id: 'radio', href: 'radio.html', text: 'إذاعة القرآن' },
    { id: 'adhkar', href: 'adhkar.html', text: 'الأذكار اليومية' },
    { id: 'names', href: 'names.html', text: 'أسماء الله الحسنى' },
    { id: 'tasbih', href: 'tasbih.html', text: 'السبحة الإلكترونية' },
    { id: 'verse', href: 'verse.html', text: 'آية عشوائية' },
    { id: 'cards', href: 'cards.html', text: 'بطاقات التهنئة' },
    { id: 'zakat', href: 'zakat.html', text: 'حاسبة الزكاة' },
    { id: 'khatma', href: 'khatma.html', text: 'الختمة الجماعية' },
    { id: 'moshaf', href: 'moshaf.html', text: 'تحميل المصحف' },
  ];

  const linkHTML = links.map(link => {
    const isActive = active === link.id;
    const classes = isActive
      ? 'bg-ramadan-gold text-ramadan-dark font-bold'
      : 'text-gray-300 hover:bg-white/5 hover:text-white';

    return `<a href="${link.href}" class="block px-4 py-3 rounded-lg transition-all ${classes}">
      ${link.text}
    </a>`;
  }).join('');

  // Add Install Button (Hidden by default, shown via JS)
  return linkHTML + `
    <button id="installAppBtn" onclick="installPWA()" class="hidden w-full text-right px-4 py-3 rounded-lg text-ramadan-gold hover:bg-white/5 transition-all font-bold border-t border-ramadan-gold/10 mt-2">
      <i class="fas fa-download ml-2"></i> تثبيت التطبيق
    </button>
  `;
}



function injectFooter() {
  const footerHTML = `
    <footer class="bg-ramadan-dark border-t border-ramadan-gold/20 py-12 relative overflow-hidden mt-20">
      <div class="absolute inset-0 stars opacity-30"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center">
          <div class="flex justify-center items-center gap-3 mb-6">
            <i class="fas fa-moon text-ramadan-gold text-2xl md:text-3xl"></i>
            <span class="text-2xl md:text-3xl font-bold text-ramadan-gold font-amiri">رمضان كريم</span>
          </div>
          <p class="text-gray-400 mb-6 text-sm md:text-base">تقبل الله صيامكم وقيامكم</p>

          

          <div class="border-t border-white/10 pt-8 text-xs md:text-sm text-gray-500">
            <p>© 2026 رمضان كريم - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </footer>`;

  document.getElementById('footer-placeholder').innerHTML = footerHTML;
}

function toggleMobileMenu() {
  document.getElementById("mobileMenu").classList.toggle("hidden");
}

// Common Tailwind Config
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "ramadan-dark": "#0f172a",
        "ramadan-blue": "#1e3a8a",
        "ramadan-gold": "#fbbf24",
        "ramadan-gold-light": "#fcd34d",
        "ramadan-purple": "#7c3aed",
        "ramadan-emerald": "#059669",
        "ramadan-teal": "#14b8a6",
      },
      fontFamily: {
        amiri: ["Amiri", "serif"],
        tajawal: ["Tajawal", "sans-serif"],
        quran: ["Scheherazade New", "serif"],
      },
    },
  },
};

function normalizeArabic(text) {
  if (!text) return "";
  // Remove all Arabic diacritics (tashkeel)
  return text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
}
