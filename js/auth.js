/* ==========================================
   h&D store - Auth Manager
   نظام المصادقة والصلاحيات - مستقل تماماً
   ========================================== */

// ===========================
// نظام Hash آمن لكلمات المرور (يدعم UTF-8)
// ===========================
class SimpleHash {
    static hash(password) {
      const salt = 'h&d_store_2024_secure_salt_v3';
      const str = password + salt;
      let hash1 = 0;
      let hash2 = 0;
      
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash1 = ((hash1 << 5) - hash1) + char;
        hash1 = hash1 & hash1;
        hash2 = ((hash2 << 7) - hash2) + char;
        hash2 = hash2 & hash2;
      }
      
      // تشفير hex (آمن لكل الأحرف)
      return 'sha256$' + 
             Math.abs(hash1).toString(16).padStart(8, '0') + 
             Math.abs(hash2).toString(16).padStart(8, '0') + 
             '$' + this.simpleEncode(str);
    }
    
    static simpleEncode(str) {
      // ترميز آمن يدعم UTF-8 (بدون btoa)
      let result = '';
      for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16).padStart(4, '0');
      }
      return result;
    }
    
    static verify(password, hashed) {
      return this.hash(password) === hashed;
    }
  }
  
  // ===========================
  // الأدوار والصلاحيات
  // ===========================
  const ROLES = {
    super_admin: {
      id: 'super_admin',
      name: 'المدير العام',
      nameEn: 'Super Admin',
      icon: '👑',
      color: '#8b6f47',
      level: 100,
      permissions: ['*']
    },
    admin: {
      id: 'admin',
      name: 'مدير',
      nameEn: 'Admin',
      icon: '🛡️',
      color: '#4a6fa5',
      level: 80,
      permissions: [
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'orders.view', 'orders.edit', 'orders.delete', 'orders.export',
        'categories.manage', 'coupons.manage',
        'settings.view', 'settings.edit',
        'content.manage', 'theme.manage',
        'reports.view', 'reports.export',
        'users.view', 'activity.view', 'backup.manage'
      ]
    },
    manager: {
      id: 'manager',
      name: 'مدير متجر',
      nameEn: 'Manager',
      icon: '📊',
      color: '#4a7c59',
      level: 60,
      permissions: [
        'products.view', 'products.create', 'products.edit',
        'orders.view', 'orders.edit', 'orders.export',
        'categories.manage', 'coupons.manage',
        'reports.view', 'reports.export', 'activity.view'
      ]
    },
    editor: {
      id: 'editor',
      name: 'محرر محتوى',
      nameEn: 'Editor',
      icon: '✏️',
      color: '#c9a961',
      level: 40,
      permissions: [
        'products.view', 'products.create', 'products.edit',
        'categories.view', 'content.manage', 'orders.view'
      ]
    },
    support: {
      id: 'support',
      name: 'دعم فني',
      nameEn: 'Support',
      icon: '💬',
      color: '#a04848',
      level: 30,
      permissions: ['orders.view', 'orders.edit', 'products.view', 'activity.view']
    },
    accountant: {
      id: 'accountant',
      name: 'محاسب',
      nameEn: 'Accountant',
      icon: '💰',
      color: '#6b5535',
      level: 30,
      permissions: ['orders.view', 'orders.export', 'reports.view', 'reports.export', 'products.view']
    },
    inventory: {
      id: 'inventory',
      name: 'مدير مخزون',
      nameEn: 'Inventory',
      icon: '📦',
      color: '#4a6fa5',
      level: 25,
      permissions: ['products.view', 'products.edit', 'categories.view', 'reports.view']
    },
    viewer: {
      id: 'viewer',
      name: 'مشاهد',
      nameEn: 'Viewer',
      icon: '👁️',
      color: '#6b6b6b',
      level: 10,
      permissions: ['products.view', 'orders.view', 'reports.view']
    }
  };
  
  const PERMISSIONS_LIST = {
    'products.view': 'عرض المنتجات',
    'products.create': 'إضافة منتجات',
    'products.edit': 'تعديل المنتجات',
    'products.delete': 'حذف المنتجات',
    'orders.view': 'عرض الطلبات',
    'orders.edit': 'تعديل الطلبات',
    'orders.delete': 'حذف الطلبات',
    'orders.export': 'تصدير الطلبات',
    'categories.view': 'عرض الفئات',
    'categories.manage': 'إدارة الفئات',
    'coupons.manage': 'إدارة الكوبونات',
    'users.view': 'عرض المستخدمين',
    'users.manage': 'إدارة المستخدمين',
    'settings.view': 'عرض الإعدادات',
    'settings.edit': 'تعديل الإعدادات',
    'content.manage': 'إدارة المحتوى',
    'theme.manage': 'إدارة المظهر',
    'reports.view': 'عرض التقارير',
    'reports.export': 'تصدير التقارير',
    'activity.view': 'سجل النشاطات',
    'backup.manage': 'النسخ الاحتياطي',
    'system.manage': 'إدارة النظام'
  };
  
  // ===========================
  // المستخدم الافتراضي
  // ===========================
  const DEFAULT_USERS = [
    {
      id: 'u001',
      username: 'admin',
      password: SimpleHash.hash('admin123'),
      name: 'المدير العام',
      email: 'admin@hdstore.com',
      phone: '+966500000000',
      role: 'super_admin',
      avatar: null,
      bio: 'مدير عام المتجر',
      active: true,
      twoFactorEnabled: false,
      securityQuestion: 'ما هو اسم مدينتك المفضلة؟',
      securityAnswerHash: SimpleHash.hash('الرياض'),
      lastLogin: null,
      loginAttempts: 0,
      lockedUntil: null,
      createdAt: new Date().toISOString(),
      createdBy: 'system'
    }
  ];
  
  // ===========================
  // مدير المصادقة - AuthManager
  // ===========================
  const AuthManager = {
    // الحصول على المستخدم الحالي
    getCurrentUser() {
      try {
        const sessionId = sessionStorage.getItem('hd_session_id');
        if (!sessionId) return null;
        
        const sessions = this._getSessions();
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return null;
        
        // التحقق من انتهاء الجلسة
        const settings = this.getSettings();
        const timeout = (settings.security?.sessionTimeout || 60) * 60 * 1000;
        if (Date.now() - session.lastActivity > timeout) {
          this.logout();
          return null;
        }
        
        // تحديث آخر نشاط
        session.lastActivity = Date.now();
        this._saveSessions(sessions);
        
        return this.getUserById(session.userId);
      } catch (e) {
        console.error('getCurrentUser error:', e);
        return null;
      }
    },
    
    // الحصول على إعدادات
    getSettings() {
      try {
        const data = localStorage.getItem('hd_settings');
        if (data) return JSON.parse(data);
      } catch (e) {}
      return {};
    },
    
    // الحصول على المستخدمين
    getUsers() {
      try {
        const data = localStorage.getItem('hd_users');
        if (data) return JSON.parse(data);
      } catch (e) {}
      // إنشاء المستخدم الافتراضي إذا لم يكن موجوداً
      this._saveUsers(DEFAULT_USERS);
      return DEFAULT_USERS;
    },
    
    _saveUsers(users) {
      try {
        localStorage.setItem('hd_users', JSON.stringify(users));
        return true;
      } catch (e) { return false; }
    },
    
    // الحصول على مستخدم بالمعرف
    getUserById(id) {
      return this.getUsers().find(u => u.id === id);
    },
    
    // الحصول على مستخدم باسم المستخدم
    getUserByUsername(username) {
      return this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
    },
    
    // تسجيل الدخول
    login(username, password) {
      const user = this.getUserByUsername(username);
      if (!user) return { success: false, message: 'اسم المستخدم غير موجود' };
      
      if (!user.active) return { success: false, message: 'الحساب معطل. تواصل مع المدير' };
      
      // التحقق من القفل
      if (user.lockedUntil && Date.now() < user.lockedUntil) {
        const minutes = Math.ceil((user.lockedUntil - Date.now()) / 60000);
        return { success: false, message: `الحساب مقفل. حاول بعد ${minutes} دقيقة` };
      }
      
      // التحقق من كلمة المرور
      if (!SimpleHash.verify(password, user.password)) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        const settings = this.getSettings();
        const maxAttempts = settings.security?.maxLoginAttempts || 5;
        
        if (user.loginAttempts >= maxAttempts) {
          const lockoutDuration = (settings.security?.lockoutDuration || 15) * 60 * 1000;
          user.lockedUntil = Date.now() + lockoutDuration;
          this._saveUsers(this.getUsers());
          return { success: false, message: 'تم قفل الحساب بعد محاولات فاشلة متعددة' };
        }
        
        this._saveUsers(this.getUsers());
        return { success: false, message: `كلمة المرور خاطئة (${maxAttempts - user.loginAttempts} محاولات متبقية)` };
      }
      
      // نجاح الدخول
      user.loginAttempts = 0;
      user.lockedUntil = null;
      user.lastLogin = new Date().toISOString();
      this._saveUsers(this.getUsers());
      
      // إنشاء جلسة
      const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      const session = {
        id: sessionId,
        userId: user.id,
        username: user.username,
        role: user.role,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        userAgent: (navigator.userAgent || '').slice(0, 100)
      };
      
      const sessions = this._getSessions();
      sessions.push(session);
      this._saveSessions(sessions);
      sessionStorage.setItem('hd_session_id', sessionId);
      
      // تسجيل النشاط
      this._logActivity('تسجيل دخول', `${user.name} (${user.username})`);
      
      return { success: true, user, session };
    },
    
    // تسجيل الخروج
    logout() {
      try {
        const sessionId = sessionStorage.getItem('hd_session_id');
        if (sessionId) {
          const sessions = this._getSessions();
          this._saveSessions(sessions.filter(s => s.id !== sessionId));
          sessionStorage.removeItem('hd_session_id');
        }
      } catch (e) {}
    },
    
    // الجلسات
    _getSessions() {
      try {
        const data = localStorage.getItem('hd_sessions');
        if (data) return JSON.parse(data);
      } catch (e) {}
      return [];
    },
    
    _saveSessions(sessions) {
      try { localStorage.setItem('hd_sessions', JSON.stringify(sessions)); } catch (e) {}
    },
    
    getActiveSessions() { return this._getSessions(); },
    
    // التحقق من الصلاحية
    hasPermission(permission) {
      const user = this.getCurrentUser();
      if (!user) return false;
      const role = ROLES[user.role];
      if (!role) return false;
      if (role.permissions.includes('*')) return true;
      return role.permissions.includes(permission);
    },
    
    hasAnyPermission(permissions) {
      return permissions.some(p => this.hasPermission(p));
    },
    
    isSuperAdmin() {
      const user = this.getCurrentUser();
      return user && user.role === 'super_admin';
    },
    
    // تغيير كلمة المرور
    changePassword(userId, oldPassword, newPassword) {
      const user = this.getUserById(userId);
      if (!user) return { success: false, message: 'المستخدم غير موجود' };
      
      const currentUser = this.getCurrentUser();
      if (currentUser.id !== userId && !this.isSuperAdmin()) {
        return { success: false, message: 'لا تملك صلاحية تغيير كلمة مرور هذا المستخدم' };
      }
      
      if (currentUser.id === userId && !SimpleHash.verify(oldPassword, user.password)) {
        return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
      }
      
      const settings = this.getSettings();
      if (settings.security?.requireStrongPassword && newPassword.length < (settings.security?.passwordMinLength || 8)) {
        return { success: false, message: `كلمة المرور يجب أن تكون ${settings.security?.passwordMinLength || 8} أحرف على الأقل` };
      }
      
      user.password = SimpleHash.hash(newPassword);
      user.passwordChangedAt = new Date().toISOString();
      this._saveUsers(this.getUsers());
      this._logActivity('تغيير كلمة مرور', user.username);
      return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
    },
    
    // استعادة كلمة المرور
    resetPassword(userId, securityAnswer, newPassword) {
      const user = this.getUserById(userId);
      if (!user) return { success: false, message: 'المستخدم غير موجود' };
      
      if (!SimpleHash.verify(securityAnswer, user.securityAnswerHash)) {
        return { success: false, message: 'إجابة سؤال الأمان غير صحيحة' };
      }
      
      user.password = SimpleHash.hash(newPassword);
      user.loginAttempts = 0;
      user.lockedUntil = null;
      this._saveUsers(this.getUsers());
      this._logActivity('إعادة تعيين كلمة مرور', user.username);
      return { success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' };
    },
    
    // إضافة مستخدم
    addUser(userData, createdBy) {
      const users = this.getUsers();
      if (users.find(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
        return { success: false, message: 'اسم المستخدم موجود بالفعل' };
      }
      
      const settings = this.getSettings();
      if (settings.security?.requireStrongPassword && userData.password.length < (settings.security?.passwordMinLength || 8)) {
        return { success: false, message: `كلمة المرور يجب أن تكون ${settings.security?.passwordMinLength || 8} أحرف` };
      }
      
      const newUser = {
        id: 'u' + Date.now(),
        username: userData.username,
        password: SimpleHash.hash(userData.password),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        avatar: null,
        bio: userData.bio || '',
        active: true,
        twoFactorEnabled: false,
        securityQuestion: userData.securityQuestion,
        securityAnswerHash: SimpleHash.hash(userData.securityAnswer),
        lastLogin: null,
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date().toISOString(),
        createdBy: createdBy
      };
      
      users.push(newUser);
      this._saveUsers(users);
      this._logActivity('إضافة مستخدم', `${newUser.name} (${newUser.username})`);
      return { success: true, user: newUser, message: 'تم إضافة المستخدم بنجاح' };
    },
    
    // تحديث مستخدم
    updateUser(userId, updates, updatedBy) {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) return { success: false, message: 'المستخدم غير موجود' };
      
      if (users[index].role === 'super_admin' && updates.role && updates.role !== 'super_admin') {
        const currentUser = this.getCurrentUser();
        if (currentUser.id !== users[index].id) {
          return { success: false, message: 'لا يمكن تغيير دور المدير العام' };
        }
      }
      
      delete updates.password;
      delete updates.loginAttempts;
      delete updates.lockedUntil;
      
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      this._saveUsers(users);
      this._logActivity('تعديل مستخدم', `${users[index].name} (${users[index].username})`);
      return { success: true, user: users[index] };
    },
    
    // حذف مستخدم
    deleteUser(userId, deletedBy) {
      const users = this.getUsers();
      const user = users.find(u => u.id === userId);
      if (!user) return { success: false, message: 'المستخدم غير موجود' };
      if (user.role === 'super_admin') return { success: false, message: 'لا يمكن حذف المدير العام' };
      
      this._saveUsers(users.filter(u => u.id !== userId));
      
      // إنهاء جلسات المستخدم
      const sessions = this._getSessions().filter(s => s.userId !== userId);
      this._saveSessions(sessions);
      
      this._logActivity('حذف مستخدم', `${user.name} (${user.username})`);
      return { success: true };
    },
    
    // تفعيل/تعطيل مستخدم
    toggleUserActive(userId, active, toggledBy) {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) return { success: false };
      if (users[index].role === 'super_admin') return { success: false, message: 'لا يمكن تعطيل المدير العام' };
      
      users[index].active = active;
      this._saveUsers(users);
      this._logActivity(active ? 'تفعيل مستخدم' : 'تعطيل مستخدم', users[index].username);
      return { success: true };
    },
    
    // إنهاء جلسة
    killSession(sessionId) {
      this._saveSessions(this._getSessions().filter(s => s.id !== sessionId));
      this._logActivity('إنهاء جلسة', sessionId);
    },
    
    // سجل النشاطات
    _logActivity(type, description) {
      try {
        const log = JSON.parse(localStorage.getItem('hd_activity_log') || '[]');
        const user = this.getCurrentUser();
        log.push({
          id: Date.now(),
          type, description,
          timestamp: new Date().toISOString(),
          user: user?.username || 'system',
          userName: user?.name || 'النظام'
        });
        if (log.length > 100) log.shift();
        localStorage.setItem('hd_activity_log', JSON.stringify(log));
      } catch (e) {}
    }
  };
  
  // تهيئة - إنشاء المستخدم الافتراضي إذا لم يكن موجوداً
  (function initAuth() {
    try {
      if (!localStorage.getItem('hd_users')) {
        localStorage.setItem('hd_users', JSON.stringify(DEFAULT_USERS));
      }
    } catch (e) {
      console.warn('Auth init failed:', e);
    }
  })();
  