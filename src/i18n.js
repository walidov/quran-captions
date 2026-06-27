// Lightweight i18n. translate(locale, key, vars) substitutes {var} placeholders
// and falls back to English, then to the raw key.
const MESSAGES = {
  en: {
    'app.title': 'Quran Captions',
    'app.slogan': 'Create transparent PNG captions for your videos',
    'export.all': 'Export all cards',
    'export.exporting': 'Exporting…',
    'export.rendering': 'Rendering {i}/{n}…',
    'toast.exportedZip': 'Exported {n} transparent PNGs — ZIP downloaded',
    'toast.exportedCard': 'Card exported as transparent PNG',
    'toast.exportFailed': 'Export failed — see console',

    'tool.verses': 'Verses',
    'tool.style': 'Style',
    'share': 'Share',

    'nav.card': 'Card',
    'nav.export': 'Export',
    'nav.canvas': 'Canvas',
    'nav.canvasSub': 'Canvas size and Qur’an font',

    'theme.toDark': 'Switch to dark mode',
    'theme.toLight': 'Switch to light mode',
    'lang.switch': 'العربية',

    'preset.wide': 'Wide',
    'preset.short': 'Short / Reel',
    'preset.square': 'Square',
    'preset.portrait': 'Portrait',
    'preset.landscape': 'Landscape',
    'preset.custom': 'Custom',

    'verses.title': 'Select verses',
    'verses.subtitle': 'Pick the surah, then the ayah range',
    'verses.surah': 'SURAH',
    'verses.ayahRange': 'AYAH RANGE',
    'verses.ayah': 'Ayah',
    'verses.words': 'words',
    'verses.cards': 'cards',
    'verses.resplit': 'Re-split into cards',
    'verses.help':
      'Verses are fetched from the quran.com API and auto-split to fit your line count and canvas width. Fine-tune the breaks by moving boundary words in the card inspector.',

    'surah.search': 'Search surah…',
    'surah.loading': 'Loading surahs…',
    'surah.noMatches': 'No matches',

    'style.title': 'Caption style',
    'style.subtitle': 'Global look · applies to all inheriting cards',
    'style.fontSize': 'FONT SIZE',
    'style.color': 'FONT COLOR',
    'style.maxLines': 'MAX LINES PER CARD',
    'style.lineHeight': 'LINE HEIGHT',
    'style.border': 'BORDER',
    'style.thickness': 'Thickness',
    'style.shadow': 'SHADOW',
    'style.blur': 'Blur',

    'card.of': 'Card {n} of {m}',
    'card.words': '{n} words',
    'card.customSize': 'Custom font size',
    'card.overrideSize': 'Override the global font size',
    'card.inherits': 'This card follows the global font size. Turn on {b} to give this card its own size.',
    'card.size': 'SIZE',
    'card.reset': 'Reset to global style',
    'card.adjustWords': 'Adjust words',
    'card.adjustHelp': 'Move a boundary word to the neighbouring card',
    'card.firstWord': 'First word of current card',
    'card.lastWord': 'Last word of current card',
    'card.prev': 'To prev card',
    'card.next': 'To next card',
    'card.exportPng': 'Export only this card',
    'card.delete': 'Delete this card',

    'stage.loading': 'Loading verses…',
    'stage.error': 'Could not load verses — check your connection',
    'stage.bgBlack': 'Hold to preview on black (export stays transparent)',
    'stage.bgWhite': 'Hold to preview on white (export stays transparent)',

    'modal.lineLimit.title': 'Card line limit reached',
    'modal.lineLimit.msg':
      'Cards are capped at {n} lines (Max lines per card). This change would push a card past that limit.\n\nRaise “Max lines per card”, reduce the font size, or re-split the verses into more cards.',
    'modal.gotIt': 'Got it',

    'share.title': 'Share Quran Captions',
    'share.subtitle': 'Share it with anyone who makes Qur’an recitation videos.',
    'share.copy': 'Copy link',
    'share.copied': 'Copied!',
    'donate': 'Donate',
    'donate.title': 'Support Quran Captions',
    'donate.body':
      'Quran Captions is free to use. Your donation helps cover the development and maintenance of this app — and supports building other useful apps too. Every contribution, big or small, is deeply appreciated. May Allah reward you.',
    'donate.paypal': 'Donate with PayPal',
    'donate.note': 'You’ll be taken to PayPal to complete your donation securely.',
  },

  ar: {
    'app.title': 'قرآن كابشنز',
    'app.slogan': 'أنشئ كابشنز شفافة (PNG) لمقاطع الفيديو',
    'export.all': 'تصدير كل البطاقات',
    'export.exporting': 'جارٍ التصدير…',
    'export.rendering': 'جارٍ التصدير {i}/{n}…',
    'toast.exportedZip': 'تم تصدير {n} صورة PNG شفافة — تم تنزيل ملف ZIP',
    'toast.exportedCard': 'تم تصدير البطاقة كصورة PNG شفافة',
    'toast.exportFailed': 'فشل التصدير — راجع وحدة التحكم',

    'tool.verses': 'الآيات',
    'tool.style': 'النمط',
    'share': 'مشاركة',

    'nav.card': 'البطاقة',
    'nav.export': 'تصدير',
    'nav.canvas': 'المقاس',
    'nav.canvasSub': 'مقاس اللوحة وخط المصحف',

    'theme.toDark': 'التبديل إلى الوضع الداكن',
    'theme.toLight': 'التبديل إلى الوضع الفاتح',
    'lang.switch': 'English',

    'preset.wide': 'عريض',
    'preset.short': 'شورت / ريل',
    'preset.square': 'مربّع',
    'preset.portrait': 'عمودي',
    'preset.landscape': 'أفقي',
    'preset.custom': 'مخصّص',

    'verses.title': 'اختر الآيات',
    'verses.subtitle': 'اختر السورة ثم نطاق الآيات',
    'verses.surah': 'السورة',
    'verses.ayahRange': 'نطاق الآيات',
    'verses.ayah': 'الآية',
    'verses.words': 'كلمة',
    'verses.cards': 'بطاقة',
    'verses.resplit': 'إعادة التقسيم إلى بطاقات',
    'verses.help':
      'تُجلب الآيات من واجهة quran.com وتُقسَّم تلقائيًا لتناسب عدد الأسطر وعرض اللوحة. اضبط الفواصل بتحريك كلمات الحدود في مفتّش البطاقة.',

    'surah.search': 'ابحث عن سورة…',
    'surah.loading': 'جارٍ تحميل السور…',
    'surah.noMatches': 'لا توجد نتائج',

    'style.title': 'نمط النص',
    'style.subtitle': 'المظهر العام · يُطبَّق على كل البطاقات الوارثة',
    'style.fontSize': 'حجم الخط',
    'style.color': 'لون الخط',
    'style.maxLines': 'أقصى عدد أسطر للبطاقة',
    'style.lineHeight': 'ارتفاع السطر',
    'style.border': 'الحدود',
    'style.thickness': 'السماكة',
    'style.shadow': 'الظل',
    'style.blur': 'التمويه',

    'card.of': 'بطاقة {n} من {m}',
    'card.words': '{n} كلمة',
    'card.customSize': 'حجم خط مخصّص',
    'card.overrideSize': 'تجاوز حجم الخط العام',
    'card.inherits': 'تتبع هذه البطاقة حجم الخط العام. فعّل {b} لمنح هذه البطاقة حجمها الخاص.',
    'card.size': 'الحجم',
    'card.reset': 'إعادة التعيين إلى النمط العام',
    'card.adjustWords': 'ضبط الكلمات',
    'card.adjustHelp': 'انقل كلمة حدودية إلى البطاقة المجاورة',
    'card.firstWord': 'أول كلمة في البطاقة الحالية',
    'card.lastWord': 'آخر كلمة في البطاقة الحالية',
    'card.prev': 'إلى السابقة',
    'card.next': 'إلى التالية',
    'card.exportPng': 'تصدير هذه البطاقة فقط',
    'card.delete': 'حذف هذه البطاقة',

    'stage.loading': 'جارٍ تحميل الآيات…',
    'stage.error': 'تعذّر تحميل الآيات — تحقّق من اتصالك',
    'stage.bgBlack': 'اضغط للمعاينة على خلفية سوداء (التصدير يبقى شفافًا)',
    'stage.bgWhite': 'اضغط للمعاينة على خلفية بيضاء (التصدير يبقى شفافًا)',

    'modal.lineLimit.title': 'تم بلوغ حد أسطر البطاقة',
    'modal.lineLimit.msg':
      'البطاقات محدودة بـ {n} أسطر (أقصى عدد أسطر للبطاقة). هذا التغيير سيتجاوز هذا الحد.\n\nارفع «أقصى عدد أسطر للبطاقة»، أو قلّل حجم الخط، أو أعد تقسيم الآيات إلى بطاقات أكثر.',
    'modal.gotIt': 'حسنًا',

    'share.title': 'شارك قرآن كابشنز',
    'share.subtitle': 'شاركه مع كل من يصنع مقاطع تلاوة القرآن.',
    'share.copy': 'نسخ الرابط',
    'share.copied': 'تم النسخ!',
    'donate': 'تبرّع',
    'donate.title': 'ادعم قرآن كابشنز',
    'donate.body':
      'قرآن كابشنز مجاني للاستخدام. تبرّعك يساعد في تغطية تطوير هذا التطبيق وصيانته — ويدعم أيضًا بناء تطبيقات نافعة أخرى. كل مساهمة، مهما صغرت، محل تقدير كبير. جزاك الله خيرًا.',
    'donate.paypal': 'تبرّع عبر باي بال',
    'donate.note': 'سيتم تحويلك إلى باي بال لإتمام تبرّعك بأمان.',
  },
}

export function translate(locale, key, vars) {
  const dict = MESSAGES[locale] || MESSAGES.en
  let s = dict[key] ?? MESSAGES.en[key] ?? key
  if (vars) for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(vars[k])
  return s
}
