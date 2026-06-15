/* ==========================================
   h&D store - Data Manager v6.0 (بدون Dark Mode)
   ========================================== */

// ===========================
// SVG Placeholder (آمن - UTF-8)
// ===========================
function generatePlaceholderSVG(text, width, height) {
  text = text || 'h&D';
  width = width || 400;
  height = height || 500;
  
  const svgString = 
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
      '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" style="stop-color:#f0ede6;stop-opacity:1" />' +
        '<stop offset="100%" style="stop-color:#d4c5a0;stop-opacity:1" />' +
      '</linearGradient></defs>' +
      '<rect width="' + width + '" height="' + height + '" fill="url(#bg)"/>' +
      '<text x="50%" y="50%" font-family="Arial, sans-serif" font-size="' + Math.floor(width/8) + '" ' +
            'fill="#8b6f47" text-anchor="middle" dominant-baseline="middle" font-weight="600">' +
        text +
      '</text>' +
    '</svg>';
  
  return 'data:image/svg+xml;base64,' + utf8ToBase64(svgString);
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const PLACEHOLDER_IMG = generatePlaceholderSVG('h&D', 400, 500);
const PLACEHOLDER_THUMB = generatePlaceholderSVG('h&D', 100, 100);

// ===========================
// الإعدادات الافتراضية
// ===========================
const DEFAULT_SETTINGS = {
  brand: {
    nameAr: 'h&D',
    nameEn: 'store',
    logo: 'h&D',
    tagline: 'متجر الملابس والإكسسوارات الفاخر في مصر',
    favicon: ''
  },
  
  hero: {
    title: 'أناقة <span class="accent-word">بلا حدود</span>',
    subtitle: 'اكتشف مجموعتنا الفاخرة من الملابس والإكسسوارات المصممة بعناية لتناسب ذوقك الرفيع',
    buttonText: 'تسوق الآن',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    overlayOpacity: 0.4,
    slides: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80'
    ]
  },
  
  features: [
    { icon: '🚚', title: 'شحن سريع', description: 'توصيل لجميع أنحاء مصر خلال 2-5 أيام' },
    { icon: '🛡️', title: 'جودة مضمونة', description: 'منتجات أصلية 100% من أفضل العلامات' },
    { icon: '↩️', title: 'إرجاع سهل', description: 'سياسة إرجاع مرنة خلال 14 يوم' },
    { icon: '💎', title: 'دعم مميز', description: 'فريق دعم متاح 24/7 لخدمتك' }
  ],
  
  footer: {
    aboutText: 'وجهتك الأولى للأزياء الفاخرة والأنيقة في مصر. نقدم لك أفضل التشكيلات من الملابس والإكسسوارات بأعلى جودة وأفضل الأسعار.',
    columns: [
      { 
        title: 'روابط سريعة', 
        links: [
          { text: 'الرئيسية', url: '#home' }, 
          { text: 'المنتجات', url: '#products' },
          { text: 'مميزاتنا', url: '#features' }, 
          { text: 'لوحة الإدارة', url: 'admin.html' }
        ]
      },
      { 
        title: 'خدمة العملاء', 
        links: [
          { text: 'سياسة الإرجاع', url: '#' }, 
          { text: 'الشحن والتوصيل', url: '#' },
          { text: 'الأسئلة الشائعة', url: '#' }, 
          { text: 'اتصل بنا', url: '#' }
        ]
      },
      { 
        title: 'سياسات', 
        links: [
          { text: 'سياسة الخصوصية', url: 'privacy.html' },
          { text: 'الشروط والأحكام', url: 'terms.html' },
          { text: 'ملفات تعريف الارتباط', url: '#' }
        ]
      }
    ],
    contact: { 
      phone: '+20 100 000 0000', 
      email: 'info@hdstore.com', 
      address: 'القاهرة، جمهورية مصر العربية' 
    },
    social: { 
      instagram: '#', 
      twitter: '#', 
      facebook: '#', 
      snapchat: '#', 
      tiktok: '#', 
      youtube: '' 
    },
    copyright: '© 2024 h&D store. جميع الحقوق محفوظة. صنع بـ ❤️ في مصر'
  },
  
  colors: { 
    primary: '#1a1a1a', 
    background: '#fafaf7', 
    accent: '#8b6f47', 
    text: '#1a1a1a', 
    textMuted: '#6b6b6b' 
  },
  
  fonts: { 
    heading: 'El Messiri', 
    body: 'Tajawal' 
  },
  
  contact: {
    whatsappNumber: '201000000000',
    whatsappMessage: 'مرحباً، أرغب بالاستفسار عن منتج في متجر h&D',
    phone: '+201000000000',
    email: 'info@hdstore.com',
    address: 'القاهرة، جمهورية مصر العربية'
  },
  
  seo: {
    title: 'h&D store | متجر الملابس والإكسسوارات الفاخر في مصر',
    description: 'h&D store - متجر إلكتروني مصري متخصص في بيع الملابس والإكسسوارات الفاخرة',
    keywords: 'ملابس فاخرة, إكسسوارات, أزياء رجالية, متجر إلكتروني, تسوق أونلاين',
    ogImage: '',
    googleAnalytics: '',
    facebookPixel: '',
    enableSchema: true
  },
  
  security: {
    sessionTimeout: 60, maxLoginAttempts: 5, lockoutDuration: 15,
    twoFactorRequired: false, passwordMinLength: 8, requireStrongPassword: true,
    enableAuditLog: true, ipWhitelist: []
  },
  
  email: {
    smtpHost: '', smtpPort: 587, smtpUser: '', smtpPassword: '',
    fromEmail: 'noreply@hdstore.com', fromName: 'h&D store', enableNotifications: false
  },
  
  backup: { autoBackup: false, backupInterval: 7, lastBackup: null },
  
  announcement: {
    enabled: true,
    text: 'شحن مجاني للطلبات فوق 1500 ج.م | استخدم كود WELCOME10 للحصول على خصم 10%',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff'
  }
};

const DEFAULT_CATEGORIES = [
  { id: 'cat1', name: 'الكل', slug: 'all', icon: '🏪', order: 1, visible: true },
  { id: 'cat2', name: 'رجالي', slug: 'men', icon: '👔', order: 2, visible: true },
  { id: 'cat3', name: 'إكسسوارات', slug: 'accessories', icon: '⌚', order: 3, visible: true }
];

const DEFAULT_PRODUCTS = [
  { 
    id: 'p001', name: 'بدلة رجالية كلاسيكية', price: 8999, oldPrice: 10999, category: 'رجالي',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['أسود', 'كحلي', 'رمادي'],
    images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG,
    description: 'بدلة رجالية فاخرة مصنوعة من أجود أنواع الأقمشة الإيطالية، تتميز بقصة أنيقة ومريحة تناسب المناسبات الرسمية.',
    stock: 15, sku: 'SUIT-001', featured: true, active: true, tags: ['كلاسيكي', 'رسمي'],
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'p002', name: 'قميص قطني أبيض', price: 1499, category: 'رجالي',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['أبيض'],
    images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG,
    description: 'قميص قطني 100% بقصة كلاسيكية، مثالي للمناسبات الرسمية والكاجوال.',
    stock: 30, sku: 'SHIRT-002', featured: true, active: true, tags: ['قطن', 'رسمي'],
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'p003', name: 'ساعة فاخرة', price: 18999, oldPrice: 22999, category: 'إكسسوارات',
    sizes: ['مقاس واحد'], colors: ['أسود', 'فضي', 'ذهبي'],
    images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG,
    description: 'ساعة يد أنيقة بتصميم كلاسيكي، مقاومة للماء، مصنوعة من مواد عالية الجودة.',
    stock: 8, sku: 'WATCH-003', featured: true, active: true, tags: ['فاخر', 'هدية'],
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'p004', name: 'حقيبة جلدية', price: 5999, category: 'إكسسوارات',
    sizes: ['مقاس واحد'], colors: ['بني', 'أسود'],
    images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG,
    description: 'حقيبة جلد طبيعي بتصميم عصري، تتسع لجميع احتياجاتك اليومية.',
    stock: 12, sku: 'BAG-004', featured: false, active: true, tags: ['جلد', 'كاجوال'],
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'p005', name: 'بنطلون قماش أنيق', price: 2499, category: 'رجالي',
    sizes: ['28', '30', '32', '34', '36'], colors: ['كحلي', 'بيج', 'رمادي'],
    images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG,
    description: 'بنطلون قماش بقصة عصرية، مريح للاستخدام اليومي والمناسبات غير الرسمية.',
    stock: 25, sku: 'PANT-005', featured: false, active: true, tags: ['كلاسيكي', 'كاجوال'],
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'p006', name: 'نظارات شمسية كلاسيكية', price: 3299, category: 'إكسسوارات',
    sizes: ['مقاس واحد'], colors: ['أسود', 'بني'],
    images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG,
    description: 'نظارات شمسية بإطار كلاسيكي وعدسات مستقطبة لحماية كاملة من الأشعة فوق البنفسجية.',
    stock: 20, sku: 'SUN-006', featured: true, active: true, tags: ['فاخر', 'صيف'],
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'p007', name: 'سترة صوفية', price: 4999, category: 'رجالي',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['بيج', 'رمادي', 'كحلي'],
    images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG,
    description: 'سترة صوفية دافئة بتصميم كلاسيكي، مثالية لفصل الشتاء.',
    stock: 18, sku: 'COAT-007', featured: false, active: true, tags: ['شتوي', 'كلاسيكي'],
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'p008', name: 'حذاء جلد طبيعي', price: 5799, category: 'إكسسوارات',
    sizes: ['40', '41', '42', '43', '44', '45'], colors: ['بني', 'أسود'],
    images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG,
    description: 'حذاء جلد طبيعي بتصميم كلاسيكي راقي، مريح للاستخدام اليومي.',
    stock: 22, sku: 'SHOE-008', featured: true, active: true, tags: ['جلد', 'رسمي'],
    createdAt: new Date().toISOString() 
  }
];

// ===========================
// التهيئة
// ===========================
function initializeData() {
  try {
    if (!localStorage.getItem('hd_settings')) localStorage.setItem('hd_settings', JSON.stringify(DEFAULT_SETTINGS));
    if (!localStorage.getItem('hd_categories')) localStorage.setItem('hd_categories', JSON.stringify(DEFAULT_CATEGORIES));
    if (!localStorage.getItem('hd_products')) localStorage.setItem('hd_products', JSON.stringify(DEFAULT_PRODUCTS));
    if (!localStorage.getItem('hd_orders')) localStorage.setItem('hd_orders', JSON.stringify([]));
    if (!localStorage.getItem('hd_coupons')) localStorage.setItem('hd_coupons', JSON.stringify([]));
    if (!localStorage.getItem('hd_activity_log')) localStorage.setItem('hd_activity_log', JSON.stringify([]));
    if (!localStorage.getItem('hd_audit_log')) localStorage.setItem('hd_audit_log', JSON.stringify([]));
    if (!localStorage.getItem('hd_notifications')) localStorage.setItem('hd_notifications', JSON.stringify([]));
  } catch (e) { console.warn('Init failed:', e); }
}

// ===========================
// DataManager
// ===========================
const DataManager = {
  getSettings() {
    try { const d = localStorage.getItem('hd_settings'); if (d) return JSON.parse(d); } catch (e) {}
    return DEFAULT_SETTINGS;
  },
  saveSettings(settings) {
    try { localStorage.setItem('hd_settings', JSON.stringify(settings)); return true; } catch (e) { return false; }
  },
  
  getCategories() { try { return JSON.parse(localStorage.getItem('hd_categories') || '[]'); } catch (e) { return []; } },
  saveCategories(c) { try { localStorage.setItem('hd_categories', JSON.stringify(c)); return true; } catch (e) { return false; } },
  addCategory(category) {
    const categories = this.getCategories();
    category.id = 'cat' + Date.now();
    category.order = categories.length + 1;
    categories.push(category);
    this.saveCategories(categories);
    return category;
  },
  updateCategory(id, updates) {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.saveCategories(categories);
      return categories[index];
    }
    return null;
  },
  deleteCategory(id) { this.saveCategories(this.getCategories().filter(c => c.id !== id)); },
  
  getProducts(filters) {
    filters = filters || {};
    try {
      let products = JSON.parse(localStorage.getItem('hd_products') || '[]');
      if (filters.category && filters.category !== 'الكل') products = products.filter(p => p.category === filters.category);
      if (filters.search) {
        const s = filters.search.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
      }
      if (filters.featured !== undefined) products = products.filter(p => p.featured === filters.featured);
      if (filters.active !== undefined) products = products.filter(p => p.active === filters.active);
      if (filters.lowStock) products = products.filter(p => p.stock <= 5);
      return products;
    } catch (e) { return []; }
  },
  saveProducts(p) { try { localStorage.setItem('hd_products', JSON.stringify(p)); return true; } catch (e) { return false; } },
  addProduct(product) {
    const products = this.getProducts();
    product.id = 'p' + Date.now();
    product.createdAt = new Date().toISOString();
    if (!product.images) product.images = [product.image || PLACEHOLDER_IMG];
    products.push(product);
    this.saveProducts(products);
    return product;
  },
  updateProduct(id, updates) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveProducts(products);
      return products[index];
    }
    return null;
  },
  deleteProduct(id) { this.saveProducts(this.getProducts().filter(p => p.id !== id)); },
  getProduct(id) { return this.getProducts().find(p => p.id === id); },
  duplicateProduct(id) {
    const product = this.getProduct(id);
    if (product) {
      const newProduct = { ...product };
      delete newProduct.id;
      newProduct.name = product.name + ' (نسخة)';
      newProduct.createdAt = new Date().toISOString();
      return this.addProduct(newProduct);
    }
    return null;
  },
  toggleFeatured(id) {
    const p = this.getProduct(id);
    if (p) return this.updateProduct(id, { featured: !p.featured });
  },
  
  getOrders(filters) {
    filters = filters || {};
    try {
      let orders = JSON.parse(localStorage.getItem('hd_orders') || '[]');
      if (filters.status) orders = orders.filter(o => o.status === filters.status);
      return orders.reverse();
    } catch (e) { return []; }
  },
  addOrder(order) {
    const orders = JSON.parse(localStorage.getItem('hd_orders') || '[]');
    order.id = 'ORD-' + Date.now();
    order.date = new Date().toISOString();
    order.status = order.status || 'new';
    order.adminNotes = order.adminNotes || '';
    orders.push(order);
    try { localStorage.setItem('hd_orders', JSON.stringify(orders)); } catch (e) {}
    return order;
  },
  updateOrder(id, updates) {
    const orders = JSON.parse(localStorage.getItem('hd_orders') || '[]');
    const order = orders.find(o => o.id === id);
    if (order) {
      Object.assign(order, updates);
      try { localStorage.setItem('hd_orders', JSON.stringify(orders)); } catch (e) {}
      return order;
    }
    return null;
  },
  updateOrderStatus(id, status) { return this.updateOrder(id, { status }); },
  deleteOrder(id) {
    try { 
      const orders = JSON.parse(localStorage.getItem('hd_orders') || '[]');
      localStorage.setItem('hd_orders', JSON.stringify(orders.filter(o => o.id !== id)));
    } catch (e) {}
  },
  
  getCoupons() { try { return JSON.parse(localStorage.getItem('hd_coupons') || '[]'); } catch (e) { return []; } },
  saveCoupons(c) { try { localStorage.setItem('hd_coupons', JSON.stringify(c)); return true; } catch (e) { return false; } },
  addCoupon(coupon) {
    const coupons = this.getCoupons();
    coupon.id = 'c' + Date.now();
    coupon.usageCount = 0;
    coupons.push(coupon);
    this.saveCoupons(coupons);
    return coupon;
  },
  validateCoupon(code) {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return { valid: false, message: 'كود غير صحيح' };
    if (!coupon.active) return { valid: false, message: 'الكود غير نشط' };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, message: 'انتهت صلاحية الكود' };
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) return { valid: false, message: 'تم استخدام الكود الحد الأقصى' };
    return { valid: true, coupon };
  },
  
  getNotifications() { try { return JSON.parse(localStorage.getItem('hd_notifications') || '[]'); } catch (e) { return []; } },
  saveNotifications(n) { try { localStorage.setItem('hd_notifications', JSON.stringify(n)); return true; } catch (e) { return false; } },
  addNotification(title, message, type) {
    const notifs = this.getNotifications();
    notifs.unshift({ id: 'n' + Date.now(), title, message, type: type || 'info', read: false, createdAt: new Date().toISOString() });
    if (notifs.length > 50) notifs.length = 50;
    this.saveNotifications(notifs);
  },
  markNotificationRead(id) {
    const notifs = this.getNotifications();
    const n = notifs.find(x => x.id === id);
    if (n) { n.read = true; this.saveNotifications(notifs); }
  },
  markAllNotificationsRead() {
    const notifs = this.getNotifications();
    notifs.forEach(n => n.read = true);
    this.saveNotifications(notifs);
  },
  
  getActivityLog(limit) {
    try { 
      const log = JSON.parse(localStorage.getItem('hd_activity_log') || '[]');
      return log.reverse().slice(0, limit || 50);
    } catch (e) { return []; }
  },
  
  getAuditLog(filters) {
    filters = filters || {};
    try {
      let log = JSON.parse(localStorage.getItem('hd_audit_log') || '[]');
      if (filters.module) log = log.filter(l => l.module === filters.module);
      if (filters.userId) log = log.filter(l => l.userId === filters.userId);
      return log.reverse();
    } catch (e) { return []; }
  },
  
  exportData() {
    return {
      version: '6.0', exportDate: new Date().toISOString(),
      settings: this.getSettings(), categories: this.getCategories(),
      products: this.getProducts(), orders: this.getOrders(),
      coupons: this.getCoupons(),
      users: typeof AuthManager !== 'undefined' ? AuthManager.getUsers().map(u => ({ ...u, password: '***HIDDEN***' })) : [],
      activityLog: this.getActivityLog(1000), auditLog: this.getAuditLog()
    };
  },
  
  importData(data) {
    try {
      if (data.settings) localStorage.setItem('hd_settings', JSON.stringify(data.settings));
      if (data.categories) localStorage.setItem('hd_categories', JSON.stringify(data.categories));
      if (data.products) localStorage.setItem('hd_products', JSON.stringify(data.products));
      if (data.orders) localStorage.setItem('hd_orders', JSON.stringify(data.orders));
      if (data.coupons) localStorage.setItem('hd_coupons', JSON.stringify(data.coupons));
      return true;
    } catch (e) { return false; }
  },
  
  resetAllData() {
    if (!confirm('⚠️ هل أنت متأكد؟ سيتم حذف كل البيانات!')) return;
    ['hd_settings', 'hd_categories', 'hd_products', 'hd_orders', 'hd_coupons', 'hd_activity_log', 'hd_audit_log', 'hd_notifications'].forEach(k => localStorage.removeItem(k));
    initializeData();
  },
  
  getStats() {
    const products = this.getProducts();
    const orders = this.getOrders();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.active !== false).length,
      featuredProducts: products.filter(p => p.featured).length,
      lowStockProducts: products.filter(p => p.stock <= 5).length,
      outOfStockProducts: products.filter(p => p.stock === 0).length,
      totalOrders: orders.length,
      todayOrders: orders.filter(o => new Date(o.date) >= today).length,
      monthOrders: orders.filter(o => new Date(o.date) >= thisMonth).length,
      newOrders: orders.filter(o => o.status === 'new').length,
      processingOrders: orders.filter(o => o.status === 'processing').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      totalRevenue: orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0),
      monthRevenue: orders.filter(o => o.status === 'completed' && new Date(o.date) >= thisMonth).reduce((s, o) => s + o.total, 0),
      pendingRevenue: orders.filter(o => o.status !== 'completed').reduce((s, o) => s + o.total, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0,
      totalCoupons: this.getCoupons().length,
      totalUsers: typeof AuthManager !== 'undefined' ? AuthManager.getUsers().length : 0,
      activeUsers: typeof AuthManager !== 'undefined' ? AuthManager.getUsers().filter(u => u.active).length : 0,
      onlineUsers: typeof AuthManager !== 'undefined' ? AuthManager.getActiveSessions().length : 0
    };
  }
};

// ===========================
// دوال مساعدة
// ===========================
function showToast(message, type) {
  type = type || 'success';
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<span class="toast-icon">' + (icons[type] || 'ℹ') + '</span><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('removing');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}

function formatPrice(price) {
  return new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(price || 0) + ' ج.م';
}

function handleImageError(img, fallback) {
  img.onerror = null;
  img.src = fallback || PLACEHOLDER_IMG;
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function readJSONFile(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function(e) { try { resolve(JSON.parse(e.target.result)); } catch (err) { reject(err); } };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function downloadCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = '\ufeff' + [headers.join(',')].concat(data.map(function(row) {
    return headers.map(function(h) { return '"' + ((row[h] || '').toString().replace(/"/g, '""')) + '"'; }).join(',');
  })).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'الآن';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return 'قبل ' + minutes + ' دقيقة';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return 'قبل ' + hours + ' ساعة';
  const days = Math.floor(hours / 24);
  if (days < 30) return 'قبل ' + days + ' يوم';
  return new Date(date).toLocaleDateString('ar-EG');
}

initializeData();
