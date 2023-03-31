import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const edited = i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.

  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          "Personal Info": "Personal Info",
          "Full name": "Full name",
          "Phone number": "Phone number",
          "Passport number": "Passport number",
          "Pick a picture": "Pick a picture",
          "Passport Picture": "Passport Picture",
          "Passport and face pic": "Passport and face pic",
          "Personal Picture": "Personal Picture",
          "Transportaion Info": "Transportaion Info",
          "Transprotaion method": "Transprotaion method",
          Car: "Car",
          Motorcycle: "Motorcycle",
          Truck: "Truck",
          Van: "Van",
          "vehicle Brand": "vehicle Brand",
          "vehicle picture": "vehicle picture",
          "Update Account": "Update Account",
          "": "",
          Error: "Error",
          "An Error occurred": "An Error occurred",
          "In Progress": "In Progress",
          "Updating Your Info": "Updating Your Info",
          Successful: "Successful",
          "Your Info was updated successfully":
            "Your Info was updated successfully",
          "Leave Order": "Leave Order",
          Duration: "Duration",
          Distance: "Distance",
          Name: "Name",
          QTY: "QTY",
          Image: "Image",
          Options: "Options",
          Instructions: "Instructions",
          Control: "Control",
          "No options": "No options",
          "No instructions": "No instructions",
          Cancel: "Cancel",
          "Show Options": "Show Options",
          "Use this if you are paid in cash only":
            "Use this if you are paid in cash only",
          "Set to paid": "Set to paid",
          "Delivery Fee": "Delivery Fee",
          Paid: "Paid",
          "Set Paid": "Set Paid",
          Report: "Report",
          "Your Report": "Your Report",
          Submit: "Submit",
          "Order Status": "Order Status",
          Map: "Map",
          Index: "Index",
          Quantity: "Quantity",
          Copied: "Copied",
          ID: "ID",
          "Payment method": "Payment method",
          Amount: "Amount",
          Validated: "Validated",
          Validate: "Validate",
          Transactions: "Transactions",
          "In progress": "In progress",
          Processing: "Processing",
          Success: "Success",
          "Last Name": "Last Name",
          driverPhone: "driverPhone",
          "Create Account": "Create Account",
          "Load more": "Load more",
          "Delivery date": "Delivery date",
          "See on map": "See on map",
          "Number of stores": "Number of stores",
          "signup successful": "signup successful",
          "just login now": "just login now",
          "does not match email pattern": "does not match email pattern",
          "Confirmation code": "Confirmation code",
          "New Password": "New Password",
          Change: "Change",
          "Confirm account": "Confirm account",
          "sending confirmation email": "sending confirmation email",
          "email was sent": "email was sent",
          "an error occured": "an error occured",
          "Resend Confirmation email": "Resend Confirmation email",
          "Logging in": "Logging in",
          "Login Successful": "Login Successful",
          LogIn: "LogIn",
          Signup: "Signup",
          "Not email pattern": "Not email pattern",
          "Forgot password": "Forgot password",
          "Orders History": "Orders History",
          All: "All",
          Accepted: "Accepted",
          "Take order": "Take order",
          "User Already Exists": "User Already Exists",
          "An account with this information already exists":
            "An account with this information already exists",
          "Signing up": "Signing up",
          "Check your Email for confirmation Email":
            "Check your Email for confirmation Email",
          "Signed up successfully": "Signed up successfully",
          "already have an account?": "already have an account?",
          Login: "Login",
          token: "token",
          tokenId: "tokenId",
          "Reset password": "Reset password",
          "New password": "New password",
          "Account wallet": "Account wallet",
          "choose a payment method": "choose a payment method",
          "Amount to pay": "Amount to pay",
          "Amount to add to wallet": "Amount to add to wallet",
          "Show payment gateway": "Show payment gateway",
          "edit if you want": "edit if you want",
          "write the paying phone number": "write the paying phone number",
          "write your birth year": "write your birth year",
          "Resend OTP": "Resend OTP",
          "Send OTP": "Send OTP",
          "write the OTP here": "write the OTP here",
          "Make payment": "Make payment",
          "OTP was resent": "OTP was resent",
          "check your messages": "check your messages",
          "OTP sent": "OTP sent",
          "Scan QR code": "Scan QR code",
          "Set as delivered": "Set as delivered",
          button: "button",
          "2d": "2d",
          In: "In",
          ",": ",",
          Country: "Country",
          City: "City",
          coords: "coords",
          "current coords": "current coords",
          "set Location": "set Location",
          Logout: "Logout",
          Balance: "Balance",
          Home: "Home",
          Proposals: "Proposals",
          "Order History": "Order History",
          "Active Order": "Active Order",
          account: "account",
          "how the app works": "how the app works",
          help: "help",
          LogOut: "LogOut",
          Tripoli: "Tripoli",
          Ajdabiya: "Ajdabiya",
          Zuwara: "Zuwara",
          Yafran: "Yafran",
          Nalut: "Nalut",
          Gharyan: "Gharyan",
          Al_Bayda: "Al_Bayda",
          Bani_Walid: "Bani_Walid",
          Al_Marj: "Al_Marj",
          Mizda: "Mizda",
          Benghazi: "Benghazi",
          Awbari: "Awbari",
          Tobruk: "Tobruk",
          Al_Khums: "Al_Khums",
          Murzuk: "Murzuk",
          Shahat: "Shahat",
          Sabratah: "Sabratah",
          Ghat: "Ghat",
          Sirte: "Sirte",
          Tajura: "Tajura",
          Misrata: "Misrata",
          Zawiya: "Zawiya",
          Sabha: "Sabha",
          Brak: "Brak",
          Ghadamis: "Ghadamis",
          Al_Abyar: "Al_Abyar",
          Tarhunah: "Tarhunah",
          Derna: "Derna",
          Waddan: "Waddan",
          Awjila: "Awjila",
          Suluq: "Suluq",
          Zelten: "Zelten",
          Qatrun: "Qatrun",
          Al_Qubbah: "Al_Qubbah",
          Tocra: "Tocra",
          Jalu: "Jalu",
          Zliten: "Zliten",
          Al_Jamīl: "Al_Jamīl",
          Brega: "Brega",
          Farzougha: "Farzougha",
          Sorman: "Sorman",
          Msallata: "Msallata",
          Kikla: "Kikla",
          "QTY found": "QTY found",
          Pay: "Pay",
          "Set as Picked up": "Set as Picked up",
          "Not found": "Not found",
          Pickup: "Pickup",
          Price: "Price",
          "Update proposal": "Update proposal",
          "Make proposal": "Make proposal",
          Delete: "Delete",
          Scan: "Scan",
          Picked: "Picked",
          script: "script",
          "?": "?",
          "content-type": "content-type",
          "web-vitals": "web-vitals",
          Hrs: "Hrs",
          Mins: "Mins",
        },
      },
      ar: {
        translation: {
          "Personal Info": "معلومات شخصية",
          "Full name": "الاسم الكامل",
          "Phone number": "رقم الهاتف",
          "Passport number": "رقم الجواز",
          "Pick a picture": "اختر صورة",
          "Passport Picture": "صورة الجواز",
          "Passport and face pic": "صورة الجواز والوجه",
          "Personal Picture": "الصورة الشخصية",
          "Transportaion Info": "معلومات النقل",
          "Transprotaion method": "طريقة النقل",
          Car: "سيارة",
          Motorcycle: "دراجة نارية",
          Truck: "شاحنة",
          Van: "فان",
          "vehicle Brand": "ماركة المركبة",
          "vehicle picture": "صورة المركبة",
          "Update Account": "تحديث الحساب",
          "": "",
          Error: "خطأ",
          "An Error occurred": "حدث خطأ",
          "In Progress": "قيد التنفيذ",
          "Updating Your Info": "تحديث معلوماتك",
          Successful: "ناجح",
          "Your Info was updated successfully": "تم تحديث معلوماتك بنجاح",
          "Leave Order": "اترك الطلب",
          Duration: "المدة",
          Distance: "المسافة",
          Name: "الاسم",
          QTY: "الكمية",
          Image: "الصورة",
          Options: "الخيارات",
          Instructions: "التعليمات",
          Control: "التحكم",
          "No options": "لا توجد خيارات",
          "No instructions": "لا توجد تعليمات",
          Cancel: "إلغاء",
          "Show Options": "عرض الخيارات",
          "Use this if you are paid in cash only":
            "استخدم هذا إذا تم دفعك بالنقد فقط",
          "Set to paid": "تم الدفع",
          "Delivery Fee": "رسوم التوصيل",
          Paid: "تم الدفع",
          "Set Paid": "تم الدفع",
          Report: "تقرير",
          "Your Report": "تقريرك",
          Submit: "إرسال",
          "Order Status": "حالة الطلب",
          Map: "الخريطة",
          Index: "الفهرس",
          Quantity: "الكمية",
          Copied: "تم النسخ",
          ID: "المعرف",
          "Payment method": "طريقة الدفع",
          Amount: "المبلغ",
          Validated: "تم التحقق",
          Validate: "تحقق",
          Transactions: "المعاملات",
          "In progress": "جارية",
          Processing: "قيد المعالجة",
          Success: "نجاح",
          "Last Name": "الاسم الأخير",
          driverPhone: "هاتف السائق",
          "Create Account": "إنشاء حساب",
          "Load more": "تحميل المزيد",
          "Delivery date": "تاريخ التسليم",
          "See on map": "عرض على الخريطة",
          "Number of stores": "عدد المتاجر",
          "signup successful": "تم التسجيل بنجاح",
          "just login now": "تسجيل الدخول الآن",
          "does not match email pattern": "لا يتطابق مع نمط البريد الإلكتروني",
          "Confirmation code": "رمز التأكيد",
          "New Password": "كلمة المرور الجديدة",
          Change: "تغيير",
          "Confirm account": "تأكيد الحساب",
          "sending confirmation email": "إرسال رسالة تأكيد البريد الإلكتروني",
          "email was sent": "تم إرسال البريد الإلكتروني",
          "an error occured": "حدث خطأ",
          "Resend Confirmation email":
            "إعادة إرسال رسالة تأكيد البريد الإلكتروني",
          "Logging in": "تسجيل الدخول",
          "Login Successful": "تسجيل الدخول ناجح",
          LogIn: "تسجيل الدخول",
          Signup: "تسجيل",
          "Not email pattern": "ليس نمط بريد إلكتروني",
          "Forgot password": "هل نسيت كلمة المرور",
          "Orders History": "تاريخ الطلبات",
          All: "الكل",
          Accepted: "تم القبول",
          "Take order": "تقديم الطلب",
          "User Already Exists": "المستخدم موجود بالفعل",
          "An account with this information already exists":
            "يوجد حساب بهذه المعلومات بالفعل",
          "Signing up": "جاري التسجيل",
          "Check your Email for confirmation Email":
            "تحقق من بريدك الإلكتروني للحصول على رسالة تأكيد البريد الإلكتروني",
          "Signed up successfully": "تم التسجيل بنجاح",
          "already have an account?": "هل لديك حساب بالفعل؟",
          Login: "تسجيل الدخول",
          token: "رمز",
          tokenId: "معرف الرمز",
          "Reset password": "إعادة تعيين كلمة المرور",
          "New password": "كلمة مرور جديدة",
          "Account wallet": "محفظة الحساب",
          "choose a payment method": "اختر طريقة الدفع",
          "Amount to pay": "المبلغ المطلوب دفعه",
          "Amount to add to wallet": "المبلغ الذي سيتم إضافته إلى المحفظة",
          "Show payment gateway": "عرض بوابة الدفع",
          "edit if you want": "تحرير إذا كنت تريد",
          "write the paying phone number": "اكتب رقم الهاتف الذي ستدفع منه",
          "write your birth year": "اكتب سنة ميلادك",
          "Resend OTP": "إعادة إرسال OTP",
          "Send OTP": "إرسال OTP",
          "write the OTP here": "اكتب OTP هنا",
          "Make payment": "إجراء الدفع",
          "OTP was resent": "تم إعادة إرسال OTP",
          "check your messages": "تحقق من رسائلك",
          "OTP sent": "تم إرسال OTP",
          "Scan QR code": "مسح رمز الاستجابة السريعة",
          "Set as delivered": "تم تسليم الطلب",
          button: "زر",
          "2d": "ثنائي الأبعاد",
          In: "في",
          ",": "،",
          Country: "الدولة",
          City: "المدينة",
          coords: "إحداثيات",
          "current coords": "الإحداثيات الحالية",
          "set Location": "تحديد الموقع",
          Logout: "تسجيل الخروج",
          Balance: "الرصيد",
          Home: "الصفحة الرئيسية",
          Proposals: "المقترحات",
          "Order History": "تاريخ الطلبات",
          "Active Order": "الطلبات النشطة",
          account: "الحساب",
          "how the app works": "كيفية عمل التطبيق",
          help: "مساعدة",
          LogOut: "تسجيل الخروج",
          Tripoli: "طرابلس",
          Ajdabiya: "أجدابيا",
          Zuwara: "زوارة",
          Yafran: "يفرن",
          Nalut: "نالوت",
          Gharyan: "غريان",
          Al_Bayda: "البيضاء",
          Bani_Walid: "بني وليد",
          Al_Marj: "المرج",
          Mizda: "مزدة",
          Benghazi: "بنغازي",
          Awbari: "أوباري",
          Tobruk: "طبرق",
          Al_Khums: "الخمس",
          Murzuk: "مرزق",
          Shahat: "شحات",
          Sabratah: "صبراتة",
          Ghat: "غات",
          Sirte: "سرت",
          Tajura: "تاجوراء",
          Misrata: "مصراتة",
          Zawiya: "الزاوية",
          Sabha: "سبها",
          Brak: "البراك",
          Ghadamis: "غدامس",
          Al_Abyar: "الأبيار",
          Tarhunah: "ترهونة",
          Derna: "درنة",
          Waddan: "وادان",
          Awjila: "أوجلة",
          Suluq: "سلوق",
          Zelten: "زلطن",
          Qatrun: "قطرن",
          Al_Qubbah: "القبة",
          Tocra: "توكرة",
          Jalu: "جالو",
          Zliten: "زليتن",
          Al_Jamīl: "الجميل",
          Brega: "بريقة",
          Farzougha: "الفرزوقة",
          Sorman: "صرمان",
          Msallata: "مسلاتة",
          Kikla: "كيكلا",
          "QTY found": "الكمية الموجودة",
          Pay: "دفع",
          "Set as Picked up": "تعيين كتم استلام",
          "Not found": "غير موجود",
          Pickup: "استلام",
          Price: "السعر",
          "Update proposal": "تحديث الاقتراح",
          "Make proposal": "عمل اقتراح",
          Delete: "حذف",
          Scan: "مسح",
          Picked: "تم الاستلام",
          script: "سكريبت",
          "?": "؟",
          "content-type": "نوع المحتوى",
          "web-vitals": "معايير الويب",
          Hrs: "ساعات",
          Mins: "دقائق",
        },
      },
    },
  });

export default edited;