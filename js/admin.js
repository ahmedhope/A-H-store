/* ==========================================
   h&D store - Admin Panel v3.0 (EGP)
   لوحة الإدارة - الجنيه المصري
   ========================================== */

   if (typeof AuthManager === 'undefined') {
    console.error('❌ خطأ: يجب تحميل auth.js قبل admin.js');
  }
  
  let currentUser = null;
  let currentEditId = null;
  let productImages = [];
  let productImageBase64 = '';
  
  function init() {
    if (typeof AuthManager === 'undefined') return;
    currentUser = AuthManager.getCurrentUser();
    if (currentUser) {
      showDashboard();
    } else {
      showLogin();
    }
  }
  
  function showLogin() {
    const loginPage = document.getElementById('login-page');
    const forgotPage = document.getElementById('forgot-password-page');
    const dashboard = document.getElementById('dashboard-page');
    if (loginPage) loginPage.classList.remove('hidden');
    if (forgotPage) forgotPage.classList.add('hidden');
    if (dashboard) dashboard.classList.add('hidden');
  }
  
  function showForgotPassword() {
    const loginPage = document.getElementById('login-page');
    const forgotPage = document.getElementById('forgot-password-page');
    if (loginPage) loginPage.classList.add('hidden');
    if (forgotPage) forgotPage.classList.remove('hidden');
  }
  
  function showDashboard() {
    currentUser = AuthManager.getCurrentUser();
    if (!currentUser) { showLogin(); return; }
    
    const loginPage = document.getElementById('login-page');
    const forgotPage = document.getElementById('forgot-password-page');
    const dashboard = document.getElementById('dashboard-page');
    if (loginPage) loginPage.classList.add('hidden');
    if (forgotPage) forgotPage.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
    
    const name = currentUser.name;
    const initial = name.charAt(0);
    const role = ROLES[currentUser.role];
    const roleName = role ? role.name : currentUser.role;
    
    setText('current-user-name', name);
    setText('current-user-role', roleName);
    setText('overview-user-name', name);
    setText('current-user-avatar', initial);
    setText('dropdown-user-name', name);
    setText('dropdown-user-role', currentUser.email + ' • ' + roleName);
    
    applyPermissions();
    renderAll();
  }
  
  function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
  function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
  function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
  
  function applyPermissions() {
    const permsMap = {
      'products': ['products.view'], 'orders': ['orders.view'], 'categories': ['categories.view'],
      'coupons': ['coupons.manage'], 'users': ['users.view'], 'settings': ['settings.view'],
      'theme': ['theme.manage'], 'content': ['content.manage'], 'reports': ['reports.view'],
      'activity': ['activity.view'], 'audit': ['activity.view'], 'security': ['system.manage'],
      'backup': ['backup.manage']
    };
    
    Object.keys(permsMap).forEach(function(section) {
      const navLink = document.querySelector('[data-section="' + section + '"]');
      if (navLink) {
        const hasAccess = permsMap[section].some(function(p) { return AuthManager.hasPermission(p); });
        navLink.style.display = hasAccess ? 'flex' : 'none';
      }
    });
  }
  
  function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value.trim();
    const password = form.password.value;
    
    const result = AuthManager.login(username, password);
    if (result.success) {
      showToast('أهلاً ' + result.user.name + ' 👋');
      showDashboard();
    } else {
      showToast(result.message, 'error');
    }
  }
  
  function logout() {
    if (!confirm('هل تريد تسجيل الخروج؟')) return;
    AuthManager.logout();
    showLogin();
    showToast('تم تسجيل الخروج', 'info');
  }
  
  function handleForgotPassword(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value.trim();
    const user = AuthManager.getUserByUsername(username);
    
    if (!user) { showToast('اسم المستخدم غير موجود', 'error'); return; }
    
    document.getElementById('forgot-step-1').classList.add('hidden');
    document.getElementById('forgot-step-2').classList.remove('hidden');
    setText('security-question-text', user.securityQuestion);
    setVal('reset-username', username);
  }
  
  function handleResetPassword(event) {
    event.preventDefault();
    const form = event.target;
    const username = getVal('reset-username');
    const answer = form.securityAnswer.value.trim();
    const newPass = form.newPassword.value;
    const confirmPass = form.confirmPassword.value;
    
    if (newPass !== confirmPass) { showToast('كلمات المرور غير متطابقة', 'error'); return; }
    
    const user = AuthManager.getUserByUsername(username);
    const result = AuthManager.resetPassword(user.id, answer, newPass);
    
    if (result.success) { showToast(result.message); showLogin(); }
    else { showToast(result.message, 'error'); }
  }
  
  function openChangePasswordModal() {
    const form = document.getElementById('change-password-form');
    if (form) form.reset();
    document.getElementById('change-password-modal').classList.add('active');
  }
  
  function closeChangePasswordModal() {
    document.getElementById('change-password-modal').classList.remove('active');
  }
  
  function handleChangePassword(event) {
    event.preventDefault();
    const form = event.target;
    const oldPass = form.oldPassword.value;
    const newPass = form.newPassword.value;
    const confirmPass = form.confirmPassword.value;
    
    if (newPass !== confirmPass) { showToast('كلمات المرور غير متطابقة', 'error'); return; }
    
    const result = AuthManager.changePassword(currentUser.id, oldPass, newPass);
    if (result.success) { showToast(result.message); closeChangePasswordModal(); }
    else { showToast(result.message, 'error'); }
  }
  
  function renderUsersTable() {
    if (!AuthManager.hasPermission('users.view')) return;
    
    const users = AuthManager.getUsers();
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    
    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--text-muted);">لا يوجد مستخدمين</td></tr>';
      return;
    }
    
    tbody.innerHTML = users.map(function(user) {
      const role = ROLES[user.role];
      const isOnline = AuthManager.getActiveSessions().some(function(s) { return s.userId === user.id; });
      const isLocked = user.lockedUntil && Date.now() < user.lockedUntil;
      const lastLogin = user.lastLogin ? timeAgo(user.lastLogin) : 'لم يسجل دخول';
      const canManage = AuthManager.hasPermission('users.manage');
      
      return '<tr>' +
        '<td><div style="display:flex;align-items:center;gap:0.75rem;">' +
          '<div class="user-avatar" style="background:' + (role ? role.color : '#999') + ';">' + user.name.charAt(0) + '</div>' +
          '<div><div style="font-weight:600;">' + user.name + '</div><div style="font-size:0.75rem;color:var(--text-muted);">@' + user.username + '</div></div>' +
        '</div></td>' +
        '<td>' + user.email + '</td>' +
        '<td><span class="role-badge" style="background:' + (role ? role.color : '#999') + '20;color:' + (role ? role.color : '#666') + ';border:1px solid ' + (role ? role.color : '#999') + '40;">' + (role ? role.icon : '👤') + ' ' + (role ? role.name : user.role) + '</span></td>' +
        '<td>' + (isOnline ? '<span class="status-online">● متصل</span>' : '<span class="status-offline">غير متصل</span>') + '</td>' +
        '<td>' + (user.active ? '<span class="status-badge status-completed">نشط</span>' : '<span class="status-badge status-new">معطل</span>') + (isLocked ? ' <span class="status-badge" style="background:#a04848;color:white;">🔒 مقفل</span>' : '') + '</td>' +
        '<td style="font-size:0.8rem;">' + lastLogin + '</td>' +
        '<td><div style="display:flex;gap:0.25rem;flex-wrap:wrap;">' +
          (user.role !== 'super_admin' && canManage ? 
            '<button onclick="editUser(\'' + user.id + '\')" class="btn-sm btn-secondary">تعديل</button>' +
            '<button onclick="resetUserPassword(\'' + user.id + '\')" class="btn-sm" style="background:rgba(74,111,165,0.1);color:#4a6fa5;border:1px solid rgba(74,111,165,0.3);">إعادة</button>' +
            '<button onclick="toggleUserActive(\'' + user.id + '\')" class="btn-sm" style="background:rgba(212,160,23,0.1);color:#856404;border:1px solid rgba(212,160,23,0.3);">' + (user.active ? 'تعطيل' : 'تفعيل') + '</button>' +
            '<button onclick="deleteUserConfirm(\'' + user.id + '\')" class="btn-sm btn-danger">حذف</button>'
            : '<span style="font-size:0.75rem;color:var(--text-light);">محمي</span>'
          ) +
        '</div></td>' +
      '</tr>';
    }).join('');
  }
  
  function openAddUserModal() {
    if (!AuthManager.hasPermission('users.manage')) { showToast('لا تملك صلاحية', 'error'); return; }
    currentEditId = null;
    const form = document.getElementById('user-form');
    if (form) form.reset();
    setText('user-form-title', 'إضافة مستخدم جديد');
    setText('user-password-required', '*');
    populateRoleSelect();
    document.getElementById('user-modal').classList.add('active');
  }
  
  function editUser(userId) {
    if (!AuthManager.hasPermission('users.manage')) { showToast('لا تملك صلاحية', 'error'); return; }
    const user = AuthManager.getUserById(userId);
    if (!user) return;
    currentEditId = userId;
    setText('user-form-title', 'تعديل المستخدم');
    setVal('user-name', user.name);
    setVal('user-username', user.username);
    setVal('user-email', user.email);
    setVal('user-phone', user.phone || '');
    setVal('user-bio', user.bio || '');
    setText('user-password-required', '(اتركه فارغاً للإبقاء على الحالي)');
    populateRoleSelect(user.role);
    document.getElementById('user-modal').classList.add('active');
  }
  
  function populateRoleSelect(selected) {
    selected = selected || 'viewer';
    const select = document.getElementById('user-role');
    if (!select) return;
    select.innerHTML = Object.values(ROLES).map(function(r) {
      return '<option value="' + r.id + '"' + (r.id === selected ? ' selected' : '') + '>' + r.icon + ' ' + r.name + ' (' + r.nameEn + ')</option>';
    }).join('');
  }
  
  function closeUserModal() { document.getElementById('user-modal').classList.remove('active'); currentEditId = null; }
  
  function saveUser(event) {
    event.preventDefault();
    const form = event.target;
    if (currentEditId) {
      const updates = {
        name: form.name.value.trim(), email: form.email.value.trim(),
        phone: form.phone.value.trim(), bio: form.bio.value.trim(), role: form.role.value
      };
      const result = AuthManager.updateUser(currentEditId, updates, currentUser.id);
      if (result.success) { showToast('تم التحديث'); closeUserModal(); renderUsersTable(); }
      else { showToast(result.message, 'error'); }
    } else {
      const userData = {
        name: form.name.value.trim(), username: form.username.value.trim(),
        email: form.email.value.trim(), phone: form.phone.value.trim(),
        bio: form.bio.value.trim(), role: form.role.value, password: form.password.value,
        securityQuestion: form.securityQuestion.value.trim(), securityAnswer: form.securityAnswer.value.trim()
      };
      const result = AuthManager.addUser(userData, currentUser.id);
      if (result.success) { showToast(result.message); closeUserModal(); renderUsersTable(); }
      else { showToast(result.message, 'error'); }
    }
  }
  
  function deleteUserConfirm(userId) {
    if (!AuthManager.hasPermission('users.manage')) { showToast('لا تملك صلاحية', 'error'); return; }
    if (!confirm('حذف هذا المستخدم؟')) return;
    const result = AuthManager.deleteUser(userId, currentUser.id);
    if (result.success) { showToast('تم الحذف'); renderUsersTable(); }
    else { showToast(result.message, 'error'); }
  }
  
  function toggleUserActive(userId) {
    if (!AuthManager.hasPermission('users.manage')) return;
    const user = AuthManager.getUserById(userId);
    if (!user) return;
    const result = AuthManager.toggleUserActive(userId, !user.active, currentUser.id);
    if (result.success) { showToast('تم التحديث'); renderUsersTable(); }
    else { showToast(result.message, 'error'); }
  }
  
  function resetUserPassword(userId) {
    if (!AuthManager.hasPermission('users.manage')) return;
    const newPass = prompt('كلمة المرور الجديدة (8 أحرف على الأقل):');
    if (!newPass) return;
    if (newPass.length < 8) { showToast('كلمة المرور قصيرة', 'error'); return; }
    const user = AuthManager.getUserById(userId);
    user.password = SimpleHash.hash(newPass);
    user.loginAttempts = 0;
    user.lockedUntil = null;
    AuthManager._saveUsers(AuthManager.getUsers());
    showToast('تم إعادة تعيين كلمة المرور');
  }
  
  function renderAll() {
    renderDashboardStats(); renderProductsTable(); renderOrdersTable();
    renderCategoriesList(); renderSettingsForm(); renderFeaturesList();
    renderFooterColumns(); renderCouponsList(); renderUsersTable();
    renderActiveSessions(); renderAuditLog(); renderReports();
    renderNotifications(); updateCategorySelects();
  }
  
  function renderDashboardStats() {
    const stats = DataManager.getStats();
    setText('stat-products', stats.totalProducts);
    setText('stat-orders', stats.totalOrders);
    setText('stat-revenue', formatPrice(stats.totalRevenue));
    setText('stat-new-orders', stats.newOrders);
    setText('stat-today-orders', stats.todayOrders);
    setText('stat-month-revenue', formatPrice(stats.monthRevenue));
    setText('stat-users', stats.totalUsers);
    setText('stat-online', stats.onlineUsers);
  }
  
  function renderProductsTable() {
    const products = DataManager.getProducts();
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--text-muted);">لا توجد منتجات</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(function(p) {
      return '<tr>' +
        '<td><img src="' + (p.image || PLACEHOLDER_THUMB) + '" class="product-img" onerror="handleImageError(this, \'' + PLACEHOLDER_THUMB + '\')"></td>' +
        '<td><div style="font-weight:600;">' + p.name + '</div><div style="font-size:0.75rem;color:var(--text-muted);">' + (p.sku || '') + '</div></td>' +
        '<td>' + formatPrice(p.price) + '</td>' +
        '<td>' + p.category + '</td>' +
        '<td><span style="' + (p.stock === 0 ? 'color:#a04848;font-weight:bold;' : p.stock <= 5 ? 'color:#d4a017;' : '') + '">' + p.stock + '</span></td>' +
        '<td><button onclick="toggleFeatured(\'' + p.id + '\')" class="btn-sm" style="background:' + (p.featured ? 'rgba(201,169,97,0.2)' : 'var(--bg-page)') + ';">' + (p.featured ? '⭐' : 'عادي') + '</button></td>' +
        '<td><span class="status-badge ' + (p.active !== false ? 'status-completed' : 'status-new') + '">' + (p.active !== false ? 'نشط' : 'مخفي') + '</span></td>' +
        '<td><div class="actions">' +
          '<button onclick="editProduct(\'' + p.id + '\')" class="btn-sm btn-secondary">تعديل</button>' +
          '<button onclick="duplicateProductAction(\'' + p.id + '\')" class="btn-sm" style="background:rgba(74,111,165,0.1);color:#4a6fa5;">نسخ</button>' +
          '<button onclick="deleteProductConfirm(\'' + p.id + '\')" class="btn-sm btn-danger">حذف</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }
  
  function searchProducts() {
    const query = getVal('product-search').toLowerCase();
    const category = getVal('product-filter-category');
    const stockFilter = getVal('product-filter-stock');
    let products = DataManager.getProducts();
    if (query) products = products.filter(function(p) { return p.name.toLowerCase().includes(query) || (p.sku || '').toLowerCase().includes(query); });
    if (category) products = products.filter(function(p) { return p.category === category; });
    if (stockFilter === 'low') products = products.filter(function(p) { return p.stock <= 5; });
    if (stockFilter === 'out') products = products.filter(function(p) { return p.stock === 0; });
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--text-muted);">لا توجد نتائج</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(function(p) {
      return '<tr>' +
        '<td><img src="' + (p.image || PLACEHOLDER_THUMB) + '" class="product-img" onerror="handleImageError(this, \'' + PLACEHOLDER_THUMB + '\')"></td>' +
        '<td><div style="font-weight:600;">' + p.name + '</div><div style="font-size:0.75rem;color:var(--text-muted);">' + (p.sku || '') + '</div></td>' +
        '<td>' + formatPrice(p.price) + '</td>' +
        '<td>' + p.category + '</td>' +
        '<td><span style="' + (p.stock === 0 ? 'color:#a04848;font-weight:bold;' : p.stock <= 5 ? 'color:#d4a017;' : '') + '">' + p.stock + '</span></td>' +
        '<td><button onclick="toggleFeatured(\'' + p.id + '\')" class="btn-sm">' + (p.featured ? '⭐' : 'عادي') + '</button></td>' +
        '<td><span class="status-badge ' + (p.active !== false ? 'status-completed' : 'status-new') + '">' + (p.active !== false ? 'نشط' : 'مخفي') + '</span></td>' +
        '<td><div class="actions">' +
          '<button onclick="editProduct(\'' + p.id + '\')" class="btn-sm btn-secondary">تعديل</button>' +
          '<button onclick="duplicateProductAction(\'' + p.id + '\')" class="btn-sm">نسخ</button>' +
          '<button onclick="deleteProductConfirm(\'' + p.id + '\')" class="btn-sm btn-danger">حذف</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }
  
  function renderOrdersTable() {
    const orders = DataManager.getOrders();
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--text-muted);">لا توجد طلبات</td></tr>';
      return;
    }
    const statusMap = {
      'new': { label: '🆕 جديد', class: 'status-new' },
      'processing': { label: '⚙️ قيد التنفيذ', class: 'status-processing' },
      'shipped': { label: '🚚 تم الشحن', class: 'status-processing' },
      'completed': { label: '✅ مكتمل', class: 'status-completed' },
      'cancelled': { label: '❌ ملغي', class: 'status-cancelled' }
    };
    tbody.innerHTML = orders.map(function(order) {
      const status = statusMap[order.status] || statusMap['new'];
      const date = new Date(order.date).toLocaleDateString('ar-EG');
      return '<tr>' +
        '<td style="font-family:monospace;font-size:0.75rem;">' + order.id + '</td>' +
        '<td><div style="font-weight:600;">' + order.customer.name + '</div><div style="font-size:0.75rem;color:var(--text-muted);">' + order.customer.phone + '</div></td>' +
        '<td>' + order.items.length + '</td>' +
        '<td style="font-weight:600;">' + formatPrice(order.total) + '</td>' +
        '<td><span class="status-badge ' + status.class + '">' + status.label + '</span></td>' +
        '<td><select onchange="updateOrderStatus(\'' + order.id + '\', this.value)" class="form-input" style="padding:0.4rem 0.6rem;font-size:0.8rem;">' +
          '<option value="new"' + (order.status === 'new' ? ' selected' : '') + '>جديد</option>' +
          '<option value="processing"' + (order.status === 'processing' ? ' selected' : '') + '>قيد التنفيذ</option>' +
          '<option value="shipped"' + (order.status === 'shipped' ? ' selected' : '') + '>تم الشحن</option>' +
          '<option value="completed"' + (order.status === 'completed' ? ' selected' : '') + '>مكتمل</option>' +
          '<option value="cancelled"' + (order.status === 'cancelled' ? ' selected' : '') + '>ملغي</option>' +
        '</select></td>' +
        '<td><div style="display:flex;flex-direction:column;gap:0.25rem;">' +
          '<span style="font-size:0.75rem;color:var(--text-muted);">' + date + '</span>' +
          '<div style="display:flex;gap:0.5rem;">' +
            '<button onclick="viewOrderDetails(\'' + order.id + '\')" style="font-size:0.75rem;color:#4a6fa5;background:none;border:none;cursor:pointer;">عرض</button>' +
            '<button onclick="printInvoice(\'' + order.id + '\')" style="font-size:0.75rem;color:#4a7c59;background:none;border:none;cursor:pointer;">طباعة</button>' +
            '<button onclick="deleteOrderConfirm(\'' + order.id + '\')" style="font-size:0.75rem;color:#a04848;background:none;border:none;cursor:pointer;">حذف</button>' +
          '</div>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }
  
  function viewOrderDetails(id) {
    const order = DataManager.getOrders().find(function(o) { return o.id === id; });
    if (!order) return;
    const date = new Date(order.date).toLocaleString('ar-EG');
    const itemsHTML = order.items.map(function(item) {
      return '• ' + item.name + ' (' + item.size + ' - ' + item.color + ') × ' + item.quantity + ' = ' + formatPrice(item.price * item.quantity);
    }).join('\n');
    alert('📋 رقم الطلب: ' + order.id + '\n📅 التاريخ: ' + date + '\n━━━━━━━━━━━━━━━\n👤 العميل: ' + order.customer.name + '\n📞 الجوال: ' + order.customer.phone + '\n🏙️ المدينة: ' + order.customer.city + '\n📍 العنوان: ' + order.customer.address + (order.customer.notes ? '\n📝 ملاحظات: ' + order.customer.notes : '') + '\n━━━━━━━━━━━━━━━\n🛒 المنتجات:\n' + itemsHTML + '\n━━━━━━━━━━━━━━━\n💰 الإجمالي: ' + formatPrice(order.total));
  }
  
  function printInvoice(id) {
    const order = DataManager.getOrders().find(function(o) { return o.id === id; });
    if (!order) return;
    const date = new Date(order.date).toLocaleString('ar-EG');
    const win = window.open('', '_blank');
    win.document.write('<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>فاتورة ' + order.id + '</title><style>body{font-family:Tajawal,Arial,sans-serif;padding:30px;max-width:800px;margin:auto;color:#1a1a1a}h1{text-align:center;color:#1a1a1a;border-bottom:3px solid #8b6f47;padding-bottom:15px}.section{margin:25px 0;padding:15px;background:#fafaf7;border-radius:8px}.section h3{color:#8b6f47;margin-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:15px;background:white}th,td{padding:12px;text-align:right;border-bottom:1px solid #ebe7e0}th{background:#1a1a1a;color:white}.total{font-size:1.5em;font-weight:bold;text-align:left;margin-top:20px;padding:15px;background:#8b6f47;color:white;border-radius:8px}@media print{.no-print{display:none}}</style></head><body><h1>h&D store</h1><p style="text-align:center">فاتورة ضريبية مبسطة - جمهورية مصر العربية</p><div class="section"><p><strong>رقم الطلب:</strong> ' + order.id + '</p><p><strong>التاريخ:</strong> ' + date + '</p><p><strong>الحالة:</strong> ' + order.status + '</p></div><div class="section"><h3>بيانات العميل</h3><p><strong>الاسم:</strong> ' + order.customer.name + '</p><p><strong>الجوال:</strong> ' + order.customer.phone + '</p><p><strong>المدينة:</strong> ' + order.customer.city + '</p><p><strong>العنوان:</strong> ' + order.customer.address + '</p>' + (order.customer.notes ? '<p><strong>ملاحظات:</strong> ' + order.customer.notes + '</p>' : '') + '</div><div class="section"><h3>المنتجات</h3><table><thead><tr><th>المنتج</th><th>المقاس</th><th>اللون</th><th>الكمية</th><th>السعر</th><th>المجموع</th></tr></thead><tbody>' + order.items.map(function(item) {
      return '<tr><td>' + item.name + '</td><td>' + item.size + '</td><td>' + item.color + '</td><td>' + item.quantity + '</td><td>' + formatPrice(item.price) + '</td><td>' + formatPrice(item.price * item.quantity) + '</td></tr>';
    }).join('') + '</tbody></table><div class="total">الإجمالي: ' + formatPrice(order.total) + ' ج.م</div></div><div class="no-print" style="text-align:center;margin-top:30px"><button onclick="window.print()" style="padding:12px 30px;background:#1a1a1a;color:white;border:none;cursor:pointer;border-radius:4px;font-size:1rem">🖨️ طباعة الفاتورة</button></div></body></html>');
    win.document.close();
  }
  
  function updateOrderStatus(id, status) {
    DataManager.updateOrderStatus(id, status);
    renderOrdersTable();
    renderDashboardStats();
    showToast('تم تحديث حالة الطلب');
  }
  
  function deleteOrderConfirm(id) {
    if (!confirm('حذف هذا الطلب؟')) return;
    DataManager.deleteOrder(id);
    renderOrdersTable();
    renderDashboardStats();
    showToast('تم الحذف');
  }
  
  function openAddProductModal() {
    if (!AuthManager.hasPermission('products.create')) { showToast('لا تملك صلاحية', 'error'); return; }
    currentEditId = null;
    productImages = [];
    productImageBase64 = '';
    const form = document.getElementById('product-form');
    if (form) form.reset();
    setText('product-form-title', 'إضافة منتج جديد');
    const preview = document.getElementById('image-preview');
    if (preview) { preview.src = ''; preview.classList.add('hidden'); }
    setVal('image-url-input', '');
    const fileInput = document.getElementById('image-file-input');
    if (fileInput) fileInput.value = '';
    document.getElementById('product-form-modal').classList.add('active');
  }
  
  function editProduct(id) {
    if (!AuthManager.hasPermission('products.edit')) { showToast('لا تملك صلاحية', 'error'); return; }
    const product = DataManager.getProduct(id);
    if (!product) return;
    currentEditId = id;
    productImages = product.images || [product.image];
    productImageBase64 = '';
    setText('product-form-title', 'تعديل المنتج');
    setVal('p-name', product.name);
    setVal('p-price', product.price);
    setVal('p-old-price', product.oldPrice || '');
    setVal('p-sku', product.sku || '');
    setVal('p-category', product.category);
    setVal('p-sizes', (product.sizes || []).join(', '));
    setVal('p-colors', (product.colors || []).join(', '));
    setVal('p-description', product.description);
    setVal('p-stock', product.stock);
    setVal('p-tags', (product.tags || []).join(', '));
    const featuredCheck = document.getElementById('p-featured');
    const activeCheck = document.getElementById('p-active');
    if (featuredCheck) featuredCheck.checked = product.featured;
    if (activeCheck) activeCheck.checked = product.active !== false;
    setVal('image-url-input', product.image || '');
    const preview = document.getElementById('image-preview');
    if (preview && product.image) { preview.src = product.image; preview.classList.remove('hidden'); }
    const fileInput = document.getElementById('image-file-input');
    if (fileInput) fileInput.value = '';
    document.getElementById('product-form-modal').classList.add('active');
  }
  
  function closeProductForm() {
    document.getElementById('product-form-modal').classList.remove('active');
    currentEditId = null;
    productImages = [];
    productImageBase64 = '';
  }
  
  function previewImageFromUrl() {
    const urlInput = document.getElementById('image-url-input');
    const preview = document.getElementById('image-preview');
    if (!urlInput || !preview) return;
    const url = urlInput.value.trim();
    if (url) {
      preview.src = url;
      preview.classList.remove('hidden');
      preview.onerror = function() { showToast('الرابط غير صالح', 'error'); preview.classList.add('hidden'); preview.src = ''; };
    } else { preview.classList.add('hidden'); }
  }
  
  function previewUploadedImage(input) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) { showToast('الصورة كبيرة جداً', 'error'); input.value = ''; return; }
    if (!file.type.startsWith('image/')) { showToast('اختر صورة', 'error'); input.value = ''; return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      productImageBase64 = e.target.result;
      const preview = document.getElementById('image-preview');
      if (preview) { preview.src = productImageBase64; preview.classList.remove('hidden'); }
    };
    reader.readAsDataURL(file);
  }
  
  function saveProduct(event) {
    event.preventDefault();
    const form = event.target;
    const imageUrl = getVal('image-url-input');
    const finalImage = productImageBase64 || imageUrl;
    if (!finalImage) { showToast('أدخل صورة', 'error'); return; }
    const name = form.name.value.trim();
    const price = parseFloat(form.price.value);
    if (!name) { showToast('أدخل اسم المنتج', 'error'); return; }
    if (isNaN(price) || price < 0) { showToast('السعر غير صحيح', 'error'); return; }
    const productData = {
      name: name, price: price,
      oldPrice: parseFloat(form['p-old-price'] ? form['p-old-price'].value : '') || null,
      sku: form.sku ? form.sku.value.trim() : '',
      category: form.category.value,
      sizes: form.sizes.value.split(',').map(function(s) { return s.trim(); }).filter(Boolean),
      colors: form.colors.value.split(',').map(function(c) { return c.trim(); }).filter(Boolean),
      description: form.description.value.trim(),
      stock: parseInt(form.stock.value) || 0,
      tags: form.tags ? form.tags.value.split(',').map(function(t) { return t.trim(); }).filter(Boolean) : [],
      featured: document.getElementById('p-featured') ? document.getElementById('p-featured').checked : false,
      active: document.getElementById('p-active') ? document.getElementById('p-active').checked !== false : true,
      image: finalImage, images: [finalImage]
    };
    if (currentEditId) { DataManager.updateProduct(currentEditId, productData); showToast('تم تحديث المنتج'); }
    else { DataManager.addProduct(productData); showToast('تم إضافة المنتج'); }
    closeProductForm();
    renderProductsTable();
    renderDashboardStats();
  }
  
  function deleteProductConfirm(id) {
    if (!confirm('حذف هذا المنتج؟')) return;
    DataManager.deleteProduct(id);
    renderProductsTable();
    renderDashboardStats();
    showToast('تم الحذف');
  }
  
  function duplicateProductAction(id) {
    if (!AuthManager.hasPermission('products.create')) { showToast('لا تملك صلاحية', 'error'); return; }
    DataManager.duplicateProduct(id);
    renderProductsTable();
    showToast('تم نسخ المنتج');
  }
  
  function toggleFeatured(id) { DataManager.toggleFeatured(id); renderProductsTable(); }
  
  function exportProducts() {
    const products = DataManager.getProducts();
    downloadJSON(products, 'products-' + Date.now() + '.json');
    showToast('تم التصدير');
  }
  
  function renderCategoriesList() {
    const categories = DataManager.getCategories().sort(function(a, b) { return a.order - b.order; });
    const container = document.getElementById('categories-list');
    if (!container) return;
    container.innerHTML = categories.map(function(cat) {
      return '<div class="category-item">' +
        '<div class="icon">' + (cat.icon || '📦') + '</div>' +
        '<div class="info"><div class="name">' + cat.name + '</div><div class="slug">slug: ' + cat.slug + '</div></div>' +
        '<label><input type="checkbox" ' + (cat.visible ? 'checked' : '') + ' onchange="toggleCategoryVisibility(\'' + cat.id + '\', this.checked)"> <span>ظاهر</span></label>' +
        '<button onclick="editCategoryAction(\'' + cat.id + '\')" class="btn-sm btn-secondary">تعديل</button>' +
        '<button onclick="deleteCategoryConfirm(\'' + cat.id + '\')" class="btn-sm btn-danger">حذف</button>' +
      '</div>';
    }).join('');
  }
  
  function openAddCategoryModal() {
    setVal('cat-id', ''); setVal('cat-name', ''); setVal('cat-slug', '');
    setVal('cat-icon', '📦');
    const visibleCheck = document.getElementById('cat-visible');
    if (visibleCheck) visibleCheck.checked = true;
    setText('category-modal-title', 'إضافة فئة جديدة');
    document.getElementById('category-modal').classList.add('active');
  }
  
  function editCategoryAction(id) {
    const cat = DataManager.getCategories().find(function(c) { return c.id === id; });
    if (!cat) return;
    setVal('cat-id', id); setVal('cat-name', cat.name); setVal('cat-slug', cat.slug);
    setVal('cat-icon', cat.icon || '📦');
    const visibleCheck = document.getElementById('cat-visible');
    if (visibleCheck) visibleCheck.checked = cat.visible;
    setText('category-modal-title', 'تعديل الفئة');
    document.getElementById('category-modal').classList.add('active');
  }
  
  function closeCategoryModal() { document.getElementById('category-modal').classList.remove('active'); }
  
  function saveCategory(event) {
    event.preventDefault();
    const id = getVal('cat-id');
    const data = {
      name: getVal('cat-name').trim(),
      slug: getVal('cat-slug').trim() || getVal('cat-name').trim(),
      icon: getVal('cat-icon').trim() || '📦',
      visible: document.getElementById('cat-visible').checked
    };
    if (!data.name) { showToast('أدخل اسم الفئة', 'error'); return; }
    if (id) { DataManager.updateCategory(id, data); showToast('تم تحديث الفئة'); }
    else { DataManager.addCategory(data); showToast('تم إضافة الفئة'); }
    closeCategoryModal();
    renderCategoriesList();
    updateCategorySelects();
  }
  
  function deleteCategoryConfirm(id) {
    if (!confirm('حذف هذه الفئة؟')) return;
    DataManager.deleteCategory(id);
    renderCategoriesList();
    updateCategorySelects();
    showToast('تم الحذف');
  }
  
  function toggleCategoryVisibility(id, visible) {
    DataManager.updateCategory(id, { visible: visible });
    updateCategorySelects();
    showToast('تم التحديث');
  }
  
  function updateCategorySelects() {
    const categories = DataManager.getCategories().filter(function(c) { return c.visible; });
    const filterSelect = document.getElementById('product-filter-category');
    if (filterSelect) {
      const current = filterSelect.value;
      filterSelect.innerHTML = '<option value="">كل الفئات</option>' + categories.map(function(c) {
        return '<option value="' + c.name + '">' + c.name + '</option>';
      }).join('');
      if (current) filterSelect.value = current;
    }
    const productSelect = document.getElementById('p-category');
    if (productSelect) {
      const current = productSelect.value;
      productSelect.innerHTML = categories.filter(function(c) { return c.name !== 'الكل'; }).map(function(c) {
        return '<option value="' + c.name + '">' + c.name + '</option>';
      }).join('');
      if (current) productSelect.value = current;
    }
  }
  
  function renderSettingsForm() {
    const settings = DataManager.getSettings();
    setVal('set-brand-name-ar', settings.brand ? settings.brand.nameAr : '');
    setVal('set-brand-name-en', settings.brand ? settings.brand.nameEn : '');
    setVal('set-brand-logo', settings.brand ? settings.brand.logo : '');
    setVal('set-brand-tagline', settings.brand ? settings.brand.tagline : '');
    setVal('set-hero-title', settings.hero ? settings.hero.title : '');
    setVal('set-hero-subtitle', settings.hero ? settings.hero.subtitle : '');
    setVal('set-hero-button', settings.hero ? settings.hero.buttonText : '');
    setVal('set-hero-image', settings.hero ? settings.hero.image : '');
    setVal('set-hero-overlay', settings.hero ? settings.hero.overlayOpacity : 0.4);
    setVal('set-whatsapp', settings.contact ? settings.contact.whatsappNumber : '');
    setVal('set-whatsapp-msg', settings.contact ? settings.contact.whatsappMessage : '');
    setVal('set-phone', settings.contact ? settings.contact.phone : '');
    setVal('set-email', settings.contact ? settings.contact.email : '');
    setVal('set-address', settings.contact ? settings.contact.address : '');
    setVal('set-seo-title', settings.seo ? settings.seo.title : '');
    setVal('set-seo-desc', settings.seo ? settings.seo.description : '');
    setVal('set-seo-keywords', settings.seo ? settings.seo.keywords : '');
    setVal('set-seo-ga', settings.seo ? settings.seo.googleAnalytics : '');
    setVal('set-seo-pixel', settings.seo ? settings.seo.facebookPixel : '');
    setVal('set-announcement-text', settings.announcement ? settings.announcement.text : '');
    const annEnabled = document.getElementById('set-announcement-enabled');
    if (annEnabled) annEnabled.checked = settings.announcement ? settings.announcement.enabled : false;
    setVal('set-footer-about', settings.footer ? settings.footer.aboutText : '');
    setVal('set-footer-copyright', settings.footer ? settings.footer.copyright : '');
    setVal('set-footer-phone', settings.footer && settings.footer.contact ? settings.footer.contact.phone : '');
    setVal('set-footer-email', settings.footer && settings.footer.contact ? settings.footer.contact.email : '');
    setVal('set-footer-address', settings.footer && settings.footer.contact ? settings.footer.contact.address : '');
    setVal('set-session-timeout', settings.security ? settings.security.sessionTimeout : 60);
    setVal('set-max-attempts', settings.security ? settings.security.maxLoginAttempts : 5);
    setVal('set-lockout-duration', settings.security ? settings.security.lockoutDuration : 15);
    setVal('set-min-password-length', settings.security ? settings.security.passwordMinLength : 8);
    const strongPass = document.getElementById('set-strong-password');
    if (strongPass) strongPass.checked = settings.security ? settings.security.requireStrongPassword : true;
  }
  
  function saveSettingsSection(section) {
    if (!AuthManager.hasPermission('settings.edit')) { showToast('لا تملك صلاحية', 'error'); return; }
    const settings = DataManager.getSettings();
    if (section === 'brand') {
      settings.brand = { nameAr: getVal('set-brand-name-ar'), nameEn: getVal('set-brand-name-en'), logo: getVal('set-brand-logo'), tagline: getVal('set-brand-tagline') };
    } else if (section === 'hero') {
      settings.hero = { title: getVal('set-hero-title'), subtitle: getVal('set-hero-subtitle'), buttonText: getVal('set-hero-button'), image: getVal('set-hero-image'), overlayOpacity: parseFloat(getVal('set-hero-overlay')) || 0.4, slides: settings.hero ? settings.hero.slides : [] };
    } else if (section === 'contact') {
      settings.contact = Object.assign({}, settings.contact, { whatsappNumber: getVal('set-whatsapp').replace(/\D/g, ''), whatsappMessage: getVal('set-whatsapp-msg'), phone: getVal('set-phone'), email: getVal('set-email'), address: getVal('set-address') });
    } else if (section === 'seo') {
      settings.seo = Object.assign({}, settings.seo, { title: getVal('set-seo-title'), description: getVal('set-seo-desc'), keywords: getVal('set-seo-keywords'), googleAnalytics: getVal('set-seo-ga'), facebookPixel: getVal('set-seo-pixel') });
    } else if (section === 'announcement') {
      settings.announcement = Object.assign({}, settings.announcement, { enabled: document.getElementById('set-announcement-enabled').checked, text: getVal('set-announcement-text') });
    } else if (section === 'footer') {
      settings.footer = Object.assign({}, settings.footer, { aboutText: getVal('set-footer-about'), copyright: getVal('set-footer-copyright'), contact: { phone: getVal('set-footer-phone'), email: getVal('set-footer-email'), address: getVal('set-footer-address') } });
    } else if (section === 'security') {
      settings.security = Object.assign({}, settings.security, { sessionTimeout: parseInt(getVal('set-session-timeout')) || 60, maxLoginAttempts: parseInt(getVal('set-max-attempts')) || 5, lockoutDuration: parseInt(getVal('set-lockout-duration')) || 15, passwordMinLength: parseInt(getVal('set-min-password-length')) || 8, requireStrongPassword: document.getElementById('set-strong-password').checked });
    }
    DataManager.saveSettings(settings);
    showToast('تم حفظ الإعدادات');
  }
  
  function renderFeaturesList() {
    const settings = DataManager.getSettings();
    const features = settings.features || [];
    const container = document.getElementById('features-list');
    if (!container) return;
    container.innerHTML = features.map(function(f, i) {
      return '<div class="feature-item">' +
        '<div class="feature-item-header"><h4>الميزة ' + (i + 1) + '</h4><button onclick="removeFeature(' + i + ')" style="color:#a04848;font-size:0.85rem;">حذف</button></div>' +
        '<div style="display:grid;grid-template-columns:80px 1fr;gap:0.5rem;margin-bottom:0.5rem;">' +
          '<input type="text" value="' + (f.icon || '') + '" onchange="updateFeature(' + i + ', \'icon\', this.value)" class="form-input" style="text-align:center;font-size:1.5rem;" placeholder="🎯">' +
          '<input type="text" value="' + (f.title || '') + '" onchange="updateFeature(' + i + ', \'title\', this.value)" class="form-input" placeholder="العنوان">' +
        '</div>' +
        '<textarea onchange="updateFeature(' + i + ', \'description\', this.value)" class="form-textarea" rows="2" placeholder="الوصف">' + (f.description || '') + '</textarea>' +
      '</div>';
    }).join('');
  }
  
  function updateFeature(index, field, value) {
    const settings = DataManager.getSettings();
    if (settings.features && settings.features[index]) { settings.features[index][field] = value; DataManager.saveSettings(settings); }
  }
  
  function addFeature() {
    const settings = DataManager.getSettings();
    if (!settings.features) settings.features = [];
    settings.features.push({ icon: '✨', title: 'ميزة جديدة', description: 'وصف الميزة' });
    DataManager.saveSettings(settings);
    renderFeaturesList();
    showToast('تمت إضافة ميزة');
  }
  
  function removeFeature(index) {
    if (!confirm('حذف؟')) return;
    const settings = DataManager.getSettings();
    if (settings.features) { settings.features.splice(index, 1); DataManager.saveSettings(settings); }
    renderFeaturesList();
    showToast('تم الحذف');
  }
  
  function renderFooterColumns() {
    const settings = DataManager.getSettings();
    const columns = (settings.footer && settings.footer.columns) || [];
    const container = document.getElementById('footer-columns-list');
    if (!container) return;
    container.innerHTML = columns.map(function(col, ci) {
      return '<div class="footer-column-item">' +
        '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">' +
          '<input type="text" value="' + col.title + '" onchange="updateFooterColumn(' + ci + ', \'title\', this.value)" class="form-input" style="font-weight:600;">' +
          '<button onclick="removeFooterColumn(' + ci + ')" style="color:#a04848;font-size:0.85rem;background:none;border:none;cursor:pointer;">حذف العمود</button>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:0.4rem;">' +
          (col.links || []).map(function(link, li) {
            return '<div class="footer-link-row">' +
              '<input type="text" value="' + link.text + '" onchange="updateFooterLink(' + ci + ', ' + li + ', \'text\', this.value)" class="form-input" placeholder="النص">' +
              '<input type="text" value="' + link.url + '" onchange="updateFooterLink(' + ci + ', ' + li + ', \'url\', this.value)" class="form-input" placeholder="الرابط">' +
              '<button onclick="removeFooterLink(' + ci + ', ' + li + ')">✕</button>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<button onclick="addFooterLink(' + ci + ')" style="color:#8b6f47;font-size:0.85rem;background:none;border:none;cursor:pointer;margin-top:0.5rem;">+ إضافة رابط</button>' +
      '</div>';
    }).join('');
  }
  
  function updateFooterColumn(ci, field, value) {
    const settings = DataManager.getSettings();
    if (settings.footer && settings.footer.columns[ci]) { settings.footer.columns[ci][field] = value; DataManager.saveSettings(settings); }
  }
  
  function addFooterColumn() {
    const settings = DataManager.getSettings();
    if (!settings.footer) settings.footer = {};
    if (!settings.footer.columns) settings.footer.columns = [];
    settings.footer.columns.push({ title: 'عمود جديد', links: [] });
    DataManager.saveSettings(settings);
    renderFooterColumns();
    showToast('تمت الإضافة');
  }
  
  function removeFooterColumn(ci) {
    if (!confirm('حذف؟')) return;
    const settings = DataManager.getSettings();
    if (settings.footer && settings.footer.columns) { settings.footer.columns.splice(ci, 1); DataManager.saveSettings(settings); }
    renderFooterColumns();
    showToast('تم الحذف');
  }
  
  function updateFooterLink(ci, li, field, value) {
    const settings = DataManager.getSettings();
    if (settings.footer && settings.footer.columns[ci] && settings.footer.columns[ci].links[li]) { settings.footer.columns[ci].links[li][field] = value; DataManager.saveSettings(settings); }
  }
  
  function addFooterLink(ci) {
    const settings = DataManager.getSettings();
    if (settings.footer && settings.footer.columns[ci]) {
      if (!settings.footer.columns[ci].links) settings.footer.columns[ci].links = [];
      settings.footer.columns[ci].links.push({ text: 'رابط جديد', url: '#' });
      DataManager.saveSettings(settings);
      renderFooterColumns();
    }
  }
  
  function removeFooterLink(ci, li) {
    const settings = DataManager.getSettings();
    if (settings.footer && settings.footer.columns[ci] && settings.footer.columns[ci].links[li]) {
      settings.footer.columns[ci].links.splice(li, 1);
      DataManager.saveSettings(settings);
      renderFooterColumns();
    }
  }
  
  function renderThemeColors() {
    const settings = DataManager.getSettings();
    const colors = settings.colors || {};
    setVal('color-primary', colors.primary);
    setVal('color-background', colors.background);
    setVal('color-accent', colors.accent);
    setVal('color-text', colors.text);
    setVal('color-text-muted', colors.textMuted);
  }
  
  function saveTheme() {
    const settings = DataManager.getSettings();
    settings.colors = { primary: getVal('color-primary'), background: getVal('color-background'), accent: getVal('color-accent'), text: getVal('color-text'), textMuted: getVal('color-text-muted') };
    DataManager.saveSettings(settings);
    showToast('تم حفظ الألوان');
  }
  
  function resetTheme() {
    if (!confirm('استعادة الافتراضي؟')) return;
    const settings = DataManager.getSettings();
    settings.colors = { primary: '#1a1a1a', background: '#fafaf7', accent: '#8b6f47', text: '#1a1a1a', textMuted: '#6b6b6b' };
    DataManager.saveSettings(settings);
    renderThemeColors();
    showToast('تم الاستعادة');
  }
  
  function renderCouponsList() {
    const coupons = DataManager.getCoupons();
    const container = document.getElementById('coupons-list');
    if (!container) return;
    if (coupons.length === 0) {
      container.innerHTML = '<p style="text-align:center;padding:3rem;color:var(--text-muted);">لا توجد كوبونات</p>';
      return;
    }
    container.innerHTML = coupons.map(function(c) {
      return '<div class="log-item"><div class="icon">🎟️</div><div class="body"><div class="title">' + c.code + '</div><div class="desc">' + (c.type === 'percent' ? c.value + '%' : formatPrice(c.value)) + ' خصم • استُخدم ' + (c.usageCount || 0) + ' مرة</div></div><div style="display:flex;gap:0.5rem;align-items:center;"><span class="status-badge ' + (c.active ? 'status-completed' : 'status-new') + '">' + (c.active ? 'نشط' : 'معطل') + '</span><button onclick="deleteCoupon(\'' + c.id + '\')" class="btn-sm btn-danger">حذف</button></div></div>';
    }).join('');
  }
  
  function openAddCouponModal() {
    setVal('coupon-code', ''); setVal('coupon-type', 'percent');
    setVal('coupon-value', ''); setVal('coupon-expiry', ''); setVal('coupon-max', '');
    document.getElementById('coupon-modal').classList.add('active');
  }
  
  function closeCouponModal() { document.getElementById('coupon-modal').classList.remove('active'); }
  
  function saveCoupon(event) {
    event.preventDefault();
    const coupon = {
      code: getVal('coupon-code').toUpperCase(),
      type: getVal('coupon-type'),
      value: parseFloat(getVal('coupon-value')) || 0,
      expiresAt: getVal('coupon-expiry') || null,
      maxUsage: parseInt(getVal('coupon-max')) || null,
      active: true
    };
    if (!coupon.code || !coupon.value) { showToast('أدخل الكود والقيمة', 'error'); return; }
    DataManager.addCoupon(coupon);
    closeCouponModal();
    renderCouponsList();
    renderDashboardStats();
    showToast('تمت إضافة الكوبون');
  }
  
  function deleteCoupon(id) {
    if (!confirm('حذف؟')) return;
    DataManager.saveCoupons(DataManager.getCoupons().filter(function(c) { return c.id !== id; }));
    renderCouponsList();
    renderDashboardStats();
    showToast('تم الحذف');
  }
  
  function renderActiveSessions() {
    if (!AuthManager.hasPermission('system.manage')) return;
    const sessions = AuthManager.getActiveSessions();
    const users = AuthManager.getUsers();
    const container = document.getElementById('active-sessions-list');
    if (!container) return;
    if (sessions.length === 0) {
      container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text-muted);">لا توجد جلسات نشطة</p>';
      return;
    }
    container.innerHTML = sessions.map(function(session) {
      const user = users.find(function(u) { return u.id === session.userId; });
      if (!user) return '';
      const role = ROLES[user.role];
      return '<div class="session-card"><div style="display:flex;align-items:center;gap:1rem;"><div class="user-avatar" style="background:' + (role ? role.color : '#999') + ';">' + user.name.charAt(0) + '</div><div><div style="font-weight:600;">' + user.name + '</div><div style="font-size:0.75rem;color:var(--text-muted);">@' + user.username + ' • ' + (role ? role.name : user.role) + '</div><div class="meta">بدأ: ' + new Date(session.loginTime).toLocaleString('ar-EG') + '</div><div class="meta">آخر نشاط: ' + timeAgo(session.lastActivity) + '</div></div></div>' + (session.userId !== currentUser.id ? '<button onclick="killSessionAction(\'' + session.id + '\')" class="btn-sm btn-secondary">إنهاء</button>' : '<span style="font-size:0.8rem;color:#4a7c59;">● جلستك الحالية</span>') + '</div>';
    }).join('');
  }
  
  function killSessionAction(sessionId) {
    if (!confirm('إنهاء هذه الجلسة؟')) return;
    AuthManager.killSession(sessionId);
    renderActiveSessions();
    showToast('تم إنهاء الجلسة');
  }
  
  function renderAuditLog() {
    if (!AuthManager.hasPermission('activity.view')) return;
    const log = DataManager.getAuditLog();
    const users = AuthManager.getUsers();
    const container = document.getElementById('audit-log-list');
    if (!container) return;
    if (log.length === 0) {
      container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text-muted);">لا توجد سجلات</p>';
      return;
    }
    const moduleIcons = { PRODUCTS: '📦', ORDERS: '🛒', USERS: '👥', AUTH: '🔐', SETTINGS: '⚙️', SYSTEM: '💻' };
    container.innerHTML = log.slice(0, 100).map(function(item) {
      const user = users.find(function(u) { return u.id === item.userId; });
      return '<div class="log-item"><div class="icon">' + (moduleIcons[item.module] || '📌') + '</div><div class="body"><div class="title">' + item.module + ' → ' + item.action + '</div><div class="desc">' + item.details + '</div><div class="meta">' + (user ? user.name : 'النظام') + ' • ' + new Date(item.timestamp).toLocaleString('ar-EG') + '</div></div></div>';
    }).join('');
  }
  
  function renderActivityLogList() {
    const log = DataManager.getActivityLog(30);
    const container = document.getElementById('activity-log-list');
    if (!container) return;
    if (log.length === 0) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text-muted);">لا توجد نشاطات</p>'; return; }
    const iconMap = { 'إضافة': '➕', 'تعديل': '✏️', 'حذف': '🗑️', 'تسجيل دخول': '🔓', 'طلب جديد': '🛒' };
    container.innerHTML = log.map(function(item) {
      return '<div class="log-item"><div class="icon">' + (iconMap[item.type] || '📌') + '</div><div class="body"><div class="title">' + item.type + '</div><div class="desc">' + item.description + '</div><div class="meta">' + (item.userName || 'النظام') + '</div></div><div style="font-size:0.75rem;color:var(--text-muted);">' + timeAgo(item.timestamp) + '</div></div>';
    }).join('');
  }
  
  function renderNotifications() {
    const notifs = DataManager.getNotifications();
    const unread = notifs.filter(function(n) { return !n.read; }).length;
    const badge = document.getElementById('notifications-badge');
    if (badge) { badge.textContent = unread; badge.style.display = unread > 0 ? 'flex' : 'none'; }
    const list = document.getElementById('notifications-list');
    if (list) {
      if (notifs.length === 0) {
        list.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted);">لا توجد إشعارات</div>';
      } else {
        list.innerHTML = notifs.slice(0, 10).map(function(n) {
          return '<div class="notification-item ' + (n.read ? '' : 'unread') + '" onclick="markNotifRead(\'' + n.id + '\')"><div class="title">' + n.title + '</div><div class="message">' + n.message + '</div><div class="time">' + timeAgo(n.createdAt) + '</div></div>';
        }).join('');
      }
    }
  }
  
  function markNotifRead(id) { DataManager.markNotificationRead(id); renderNotifications(); }
  function markAllNotifsRead() { DataManager.markAllNotificationsRead(); renderNotifications(); }
  
  function renderReports() {
    if (!AuthManager.hasPermission('reports.view')) return;
    const stats = DataManager.getStats();
    setText('rep-month-orders', stats.monthOrders);
    setText('rep-month-revenue', formatPrice(stats.monthRevenue));
    setText('rep-total-customers', new Set(DataManager.getOrders().map(function(o) { return o.customer.phone; })).size);
    setText('rep-avg-order', formatPrice(Math.round(stats.averageOrderValue)));
    const productSales = {};
    DataManager.getOrders().forEach(function(order) {
      order.items.forEach(function(item) {
        productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
      });
    });
    const topProducts = Object.entries(productSales).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
    const topEl = document.getElementById('top-products');
    if (topEl) {
      topEl.innerHTML = topProducts.length ? topProducts.map(function(p) {
        return '<div class="log-item"><div class="icon">🏆</div><div class="body"><div class="title">' + p[0] + '</div></div><div style="font-weight:700;">' + p[1] + ' قطعة</div></div>';
      }).join('') : '<p style="text-align:center;color:var(--text-muted);padding:1rem;">لا توجد بيانات</p>';
    }
    const recent = DataManager.getOrders().slice(0, 5);
    const recentEl = document.getElementById('recent-orders');
    if (recentEl) {
      recentEl.innerHTML = recent.length ? recent.map(function(o) {
        return '<div class="log-item"><div class="icon">🛒</div><div class="body"><div class="title">' + o.customer.name + '</div><div class="desc">' + o.id + '</div></div><div><div style="font-weight:700;">' + formatPrice(o.total) + '</div><div style="font-size:0.75rem;color:var(--text-muted);">' + timeAgo(o.date) + '</div></div></div>';
      }).join('') : '<p style="text-align:center;color:var(--text-muted);padding:1rem;">لا توجد طلبات</p>';
    }
  }
  
  function exportReport(type) {
    const orders = DataManager.getOrders();
    if (type === 'csv') {
      const data = orders.map(function(o) {
        return { 'رقم الطلب': o.id, 'التاريخ': new Date(o.date).toLocaleString('ar-EG'), 'العميل': o.customer.name, 'الهاتف': o.customer.phone, 'المدينة': o.customer.city, 'الإجمالي (ج.م)': o.total, 'الحالة': o.status };
      });
      downloadCSV(data, 'orders-report-' + Date.now() + '.csv');
      showToast('تم التصدير');
    }
  }
  
  function exportAllData() {
    const data = DataManager.exportData();
    downloadJSON(data, 'hd-store-backup-' + Date.now() + '.json');
    showToast('تم تصدير النسخة الاحتياطية');
  }
  
  function importDataAction(input) {
    const file = input.files[0];
    if (!file) return;
    if (!confirm('سيتم استبدال البيانات. متابعة؟')) { input.value = ''; return; }
    readJSONFile(file).then(function(data) {
      if (DataManager.importData(data)) { renderAll(); showToast('تم الاستيراد'); }
      else { showToast('فشل', 'error'); }
    }).catch(function() { showToast('ملف غير صالح', 'error'); });
    input.value = '';
  }
  
  function resetAllData() { DataManager.resetAllData(); renderAll(); showToast('تم'); }
  
  function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(function(s) { s.classList.add('hidden'); });
    const target = document.getElementById('section-' + section);
    if (target) target.classList.remove('hidden');
    document.querySelectorAll('.admin-nav-link').forEach(function(link) {
      link.classList.toggle('active', link.dataset.section === section);
    });
    if (section === 'activity') renderActivityLogList();
    window.scrollTo(0, 0);
  }
  
  function toggleUserMenu() {
    const dropdown = document.getElementById('user-menu-dropdown');
    const notif = document.getElementById('notifications-dropdown');
    if (notif) notif.classList.add('hidden');
    if (dropdown) dropdown.classList.toggle('hidden');
  }
  
  function toggleNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    const user = document.getElementById('user-menu-dropdown');
    if (user) user.classList.add('hidden');
    if (dropdown) dropdown.classList.toggle('hidden');
  }
  
  function toggleSidebar() {
    document.getElementById('admin-sidebar').classList.toggle('open');
  }
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu') && !e.target.closest('.notifications-btn')) {
      const u = document.getElementById('user-menu-dropdown');
      const n = document.getElementById('notifications-dropdown');
      if (u) u.classList.add('hidden');
      if (n) n.classList.add('hidden');
    }
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    init();
    setInterval(function() {
      const user = AuthManager.getCurrentUser();
      if (!user && !document.getElementById('login-page').classList.contains('hidden')) return;
      if (!user) { showLogin(); showToast('انتهت الجلسة', 'warning'); }
    }, 60000);
    document.querySelectorAll('.modal-overlay').forEach(function(modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('active');
      });
    });
  });

  /* ===========================
   دوال القائمة الجانبية - محسّنة
   =========================== */
function toggleSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
  
  // منع التمرير عند فتح القائمة
  document.body.style.overflow = sidebar?.classList.contains('open') ? 'hidden' : '';
}

function closeSidebarMobile() {
  // إغلاق تلقائي عند اختيار قسم في الموبايل
  if (window.innerWidth <= 1024) {
    toggleSidebar();
  }
}

function toggleUserMenu() {
  const dropdown = document.getElementById('user-menu-dropdown');
  const notif = document.getElementById('notifications-dropdown');
  if (notif) notif.classList.add('hidden');
  if (dropdown) dropdown.classList.toggle('hidden');
  
  // إضافة class للعنصر الأب لتدوير السهم
  const userMenu = document.getElementById('user-menu');
  if (userMenu) userMenu.classList.toggle('open');
}

function toggleNotifications() {
  const dropdown = document.getElementById('notifications-dropdown');
  const user = document.getElementById('user-menu-dropdown');
  if (user) user.classList.add('hidden');
  if (dropdown) dropdown.classList.toggle('hidden');
  
  const userMenu = document.getElementById('user-menu');
  if (userMenu) userMenu.classList.remove('open');
}

// إغلاق القوائم عند النقر خارجها
document.addEventListener('click', function(e) {
  // إغلاق القوائم المنسدلة
  if (!e.target.closest('.user-menu')) {
    const user = document.getElementById('user-menu-dropdown');
    const userMenu = document.getElementById('user-menu');
    if (user) user.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('open');
  }
  
  if (!e.target.closest('.notifications-btn')) {
    const notif = document.getElementById('notifications-dropdown');
    if (notif) notif.classList.add('hidden');
  }
  
  // إغلاق القائمة الجانبية عند النقر على overlay
  if (e.target.classList.contains('sidebar-overlay')) {
    toggleSidebar();
  }
});

// إغلاق بـ Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    // إغلاق النوافذ
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    // إغلاق القوائم
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// إغلاق القائمة تلقائياً عند تكبير الشاشة
window.addEventListener('resize', function() {
  if (window.innerWidth > 1024) {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});

  