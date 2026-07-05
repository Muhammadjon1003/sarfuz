import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Brain, BarChart3, Shield, Users, BookOpen, Zap, Star, ChevronDown,
  ChevronRight, Menu, X, Check, Play, Award, TrendingUp, Bell,
  MessageSquare, FileText, Search, GraduationCap, Building2, Layers,
  Globe, Lock, Bot, Coins, Trophy, Target, ArrowRight, Mail, Phone,
  MapPin, ClipboardCheck, PenTool, Video, Lightbulb,
  Activity, UserCheck, AlertCircle, LayoutDashboard, CalendarCheck,
  DollarSign, Wifi, Sun, Moon, Languages, Send, ShieldCheck, KeyRound,
  ServerCrash, DatabaseBackup, Fingerprint, Linkedin, Twitter, Youtube,
  Instagram, Facebook,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import eduselfLogo from "@/imports/IMG_20260126_000615_196-2.png";

const DEMO_URL = "https://mylms.eduself.uz";
const TG_BOT_TOKEN = "REPLACE_WITH_BOT_TOKEN";
const TG_CHAT_ID = "REPLACE_WITH_CHAT_ID";
type Locale = "en" | "ru" | "uz";

const T = {
  en: {
    nav: { platform: "Platform", features: "Features", ai: "AI", analytics: "Analytics", pricing: "Pricing", contact: "Contact", signIn: "Sign in", bookDemo: "Book a demo" },
    hero: { badge: "Enterprise AI-Powered LMS", headline1: "Learning that", headline2: "evolves with AI", sub: "EduSelf is the all-in-one LMS trusted by 2,400+ institutions worldwide. AI grading, predictive analytics, Telegram bots, and gamification — built for schools, universities, and corporate academies.", cta1: "Start free trial", cta2: "Watch 3-min demo", reviews: "From 1,200+ reviews on G2 & Capterra" },
    why: { badge: "Why EduSelf", title: "Built for the way institutions actually work", sub: "Not a retrofit. EduSelf was designed from day one for multi-role, multi-campus, AI-augmented education.", items: [{ title: "AI at the core", desc: "17 AI modules embedded in every workflow — not bolted on as an add-on." }, { title: "Every role, purpose-built", desc: "Admin, teacher, student, parent — each role gets a tailored experience, not a reskin." }, { title: "Enterprise-grade reliability", desc: "99.97% uptime SLA, SOC 2 Type II, GDPR-compliant, on-premise option." }] },
    platform: { badge: "Platform", title: "One platform, every role", sub: "Admin, teacher, student, parent — each role gets a purpose-built experience backed by the same shared data layer.", explore: "Explore", features: "features" },
    features: { badge: "Features", title: "Everything your institution needs", sub: "26+ features spanning academic delivery, student engagement, operations, security, and integrations — all in one platform.", search: "Search features…", noResults: "No features match your search." },
    ai: { badge: "AI Features", title: "Intelligence at every touchpoint", sub: "17 AI modules working continuously — grading, predicting, personalising, and reporting.", metrics: [{ value: "12 hrs", label: "Saved per teacher per week" }, { value: "4 wks", label: "Dropout risk predicted in advance" }, { value: "98.4%", label: "AI grading accuracy vs. human" }, { value: "<2s", label: "Test generation time" }] },
    analytics: { badge: "Analytics", title: "Data that drives decisions", sub: "Real-time monitoring, AI-powered insights, and interactive dashboards — from attendance heatmaps to system health." },
    telegram: { badge: "Telegram Integration", title: "Your LMS in every pocket", sub: "Role-aware Telegram bots deliver the right data to the right person the moment it matters — no app install required.", roles: [{ role: "Student", flows: ["Check grades & homework", "Receive exam reminders", "AI study chatbot", "Download certificates", "View timetable", "Pay fees"] }, { role: "Teacher", flows: ["Post assignments", "Mark attendance", "Get submission alerts", "Send announcements", "View class analytics", "Report generation"] }, { role: "Parent", flows: ["Attendance alerts", "Grade notifications", "Payment invoices", "Teacher messages", "Monthly AI reports", "Exam schedule"] }, { role: "Admin", flows: ["Security event alerts", "New enrollment notices", "Financial summaries", "System health pings", "Broadcast messages", "Audit log digest"] }] },
    gamification: { badge: "Gamification", title: "Make learning addictively rewarding", sub: "Coins, badges, leaderboards, team challenges, and a rewards marketplace keep students engaged every day — not just before exams." },
    security: { badge: "Security", title: "Enterprise security, zero compromise", sub: "SOC 2 Type II certified, GDPR-compliant, with granular role permissions, immutable audit logs, and active threat detection.", items: [{ title: "Role & Permission Matrix", desc: "Granular access control across 6 roles with field-level and action-level overrides." }, { title: "Immutable Audit Logs", desc: "Every action logged with timestamp, IP, device, and actor — tamper-proof, exportable." }, { title: "Threat Detection", desc: "Anomaly detection on logins, API calls, and bulk exports with real-time security alerts." }, { title: "Data Encryption", desc: "AES-256 at rest, TLS 1.3 in transit. Choose your data region: EU, US, or Uzbekistan." }, { title: "Automated Backups", desc: "Daily encrypted backups with point-in-time recovery up to 90 days." }, { title: "SSO & MFA", desc: "Google Workspace, Microsoft Entra, SAML 2.0, plus enforced MFA for admin accounts." }] },
    pricing: { badge: "Pricing", title: "Simple, scalable pricing", sub: "All plans include a 30-day free trial. No credit card required. Upgrade or cancel anytime." },
    faq: { badge: "FAQ", title: "Common questions", sub: "Everything you need to know before booking a demo.", search: "Search questions…" },
    contact: { badge: "Contact", title: "Ready to transform your institution?", sub: "Book a 30-minute demo with our team. We'll walk through your specific use case, answer every technical question, and build a custom rollout plan.", name: "Full name", email: "Work email", org: "Institution / company", message: "Message (optional)", placeholder: { name: "Dr. Aziz Karimov", email: "aziz@university.uz", org: "Tashkent State University", message: "Tell us about your institution and goals…" }, submit: "Book a demo", success: "Message received!", successSub: "We'll get back to you within 4 business hours." },
    cta: { title: "Ready to modernise your institution?", sub: "Join schools and universities already running on EduSelf. Setup takes minutes, not months.", primary: "Start free trial", secondary: "Book a demo" },
    footer: { desc: "Enterprise AI-powered learning management for schools, universities, and corporate academies worldwide.", product: "Product", company: "Company", legal: "Legal", copy: "© 2025 EduSelf Technologies Inc. All rights reserved.", status: "All systems operational" },
    about: { title: "About EduSelf", content: [{ heading: "Our Mission", text: "EduSelf was founded in 2025 in Tashkent, Uzbekistan, with one mission: make AI-powered, enterprise-grade education accessible to every institution — from a 50-student academy to a 100,000-student university." }, { heading: "What We Build", text: "We build the operating system for modern education. EduSelf unifies course management, AI grading, attendance, gamification, Telegram integration, financial management, and real-time analytics into one platform used by 2,400+ institutions in 30+ countries." }, { heading: "Our Team", text: "We're a team of 120+ educators, engineers, and AI researchers based in Tashkent, Dubai, and New York. Our advisors include former CIOs of leading universities and AI researchers from Stanford and MIT." }, { heading: "Global Presence", text: "Offices in Tashkent (HQ), Dubai, and New York. Data centres in the EU, US, and Uzbekistan. Serving institutions in Central Asia, the Middle East, Europe, and North America." }] },
    privacy: { title: "Privacy Policy", content: [{ heading: "Data We Collect", text: "We collect account registration data (name, email, institution), usage data (logins, feature interactions), and content data (course materials, assignments, grades). We never sell personal data to third parties." }, { heading: "How We Use Your Data", text: "Your data powers the EduSelf platform: personalised learning paths, AI grading, analytics dashboards, and Telegram notifications. Aggregate, anonymised data may be used to improve AI models." }, { heading: "GDPR Compliance", text: "EduSelf is fully GDPR-compliant. EU data is stored in Frankfurt, Germany. You may request access to, rectification of, or erasure of your personal data at privacy@eduself.io at any time." }, { heading: "Data Retention", text: "Active account data is retained for the duration of your subscription plus 90 days. Upon account termination you may export all data within 30 days before it is securely deleted." }, { heading: "Security", text: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified and conduct annual third-party penetration tests." }, { heading: "Contact", text: "Data Protection Officer: dpo@eduself.io | privacy@eduself.io | EduSelf Technologies Inc., 47 Amir Timur Ave, Tashkent 100084, Uzbekistan." }] },
    terms: { title: "Terms of Service", content: [{ heading: "Acceptance of Terms", text: "By accessing or using EduSelf, you agree to these Terms of Service. If you are using EduSelf on behalf of an institution, you represent that you have authority to bind that institution to these terms." }, { heading: "Service Description", text: "EduSelf provides a cloud-based learning management system including course management, AI-assisted grading, analytics, gamification, and Telegram bot integration. Features available depend on your subscription plan." }, { heading: "User Obligations", text: "You agree not to misuse the platform, attempt to gain unauthorised access, transmit malicious code, or use EduSelf to violate any applicable law. Institutions are responsible for user conduct within their account." }, { heading: "Intellectual Property", text: "EduSelf and its licensors own all rights in the platform. Your content (courses, materials) remains yours. You grant EduSelf a limited licence to host and process your content solely to provide the service." }, { heading: "Limitation of Liability", text: "EduSelf's liability is limited to the amount paid in the 12 months preceding any claim. We are not liable for indirect, incidental, or consequential damages. Uptime guarantees are defined in your SLA." }, { heading: "Governing Law", text: "These terms are governed by the laws of the Republic of Uzbekistan. Disputes shall be resolved in the courts of Tashkent. For international customers, ICC arbitration may apply per your Enterprise agreement." }] },
  },
  ru: {
    nav: { platform: "Платформа", features: "Функции", ai: "ИИ", analytics: "Аналитика", pricing: "Цены", contact: "Контакты", signIn: "Войти", bookDemo: "Заказать демо" },
    hero: { badge: "Корпоративная LMS на базе ИИ", headline1: "Обучение, которое", headline2: "развивается с ИИ", sub: "EduSelf — комплексная LMS, которой доверяют 2 400+ учебных заведений по всему миру. ИИ-оценка, предиктивная аналитика, Telegram-боты и геймификация.", cta1: "Начать бесплатно", cta2: "Смотреть демо (3 мин)", reviews: "По 1 200+ отзывам на G2 и Capterra" },
    why: { badge: "Почему EduSelf", title: "Создан так, как работают учебные заведения", sub: "Не надстройка. EduSelf спроектирован с первого дня для многоролевого, многокампусного, ИИ-усиленного образования.", items: [{ title: "ИИ в основе", desc: "17 ИИ-модулей встроены в каждый рабочий процесс — не как дополнение, а как основа." }, { title: "Для каждой роли", desc: "Администратор, учитель, студент, родитель — каждая роль получает свой интерфейс." }, { title: "Корпоративная надёжность", desc: "SLA 99,97%, SOC 2 Type II, GDPR, возможность on-premise." }] },
    platform: { badge: "Платформа", title: "Одна платформа — для каждой роли", sub: "Каждая роль получает целевой интерфейс на основе единого слоя данных.", explore: "Подробнее", features: "возможностях" },
    features: { badge: "Функции", title: "Всё, что нужно вашему учебному заведению", sub: "26+ функций в одной платформе.", search: "Поиск функций…", noResults: "Функции не найдены." },
    ai: { badge: "Функции ИИ", title: "Интеллект на каждом этапе", sub: "17 ИИ-модулей работают непрерывно — оценивают, прогнозируют, персонализируют и формируют отчёты.", metrics: [{ value: "12 ч", label: "Экономия преподавателя в неделю" }, { value: "4 нед", label: "Раннее выявление риска отчисления" }, { value: "98,4%", label: "Точность ИИ-оценки vs. человек" }, { value: "<2 с", label: "Генерация теста" }] },
    analytics: { badge: "Аналитика", title: "Данные, которые меняют решения", sub: "Мониторинг в реальном времени, ИИ-инсайты и интерактивные дашборды." },
    telegram: { badge: "Интеграция с Telegram", title: "Ваша LMS в каждом кармане", sub: "Ролевые Telegram-боты доставляют нужные данные нужному человеку в нужный момент.", roles: [{ role: "Студент", flows: ["Оценки и домашние задания", "Напоминания об экзаменах", "ИИ-чат для учёбы", "Скачать сертификат", "Расписание занятий", "Оплата обучения"] }, { role: "Учитель", flows: ["Публикация заданий", "Отметка посещаемости", "Уведомления о сдаче работ", "Рассылка объявлений", "Аналитика класса", "Генерация отчётов"] }, { role: "Родитель", flows: ["Уведомления о пропусках", "Уведомления об оценках", "Счета на оплату", "Сообщения учителей", "Ежемесячные ИИ-отчёты", "Расписание экзаменов"] }, { role: "Администратор", flows: ["Предупреждения о безопасности", "Новые зачисления", "Финансовые сводки", "Состояние системы", "Рассылка сообщений", "Дайджест журнала аудита"] }] },
    gamification: { badge: "Геймификация", title: "Сделайте обучение увлекательным", sub: "Монеты, значки, рейтинги, командные задания и маркетплейс наград — каждый день." },
    security: { badge: "Безопасность", title: "Корпоративная безопасность без компромиссов", sub: "Сертификат SOC 2 Type II, соответствие GDPR, гранулярные права доступа, неизменяемые журналы аудита.", items: [{ title: "Матрица ролей и прав", desc: "Гранулярный контроль доступа для 6 ролей с переопределением." }, { title: "Неизменяемые журналы аудита", desc: "Каждое действие записывается с метаданными: время, IP, устройство." }, { title: "Обнаружение угроз", desc: "Поведенческий анализ входов, API-вызовов и массовых экспортов." }, { title: "Шифрование данных", desc: "AES-256 в хранилище, TLS 1.3 в транзите. Выберите регион: ЕС, США или Узбекистан." }, { title: "Автоматическое резервирование", desc: "Ежедневные зашифрованные резервные копии с восстановлением до 90 дней." }, { title: "SSO и MFA", desc: "Google Workspace, Microsoft Entra, SAML 2.0 и обязательный MFA для администраторов." }] },
    pricing: { badge: "Цены", title: "Простые и масштабируемые тарифы", sub: "Все планы включают 30-дневный пробный период. Без кредитной карты." },
    faq: { badge: "Вопросы и ответы", title: "Частые вопросы", sub: "Всё, что нужно знать перед заказом демо.", search: "Поиск вопросов…" },
    contact: { badge: "Контакты", title: "Готовы трансформировать своё учебное заведение?", sub: "Закажите 30-минутное демо. Мы разберём ваш кейс, ответим на технические вопросы и составим план внедрения.", name: "Полное имя", email: "Рабочий e-mail", org: "Учебное заведение / компания", message: "Сообщение (необязательно)", placeholder: { name: "Д-р Азиз Каримов", email: "aziz@university.uz", org: "Ташкентский государственный университет", message: "Расскажите о вашем учебном заведении…" }, submit: "Заказать демо", success: "Сообщение получено!", successSub: "Мы ответим в течение 4 рабочих часов." },
    cta: { title: "Готовы модернизировать учебное заведение?", sub: "Присоединяйтесь к школам и университетам на EduSelf. Запуск — за минуты.", primary: "Начать бесплатно", secondary: "Заказать демо" },
    footer: { desc: "Корпоративная LMS на базе ИИ для школ, университетов и корпоративных академий по всему миру.", product: "Продукт", company: "Компания", legal: "Юридическое", copy: "© 2025 EduSelf Technologies Inc. Все права защищены.", status: "Все системы работают" },
    about: { title: "О компании EduSelf", content: [{ heading: "Наша миссия", text: "EduSelf основана в 2025 году в Ташкенте с одной целью: сделать ИИ-образование корпоративного уровня доступным для каждого учебного заведения." }, { heading: "Что мы создаём", text: "Мы создаём операционную систему для современного образования: управление курсами, ИИ-оценка, аналитика, геймификация, интеграция с Telegram и финансовый менеджмент." }, { heading: "Наша команда", text: "120+ педагогов, инженеров и ИИ-исследователей в Ташкенте, Дубае и Нью-Йорке." }, { heading: "Глобальное присутствие", text: "Офисы в Ташкенте (штаб-квартира), Дубае и Нью-Йорке. Центры обработки данных в ЕС, США и Узбекистане." }] },
    privacy: { title: "Политика конфиденциальности", content: [{ heading: "Данные, которые мы собираем", text: "Мы собираем регистрационные данные (имя, e-mail, учебное заведение), данные использования и данные контента (курсы, задания, оценки). Мы никогда не продаём личные данные третьим лицам." }, { heading: "Как мы используем данные", text: "Ваши данные обеспечивают работу платформы EduSelf: персонализированные пути обучения, ИИ-оценка, аналитика и Telegram-уведомления." }, { heading: "Соответствие GDPR", text: "EduSelf полностью соответствует GDPR. Данные ЕС хранятся во Франкфурте. Вы можете запросить доступ, исправление или удаление личных данных по адресу privacy@eduself.io." }, { heading: "Хранение данных", text: "Данные активного аккаунта хранятся в течение срока подписки плюс 90 дней. При расторжении договора вы можете экспортировать все данные в течение 30 дней." }, { heading: "Безопасность", text: "Все данные зашифрованы в хранилище (AES-256) и в транзите (TLS 1.3). Мы сертифицированы SOC 2 Type II." }, { heading: "Контакты", text: "DPO: dpo@eduself.io | privacy@eduself.io | EduSelf Technologies Inc., пр. Амира Темура 47, Ташкент 100084, Узбекистан." }] },
    terms: { title: "Условия использования", content: [{ heading: "Принятие условий", text: "Используя EduSelf, вы соглашаетесь с настоящими Условиями использования. Если вы используете EduSelf от имени учреждения, вы подтверждаете наличие полномочий." }, { heading: "Описание услуги", text: "EduSelf предоставляет облачную LMS, включая управление курсами, ИИ-оценку, аналитику, геймификацию и интеграцию с Telegram-ботом." }, { heading: "Обязательства пользователя", text: "Вы соглашаетесь не злоупотреблять платформой, не пытаться получить несанкционированный доступ и не использовать EduSelf для нарушения законодательства." }, { heading: "Интеллектуальная собственность", text: "EduSelf и её лицензиары владеют всеми правами на платформу. Ваш контент остаётся вашим." }, { heading: "Ограничение ответственности", text: "Ответственность EduSelf ограничена суммой, уплаченной за 12 месяцев, предшествующих претензии." }, { heading: "Применимое право", text: "Настоящие условия регулируются законодательством Республики Узбекистан. Споры разрешаются в судах Ташкента." }] },
  },
  uz: {
    nav: { platform: "Platforma", features: "Imkoniyatlar", ai: "Sun'iy intellekt", analytics: "Tahlil", pricing: "Narxlar", contact: "Aloqa", signIn: "Kirish", bookDemo: "Demo buyurtma" },
    hero: { badge: "Korporativ AI-asosli LMS", headline1: "Sun'iy intellekt bilan", headline2: "rivojlanadigan ta'lim", sub: "EduSelf — butun dunyo bo'ylab 2 400+ ta muassasa ishongan yaxlit LMS. AI-baholash, prediktiv tahlil, Telegram botlar va geymifikatsiya — maktablar, universitetlar va korporativ akademiyalar uchun.", cta1: "Bepul boshlash", cta2: "3 daqiqalik demoni ko'rish", reviews: "G2 va Capterra da 1 200+ ta sharh asosida" },
    why: { badge: "Nima uchun EduSelf", title: "Ta'lim muassasalari ishlash usuli uchun yaratilgan", sub: "Moslashtirish emas. EduSelf ko'p rolali, ko'p kampusli, AI-kuchaytirilgan ta'lim uchun birinchi kundan boshlab loyihalangan.", items: [{ title: "AI — asos", desc: "17 ta AI moduli har bir ish jarayoniga o'rnatilgan — qo'shimcha sifatida emas, asosiy qism sifatida." }, { title: "Har bir rol uchun", desc: "Admin, o'qituvchi, talaba, ota-ona — har bir rol o'z interfeysiga ega." }, { title: "Korporativ ishonchlilik", desc: "99,97% SLA, SOC 2 Type II, GDPR, on-premise imkoniyati." }] },
    platform: { badge: "Platforma", title: "Bitta platforma — har bir rol uchun", sub: "Har bir rol bir xil ma'lumotlar qatlami asosida maqsadli interfeys oladi.", explore: "Batafsil", features: "imkoniyatlarini ko'rish" },
    features: { badge: "Imkoniyatlar", title: "Muassasangiz uchun zarur bo'lgan hamma narsa", sub: "Bitta platformada 26+ imkoniyat.", search: "Imkoniyatlarni qidirish…", noResults: "Qidiruv natijasi topilmadi." },
    ai: { badge: "AI Imkoniyatlari", title: "Har bir nuqtada intellekt", sub: "17 ta AI moduli uzluksiz ishlaydi — baholaydi, bashorat qiladi, moslashtiradi va hisobot beradi.", metrics: [{ value: "12 soat", label: "O'qituvchi haftada tejagan vaqt" }, { value: "4 hafta", label: "Talaba riski oldindan bashorat" }, { value: "98,4%", label: "AI baholash aniqligi" }, { value: "<2 s", label: "Test yaratish vaqti" }] },
    analytics: { badge: "Tahlil", title: "Qarorlarni shakllantiruvchi ma'lumotlar", sub: "Real vaqt monitoringi, AI-asosli tahlil va interaktiv dashboardlar." },
    telegram: { badge: "Telegram integratsiyasi", title: "LMS siz bilan — har joyda", sub: "Rol-asosli Telegram botlar kerakli ma'lumotni kerakli odamga kerakli paytda yetkazadi — ilova o'rnatishsiz.", roles: [{ role: "Talaba", flows: ["Baholar va vazifalar", "Imtihon eslatmalari", "AI o'rganish chati", "Sertifikat yuklab olish", "Dars jadvali", "To'lov amalga oshirish"] }, { role: "O'qituvchi", flows: ["Topshiriq yuborish", "Davomat belgilash", "Ish topshirish bildirishnomalari", "E'lon tarqatish", "Sinf tahlili", "Hisobot yaratish"] }, { role: "Ota-ona", flows: ["Davomat ogohlantirishlari", "Baho bildirishnomalari", "To'lov hisob-fakturalari", "O'qituvchi xabarlari", "Oylik AI hisobotlar", "Imtihon jadvali"] }, { role: "Admin", flows: ["Xavfsizlik ogohlantirishlar", "Yangi ro'yxatga olish", "Moliyaviy xulosalar", "Tizim holati", "Xabar tarqatish", "Audit jurnali xulosasi"] }] },
    gamification: { badge: "Geymifikatsiya", title: "O'rganishni jozibali qiling", sub: "Tangalar, nishonlar, reytinglar, jamoa musobaqa va mukofotlar bozori — har kuni." },
    security: { badge: "Xavfsizlik", title: "Korporativ xavfsizlik — hech qanday murosasiz", sub: "SOC 2 Type II sertifikati, GDPR muvofiqlik, granular rol huquqlari, o'zgarmas audit jurnallari.", items: [{ title: "Rol va ruxsatlar matritsasi", desc: "6 ta rol uchun maydon va amal darajasida granular kirishni boshqarish." }, { title: "O'zgarmas audit jurnallari", desc: "Har bir amal vaqt belgisi, IP, qurilma va foydalanuvchi bilan qayd etiladi." }, { title: "Tahdidni aniqlash", desc: "Kirish, API chaqiruvlar va eksportlar uchun anomaliyalarni aniqlash." }, { title: "Ma'lumotlarni shifrlash", desc: "AES-256 saqlashda, TLS 1.3 uzatishda. Mintaqani tanlang: EU, US yoki O'zbekiston." }, { title: "Avtomatik zaxira nusxa", desc: "90 kungacha tiklash imkoniyati bilan kunlik shifrlangan zaxira nusxalar." }, { title: "SSO va MFA", desc: "Google Workspace, Microsoft Entra, SAML 2.0 va admin uchun majburiy MFA." }] },
    pricing: { badge: "Narxlar", title: "Oddiy va miqyoslanuvchi narxlar", sub: "Barcha rejalar 30 kunlik bepul sinov davrini o'z ichiga oladi. Kredit karta talab etilmaydi." },
    faq: { badge: "Savol-javob", title: "Ko'p beriladigan savollar", sub: "Demo buyurtma berishdan oldin bilishingiz kerak bo'lgan hamma narsa.", search: "Savollarni qidirish…" },
    contact: { badge: "Aloqa", title: "Muassasangizni o'zgartira olasizmi?", sub: "30 daqiqalik demo buyurtma bering. Biz sizning holatingizni ko'rib chiqamiz va joriy etish rejasini tuzamiz.", name: "To'liq ism", email: "Ish e-maili", org: "Muassasa / kompaniya", message: "Xabar (ixtiyoriy)", placeholder: { name: "Dr. Aziz Karimov", email: "aziz@university.uz", org: "Toshkent davlat texnika universiteti", message: "Muassasangiz va maqsadlaringiz haqida yozing…" }, submit: "Demo buyurtma berish", success: "Xabar qabul qilindi!", successSub: "4 ish soati ichida javob beramiz." },
    cta: { title: "Muassasangizni modernizatsiya qilishga tayyormisiz?", sub: "EduSelf'da ishlayotgan maktab va universitetga qo'shiling. Sozlash daqiqalar ichida.", primary: "Bepul boshlash", secondary: "Demo buyurtma" },
    footer: { desc: "Maktablar, universitetlar va korporativ akademiyalar uchun AI-asosli korporativ ta'lim boshqarish tizimi.", product: "Mahsulot", company: "Kompaniya", legal: "Huquqiy", copy: "© 2025 EduSelf Technologies Inc. Barcha huquqlar himoyalangan.", status: "Barcha tizimlar ishlayapti" },
    about: { title: "EduSelf haqida", content: [{ heading: "Bizning missiyamiz", text: "EduSelf 2025 yilda Toshkentda bitta maqsad bilan tashkil etildi: AI-asosli korporativ darajadagi ta'limni har bir muassasaga ochiq qilish." }, { heading: "Nima yaratamiz", text: "Zamonaviy ta'lim uchun operatsion tizim: kurs boshqaruvi, AI baholash, tahlil, geymifikatsiya, Telegram integratsiyasi va moliyaviy boshqaruv." }, { heading: "Jamoamiz", text: "Toshkent, Dubai va Nyu-Yorkda joylashgan 120+ ta pedagog, muhandis va AI tadqiqotchilari." }, { heading: "Global mavjudlik", text: "Toshkent (bosh ofis), Dubai va Nyu-York'da ofislar. EU, US va O'zbekistonda ma'lumotlar markazlari." }] },
    privacy: { title: "Maxfiylik siyosati", content: [{ heading: "Yig'adigan ma'lumotlarimiz", text: "Biz hisob ro'yxatdan o'tish ma'lumotlari (ism, e-mail, muassasa), foydalanish ma'lumotlari va kontent ma'lumotlarini yig'amiz. Shaxsiy ma'lumotlarni hech qachon uchinchi tomonlarga sotmaymiz." }, { heading: "Ma'lumotlardan foydalanish", text: "Sizning ma'lumotlaringiz EduSelf platformasini ishlatadi: shaxsiylashtirilgan o'rganish yo'llari, AI baholash, tahlil va Telegram bildirinomalari." }, { heading: "GDPR muvofiqlik", text: "EduSelf to'liq GDPR-muvofiq. EU ma'lumotlari Frankfurt, Germaniyada saqlanadi. privacy@eduself.io manziliga murojaat qilib shaxsiy ma'lumotlarga kirish so'rovi berishingiz mumkin." }, { heading: "Ma'lumotlarni saqlash", text: "Faol hisob ma'lumotlari obuna muddati davomida va undan keyin 90 kun saqlanadi. Hisobni yopishda 30 kun ichida barcha ma'lumotlarni eksport qilishingiz mumkin." }, { heading: "Xavfsizlik", text: "Barcha ma'lumotlar saqlashda (AES-256) va uzatishda (TLS 1.3) shifrlanadi. SOC 2 Type II sertifikatiga egamiz." }, { heading: "Aloqa", text: "DPO: dpo@eduself.io | privacy@eduself.io | EduSelf Technologies Inc., Amir Temur shoh ko'chasi 47, Toshkent 100084, O'zbekiston." }] },
    terms: { title: "Foydalanish shartlari", content: [{ heading: "Shartlarni qabul qilish", text: "EduSelf'dan foydalanib, siz ushbu Foydalanish shartlariga rozilik bildirasiz." }, { heading: "Xizmat tavsifi", text: "EduSelf kurs boshqaruvi, AI baholash, tahlil, geymifikatsiya va Telegram bot integratsiyasini o'z ichiga olgan bulutli LMS taqdim etadi." }, { heading: "Foydalanuvchi majburiyatlari", text: "Siz platformadan suiiste'mol qilmaslikka, ruxsatsiz kirishga urinmaslikka va EduSelf'ni qonunbuzarlik uchun ishlatmaslikka rozilik bildirasiz." }, { heading: "Intellektual mulk", text: "EduSelf va uning litsenziarlar platformadagi barcha huquqlarga ega. Sizning kontentingiz sizniki bo'lib qoladi." }, { heading: "Javobgarlikni cheklash", text: "EduSelf'ning javobgarligi da'voga qadar 12 oy davomida to'langan summaga cheklangan." }, { heading: "Qo'llaniladigan qonun", text: "Ushbu shartlar O'zbekiston Respublikasi qonunchiligiga muvofiq tartibga solinadi. Nizolar Toshkent sudlarida hal qilinadi." }] },
  },
} as const;
type Translation = typeof T["en"];
type ModalPage = "about" | "privacy" | "terms" | null;

const AppCtx = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: Translation; dark: boolean; toggleDark: () => void; openModal: (p: ModalPage) => void }>({ locale: "en", setLocale: () => {}, t: T.en, dark: true, toggleDark: () => {}, openModal: () => {} });
const useApp = () => useContext(AppCtx);

// ─── Static data ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "", label: { en: "Institutions", ru: "Учреждений", uz: "Muassasalar" } },
  { value: "1.8M", label: { en: "Active Students", ru: "Активных студентов", uz: "Faol talabalar" } },
  { value: "94K+", label: { en: "Educators", ru: "Преподавателей", uz: "O'qituvchilar" } },
  { value: "99.97%", label: { en: "Uptime SLA", ru: "Uptime SLA", uz: "Uptime SLA" } },
];

const ROLE_LABELS: Record<string, Record<Locale, string>> = {
  "admin": { en: "Administrator", ru: "Администратор", uz: "Administrator" },
  "teacher": { en: "Teacher", ru: "Учитель", uz: "O'qituvchi" },
  "student": { en: "Student", ru: "Студент", uz: "Talaba" },
  "parent": { en: "Parent", ru: "Родитель", uz: "Ota-ona" },
  "asst-admin": { en: "Asst. Admin", ru: "Пом. Админ", uz: "Yordamchi Admin" },
  "telegram": { en: "Telegram Bot", ru: "Telegram-бот", uz: "Telegram Bot" },
};

const PLATFORM_DESCS: Record<string, Record<Locale, string>> = {
  admin: { en: "Complete institutional control with real-time oversight across every department, teacher, and student.", ru: "Полный контроль над учебным заведением с мониторингом каждого отдела, учителя и студента в реальном времени.", uz: "Har bir bo'lim, o'qituvchi va talaba bo'yicha real vaqt nazorati bilan to'liq muassasa boshqaruvi." },
  teacher: { en: "A distraction-free workspace for course creation, grading, and student engagement.", ru: "Рабочее пространство без отвлечений для создания курсов, выставления оценок и взаимодействия со студентами.", uz: "Kurs yaratish, baholash va talabalar bilan muloqot uchun chalg'ituvchi omilsiz ish maydoni." },
  student: { en: "Personalised learning paths, gamified progress, and an AI study companion available 24/7.", ru: "Персонализированные учебные пути, геймифицированный прогресс и ИИ-помощник для учёбы 24/7.", uz: "Shaxsiylashtirilgan o'rganish yo'llari, geymifikatsiya va 24/7 mavjud AI o'rganish hamkori." },
  parent: { en: "Transparent visibility into your child's academic journey — grades, attendance, and teacher messages.", ru: "Прозрачный мониторинг учёбы вашего ребёнка — оценки, посещаемость и сообщения учителей.", uz: "Farzandingizning akademik yo'lini shaffof kuzatish — baholar, davomat va o'qituvchi xabarlari." },
  asst: { en: "Delegated authority to manage daily operations without touching sensitive financial or security settings.", ru: "Делегированные полномочия для управления ежедневными операциями.", uz: "Moliyaviy yoki xavfsizlik sozlamalarisiz kundalik operatsiyalarni boshqarish uchun delegat vakolat." },
  tg: { en: "Role-aware Telegram bot that delivers the right data to the right person — no app install required.", ru: "Ролевой Telegram-бот, который доставляет нужные данные нужному человеку.", uz: "To'g'ri ma'lumotni to'g'ri odamga yetkazadigan rol-asosli Telegram bot — ilova o'rnatish shart emas." },
};

type PlatformRoleData = { id: string; descKey: string; icon: React.ReactNode; caps: Record<Locale, string[]> };
const PLATFORM_ROLES: PlatformRoleData[] = [
  { id: "admin", descKey: "admin", icon: <LayoutDashboard size={16} />, caps: { en: ["Multi-school & multi-branch management", "Role & permission matrix", "Financial dashboard with invoice automation", "Audit logs & security event stream", "AI-generated executive reports", "API & third-party integration hub"], ru: ["Управление несколькими школами и филиалами", "Матрица ролей и разрешений", "Финансовый дашборд с автоматизацией счетов", "Журналы аудита и поток событий безопасности", "ИИ-отчёты для руководства", "Центр API и сторонних интеграций"], uz: ["Ko'p maktab va filiallarni boshqarish", "Rol va ruxsatlar matritsasi", "Moliyaviy dashboard va hisob-faktura avtomatizatsiyasi", "Audit jurnallari va xavfsizlik hodisalar oqimi", "AI-asosli boshqaruv hisobotlari", "API va uchinchi tomon integratsiyalar markazi"] } },
  { id: "teacher", descKey: "teacher", icon: <BookOpen size={16} />, caps: { en: ["Drag-and-drop lesson builder", "AI test & quiz generator", "Auto assignment & essay checking", "Attendance tracking with photo recognition", "Learning analytics per student", "Telegram notification automation"], ru: ["Конструктор уроков перетаскиванием", "ИИ-генератор тестов и викторин", "Автопроверка заданий и эссе", "Учёт посещаемости с распознаванием фото", "Аналитика обучения по каждому студенту", "Автоматизация Telegram-уведомлений"], uz: ["Sudrab tashlash dars yaratuvchi", "AI test va viktorina generatori", "Avtomatik vazifa va esse tekshirish", "Foto tanish bilan davomat hisobi", "Har bir talaba uchun o'rganish tahlili", "Telegram bildirinomalari avtomatizatsiyasi"] } },
  { id: "student", descKey: "student", icon: <GraduationCap size={16} />, caps: { en: ["AI-personalized learning path", "Interactive video lessons with AI summaries", "Gamified coin & badge rewards", "Exam simulator with instant feedback", "Plagiarism-safe submission portal", "Multilingual AI chatbot support"], ru: ["ИИ-персонализированный путь обучения", "Интерактивные видеоуроки с ИИ-резюме", "Геймифицированные монеты и значки", "Симулятор экзамена с мгновенной обратной связью", "Портал сдачи работ без плагиата", "Многоязычная поддержка ИИ-чатбота"], uz: ["AI-shaxsiylashtirilgan o'rganish yo'li", "AI xulosali interaktiv video darslar", "Geymifikatsiya tangalar va nishonlar", "Zudlik bilan fikr-mulohaza bilan imtihon simulyatori", "Plagiatdan xoli topshirish portali", "Ko'p tilli AI chatbot qo'llab-quvvatlash"] } },
  { id: "parent", descKey: "parent", icon: <Users size={16} />, caps: { en: ["Real-time grade & attendance feed", "Direct teacher messaging", "Homework & exam schedule alerts", "Monthly AI progress reports", "Payment & invoice tracking", "Telegram bot notifications"], ru: ["Лента оценок и посещаемости в реальном времени", "Прямые сообщения учителю", "Уведомления о домашних заданиях и экзаменах", "Ежемесячные ИИ-отчёты о прогрессе", "Отслеживание платежей и счетов", "Уведомления через Telegram-бота"], uz: ["Real vaqt baho va davomat yangiliklari", "O'qituvchi bilan to'g'ridan-to'g'ri xabar almashish", "Uy vazifalari va imtihon jadvali ogohlantirishlar", "Oylik AI taraqqiyot hisobotlari", "To'lov va hisob-faktura kuzatuvi", "Telegram bot bildirinomalari"] } },
  { id: "asst-admin", descKey: "asst", icon: <UserCheck size={16} />, caps: { en: ["Student enrollment & profile management", "Schedule & timetable builder", "Classroom & resource allocation", "Teacher assignment & substitution", "Announcement broadcasting", "Report generation & export"], ru: ["Зачисление студентов и управление профилями", "Построитель расписания", "Распределение классов и ресурсов", "Назначение учителей и замены", "Рассылка объявлений", "Генерация и экспорт отчётов"], uz: ["Talabalarni ro'yxatga olish va profil boshqarish", "Jadval va dars jadvali yaratuvchi", "Sinf xonalari va resurslarni taqsimlash", "O'qituvchilarni tayinlash va almashtirish", "E'lonlarni tarqatish", "Hisobot yaratish va eksport qilish"] } },
  { id: "telegram", descKey: "tg", icon: <Bot size={16} />, caps: { en: ["Attendance & grade queries", "Homework & exam reminders", "Certificate & payment notifications", "AI chat for students", "Admin alerts & security events", "Broadcast to groups by role"], ru: ["Запросы посещаемости и оценок", "Напоминания о домашних заданиях и экзаменах", "Уведомления о сертификатах и платежах", "ИИ-чат для студентов", "Оповещения администратора и события безопасности", "Рассылка в группы по ролям"], uz: ["Davomat va baho so'rovlari", "Uy vazifalari va imtihon eslatmalari", "Sertifikat va to'lov bildirinomalari", "Talabalar uchun AI chat", "Admin ogohlantirishlar va xavfsizlik hodisalari", "Rol bo'yicha guruhlarga tarqatish"] } },
];

type FeatItem = { icon: React.ReactNode; title: Record<Locale, string>; desc: Record<Locale, string>; category: string };
const ALL_FEATURES: FeatItem[] = [
  { icon: <BookOpen size={18} />, title: { en: "Course Management", ru: "Управление курсами", uz: "Kurs boshqaruvi" }, desc: { en: "Build and publish rich multimedia courses with version control.", ru: "Создавайте и публикуйте мультимедийные курсы с контролем версий.", uz: "Ko'p muhitli kurslarni versiya nazorati bilan yarating." }, category: "Academic" },
  { icon: <CalendarCheck size={18} />, title: { en: "Smart Attendance", ru: "Умный учёт посещаемости", uz: "Aqlli davomat" }, desc: { en: "Face-recognition, QR, and manual attendance with instant alerts.", ru: "Распознавание лиц, QR и ручной учёт с мгновенными уведомлениями.", uz: "Yuz tanish, QR va qo'lda davomat — zudlik bilan ogohlantirishlar." }, category: "Academic" },
  { icon: <ClipboardCheck size={18} />, title: { en: "Assignment Engine", ru: "Движок заданий", uz: "Topshiriq mexanizmi" }, desc: { en: "Create, submit, grade, and return assignments with AI-assisted scoring.", ru: "Создавайте, сдавайте и оценивайте задания с ИИ-помощью.", uz: "AI yordamida baholash bilan topshiriqlarni yarating va qaytaring." }, category: "Academic" },
  { icon: <PenTool size={18} />, title: { en: "Exam Builder", ru: "Конструктор экзаменов", uz: "Imtihon yaratuvchi" }, desc: { en: "Question banks, randomised exams, and proctoring-ready delivery.", ru: "Банки вопросов, рандомизированные экзамены с прокторингом.", uz: "Savol banklari, tasodifiy imtihonlar va proktoring." }, category: "Academic" },
  { icon: <Video size={18} />, title: { en: "Video Lessons", ru: "Видеоуроки", uz: "Video darslar" }, desc: { en: "Stream lessons with AI-generated summaries and Q&A.", ru: "Транслируйте уроки с ИИ-резюме и разделом Q&A.", uz: "AI xulosalari va Q&A bilan darslarni oqimlang." }, category: "Academic" },
  { icon: <FileText size={18} />, title: { en: "Digital Certificates", ru: "Цифровые сертификаты", uz: "Raqamli sertifikatlar" }, desc: { en: "Auto-generate, verify, and share blockchain-anchored certificates.", ru: "Автоматически генерируйте и делитесь сертификатами на блокчейне.", uz: "Blokcheyn-asosli sertifikatlarni avtomatik yarating va ulashing." }, category: "Academic" },
  { icon: <Trophy size={18} />, title: { en: "Gamification", ru: "Геймификация", uz: "Geymifikatsiya" }, desc: { en: "Coins, badges, levels, leaderboards, and team challenges.", ru: "Монеты, значки, уровни, рейтинги и командные задачи.", uz: "Tangalar, nishonlar, darajalar, reytinglar va jamoa musobaqalari." }, category: "Engagement" },
  { icon: <Bell size={18} />, title: { en: "Smart Notifications", ru: "Умные уведомления", uz: "Aqlli bildirishnomalar" }, desc: { en: "AI-prioritised alerts via app, email, and Telegram.", ru: "ИИ-приоритизированные оповещения через приложение, e-mail и Telegram.", uz: "Ilova, elektron pochta va Telegram orqali AI-ustuvorlik ogohlantirishlari." }, category: "Engagement" },
  { icon: <MessageSquare size={18} />, title: { en: "In-App Messaging", ru: "Внутренние сообщения", uz: "Ilova ichida xabar" }, desc: { en: "Threaded teacher–student–parent chat with read receipts.", ru: "Тематическая переписка учитель–студент–родитель.", uz: "O'qituvchi–talaba–ota-ona o'rtasida xabar almashish." }, category: "Engagement" },
  { icon: <Bot size={18} />, title: { en: "Telegram Integration", ru: "Интеграция с Telegram", uz: "Telegram integratsiyasi" }, desc: { en: "Per-role bot flows for homework, grades, payments, and AI chat.", ru: "Ролевые потоки бота для домашних заданий, оценок и платежей.", uz: "Uy vazifalari, baholar, to'lovlar va AI chat uchun rol-asosli bot oqimlari." }, category: "Engagement" },
  { icon: <DollarSign size={18} />, title: { en: "Financial Management", ru: "Финансовый менеджмент", uz: "Moliyaviy boshqaruv" }, desc: { en: "Invoicing, fee collection, payment plans, and overdue automation.", ru: "Выставление счетов, сбор платежей и планы оплаты.", uz: "Hisob-faktura, to'lov yig'ish va to'lov rejalari." }, category: "Operations" },
  { icon: <Building2 size={18} />, title: { en: "Multi-School Support", ru: "Поддержка нескольких школ", uz: "Ko'p maktab qo'llab-quvvatlash" }, desc: { en: "Manage multiple campuses from a single super-admin seat.", ru: "Управляйте несколькими кампусами из одного суперадмин-аккаунта.", uz: "Bitta super-admin hisobidan bir nechta kampuslarni boshqaring." }, category: "Operations" },
  { icon: <Globe size={18} />, title: { en: "Multilingual UI", ru: "Многоязычный интерфейс", uz: "Ko'p tilli interfeys" }, desc: { en: "English, Russian, and Uzbek with instant switching.", ru: "Английский, русский и узбекский с мгновенным переключением.", uz: "Ingliz, rus va o'zbek tillarida zudlik bilan almashtirish." }, category: "Operations" },
  { icon: <Shield size={18} />, title: { en: "Role Permissions", ru: "Права ролей", uz: "Rol ruxsatlari" }, desc: { en: "Granular permission matrix across 6 roles with custom overrides.", ru: "Гранулярная матрица разрешений для 6 ролей.", uz: "6 ta rol bo'yicha granular ruxsatlar matritsasi." }, category: "Security" },
  { icon: <Lock size={18} />, title: { en: "Audit Logs", ru: "Журналы аудита", uz: "Audit jurnallari" }, desc: { en: "Immutable activity log with full-text search and export.", ru: "Неизменяемый журнал активности с полнотекстовым поиском.", uz: "To'liq matn qidiruv va eksport bilan o'zgarmas faoliyat jurnali." }, category: "Security" },
  { icon: <Wifi size={18} />, title: { en: "API & Webhooks", ru: "API и вебхуки", uz: "API va Webhook'lar" }, desc: { en: "REST API, webhook events, and OAuth2 for third-party integrations.", ru: "REST API, события вебхуков и OAuth2 для сторонних интеграций.", uz: "Uchinchi tomon integratsiyalar uchun REST API, webhook hodisalari va OAuth2." }, category: "Integrations" },
  { icon: <Globe size={18} />, title: { en: "SSO / SAML", ru: "SSO / SAML", uz: "SSO / SAML" }, desc: { en: "Single sign-on via Google Workspace, Microsoft Entra, and SAML 2.0.", ru: "Единый вход через Google Workspace, Microsoft Entra и SAML 2.0.", uz: "Google Workspace, Microsoft Entra va SAML 2.0 orqali yagona kirish." }, category: "Integrations" },
  { icon: <Zap size={18} />, title: { en: "Zapier & n8n", ru: "Zapier и n8n", uz: "Zapier va n8n" }, desc: { en: "Connect to 5,000+ apps via Zapier or self-hosted n8n workflows.", ru: "Подключитесь к 5 000+ приложениям через Zapier или n8n.", uz: "Zapier yoki o'z-o'zini boshqaradigan n8n orqali 5 000+ ilovaga ulaning." }, category: "Integrations" },
];

const AI_CONTENT: Record<string, { title: Record<Locale, string>; desc: Record<Locale, string> }> = {
  testgen: { title: { en: "AI Test Generator", ru: "ИИ-генератор тестов", uz: "AI Test Generatori" }, desc: { en: "Paste a topic and get a publish-ready quiz with varied question types in seconds.", ru: "Вставьте тему и получите готовый тест с разными типами вопросов за секунды.", uz: "Mavzuni joylang va soniyalar ichida turli savol turlari bilan tayyor test oling." } },
  autograde: { title: { en: "Auto Grading", ru: "Автоматическая оценка", uz: "Avtomatik baholash" }, desc: { en: "AI reviews assignments, scores against a rubric, and posts feedback before the teacher opens the submission.", ru: "ИИ проверяет задания по рубрике и публикует обратную связь до учителя.", uz: "AI topshiriqni rubrika bo'yicha baholaydi va o'qituvchi ochishidan oldin fikr-mulohaza qoldiradi." } },
  learningpath: { title: { en: "Learning Path AI", ru: "ИИ-путь обучения", uz: "O'rganish yo'li AI" }, desc: { en: "Adapts curriculum sequence, pacing, and resources to each student's performance history in real time.", ru: "Адаптирует учебный план и темп к истории успеваемости каждого студента в реальном времени.", uz: "Har bir talabaning ishlash tarixiga qarab o'quv dasturi ketma-ketligini real vaqtda moslaydi." } },
  videosummary: { title: { en: "Video Summariser", ru: "ИИ-резюме видео", uz: "Video xulosachi" }, desc: { en: "Generates timestamped summaries, key-concept cards, and chapter markers from any lesson video.", ru: "Создаёт резюме с временными метками и карточки концепций из видеоурока.", uz: "Har qanday dars videosidan vaqt belgili xulosalar va asosiy tushuncha kartochkalarini yaratadi." } },
  prediction: { title: { en: "Performance Prediction", ru: "Прогнозирование успеваемости", uz: "Ishlash bashorati" }, desc: { en: "Forecasts dropout risk and exam failure up to 4 weeks in advance.", ru: "Прогнозирует риск отчисления и провала экзамена за 4 недели.", uz: "4 hafta oldin talabalar riski va imtihon muvaffaqiyatsizligini bashorat qiladi." } },
  reports: { title: { en: "Report Generation", ru: "Генерация отчётов", uz: "Hisobot yaratish" }, desc: { en: "One-click AI-written narrative reports for students, classes, or the whole institution.", ru: "Отчёты с ИИ-нарративом в один клик для студентов, классов или всего учреждения.", uz: "Talabalar, sinflar yoki butun muassasa uchun bir bosish bilan AI-yozilgan hisobotlar." } },
  chatbot: { title: { en: "AI Study Chatbot", ru: "ИИ-чатбот для учёбы", uz: "AI O'rganish Chatboti" }, desc: { en: "Subject-aware assistant trained on the course syllabus that answers questions and quizzes on demand.", ru: "Предметный ассистент, обученный на учебной программе, отвечает на вопросы студентов.", uz: "Kurs o'quv dasturiga o'rgatilgan predmet-sezuvchan yordamchi — talabalar savollariga javob beradi." } },
  plagiarism: { title: { en: "Plagiarism Detection", ru: "Обнаружение плагиата", uz: "Plagiatni aniqlash" }, desc: { en: "Cross-references submissions against the web, course library, and past student work.", ru: "Перекрёстно проверяет работы с интернетом, библиотекой курсов и прошлыми работами.", uz: "Topshiriqlarni internet, kurs kutubxonasi va o'tgan talabalar ishlari bilan solishtiradi." } },
  analytics: { title: { en: "AI Analytics", ru: "ИИ-аналитика", uz: "AI Tahlil" }, desc: { en: "Natural-language query interface over your institutional data — ask and get a chart instantly.", ru: "Интерфейс запросов на естественном языке для институциональных данных.", uz: "Muassasa ma'lumotlari bo'yicha tabiiy til so'rov interfeysi — so'rang va zudlik bilan grafik oling." } },
};
const AI_KEYS = ["testgen", "autograde", "learningpath", "videosummary", "prediction", "reports", "chatbot", "plagiarism", "analytics"] as const;
const AI_ICONS: Record<string, React.ReactNode> = { testgen: <Brain size={20} />, autograde: <ClipboardCheck size={20} />, learningpath: <Lightbulb size={20} />, videosummary: <Video size={20} />, prediction: <TrendingUp size={20} />, reports: <FileText size={20} />, chatbot: <MessageSquare size={20} />, plagiarism: <Shield size={20} />, analytics: <BarChart3 size={20} /> };

type PricingTier = { name: Record<Locale, string>; price: Record<Locale, string>; period: Record<Locale, string>; desc: Record<Locale, string>; features: Record<Locale, string[]>; cta: Record<Locale, string>; highlighted: boolean };
const PRICING: PricingTier[] = [
  { name: { en: "Starter", ru: "Стартовый", uz: "Boshlang'ich" }, price: { en: "$299", ru: "$299", uz: "$299" }, period: { en: "/month", ru: "/месяц", uz: "/oy" }, desc: { en: "For growing private learning centres up to 500 students.", ru: "Для растущих частных учебных центров до 500 студентов.", uz: "500 tagacha talabali rivojlanayotgan xususiy o'quv markazlari uchun." }, features: { en: ["Up to 500 students", "3 admin seats", "Core LMS features", "Telegram bot (3 roles)", "Basic analytics", "Email support", "99.9% uptime SLA"], ru: ["До 500 студентов", "3 места администратора", "Основные функции LMS", "Telegram-бот (3 роли)", "Базовая аналитика", "Поддержка по e-mail", "SLA 99,9%"], uz: ["500 tagacha talaba", "3 ta admin o'rin", "Asosiy LMS imkoniyatlari", "Telegram bot (3 rol)", "Asosiy tahlil", "Elektron pochta qo'llab-quvvatlash", "99,9% Uptime SLA"] }, cta: { en: "Start free trial", ru: "Начать бесплатно", uz: "Bepul boshlash" }, highlighted: false },
  { name: { en: "Professional", ru: "Профессиональный", uz: "Professional" }, price: { en: "$899", ru: "$899", uz: "$899" }, period: { en: "/month", ru: "/месяц", uz: "/oy" }, desc: { en: "For universities and multi-branch academies up to 5,000 students.", ru: "Для университетов и многофилиальных академий до 5 000 студентов.", uz: "5 000 tagacha talabali universitetlar va ko'p filiali akademiyalar uchun." }, features: { en: ["Up to 5,000 students", "Unlimited admin seats", "Full AI feature suite", "Gamification & rewards", "Advanced analytics", "API access & webhooks", "SSO / SAML", "Priority support (4h SLA)", "99.95% uptime SLA"], ru: ["До 5 000 студентов", "Неограниченные места", "Полный набор ИИ-функций", "Геймификация и награды", "Расширенная аналитика", "Доступ к API и вебхуки", "SSO / SAML", "Приоритетная поддержка (4ч)", "SLA 99,95%"], uz: ["5 000 tagacha talaba", "Cheksiz admin o'rinlari", "To'liq AI imkoniyatlari", "Geymifikatsiya va mukofotlar", "Ilg'or tahlil", "API kirish va webhook'lar", "SSO / SAML", "Ustuvor qo'llab-quvvatlash (4 soat)", "99,95% Uptime SLA"] }, cta: { en: "Start free trial", ru: "Начать бесплатно", uz: "Bepul boshlash" }, highlighted: true },
  { name: { en: "Enterprise", ru: "Корпоративный", uz: "Korporativ" }, price: { en: "Custom", ru: "Индивидуально", uz: "Maxsus" }, period: { en: "", ru: "", uz: "" }, desc: { en: "For large institutions, government bodies, and corporate academies.", ru: "Для крупных учреждений, государственных органов и корпоративных академий.", uz: "Yirik muassasalar, davlat tashkilotlari va korporativ akademiyalar uchun." }, features: { en: ["Unlimited students", "Dedicated infrastructure", "Custom AI model fine-tuning", "Multi-school super-admin", "White-label & custom domain", "On-premise deployment", "Dedicated CSM", "99.99% uptime SLA"], ru: ["Неограниченное количество студентов", "Выделенная инфраструктура", "Настройка собственной ИИ-модели", "Суперадмин нескольких школ", "White-label и собственный домен", "On-premise развёртывание", "Выделенный CSM", "SLA 99,99%"], uz: ["Cheksiz talabalar", "Maxsus infratuzilma", "Maxsus AI model sozlash", "Ko'p maktab super-admin", "White-label va maxsus domen", "On-premise joylashtirish", "Maxsus CSM", "99,99% Uptime SLA"] }, cta: { en: "Contact sales", ru: "Связаться с продажами", uz: "Sotuv bilan bog'lanish" }, highlighted: false },
];

type FaqItem = { q: Record<Locale, string>; a: Record<Locale, string> };
const FAQS: FaqItem[] = [
  { q: { en: "How long does implementation take?", ru: "Сколько времени занимает внедрение?", uz: "Joriy etish qancha vaqt oladi?" }, a: { en: "Most institutions are live within 2–4 weeks. Our onboarding team handles data migration, user provisioning, and staff training.", ru: "Большинство учреждений запускаются в течение 2–4 недель. Наша команда занимается миграцией данных и обучением персонала.", uz: "Ko'pgina muassasalar 2–4 hafta ichida ishga tushadi. Jamoamiz ma'lumot migratsiyasi va xodimlarni o'qitish bilan shug'ullanadi." } },
  { q: { en: "Can EduSelf support multiple campuses or branches?", ru: "Поддерживает ли EduSelf несколько кампусов?", uz: "EduSelf bir nechta kampuslarni qo'llab-quvvatlashi mumkinmi?" }, a: { en: "Yes. The multi-school architecture lets a single super-admin manage unlimited branches, each with isolated data, branding, and permission sets.", ru: "Да. Архитектура позволяет одному суперадмину управлять неограниченным количеством филиалов с изолированными данными.", uz: "Ha. Ko'p maktab arxitekturasi bitta super-adminga izolyatsiya qilingan ma'lumotlar bilan cheksiz filiallarni boshqarish imkonini beradi." } },
  { q: { en: "Is student data secure and GDPR-compliant?", ru: "Безопасны ли данные студентов и соответствуют ли GDPR?", uz: "Talabalar ma'lumotlari xavfsiz va GDPR muvofiqmi?" }, a: { en: "EduSelf is SOC 2 Type II certified and GDPR-compliant. Data is encrypted at rest (AES-256) and in transit (TLS 1.3). You choose your data region — EU, US, or Uzbekistan.", ru: "EduSelf сертифицирован SOC 2 Type II и соответствует GDPR. Данные зашифрованы. Вы выбираете регион данных — ЕС, США или Узбекистан.", uz: "EduSelf SOC 2 Type II va GDPR-muvofiq. Ma'lumotlar shifrlanadi. Ma'lumot mintaqasini o'zingiz tanlaysiz — EU, US yoki O'zbekiston." } },
  { q: { en: "Does the AI grading replace teachers?", ru: "Заменяет ли ИИ-оценка учителей?", uz: "AI baholash o'qituvchilarni o'rnini oladi?" }, a: { en: "No — it augments them. AI produces a draft score and written feedback; the teacher reviews, edits, and publishes. The final grade is always a human decision.", ru: "Нет — она их дополняет. ИИ создаёт черновую оценку; учитель проверяет и публикует. Окончательная оценка — всегда за человеком.", uz: "Yo'q — u ularni kuchaytiradi. AI qoralama baho hosil qiladi; o'qituvchi ko'rib chiqadi. Yakuniy baho har doim inson qarori." } },
  { q: { en: "Which languages does the platform support?", ru: "Какие языки поддерживает платформа?", uz: "Platforma qaysi tillarni qo'llab-quvvatlaydi?" }, a: { en: "English, Russian, and Uzbek are fully supported with instant switching. Additional languages are available on the Enterprise plan.", ru: "Английский, русский и узбекский с мгновенным переключением. Дополнительные языки — в Enterprise.", uz: "Ingliz, rus va o'zbek tillari to'liq qo'llab-quvvatlanadi. Qo'shimcha tillar Korporativ rejada mavjud." } },
  { q: { en: "Can parents access the platform without downloading an app?", ru: "Могут ли родители пользоваться платформой без приложения?", uz: "Ota-onalar ilova o'rnatmasdan platformaga kira oladimi?" }, a: { en: "Yes. EduSelf is a responsive web app, and the Telegram bot delivers grades, attendance, and homework alerts to parents without any app installation.", ru: "Да. EduSelf — адаптивное веб-приложение, а Telegram-бот доставляет уведомления без установки приложения.", uz: "Ha. EduSelf moslashuvchan veb-ilova bo'lib, Telegram bot hech qanday ilova o'rnatishsiz ishlaydi." } },
  { q: { en: "What happens to our data if we cancel?", ru: "Что происходит с данными при отмене подписки?", uz: "Bekor qilsak ma'lumotlarimiz nima bo'ladi?" }, a: { en: "You own your data. Within 30 days of cancellation you can export a full data package (CSV, JSON, PDF). After 90 days, data is securely deleted.", ru: "Данные принадлежат вам. В течение 30 дней после отмены вы можете экспортировать данные. После 90 дней — надёжное удаление.", uz: "Ma'lumotlar sizniki. Bekor qilishdan 30 kun ichida to'liq ma'lumot paketini eksport qilishingiz mumkin. 90 kundan keyin xavfsiz o'chiriladi." } },
];

// ─── Base components ──────────────────────────────────────────────────────────

function BadgeTag({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "cyan" | "violet" | "green" }) {
  const c = { blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20", violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20", green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" };
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c[color]}`}>{children}</span>;
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-black/[0.06] dark:border-white/[0.07] bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-lg hover:shadow-black/[0.06] dark:hover:shadow-blue-500/[0.06] transition-shadow duration-300 ${className}`}>{children}</div>;
}

function PrimaryButton({ children, href, onClick, className = "", size = "md" }: { children: React.ReactNode; href?: string; onClick?: () => void; className?: string; size?: "md" | "lg" }) {
  const base = `inline-flex items-center gap-2 font-semibold rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/40 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"} ${className}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={base}>{children}</a>;
  return <button type={onClick ? "button" : "submit"} onClick={onClick} className={base}>{children}</button>;
}

function OutlineButton({ children, href, onClick, className = "", size = "md" }: { children: React.ReactNode; href?: string; onClick?: () => void; className?: string; size?: "md" | "lg" }) {
  const base = `inline-flex items-center gap-2 font-semibold rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"} ${className}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={base}>{children}</a>;
  return <button onClick={onClick} className={base}>{children}</button>;
}

function SectionHeader({ badge, title, subtitle, color = "blue" }: { badge: string; title: string; subtitle: string; color?: "blue" | "cyan" | "violet" | "green" }) {
  const glowColors = { blue: "shadow-blue-500/10", cyan: "shadow-cyan-500/10", violet: "shadow-violet-500/10", green: "shadow-green-500/10" };
  return (
    <div className="text-center mb-12 md:mb-16">
      <BadgeTag color={color}>{badge}</BadgeTag>
      <h2 className={`mt-4 text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight drop-shadow-sm dark:drop-shadow-[0_2px_24px_rgba(99,102,241,0.15)]`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h2>
      <p className="mt-4 text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-2" style={{ fontFamily: "'Inter', sans-serif" }}>{subtitle}</p>
    </div>
  );
}

function CardScroller({ children, cols = 3, className = "" }: { children: React.ReactNode; cols?: number; className?: string }) {
  const gc = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" }[cols] ?? "md:grid-cols-3";
  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden md:grid md:gap-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0 ${gc} ${className}`}>
      {children}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ page, onClose }: { page: ModalPage; onClose: () => void }) {
  const { t } = useApp();
  if (!page) return null;
  const content = t[page as keyof typeof t] as { title: string; content: { heading: string; text: string }[] };
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-black/[0.08] dark:border-white/[0.1]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06] dark:border-white/[0.07] shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{content.title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-all duration-150 hover:scale-110"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:hidden">
          {content.content.map((s, i) => (
            <div key={i}>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.heading}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ activeSection }: { activeSection: string }) {
  const { locale, setLocale, t, dark, toggleDark } = useApp();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { label: t.nav.platform, href: "#platform" },
    { label: t.nav.features, href: "#features" },
    { label: t.nav.ai, href: "#ai" },
    { label: t.nav.analytics, href: "#analytics" },
    { label: t.nav.pricing, href: "#pricing" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/90 dark:bg-[#06090f]/80 backdrop-blur-xl shadow-sm shadow-black/[0.04] dark:shadow-black/[0.3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <a href="#hero" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] bg-white shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-md">
            <ImageWithFallback src={eduselfLogo} alt="EduSelf logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>EduSelf</span>
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full hidden xs:inline sm:inline">LMS</span>
        </a>

        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.03] ${activeSection === item.href.slice(1) ? "text-slate-900 dark:text-white bg-black/[0.05] dark:bg-white/[0.07]" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1 shrink-0">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-150 hover:scale-[1.02]">
              <Languages size={15} />{locale.toUpperCase()}<ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#0d1424] border border-black/[0.08] dark:border-white/[0.08] rounded-xl shadow-xl overflow-hidden z-50 w-28">
                {(["en", "ru", "uz"] as Locale[]).map((l) => (
                  <button key={l} onClick={() => { setLocale(l); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:scale-[1.01] ${locale === l ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"}`}>
                    {l === "en" ? "🇬🇧" : l === "ru" ? "🇷🇺" : "🇺🇿"} {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={toggleDark} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-150 hover:scale-110 hover:rotate-12">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-150 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:scale-[1.02]">
            {t.nav.signIn}
          </a>
          <PrimaryButton href={DEMO_URL}>{t.nav.bookDemo}</PrimaryButton>
        </div>

        <button className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 transition-all duration-150 hover:scale-110" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/[0.06] dark:border-white/[0.06] bg-white/98 dark:bg-[#06090f]/98 backdrop-blur-xl px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-150 font-medium">
              {item.label}
            </a>
          ))}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
            <div className="flex gap-2">
              {(["en", "ru", "uz"] as Locale[]).map((l) => (
                <button key={l} onClick={() => setLocale(l)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150 hover:scale-[1.02] ${locale === l ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.1]"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
              <button onClick={toggleDark} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all duration-150 hover:scale-110">
                {dark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
            <PrimaryButton href={DEMO_URL} className="w-full justify-center">{t.nav.bookDemo}</PrimaryButton>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const { t, locale, dark } = useApp();
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/12 dark:bg-blue-600/25 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/10 dark:bg-violet-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-cyan-500/8 dark:bg-cyan-500/12 rounded-full blur-[80px]" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 dark:via-blue-500/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.6) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <BadgeTag color="cyan"><Zap size={12} />{t.hero.badge}</BadgeTag>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t.hero.headline1}<br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">{t.hero.headline2}</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg" style={{ fontFamily: "'Inter', sans-serif" }}>{t.hero.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PrimaryButton href={DEMO_URL}>{t.hero.cta1}<ArrowRight size={16} /></PrimaryButton>
            <OutlineButton href={DEMO_URL}><Play size={14} />{t.hero.cta2}</OutlineButton>
          </div>
          <div className="mt-10 flex items-center gap-5">
            <div className="flex -space-x-2">
              {["AK", "SM", "JY", "RN"].map((init) => (
                <div key={init} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 border-2 border-white dark:border-[#06090f] flex items-center justify-center text-white text-[10px] font-bold">{init}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" className="text-amber-400" />)}<span className="text-slate-900 dark:text-white text-sm font-semibold ml-1">4.9</span></div>
              <p className="text-slate-400 text-xs mt-0.5">{t.hero.reviews}</p>
            </div>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <GlassCard className="p-5 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-slate-400 text-xs">{locale === "ru" ? "Доброе утро," : locale === "uz" ? "Xayrli tong," : "Good morning,"}</p>
                <p className="text-slate-900 dark:text-white font-semibold text-sm">{locale === "ru" ? "Дашборд д-ра Алиевой" : locale === "uz" ? "Dr. Aliyevaning paneli" : "Dr. Aliyeva's Dashboard"}</p>
              </div>
              <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-amber-400" /><div className="w-2 h-2 rounded-full bg-green-400" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{ l: { en: "Online", ru: "Онлайн", uz: "Onlayn" }, v: "284", c: "text-blue-500" }, { l: { en: "Avg Score", ru: "Ср. балл", uz: "O'rt. baho" }, v: "87.3%", c: "text-cyan-500" }, { l: { en: "AI Tasks", ru: "ИИ задачи", uz: "AI vazifalar" }, v: "1,482", c: "text-violet-500" }].map((s) => (
                <div key={s.v} className="bg-slate-50 dark:bg-white/[0.04] rounded-xl p-3 border border-slate-100 dark:border-white/[0.06]">
                  <p className="text-slate-400 text-[10px]">{s.l[locale]}</p>
                  <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 dark:bg-white/[0.03] rounded-xl p-3 border border-slate-100 dark:border-white/[0.05] mb-3">
              <p className="text-slate-400 text-[10px] mb-2">{locale === "ru" ? "Вовлечённость за неделю" : locale === "uz" ? "Haftalik faollik" : "Weekly Engagement"}</p>
              <div className="flex items-end gap-1 h-12">
                {[60, 75, 55, 90, 80, 95, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 5 ? "linear-gradient(to top,#2563eb,#06b6d4)" : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }} />
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/[0.08] border border-amber-200 dark:border-amber-500/20 rounded-xl p-3">
              <Brain size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-amber-700 dark:text-amber-300 text-[11px] font-semibold">{locale === "ru" ? "Предупреждение ИИ" : locale === "uz" ? "AI ogohlantirish" : "AI Prediction Alert"}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">{locale === "ru" ? "3 студента в зоне риска по физике 301" : locale === "uz" ? "Fizika 301 da 3 ta talaba xavf ostida" : "3 students at high dropout risk in Physics 301."}</p>
              </div>
            </div>
          </GlassCard>
          <div className="absolute -bottom-6 -left-8 bg-white dark:bg-[#0d1424] border border-black/[0.08] dark:border-white/[0.07] rounded-2xl p-4 shadow-xl w-44">
            <div className="flex items-center gap-2 mb-1"><div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center"><Check size={12} className="text-green-600 dark:text-green-400" /></div><span className="text-[11px] text-slate-900 dark:text-white font-semibold">{locale === "ru" ? "ИИ оценил" : locale === "uz" ? "AI baholadi" : "AI Graded"}</span></div>
            <p className="text-slate-500 text-[10px]">{locale === "ru" ? "248 эссе за последний час" : locale === "uz" ? "So'nggi soatda 248 esse" : "248 essays graded this hour"}</p>
          </div>
          <div className="absolute -top-6 -right-4 bg-white dark:bg-[#0d1424] border border-black/[0.08] dark:border-white/[0.07] rounded-2xl p-4 shadow-xl w-40">
            <div className="flex items-center gap-2 mb-1"><div className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center"><TrendingUp size={12} className="text-cyan-600 dark:text-cyan-400" /></div><span className="text-[11px] text-slate-900 dark:text-white font-semibold">+23% {locale === "ru" ? "Успеваемость" : locale === "uz" ? "O'tish" : "Pass Rate"}</span></div>
            <p className="text-slate-500 text-[10px]">{locale === "ru" ? "От семестра к семестру" : locale === "uz" ? "Semestrdan semestrgacha" : "Semester over semester"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Why ──────────────────────────────────────────────────────────────────────

function WhySection() {
  const { t } = useApp();
  const icons = [<Brain size={22} />, <Layers size={22} />, <Shield size={22} />];
  const colors = ["from-blue-50 to-blue-100/50 dark:from-blue-500/20 dark:to-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400", "from-violet-50 to-violet-100/50 dark:from-violet-500/20 dark:to-violet-500/10 border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400", "from-cyan-50 to-cyan-100/50 dark:from-cyan-500/20 dark:to-cyan-500/10 border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400"];
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.why.badge} title={t.why.title} subtitle={t.why.sub} color="blue" />
        <CardScroller cols={3}>
          {t.why.items.map((item, i) => (
            <div key={i} className="snap-start shrink-0 w-[280px] md:w-auto">
              <GlassCard className="p-6 md:p-8 h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border bg-gradient-to-br mb-5 ${colors[i]}`}>{icons[i]}</div>
                <h3 className="text-slate-900 dark:text-white font-bold text-base md:text-lg mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
              </GlassCard>
            </div>
          ))}
        </CardScroller>
      </div>
    </section>
  );
}

// ─── Platform ─────────────────────────────────────────────────────────────────

function PlatformSection() {
  const { t, locale } = useApp();
  const [activeRole, setActiveRole] = useState("admin");
  const role = PLATFORM_ROLES.find((r) => r.id === activeRole)!;
  return (
    <section id="platform" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-violet-500/8 dark:bg-violet-600/10 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.platform.badge} title={t.platform.title} subtitle={t.platform.sub} color="violet" />
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 [&::-webkit-scrollbar]:hidden">
          {PLATFORM_ROLES.map((r) => (
            <button key={r.id} onClick={() => setActiveRole(r.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 hover:scale-[1.02] ${activeRole === r.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.07] border border-slate-200 dark:border-white/[0.06]"}`}>
              {r.icon}{ROLE_LABELS[r.id][locale]}
            </button>
          ))}
        </div>
        <GlassCard className="p-6 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">{role.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{ROLE_LABELS[role.id][locale]}</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 text-sm md:text-base">{PLATFORM_DESCS[role.descKey][locale]}</p>
              <PrimaryButton href={DEMO_URL}>{t.platform.explore} {ROLE_LABELS[role.id][locale]}<ChevronRight size={16} /></PrimaryButton>
            </div>
            <div className="grid gap-3">
              {role.caps[locale].map((cap) => (
                <div key={cap} className="flex items-center gap-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] rounded-xl px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0"><Check size={11} className="text-green-600 dark:text-green-400" /></div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const { t, locale } = useApp();
  const cats = ["All", "Academic", "Engagement", "Operations", "Security", "Integrations"];
  const catLabels: Record<string, Record<Locale, string>> = { All: { en: "All", ru: "Все", uz: "Barchasi" }, Academic: { en: "Academic", ru: "Академические", uz: "Akademik" }, Engagement: { en: "Engagement", ru: "Вовлечённость", uz: "Ishtirok" }, Operations: { en: "Operations", ru: "Операции", uz: "Operatsiyalar" }, Security: { en: "Security", ru: "Безопасность", uz: "Xavfsizlik" }, Integrations: { en: "Integrations", ru: "Интеграции", uz: "Integratsiyalar" } };
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = ALL_FEATURES.filter((f) => (active === "All" || f.category === active) && (!query || f.title[locale].toLowerCase().includes(query.toLowerCase())));

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/8 dark:bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.features.badge} title={t.features.title} subtitle={t.features.sub} color="blue" />
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={t.features.search} value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 placeholder-slate-400 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-500/50 transition-all" />
          </div>
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {cats.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 shrink-0 hover:scale-[1.02] ${active === cat ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.06]"}`}>
                {catLabels[cat][locale]}
              </button>
            ))}
          </div>
        </div>
        <CardScroller cols={3}>
          {filtered.map((f) => (
            <div key={f.title.en} className="snap-start shrink-0 w-[248px] md:w-auto">
              <GlassCard className="p-5 group cursor-default h-full">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">{f.icon}</div>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-1.5 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title[locale]}</h3>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>{f.desc[locale]}</p>
              </GlassCard>
            </div>
          ))}
        </CardScroller>
        {filtered.length === 0 && <div className="text-center py-16 text-slate-400">{t.features.noResults}</div>}
      </div>
    </section>
  );
}

// ─── AI ───────────────────────────────────────────────────────────────────────

function AISection() {
  const { t, locale } = useApp();
  return (
    <section id="ai" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-500/8 dark:bg-violet-600/10 rounded-full blur-[140px]" /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.ai.badge} title={t.ai.title} subtitle={t.ai.sub} color="violet" />
        <CardScroller cols={3}>
          {AI_KEYS.map((key) => {
            const c = AI_CONTENT[key];
            return (
              <div key={key} className="snap-start shrink-0 w-[248px] md:w-auto">
                <GlassCard className="p-5 group cursor-default h-full">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-500/20 dark:to-violet-500/20 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:from-blue-100 group-hover:to-violet-100 dark:group-hover:from-blue-500/30 dark:group-hover:to-violet-500/30 transition-all">{AI_ICONS[key]}</div>
                  <h3 className="text-slate-900 dark:text-white font-bold mb-2 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.title[locale]}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3" style={{ fontFamily: "'Inter', sans-serif" }}>{c.desc[locale]}</p>
                </GlassCard>
              </div>
            );
          })}
        </CardScroller>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {t.ai.metrics.map((m, i) => {
            const ic = [<Zap size={16} className="text-cyan-500 dark:text-cyan-400" />, <Brain size={16} className="text-violet-500 dark:text-violet-400" />, <Check size={16} className="text-green-500 dark:text-green-400" />, <Activity size={16} className="text-blue-500 dark:text-blue-400" />];
            return (
              <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] hover:shadow-sm transition-shadow duration-200">
                <div className="mb-2">{ic[i]}</div>
                <div className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</div>
                <div className="text-slate-500 text-xs leading-snug">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────

function AnalyticsSection() {
  const { t, locale } = useApp();
  return (
    <section id="analytics" className="py-20 md:py-28 relative">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/6 dark:bg-cyan-500/8 rounded-full blur-[130px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.analytics.badge} title={t.analytics.title} subtitle={t.analytics.sub} color="cyan" />
        <div className="grid lg:grid-cols-3 gap-5">
          <GlassCard className="lg:col-span-2 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-base md:text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{locale === "ru" ? "Тренд успеваемости" : locale === "uz" ? "Talaba samaradorlik trendi" : "Student Performance Trend"}</h3>
                <p className="text-slate-400 text-sm">{locale === "ru" ? "Последние 7 недель · Физика 301" : locale === "uz" ? "So'nggi 7 hafta · Fizika 301" : "Last 7 weeks · Physics 301"}</p>
              </div>
              <BadgeTag color="green">+11.2% avg</BadgeTag>
            </div>
            <div className="relative h-28 md:h-32">
              <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" /><stop offset="100%" stopColor="#2563eb" stopOpacity="0" /></linearGradient></defs>
                <path d="M0,70 C50,65 80,55 120,48 S180,35 220,28 S290,18 340,15 S380,12 400,10 L400,100 L0,100 Z" fill="url(#g1)" />
                <path d="M0,70 C50,65 80,55 120,48 S180,35 220,28 S290,18 340,15 S380,12 400,10" fill="none" stroke="#2563eb" strokeWidth="2" />
                <path d="M0,80 C50,75 80,72 120,68 S180,62 220,55 S290,48 340,44 S380,40 400,38" fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
              </svg>
            </div>
          </GlassCard>
          <div className="flex flex-col gap-4">
            {[
              { label: { en: "Attendance Rate", ru: "Посещаемость", uz: "Davomat" }, value: "94.2%", delta: "+2.8%", color: "text-green-600 dark:text-green-400", icon: <CalendarCheck size={16} /> },
              { label: { en: "Completion Rate", ru: "Завершение", uz: "Yakunlash" }, value: "87.6%", delta: "+5.1%", color: "text-blue-600 dark:text-blue-400", icon: <Check size={16} /> },
              { label: { en: "Teacher Response", ru: "Ответ учителя", uz: "O'qituvchi javob" }, value: "1.8d", delta: "-0.4d", color: "text-cyan-600 dark:text-cyan-400", icon: <Zap size={16} /> },
            ].map((m) => (
              <GlassCard key={m.value} className="p-4 md:p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/[0.05] flex items-center justify-center ${m.color} shrink-0`}>{m.icon}</div>
                <div className="flex-1 min-w-0"><p className="text-slate-400 text-xs truncate">{m.label[locale]}</p><p className={`text-lg md:text-xl font-bold ${m.color}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</p></div>
                <span className="text-green-500 dark:text-green-400 text-xs font-semibold shrink-0">{m.delta}</span>
              </GlassCard>
            ))}
            <GlassCard className="p-4 md:p-5">
              <p className="text-slate-400 text-xs mb-3 font-semibold uppercase tracking-wider">{locale === "ru" ? "Система сейчас" : locale === "uz" ? "Tizim holati" : "Live System"}</p>
              <div className="space-y-2">
                {[{ label: { en: "API Health", ru: "API", uz: "API" }, value: "99.98%" }, { label: { en: "Online Users", ru: "Онлайн", uz: "Onlayn" }, value: "1,284" }, { label: { en: "AI Queue", ru: "ИИ очередь", uz: "AI navbati" }, value: locale === "ru" ? "3 задачи" : locale === "uz" ? "3 vazifa" : "3 jobs" }].map((s) => (
                  <div key={s.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-slate-400 text-xs">{s.label[locale]}</span></div>
                    <span className="text-slate-900 dark:text-white text-xs font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Telegram ─────────────────────────────────────────────────────────────────

function TelegramSection() {
  const { t, locale } = useApp();
  const [activeRole, setActiveRole] = useState(0);
  const roleColors = ["bg-blue-600", "bg-violet-600", "bg-cyan-600", "bg-green-600"];
  const roleIcons = [<GraduationCap size={16} />, <BookOpen size={16} />, <Users size={16} />, <Building2 size={16} />];
  return (
    <section id="telegram" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/8 rounded-full blur-[100px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.telegram.badge} title={t.telegram.title} subtitle={t.telegram.sub} color="cyan" />
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {t.telegram.roles.map((r, i) => (
                <button key={i} onClick={() => setActiveRole(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${activeRole === i ? `${roleColors[i]} text-white shadow-lg` : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.06]"}`}>
                  {roleIcons[i]}{r.role}
                </button>
              ))}
            </div>
            <div className="space-y-2.5">
              {t.telegram.roles[activeRole].flows.map((flow, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] rounded-xl px-4 py-3 hover:border-blue-200 dark:hover:border-blue-500/20 transition-colors duration-150">
                  <Send size={14} className="text-blue-500 dark:text-blue-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{flow}</span>
                </div>
              ))}
            </div>
          </div>
          <GlassCard className="p-5 md:p-6 max-w-sm mx-auto lg:mx-0 w-full">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0"><Bot size={18} className="text-white" /></div>
              <div><p className="text-slate-900 dark:text-white font-semibold text-sm">EduSelf Bot</p><p className="text-green-500 text-xs">● Online</p></div>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-100 dark:bg-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <p className="text-slate-700 dark:text-slate-300 text-xs">{locale === "ru" ? "📊 Оценки Дилнозы сегодня:" : locale === "uz" ? "📊 Dilnozaning bugungi baholari:" : "📊 Dilnoza's grades today:"}</p>
                <p className="text-slate-900 dark:text-white text-sm font-semibold mt-1">Math: 92 | Physics: 87 | Eng: 95</p>
              </div>
              <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] ml-auto">
                <p className="text-white text-xs">{locale === "ru" ? "Когда следующий экзамен?" : locale === "uz" ? "Keyingi imtihon qachon?" : "When is the next exam?"}</p>
              </div>
              <div className="bg-slate-100 dark:bg-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <p className="text-slate-700 dark:text-slate-300 text-xs">{locale === "ru" ? "📅 Физика 301 — пятница, 14:00" : locale === "uz" ? "📅 Fizika 301 — Juma, 14:00" : "📅 Physics 301 — Friday 2:00 PM"}</p>
                <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">{locale === "ru" ? "Добавить в напоминания?" : locale === "uz" ? "Eslatmaga qo'shish?" : "Add to reminders?"}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 text-xs py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors duration-150">{locale === "ru" ? "✅ Да" : locale === "uz" ? "✅ Ha" : "✅ Yes"}</button>
                <button className="flex-1 text-xs py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-400 font-medium transition-colors duration-150">{locale === "ru" ? "Нет" : locale === "uz" ? "Yo'q" : "No"}</button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

// ─── Gamification ─────────────────────────────────────────────────────────────

function GamificationSection() {
  const { t, locale } = useApp();
  const gamItems = [
    { icon: <Coins size={18} />, title: { en: "Coin Economy", ru: "Монетная экономика", uz: "Tanga iqtisodiyoti" }, desc: { en: "Earn coins for lessons, quizzes, and attendance.", ru: "Зарабатывайте монеты за уроки, тесты и посещаемость.", uz: "Darslar, testlar va davomat uchun tanga ishlang." } },
    { icon: <Award size={18} />, title: { en: "Badges & Levels", ru: "Значки и уровни", uz: "Nishonlar va darajalar" }, desc: { en: "80+ achievement badges across academic and social categories.", ru: "80+ значков достижений по академическим и социальным категориям.", uz: "Akademik va ijtimoiy kategoriyalar bo'yicha 80+ yutuq nishonlari." } },
    { icon: <Trophy size={18} />, title: { en: "Leaderboards", ru: "Рейтинги", uz: "Reytinglar" }, desc: { en: "Class, school, and global rankings with weekly resets.", ru: "Рейтинги класса, школы и глобальные с еженедельным обновлением.", uz: "Haftalik yangilanish bilan sinf, maktab va global reytinglar." } },
    { icon: <Target size={18} />, title: { en: "AI Challenges", ru: "ИИ-задачи", uz: "AI musobaqalar" }, desc: { en: "AI-generated challenges calibrated to each student.", ru: "ИИ-задачи, откалиброванные под уровень каждого студента.", uz: "Har bir talabaning darajasiga moslashtirilgan AI musobaqalar." } },
  ];
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/6 dark:bg-amber-500/8 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <BadgeTag color="green"><Trophy size={12} />{t.gamification.badge}</BadgeTag>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t.gamification.title.split(" ").slice(0, -1).join(" ")}{" "}<span className="text-amber-500">{t.gamification.title.split(" ").slice(-1)}</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">{t.gamification.sub}</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {gamItems.map((item) => (
                <div key={item.title.en} className="bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] rounded-xl p-4 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-500/20 transition-all duration-200">
                  <div className="text-amber-500 mb-2">{item.icon}</div>
                  <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title[locale]}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.desc[locale]}</p>
                </div>
              ))}
            </div>
          </div>
          <GlassCard className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-slate-900 dark:text-white font-bold text-sm md:text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {locale === "ru" ? "Лучшие студенты — Эта неделя" : locale === "uz" ? "Top talabalar — Bu hafta" : "Top Learners — This Week"}
              </h3>
              <BadgeTag color="green">{locale === "ru" ? "Прямой эфир" : locale === "uz" ? "Jonli" : "Live"}</BadgeTag>
            </div>
            <div className="space-y-2.5">
              {[{ rank: 1, name: "Dilnoza Tashmatova", score: "2,840 pts", badge: "🥇", coins: 480 }, { rank: 2, name: "Bobur Mirzayev", score: "2,710 pts", badge: "🥈", coins: 420 }, { rank: 3, name: "Kamola Yusupova", score: "2,590 pts", badge: "🥉", coins: 380 }, { rank: 4, name: "Asilbek Nazarov", score: "2,410 pts", badge: "", coins: 340 }, { rank: 5, name: "Feruza Abdullayeva", score: "2,280 pts", badge: "", coins: 290 }].map((s) => (
                <div key={s.rank} className={`flex items-center gap-3 rounded-xl px-3 md:px-4 py-3 transition-all duration-150 hover:scale-[1.01] ${s.rank <= 3 ? "bg-slate-50 dark:bg-white/[0.05] border border-slate-100 dark:border-white/[0.08]" : "bg-slate-50/50 dark:bg-white/[0.02]"}`}>
                  <span className="text-slate-400 text-sm font-bold w-4 shrink-0">{s.rank}</span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{s.name.split(" ").map((n) => n[0]).join("")}</div>
                  <div className="flex-1 min-w-0"><p className="text-slate-900 dark:text-white text-sm font-medium truncate">{s.badge} {s.name}</p></div>
                  <div className="text-right shrink-0"><p className="text-amber-500 text-xs font-bold">{s.score}</p><p className="text-slate-400 text-[10px]">{s.coins} {locale === "ru" ? "монет" : locale === "uz" ? "tanga" : "coins"}</p></div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

// ─── Security ─────────────────────────────────────────────────────────────────

function SecuritySection() {
  const { t } = useApp();
  const secIcons = [<KeyRound size={20} />, <FileText size={20} />, <AlertCircle size={20} />, <Lock size={20} />, <DatabaseBackup size={20} />, <Fingerprint size={20} />];
  return (
    <section id="security" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-slate-500/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.security.badge} title={t.security.title} subtitle={t.security.sub} color="violet" />
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[{ label: "SOC 2 Type II", icon: <ShieldCheck size={13} /> }, { label: "GDPR", icon: <Shield size={13} /> }, { label: "ISO 27001", icon: <Lock size={13} /> }, { label: "AES-256", icon: <ServerCrash size={13} /> }].map((b) => (
            <div key={b.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 text-sm font-semibold hover:border-green-300 dark:hover:border-green-500/30 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 cursor-default">
              <span className="text-green-600 dark:text-green-400">{b.icon}</span>{b.label}
            </div>
          ))}
        </div>
        <CardScroller cols={3}>
          {t.security.items.map((item, i) => (
            <div key={i} className="snap-start shrink-0 w-[248px] md:w-auto">
              <GlassCard className="p-5 group h-full">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-600 dark:text-slate-400 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-all duration-200">{secIcons[i]}</div>
                <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{item.desc}</p>
              </GlassCard>
            </div>
          ))}
        </CardScroller>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PricingSection() {
  const { t, locale } = useApp();
  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/6 dark:bg-blue-600/8 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.pricing.badge} title={t.pricing.title} subtitle={t.pricing.sub} color="blue" />
        <CardScroller cols={3}>
          {PRICING.map((tier) => (
            <div key={tier.name.en} className="snap-start shrink-0 w-[290px] md:w-auto">
              <div className={`relative rounded-2xl p-7 md:p-8 flex flex-col transition-all duration-200 h-full ${tier.highlighted ? "bg-gradient-to-b from-blue-50 to-violet-50/50 dark:from-blue-600/20 dark:to-violet-600/10 border-2 border-blue-400/40 dark:border-blue-500/40 shadow-2xl shadow-blue-500/10" : "bg-white dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07] hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-md shadow-sm"}`}>
                {tier.highlighted && (<div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><BadgeTag color="blue">{locale === "ru" ? "Самый популярный" : locale === "uz" ? "Eng mashhur" : "Most popular"}</BadgeTag></div>)}
                <div className="mb-5">
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg md:text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tier.name[locale]}</h3>
                  <p className="text-slate-500 text-xs md:text-sm mb-4 leading-snug">{tier.desc[locale]}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tier.price[locale]}</span>
                    {tier.period[locale] && <span className="text-slate-400 text-sm">{tier.period[locale]}</span>}
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-7">
                  {tier.features[locale].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5"><Check size={10} className="text-green-600 dark:text-green-400" /></div>
                      <span className="text-slate-600 dark:text-slate-300 text-xs md:text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                {tier.highlighted ? <PrimaryButton href={DEMO_URL} className="w-full justify-center">{tier.cta[locale]}</PrimaryButton> : <OutlineButton href={DEMO_URL} className="w-full justify-center">{tier.cta[locale]}</OutlineButton>}
              </div>
            </div>
          ))}
        </CardScroller>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQSection() {
  const { t, locale } = useApp();
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const filtered = FAQS.filter((f) => !query || f.q[locale].toLowerCase().includes(query.toLowerCase()) || f.a[locale].toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader badge={t.faq.badge} title={t.faq.title} subtitle={t.faq.sub} color="cyan" />
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder={t.faq.search} value={query} onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 placeholder-slate-400 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-500/50 transition-all" />
        </div>
        <div className="space-y-2.5">
          {filtered.map((faq, i) => (
            <div key={i} className={`rounded-2xl border transition-all duration-200 ${open === i ? "border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/[0.05]" : "border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/[0.12]"}`}>
              <button className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 text-left gap-4" onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-slate-800 dark:text-white font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{faq.q[locale]}</span>
                <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180 text-blue-500" : ""}`} />
              </button>
              {open === i && <div className="px-5 md:px-6 pb-5"><p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.a[locale]}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  const { t, locale } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", org: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const text = `🏫 <b>Yangi so'rov — EduSelf LMS</b>\n\n👤 Ism: ${form.name}\n📞 Tel: ${form.phone}\n🏢 Muassasa: ${form.org}\n💬 Xabar: ${form.message || "—"}\n\n📅 Vaqt: ${new Date().toLocaleString("uz-UZ")}`;
    try {
      await fetch(`https://api.telegram.org/bot${"8623358140:AAEkVSYR9A2_cubnlm6MJXcATPL4PqxADOY"}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: 6047410688, text, parse_mode: "HTML" }),
      });
    } catch (_) {}
    setSending(false);
    setSent(true);
  };

  const contactItems = [
    { icon: <Send size={16} />, text: "@Sarvar_Rashitov", href: "https://t.me/Sarvar_Rashitov" },
    { icon: <Phone size={16} />, text: "+998 50 010 43 07", href: "tel:+998500104307" },
    { icon: <MapPin size={16} />, text: locale === "ru" ? "Startup Garage, Ташкент, Узбекистан" : locale === "uz" ? "Startup Garage, Toshkent, O'zbekiston" : "Startup Garage, Tashkent, Uzbekistan", href: null },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-500/8 dark:bg-violet-600/10 rounded-full blur-[120px]" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <BadgeTag color="violet">{t.contact.badge}</BadgeTag>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.contact.title}</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">{t.contact.sub}</p>
            <div className="mt-8 space-y-4">
              {contactItems.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">{item.icon}</div>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item.text}</a>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 text-sm">{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <GlassCard className="p-6 md:p-8 shadow-xl shadow-violet-500/5">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-500/15 border border-green-200 dark:border-green-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20"><Check size={24} className="text-green-600 dark:text-green-400" /></div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.contact.success}</h3>
                <p className="text-slate-500 text-sm">{t.contact.successSub}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {([
                  { field: "name" as const, label: t.contact.name, placeholder: t.contact.placeholder.name, type: "text" },
                  { field: "phone" as const, label: locale === "ru" ? "Телефон" : locale === "uz" ? "Telefon" : "Phone number", placeholder: "+998 90 123 45 67", type: "tel" },
                  { field: "org" as const, label: t.contact.org, placeholder: t.contact.placeholder.org, type: "text" },
                ]).map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} required value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/[0.07] focus:shadow-sm transition-all" />
                  </div>
                ))}
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">{t.contact.message}</label>
                  <textarea rows={3} placeholder={t.contact.placeholder.message} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-500/50 transition-all resize-none" />
                </div>
                <PrimaryButton className={`w-full justify-center ${sending ? "opacity-70 cursor-not-allowed" : ""}`}>
                  {sending ? (locale === "ru" ? "Отправка…" : locale === "uz" ? "Yuborilmoqda…" : "Sending…") : <>{t.contact.submit}<ArrowRight size={15} /></>}
                </PrimaryButton>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  const { t } = useApp();
  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/8 to-cyan-600/10 dark:from-blue-600/15 dark:via-violet-600/10 dark:to-cyan-600/15" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.cta.title}</h2>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">{t.cta.sub}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <PrimaryButton href={DEMO_URL} size="lg">{t.cta.primary}<ArrowRight size={18} /></PrimaryButton>
          <OutlineButton href={DEMO_URL} size="lg">{t.cta.secondary}</OutlineButton>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { t, locale, openModal } = useApp();

  const productLinks = [
    { label: "Platform", href: "#platform" },
    { label: "Features", href: "#features" },
    { label: "AI", href: "#ai" },
    { label: "Analytics", href: "#analytics" },
    { label: "Gamification", href: "#" },
    { label: "Pricing", href: "#pricing" },
  ];

  const companyLinks = [
    { label: { en: "About", ru: "О нас", uz: "Biz haqimizda" }, action: () => openModal("about") },
    { label: { en: "Blog", ru: "Блог", uz: "Blog" }, action: null },
    { label: { en: "Careers", ru: "Карьера", uz: "Karyera" }, action: null },
    { label: { en: "Press", ru: "Пресса", uz: "Matbuot" }, action: null },
  ];

  const legalLinks = [
    { label: { en: "Privacy Policy", ru: "Конфиденциальность", uz: "Maxfiylik siyosati" }, action: () => openModal("privacy") },
    { label: { en: "Terms of Service", ru: "Условия использования", uz: "Foydalanish shartlari" }, action: () => openModal("terms") },
    { label: { en: "Legal", ru: "Юридическое", uz: "Huquqiy" }, action: () => openModal("terms") },
    { label: { en: "GDPR", ru: "GDPR", uz: "GDPR" }, action: () => openModal("privacy") },
  ];

  const socials = [
    { icon: <Linkedin size={16} />, label: "LinkedIn" },
    { icon: <Twitter size={16} />, label: "Twitter / X" },
    { icon: <Youtube size={16} />, label: "YouTube" },
    { icon: <Instagram size={16} />, label: "Instagram" },
    { icon: <Facebook size={16} />, label: "Facebook" },
    { icon: <Send size={16} />, label: "Telegram" },
  ];

  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.06] py-14 md:py-16 bg-slate-50/60 dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <a href="#hero" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] bg-white shrink-0 transition-transform duration-200 group-hover:scale-105">
                <ImageWithFallback src={eduselfLogo} alt="EduSelf logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>EduSelf LMS</span>
            </a>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">{t.footer.desc}</p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <button key={s.label} aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/30 hover:-translate-y-0.5 transition-all duration-200">
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.footer.product}</h4>
            <ul className="space-y-2.5">
              {productLinks.map((item) => (
                <li key={item.label}><a href={item.href} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-150">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.footer.company}</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.label.en}>
                  {item.action ? (
                    <button onClick={item.action} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-150 text-left">{item.label[locale]}</button>
                  ) : (
                    <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-150">{item.label[locale]}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.footer.legal}</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.label.en}>
                  <button onClick={item.action} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-150 text-left">{item.label[locale]}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-black/[0.06] dark:border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm text-center sm:text-left">{t.footer.copy}</p>
          <div className="flex items-center gap-4">
            <BadgeTag color="green"><div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />{t.footer.status}</BadgeTag>
            <span className="text-slate-400 text-xs">v4.2.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [modalPage, setModalPage] = useState<ModalPage>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    observerRef.current = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { threshold: 0.25 }
    );
    sections.forEach((s) => observerRef.current?.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (modalPage) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [modalPage]);

  return (
    <AppCtx.Provider value={{ locale, setLocale, t: T[locale], dark, toggleDark: () => setDark((d) => !d), openModal: setModalPage }}>
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Nav activeSection={activeSection} />
        <main>
          <HeroSection />
          <WhySection />
          <PlatformSection />
          <FeaturesSection />
          <AISection />
          <AnalyticsSection />
          <TelegramSection />
          <GamificationSection />
          <SecuritySection />
          <PricingSection />
          <FAQSection />
          <ContactSection />
          <FinalCTA />
        </main>
        <Footer />
        <Modal page={modalPage} onClose={() => setModalPage(null)} />
      </div>
    </AppCtx.Provider>
  );
}
