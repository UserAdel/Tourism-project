import { useEffect } from 'react';
import type { RefObject } from 'react';

const arabicText: Record<string, string> = {
  Admin: 'الإدارة',
  'Admin Login': 'تسجيل دخول الإدارة',
  'Hurghada French Guide': 'دليل الغردقة الفرنسي',
  Home: 'الرئيسية',
  Dark: 'داكن',
  Light: 'فاتح',
  Logout: 'تسجيل الخروج',
  'Booking Requests': 'طلبات الحجز',
  'Contact Requests': 'طلبات التواصل',
  'Activities CRUD': 'إدارة الأنشطة',
  'Activity Categories': 'فئات الأنشطة',
  'Guest Reviews': 'تقييمات الضيوف',
  'WhatsApp Settings': 'إعدادات واتساب',
  'Open admin navigation': 'فتح قائمة الإدارة',
  'Close admin navigation': 'إغلاق قائمة الإدارة',
  'Toggle theme': 'تبديل المظهر',
  'Booking Details': 'تفاصيل الحجز',
  'Close booking details': 'إغلاق تفاصيل الحجز',
  Guest: 'الضيف',
  Name: 'الاسم',
  Nationality: 'الجنسية',
  Language: 'اللغة',
  Submitted: 'تاريخ الإرسال',
  Trip: 'الرحلة',
  Activity: 'النشاط',
  'Activity slug': 'رابط النشاط',
  'Preferred date': 'التاريخ المفضل',
  Guests: 'الضيوف',
  'Arrival date': 'تاريخ الوصول',
  Contact: 'التواصل',
  Phone: 'الهاتف',
  WhatsApp: 'واتساب',
  Email: 'البريد الإلكتروني',
  Notes: 'ملاحظات',
  'Special requests': 'طلبات خاصة',
  'Admin notes': 'ملاحظات الإدارة',
  'No special requests.': 'لا توجد طلبات خاصة.',
  'No admin notes.': 'لا توجد ملاحظات من الإدارة.',
  Previous: 'السابق',
  Next: 'التالي',
  'All statuses': 'كل الحالات',
  'From date': 'من تاريخ',
  'To date': 'إلى تاريخ',
  'Search bookings...': 'البحث في الحجوزات...',
  'Search bookings': 'البحث في الحجوزات',
  'Search activities...': 'البحث في الأنشطة...',
  'Loading bookings...': 'جارٍ تحميل الحجوزات...',
  'Loading activities...': 'جارٍ تحميل الأنشطة...',
  'Loading activity...': 'جارٍ تحميل النشاط...',
  'Loading settings...': 'جارٍ تحميل الإعدادات...',
  'Could not load admin data. Check that the backend and MongoDB are running.': 'تعذر تحميل بيانات الإدارة. تحقق من تشغيل الخادم وقاعدة بيانات MongoDB.',
  'Admin Dashboard': 'لوحة الإدارة',
  'Manage activities, booking requests, and contact messages.': 'إدارة الأنشطة وطلبات الحجز ورسائل التواصل.',
  'Booking requests': 'طلبات الحجز',
  'New bookings': 'الحجوزات الجديدة',
  'New contacts': 'طلبات التواصل الجديدة',
  'Guest reviews': 'تقييمات الضيوف',
  Reset: 'إعادة ضبط',
  'Filter bookings by type': 'تصفية الحجوزات حسب الحالة',
  'Filter bookings from date': 'تصفية الحجوزات ابتداءً من تاريخ',
  'Filter bookings to date': 'تصفية الحجوزات حتى تاريخ',
  'No bookings match your filters.': 'لا توجد حجوزات مطابقة للتصفية.',
  'No booking requests yet.': 'لا توجد طلبات حجز بعد.',
  'Booked at': 'وقت الحجز',
  'Loading contacts...': 'جارٍ تحميل طلبات التواصل...',
  'No contact requests yet.': 'لا توجد طلبات تواصل بعد.',
  'Delete contact': 'حذف طلب التواصل',
  'Contact request deleted': 'تم حذف طلب التواصل',
  'Could not delete contact request': 'تعذر حذف طلب التواصل',
  'Create Activity': 'إنشاء نشاط',
  'Edit Activity': 'تعديل النشاط',
  'View activity': 'عرض النشاط',
  'Delete activity': 'حذف النشاط',
  'Create Category': 'إنشاء فئة',
  'Edit Category': 'تعديل الفئة',
  'Save Category': 'حفظ الفئة',
  'Add the category names used across activities.': 'أضف أسماء الفئات المستخدمة في الأنشطة.',
  'Close category form': 'إغلاق نموذج الفئة',
  Active: 'نشط',
  active: 'نشط',
  archived: 'مؤرشف',
  hidden: 'مخفي',
  'English Name': 'الاسم بالإنجليزية',
  'French Name': 'الاسم بالفرنسية',
  'Category Image': 'صورة الفئة',
  'Crop Category Image (Card Dimensions)': 'اقتصاص صورة الفئة (أبعاد البطاقة)',
  'Change Category Image': 'تغيير صورة الفئة',
  'Upload Image from Device': 'رفع صورة من الجهاز',
  'Select image to crop & adjust for card dimensions (16:10)': 'اختر صورة لاقتصاصها وضبطها لأبعاد البطاقة (16:10)',
  'Cropped Image Ready': 'الصورة المقصوصة جاهزة',
  'Current Image': 'الصورة الحالية',
  'Remove Image': 'إزالة الصورة',
  'Save changes': 'حفظ التغييرات',
  Save: 'حفظ',
  Cancel: 'إلغاء',
  Close: 'إغلاق',
  Delete: 'حذف',
  Remove: 'إزالة',
  Edit: 'تعديل',
  Add: 'إضافة',
  New: 'جديد',
  Create: 'إنشاء',
  Update: 'تحديث',
  View: 'عرض',
  Search: 'بحث',
  Status: 'الحالة',
  Actions: 'الإجراءات',
  'Mark as': 'تعيين كـ',
  'Mark as read': 'تعيين كمقروء',
  'Mark as replied': 'تعيين كتم الرد',
  'Mark as archived': 'أرشفة',
  new: 'جديد',
  pending: 'قيد الانتظار',
  contacted: 'تم التواصل',
  confirmed: 'مؤكد',
  cancelled: 'ملغي',
  read: 'مقروء',
  replied: 'تم الرد',
  'Save status': 'حفظ الحالة',
  'Delete contact request?': 'حذف طلب التواصل؟',
  'Delete category?': 'حذف الفئة؟',
  'Delete activity?': 'حذف النشاط؟',
  'This action cannot be undone.': 'لا يمكن التراجع عن هذا الإجراء.',
  Confirm: 'تأكيد',
  'Activity updated': 'تم تحديث النشاط',
  'Activity created': 'تم إنشاء النشاط',
  'Category updated': 'تم تحديث الفئة',
  'Category created': 'تم إنشاء الفئة',
  'Could not save activity. Check required fields and slug uniqueness.': 'تعذر حفظ النشاط. تحقق من صحة البيانات وتفرّد الرابط.',
  'Could not save category. Check that the English name is unique.': 'تعذر حفظ الفئة. تحقق من أن الاسم الإنجليزي فريد.',
  Activities: 'الأنشطة',
  Categories: 'الفئات',
  Bookings: 'الحجوزات',
  Contacts: 'طلبات التواصل',
  'No activities found.': 'لا توجد أنشطة.',
  'No bookings found.': 'لا توجد حجوزات.',
  'No contact requests found.': 'لا توجد طلبات تواصل.',
  'No categories found.': 'لا توجد فئات.',
  'Activity is visible on the website': 'النشاط ظاهر على الموقع',
  'Activity is hidden from the website': 'النشاط مخفي من الموقع',
  'Open public page': 'فتح الصفحة العامة',
  'Back to activities': 'العودة إلى الأنشطة',
  Slug: 'الرابط',
  Category: 'الفئة',
  Duration: 'المدة',
  'Base price': 'السعر الأساسي',
  'Price options': 'خيارات السعر',
  Description: 'الوصف',
  'No description provided.': 'لم تتم إضافة وصف.',
  Highlights: 'أبرز المزايا',
  Included: 'المشمول',
  Excluded: 'غير المشمول',
  Reviews: 'التقييمات',
  review: 'تقييم',
  reviews: 'تقييمات',
  'No reviews yet.': 'لا توجد تقييمات بعد.',
  'No activity details available.': 'لا تتوفر تفاصيل للنشاط.',
  'Pending approval': 'بانتظار الموافقة',
  Approved: 'موافق عليه',
  Approve: 'موافقة',
  Hide: 'إخفاء',
  'Edit review': 'تعديل التقييم',
  'Delete review': 'حذف التقييم',
  'Delete review?': 'حذف التقييم؟',
  'Review updated': 'تم تحديث التقييم',
  'Review deleted': 'تم حذف التقييم',
  'Review approved and published': 'تمت الموافقة على التقييم ونشره',
  'Review hidden': 'تم إخفاء التقييم',
  'Could not update review': 'تعذر تحديث التقييم',
  'Could not delete review': 'تعذر حذف التقييم',
  'Could not update review approval': 'تعذر تحديث موافقة التقييم',
  'Guest name': 'اسم الضيف',
  Country: 'البلد',
  Rating: 'التقييم',
  Comment: 'التعليق',
  'Save review': 'حفظ التقييم',
  'Cancel editing': 'إلغاء التعديل',
  Pricing: 'الأسعار',
  'Adult EUR': 'سعر البالغين (يورو)',
  'Children EUR': 'سعر الأطفال (يورو)',
  'Main price': 'السعر الرئيسي',
  'Video Highlights': 'أبرز مقاطع الفيديو',
  'Video Reviews': 'تقييمات الفيديو',
  'No video highlights yet.': 'لا توجد مقاطع مميزة بعد.',
  'No video reviews yet.': 'لا توجد تقييمات فيديو بعد.',
  Title: 'العنوان',
  'YouTube link': 'رابط يوتيوب',
  'Thumbnail image (optional)': 'صورة مصغرة (اختيارية)',
  'Optional. If empty, the YouTube thumbnail will be used.': 'اختياري. عند تركه فارغًا ستُستخدم الصورة المصغرة من يوتيوب.',
  'Video thumbnail': 'الصورة المصغرة للفيديو',
  'Video review thumbnail': 'الصورة المصغرة لتقييم الفيديو',
  'Select country': 'اختر البلد',
  Other: 'أخرى',
  'Hero image': 'الصورة الرئيسية',
  'Hero preview': 'معاينة الصورة الرئيسية',
  'Photo gallery': 'معرض الصور',
  'Gallery images': 'صور المعرض',
  Gallery: 'المعرض',
  'Delete gallery image': 'حذف صورة المعرض',
  'Name EN': 'الاسم بالإنجليزية',
  'Name FR': 'الاسم بالفرنسية',
  'Description EN': 'الوصف بالإنجليزية',
  'Description FR': 'الوصف بالفرنسية',
  'Age EN': 'العمر بالإنجليزية',
  'Age FR': 'العمر بالفرنسية',
  'Start time': 'وقت البداية',
  'End time': 'وقت النهاية',
  'Pricing options': 'خيارات السعر',
  'Hotel pickup included': 'يشمل الاستقبال من الفندق',
  'Available daily': 'متاح يوميًا',
  'Free cancellation': 'إلغاء مجاني',
  'Activity options': 'خيارات النشاط',
  Badges: 'الشارات',
  Featured: 'مميز',
  'Family friendly': 'مناسب للعائلات',
  'Tour type': 'نوع الجولة',
  'Private available': 'متاح بشكل خاص',
  'Group available': 'متاح للمجموعات',
  Features: 'الميزات',
  'Child friendly': 'مناسب للأطفال',
  'Pickup included': 'يشمل الاستقبال',
  'SEO Keywords': 'كلمات SEO المفتاحية',
  'Enter keywords separated by commas. These will be merged with auto-generated keywords on the public activity page.': 'أدخل الكلمات المفتاحية مفصولة بفواصل. ستُدمج مع الكلمات المنشأة تلقائيًا في صفحة النشاط العامة.',
  'e.g. snorkeling Hurghada, Red Sea excursion, best water activities Egypt': 'مثال: غطس الغردقة، رحلة البحر الأحمر، أفضل الأنشطة المائية في مصر',
  'Close activity editor': 'إغلاق محرر النشاط',
  'Manage the reviews shown on the public website.': 'إدارة التقييمات الظاهرة على الموقع العام.',
  'Manage the reviews shown in “What Our Guests Say”.': 'إدارة التقييمات المعروضة في قسم «ماذا يقول ضيوفنا».',
  'New Review': 'تقييم جديد',
  'Loading guest reviews...': 'جارٍ تحميل تقييمات الضيوف...',
  'Add Review': 'إضافة تقييم',
  'No guest reviews yet.': 'لا توجد تقييمات للضيوف بعد.',
  'Edit Guest Review': 'تعديل تقييم الضيف',
  'Create Guest Review': 'إنشاء تقييم ضيف',
  'Review text in English': 'نص التقييم بالإنجليزية',
  'Review text in French': 'نص التقييم بالفرنسية',
  'Activity name in English': 'اسم النشاط بالإنجليزية',
  'Activity name in French': 'اسم النشاط بالفرنسية',
  'Sort order': 'ترتيب العرض',
  'Display order': 'ترتيب العرض',
  'Activity label — English': 'عنوان النشاط بالإنجليزية',
  'Activity label — French': 'عنوان النشاط بالفرنسية',
  'Review — English': 'التقييم بالإنجليزية',
  'Review — French': 'التقييم بالفرنسية',
  'Show on homepage': 'إظهار في الصفحة الرئيسية',
  'Hidden reviews remain available in admin.': 'تبقى التقييمات المخفية متاحة في الإدارة.',
  'Show this review on the website': 'إظهار هذا التقييم على الموقع',
  'Saving...': 'جارٍ الحفظ...',
  'Save Review': 'حفظ التقييم',
  'Create Review': 'إنشاء تقييم',
  'Delete guest review?': 'حذف تقييم الضيف؟',
  'This will permanently delete the review.': 'سيُحذف هذا التقييم نهائيًا.',
  'Guest review updated': 'تم تحديث تقييم الضيف',
  'Guest review created': 'تم إنشاء تقييم الضيف',
  'Guest review deleted': 'تم حذف تقييم الضيف',
  'Could not save the guest review. Check all required fields.': 'تعذر حفظ تقييم الضيف. تحقق من البيانات.',
  'Could not delete the guest review.': 'تعذر حذف تقييم الضيف.',
  'Working...': 'جارٍ التنفيذ...',
  'Close confirmation modal': 'إغلاق نافذة التأكيد',
  Settings: 'الإعدادات',
  'WhatsApp notifications': 'إشعارات واتساب',
  'WhatsApp Service Configuration': 'إعداد خدمة واتساب',
  'Manage API endpoint credentials and notification phone number for booking confirmations and daily digests.': 'إدارة بيانات واجهة API ورقم هاتف الإشعارات لتأكيدات الحجز والملخصات اليومية.',
  'Could not load settings. Check that your backend is running.': 'تعذر تحميل الإعدادات. تحقق من تشغيل الخادم.',
  'WhatsApp API Base URL': 'رابط خدمة واتساب API',
  'Session ID / Name': 'معرّف / اسم الجلسة',
  'The session name registered in your WhatsApp API (default is': 'اسم الجلسة المسجل في واجهة واتساب API (الافتراضي هو',
  'API Key / Bearer Token': 'مفتاح API / رمز Bearer',
  'Saved token is hidden. Enter a new token to replace it.': 'الرمز المحفوظ مخفي. أدخل رمزًا جديدًا لاستبداله.',
  'Admin Notification Phone Number': 'رقم هاتف إشعارات الإدارة',
  'Number receiving admin alert messages when new bookings are submitted.': 'الرقم الذي يتلقى رسائل تنبيه الإدارة عند إرسال حجوزات جديدة.',
  'https://your-whatsapp-service.com': 'https://your-whatsapp-service.com',
  'e.g. 01273809805 or 201273809805': 'مثال: 01273809805 أو 201273809805',
  'WhatsApp settings updated successfully': 'تم تحديث إعدادات واتساب بنجاح',
  'Failed to update settings': 'تعذر تحديث الإعدادات',
  'API endpoint URL': 'رابط واجهة API',
  'API access token': 'رمز وصول API',
  'Session name': 'اسم الجلسة',
  'Admin notification phone': 'هاتف إشعارات الإدارة',
  'Endpoint URL hosting': 'رابط الخادم الذي يستضيف',
  'Leave blank if no authentication token is required': 'اتركه فارغًا إذا لم يكن رمز المصادقة مطلوبًا',
  'Passed in': 'يُمرر في',
  'Save Settings': 'حفظ الإعدادات',
  'Settings saved': 'تم حفظ الإعدادات',
  'Could not save settings.': 'تعذر حفظ الإعدادات.',
  'Signed in': 'تم تسجيل الدخول',
  'Invalid phone number or password': 'رقم الهاتف أو كلمة المرور غير صحيحين',
  'Phone number': 'رقم الهاتف',
  Password: 'كلمة المرور',
  'Signing in...': 'جارٍ تسجيل الدخول...',
  'Sign in': 'تسجيل الدخول',
};

function keepWhitespace(value: string, replacement: string) {
  const leadingWhitespace = value.match(/^\s*/)?.[0] ?? '';
  const trailingWhitespace = value.match(/\s*$/)?.[0] ?? '';
  return `${leadingWhitespace}${replacement}${trailingWhitespace}`;
}

function translateAdminValue(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return value;

  const translation = arabicText[trimmedValue];
  if (translation) return keepWhitespace(value, translation);

  const showing = trimmedValue.match(/^Showing (\d+)-(\d+) of (\d+)$/);
  if (showing) return keepWhitespace(value, `عرض ${showing[1]}-${showing[2]} من ${showing[3]}`);

  const guests = trimmedValue.match(/^(\d+) adults, (\d+) children$/);
  if (guests) return keepWhitespace(value, `${guests[1]} بالغ، ${guests[2]} طفل`);

  const arrival = trimmedValue.match(/^Arrival: (.+)$/);
  if (arrival) return keepWhitespace(value, `الوصول: ${arrival[1]}`);

  const deletedMessage = trimmedValue.match(/^This will permanently delete the message from (.+)\.$/);
  if (deletedMessage) return keepWhitespace(value, `سيُحذف نهائيًا الطلب المرسل من ${deletedMessage[1]}.`);

  const deletedReview = trimmedValue.match(/^This will permanently delete the review (?:from|by) (.+)\.$/);
  if (deletedReview) return keepWhitespace(value, `سيُحذف نهائيًا التقييم الخاص بـ ${deletedReview[1]}.`);

  return value;
}

function translateElementAttributes(element: Element) {
  for (const attribute of ['aria-label', 'title', 'placeholder', 'alt']) {
    const value = element.getAttribute(attribute);
    if (!value) continue;

    const translation = translateAdminValue(value);
    if (translation !== value) element.setAttribute(attribute, translation);
  }
}

function translateSubtree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    const translation = translateAdminValue(root.nodeValue ?? '');
    if (translation !== root.nodeValue) root.nodeValue = translation;
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    translateElementAttributes(root as Element);
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const parentTag = node.parentElement?.tagName;
    if (parentTag !== 'SCRIPT' && parentTag !== 'STYLE') {
      const translation = translateAdminValue(node.nodeValue ?? '');
      if (translation !== node.nodeValue) node.nodeValue = translation;
    }
    node = walker.nextNode();
  }
}

/** Applies the default Arabic locale to dashboard UI without changing public-site languages. */
export function useAdminArabicLocalization(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    translateSubtree(root);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          translateSubtree(mutation.target);
          return;
        }

        if (mutation.type === 'attributes') {
          translateElementAttributes(mutation.target as Element);
          return;
        }

        mutation.addedNodes.forEach((node) => translateSubtree(node));
      });
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['aria-label', 'title', 'placeholder', 'alt'],
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [rootRef]);
}
