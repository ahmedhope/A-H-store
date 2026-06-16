/* ==========================================
   h&D store - مع Firebase
   ========================================== */

// ===========================
// إعدادات Firebase
// ===========================
const firebaseConfig = {
    apiKey: "AIzaSyAIETJop0R2CHfa781VlMrGFNjLuYsb9xg",
    authDomain: "hop-dragon-1e26d.firebaseapp.com",
    databaseURL: "https://hop-dragon-1e26d-default-rtdb.firebaseio.com",
    projectId: "hop-dragon-1e26d",
    storageBucket: "hop-dragon-1e26d.firebasestorage.app",
    messagingSenderId: "748639559846",
    appId: "1:748639559846:web:7500e2cea27ff9c9421467",
    measurementId: "G-MY4WZMWZDJ"
  };

// تهيئة Firebase (يتم تحميلها من CDN)
let db, auth, storage;
let useFirebase = false;

try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();
    useFirebase = true;
    console.log('✅ Firebase متصل');
  }
} catch (e) {
  console.warn('⚠️ Firebase غير متاح - استخدام localStorage');
  useFirebase = false;
}

// ===========================
// SVG Placeholder
// ===========================
function generatePlaceholderSVG(text, width, height) {
  text = text || 'h&D';
  width = width || 400;
  height = height || 500;
  const svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0ede6;stop-opacity:1" /><stop offset="100%" style="stop-color:#d4c5a0;stop-opacity:1" /></linearGradient></defs><rect width="' + width + '" height="' + height + '" fill="url(#bg)"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="' + Math.floor(width/8) + '" fill="#8b6f47" text-anchor="middle" dominant-baseline="middle" font-weight="600">' + text + '</text></svg>';
  return 'data:image/svg+xml;base64,' + utf8ToBase64(svgString);
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

const PLACEHOLDER_IMG = generatePlaceholderSVG('h&D', 400, 500);
const PLACEHOLDER_THUMB = generatePlaceholderSVG('h&D', 100, 100);

// ===========================
// الإعدادات الافتراضية
// ===========================
const DEFAULT_SETTINGS = {
  brand: { nameAr: 'h&D', nameEn: 'store', logo: 'h&D', tagline: 'متجر الملابس والإكسسوارات الفاخر في مصر', favicon: '' },
  hero: {
    title: 'أناقة <span class="accent-word">بلا حدود</span>',
    subtitle: 'اكتشف مجموعتنا الفاخرة من الملابس والإكسسوارات',
    buttonText: 'تسوق الآن',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    overlayOpacity: 0.4
  },
  features: [
    { icon: '🚚', title: 'شحن سريع', description: 'توصيل لجميع أنحاء مصر' },
    { icon: '🛡️', title: 'جودة مضمونة', description: 'منتجات أصلية 100%' },
    { icon: '↩️', title: 'إرجاع سهل', description: 'خلال 14 يوم' }
  ],
  footer: {
    aboutText: 'وجهتك الأولى للأزياء الفاخرة في مصر',
    columns: [
      { title: 'روابط سريعة', links: [{ text: 'الرئيسية', url: '#home' }, { text: 'المنتجات', url: '#products' }] },
      { title: 'خدمة العملاء', links: [{ text: 'سياسة الإرجاع', url: '#' }, { text: 'الشحن', url: '#' }] }
    ],
    contact: { phone: '+20 100 000 0000', email: 'info@hdstore.com', address: 'القاهرة، مصر' },
    social: { instagram: '#', twitter: '#', facebook: '#' },
    copyright: '© 2024 h&D store'
  },
  colors: { primary: '#1a1a1a', background: '#fafaf7', accent: '#8b6f47', text: '#1a1a1a', textMuted: '#6b6b6b' },
  contact: {
    whatsappNumber: '201000000000',
    whatsappMessage: 'مرحباً، أرغب بالاستفسار',
    phone: '+201000000000', email: 'info@hdstore.com', address: 'القاهرة، مصر'
  },
  seo: { title: 'h&D store | متجر فاخر', description: 'متجر إلكتروني مصري', keywords: 'ملابس' },
  announcement: { enabled: true, text: 'شحن مجاني للطلبات فوق 1500 ج.م', backgroundColor: '#1a1a1a', textColor: '#ffffff' }
};

const DEFAULT_CATEGORIES = [
  { id: 'cat1', name: 'الكل', slug: 'all', icon: '🏪', order: 1, visible: true },
  { id: 'cat2', name: 'رجالي', slug: 'men', icon: '👔', order: 2, visible: true },
  { id: 'cat3', name: 'إكسسوارات', slug: 'accessories', icon: '⌚', order: 3, visible: true }
];

const DEFAULT_PRODUCTS = [
  { id: 'p001', name: 'بدلة رجالية كلاسيكية', price: 8999, oldPrice: 10999, category: 'رجالي', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['أسود', 'كحلي', 'رمادي'], images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG, description: 'بدلة فاخرة من أرقى الأقمشة الإيطالية', stock: 15, sku: 'SUIT-001', featured: true, active: true, createdAt: new Date().toISOString() },
  { id: 'p002', name: 'قميص قطني أبيض', price: 1499, category: 'رجالي', sizes: ['S', 'M', 'L', 'XL'], colors: ['أبيض'], images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG, description: 'قميص قطني 100%', stock: 30, sku: 'SHIRT-002', featured: true, active: true, createdAt: new Date().toISOString() },
  { id: 'p003', name: 'ساعة فاخرة', price: 18999, oldPrice: 22999, category: 'إكسسوارات', sizes: ['مقاس واحد'], colors: ['أسود', 'فضي', 'ذهبي'], images: [PLACEHOLDER_IMG], image: PLACEHOLDER_IMG, description: 'ساعة أنيقة كلاسيكية', stock: 8, sku: 'WATCH-003', featured: true, active: true, createdAt: new Date().toISOString() }
];

// ===========================
// نظام التخزين (Hybrid: Firebase + LocalStorage)
// ===========================
const Storage = {
  // الإعدادات
  async getSettings() {
    if (useFirebase) {
      try {
        const doc = await db.collection('settings').doc('main').get();
        if (doc.exists) return doc.data();
        // إنشاء الإعدادات الافتراضية
        await this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      } catch (e) {
        console.warn('Firebase error, using local:', e);
      }
    }
    return this._getLocal('hd_settings', DEFAULT_SETTINGS);
  },
  
  async saveSettings(settings) {
    if (useFirebase) {
      try {
        await db.collection('settings').doc('main').set(settings, { merge: true });
        return true;
      } catch (e) { console.warn('Save error:', e); }
    }
    return this._setLocal('hd_settings', settings);
  },
  
  // المنتجات
  async getProducts() {
    if (useFirebase) {
      try {
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) { console.warn('Firebase error:', e); }
    }
    return this._getLocal('hd_products', DEFAULT_PRODUCTS);
  },
  
  async saveProduct(product) {
    if (useFirebase) {
      try {
        if (product.id && product.id.startsWith('p')) {
          // منتج موجود - تحديث
          await db.collection('products').doc(product.id).set(product);
          return product;
        } else {
          // منتج جديد
          const docRef = await db.collection('products').add(product);
          return { id: docRef.id, ...product };
        }
      } catch (e) { console.warn('Save error:', e); }
    }
    // Fallback إلى localStorage
    const products = this._getLocal('hd_products', DEFAULT_PRODUCTS);
    if (product.id && products.find(p => p.id === product.id)) {
      // تحديث
      const index = products.findIndex(p => p.id === product.id);
      products[index] = { ...products[index], ...product };
    } else {
      // جديد
      product.id = 'p' + Date.now();
      products.push(product);
    }
    this._setLocal('hd_products', products);
    return product;
  },
  
  async deleteProduct(id) {
    if (useFirebase) {
      try {
        await db.collection('products').doc(id).delete();
        return true;
      } catch (e) { console.warn(e); }
    }
    const products = this._getLocal('hd_products', DEFAULT_PRODUCTS).filter(p => p.id !== id);
    this._setLocal('hd_products', products);
    return true;
  },
  
  // الفئات
  async getCategories() {
    if (useFirebase) {
      try {
        const snapshot = await db.collection('categories').orderBy('order').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) { console.warn(e); }
    }
    return this._getLocal('hd_categories', DEFAULT_CATEGORIES);
  },
  
  async saveCategory(category) {
    if (useFirebase) {
      try {
        await db.collection('categories').doc(category.id).set(category);
        return category;
      } catch (e) { console.warn(e); }
    }
    const categories = this._getLocal('hd_categories', DEFAULT_CATEGORIES);
    if (category.id && categories.find(c => c.id === category.id)) {
      const index = categories.findIndex(c => c.id === category.id);
      categories[index] = { ...categories[index], ...category };
    } else {
      category.id = 'cat' + Date.now();
      categories.push(category);
    }
    this._setLocal('hd_categories', categories);
    return category;
  },
  
  async deleteCategory(id) {
    if (useFirebase) {
      try {
        await db.collection('categories').doc(id).delete();
        return true;
      } catch (e) {}
    }
    const categories = this._getLocal('hd_categories', DEFAULT_CATEGORIES).filter(c => c.id !== id);
    this._setLocal('hd_categories', categories);
    return true;
  },
  
  // الطلبات
  async getOrders() {
    if (useFirebase) {
      try {
        const snapshot = await db.collection('orders').orderBy('date', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {}
    }
    return this._getLocal('hd_orders', []);
  },
  
  async addOrder(order) {
    if (useFirebase) {
      try {
        const docRef = await db.collection('orders').add(order);
        return { id: docRef.id, ...order };
      } catch (e) {}
    }
    const orders = this._getLocal('hd_orders', []);
    order.id = 'ORD-' + Date.now();
    orders.push(order);
    this._setLocal('hd_orders', orders);
    return order;
  },
  
  async updateOrderStatus(id, status) {
    if (useFirebase) {
      try {
        await db.collection('orders').doc(id).update({ status });
        return true;
      } catch (e) {}
    }
    const orders = this._getLocal('hd_orders', []);
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      this._setLocal('hd_orders', orders);
    }
    return true;
  },
  
  async deleteOrder(id) {
    if (useFirebase) {
      try {
        await db.collection('orders').doc(id).delete();
        return true;
      } catch (e) {}
    }
    const orders = this._getLocal('hd_orders', []).filter(o => o.id !== id);
    this._setLocal('hd_orders', orders);
    return true;
  },
  
  // كوبونات
  async getCoupons() {
    if (useFirebase) {
      try {
        const snapshot = await db.collection('coupons').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {}
    }
    return this._getLocal('hd_coupons', []);
  },
  
  async saveCoupon(coupon) {
    if (useFirebase) {
      try {
        if (coupon.id) {
          await db.collection('coupons').doc(coupon.id).set(coupon);
        } else {
          const ref = await db.collection('coupons').add(coupon);
          coupon.id = ref.id;
        }
        return coupon;
      } catch (e) {}
    }
    const coupons = this._getLocal('hd_coupons', []);
    if (coupon.id && coupons.find(c => c.id === coupon.id)) {
      const index = coupons.findIndex(c => c.id === coupon.id);
      coupons[index] = { ...coupons[index], ...coupon };
    } else {
      coupon.id = 'c' + Date.now();
      coupons.push(coupon);
    }
    this._setLocal('hd_coupons', coupons);
    return coupon;
  },
  
  async deleteCoupon(id) {
    if (useFirebase) {
      try {
        await db.collection('coupons').doc(id).delete();
        return true;
      } catch (e) {}
    }
    const coupons = this._getLocal('hd_coupons', []).filter(c => c.id !== id);
    this._setLocal('hd_coupons', coupons);
    return true;
  },
  
  // التخزين المحلي (Fallback)
  _getLocal(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) {}
    this._setLocal(key, defaultValue);
    return defaultValue;
  },
  
  _setLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) { return false; }
  }
};

// ===========================
// DataManager (واجهة موحدة)
// ===========================
const DataManager = {
  // الإعدادات
  getSettings: () => Storage.getSettings(),
  saveSettings: (s) => Storage.saveSettings(s),
  
  // المنتجات
  getProducts: (filters) => {
    return Storage.getProducts().then(products => {
      if (filters?.category && filters.category !== 'الكل') {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(s));
      }
      if (filters?.featured !== undefined) {
        products = products.filter(p => p.featured === filters.featured);
      }
      if (filters?.active !== undefined) {
        products = products.filter(p => p.active === filters.active);
      }
      if (filters?.lowStock) {
        products = products.filter(p => p.stock <= 5);
      }
      return products;
    });
  },
  getProduct: async (id) => {
    const products = await Storage.getProducts();
    return products.find(p => p.id === id);
  },
  saveProduct: (p) => Storage.saveProduct(p),
  updateProduct: (id, updates) => {
    return Storage.getProducts().then(products => {
      const product = products.find(p => p.id === id);
      if (product) {
        return Storage.saveProduct({ ...product, ...updates });
      }
      return null;
    });
  },
  deleteProduct: (id) => Storage.deleteProduct(id),
  duplicateProduct: async (id) => {
    const product = await DataManager.getProduct(id);
    if (product) {
      const newProduct = { ...product };
      delete newProduct.id;
      newProduct.name = product.name + ' (نسخة)';
      return DataManager.saveProduct(newProduct);
    }
    return null;
  },
  toggleFeatured: async (id) => {
    const product = await DataManager.getProduct(id);
    if (product) return DataManager.updateProduct(id, { featured: !product.featured });
  },
  
  // الفئات
  getCategories: () => Storage.getCategories(),
  saveCategory: (c) => Storage.saveCategory(c),
  updateCategory: async (id, updates) => {
    const categories = await Storage.getCategories();
    const cat = categories.find(c => c.id === id);
    if (cat) return Storage.saveCategory({ ...cat, ...updates });
    return null;
  },
  deleteCategory: (id) => Storage.deleteCategory(id),
  
  // الطلبات
  getOrders: () => Storage.getOrders(),
  addOrder: (o) => Storage.addOrder(o),
  updateOrderStatus: (id, status) => Storage.updateOrderStatus(id, status),
  updateOrder: (id, updates) => {
    return Storage.getOrders().then(orders => {
      const order = orders.find(o => o.id === id);
      if (order) return Storage.addOrder({ ...order, ...updates });
      return null;
    });
  },
  deleteOrder: (id) => Storage.deleteOrder(id),
  
  // كوبونات
  getCoupons: () => Storage.getCoupons(),
  saveCoupon: (c) => Storage.saveCoupon(c),
  validateCoupon: async (code) => {
    const coupons = await Storage.getCoupons();
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return { valid: false, message: 'كود غير صحيح' };
    if (!coupon.active) return { valid: false, message: 'الكود غير نشط' };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, message: 'انتهت صلاحية الكود' };
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) return { valid: false, message: 'تم استخدام الكود الحد الأقصى' };
    return { valid: true, coupon };
  },
  deleteCoupon: (id) => Storage.deleteCoupon(id),
  
  // إحصائيات
  getStats: async () => {
    const products = await Storage.getProducts();
    const orders = await Storage.getOrders();
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
      totalCoupons: (await Storage.getCoupons()).length,
      totalUsers: typeof AuthManager !== 'undefined' ? AuthManager.getUsers().length : 0,
      onlineUsers: typeof AuthManager !== 'undefined' ? AuthManager.getActiveSessions().length : 0
    };
  },
  
  // التهيئة
  async initDefaults() {
    const products = await Storage.getProducts();
    if (products.length === 0) {
      for (const p of DEFAULT_PRODUCTS) {
        await Storage.saveProduct(p);
      }
    }
    const categories = await Storage.getCategories();
    if (categories.length === 0) {
      for (const c of DEFAULT_CATEGORIES) {
        await Storage.saveCategory(c);
      }
    }
    const settings = await Storage.getSettings();
    if (!settings.hero) {
      await Storage.saveSettings(DEFAULT_SETTINGS);
    }
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
  return new Intl.NumberFormat('ar-EG').format(price || 0) + ' ج.م';
}

function handleImageError(img, fallback) {
  img.onerror = null;
  img.src = fallback || PLACEHOLDER_IMG;
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

// تهيئة البيانات الافتراضية
DataManager.initDefaults().catch(console.error);
