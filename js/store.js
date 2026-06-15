/* ==========================================
   h&D store - Storefront v6.0 (بدون Dark Mode)
   ========================================== */

   let cart = JSON.parse(sessionStorage.getItem('hd_cart') || '[]');
   let wishlist = JSON.parse(localStorage.getItem('hd_wishlist') || '[]');
   let currentProduct = null;
   let currentImageIndex = 0;
   let selectedSize = null;
   let selectedColor = null;
   let quantity = 1;
   let activeCategory = 'الكل';
   let activeSort = 'newest';
   let appliedCoupon = null;
   let heroSlideIndex = 0;
   let heroSlideInterval = null;
   
   /* ===========================
      تحميل الإعدادات الديناميكية
      =========================== */
   function loadDynamicSettings() {
     const settings = DataManager.getSettings();
   
     if (settings.seo?.title) {
       document.title = settings.seo.title;
       const metaDesc = document.querySelector('meta[name="description"]');
       if (metaDesc) metaDesc.setAttribute('content', settings.seo.description || '');
     }
   
     if (settings.colors) {
       const root = document.documentElement;
       Object.entries(settings.colors).forEach(([key, value]) => {
         const cssVar = '--color-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
         root.style.setProperty(cssVar, value);
       });
     }
   
     document.querySelectorAll('.brand-name').forEach(el => {
       el.innerHTML = `${settings.brand?.nameAr || 'h&D'} <span class="brand-sub">${settings.brand?.nameEn || 'store'}</span>`;
     });
   
     renderAnnouncement(settings.announcement);
     renderHero(settings);
     renderFooter(settings);
     renderFeatures(settings.features || []);
     renderFloatingWhatsapp(settings.contact);
   }
   
   function renderAnnouncement(announcement) {
     let banner = document.getElementById('announcement-bar');
     if (announcement?.enabled && announcement.text) {
       if (!banner) {
         banner = document.createElement('div');
         banner.id = 'announcement-bar';
         banner.className = 'announcement-bar';
         document.body.insertBefore(banner, document.body.firstChild);
       }
       banner.textContent = announcement.text;
       banner.style.display = 'block';
     } else if (banner) {
       banner.style.display = 'none';
     }
   }
   
   function renderHero(settings) {
     const hero = document.querySelector('.hero-section');
     if (!hero || !settings.hero) return;
     
     hero.innerHTML = `
       <div class="hero-slider" id="hero-slider"></div>
       <div class="hero-content">
         <div class="hero-text">
           <span class="hero-badge">✦ مجموعة حصرية</span>
           <h1 class="hero-title">${settings.hero.title || 'أناقة بلا حدود'}</h1>
           <p class="hero-subtitle">${settings.hero.subtitle || ''}</p>
           <div class="hero-actions">
             <a href="#products" class="btn btn-accent btn-lg">${settings.hero.buttonText || 'تسوق الآن'} ←</a>
             <a href="#features" class="btn btn-outline-white btn-lg">تعرف علينا</a>
           </div>
         </div>
       </div>
       <div class="hero-stats">
         <div class="hero-stat"><span class="hero-stat-value">1000+</span><span class="hero-stat-label">عميل سعيد</span></div>
         <div class="hero-stat"><span class="hero-stat-value">500+</span><span class="hero-stat-label">منتج مميز</span></div>
         <div class="hero-stat"><span class="hero-stat-value">50+</span><span class="hero-stat-label">علامة تجارية</span></div>
       </div>
       <div class="hero-dots" id="hero-dots"></div>
     `;
   
     const images = [
       settings.hero.image,
       'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
       'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80'
     ];
     
     const slider = document.getElementById('hero-slider');
     slider.innerHTML = images.map((img, i) => `
       <div class="hero-slide ${i === 0 ? 'active' : ''}">
         <div class="hero-slide-bg" style="background-image: url('${img}')"></div>
         <div class="hero-slide-overlay" style="opacity: ${settings.hero.overlayOpacity || 0.4}"></div>
       </div>
     `).join('');
   
     const dots = document.getElementById('hero-dots');
     dots.innerHTML = images.map((_, i) => `<div class="hero-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>`).join('');
   
     if (heroSlideInterval) clearInterval(heroSlideInterval);
     heroSlideInterval = setInterval(nextSlide, 6000);
   }
   
   function nextSlide() {
     const slides = document.querySelectorAll('.hero-slide');
     const dots = document.querySelectorAll('.hero-dot');
     slides.forEach(s => s.classList.remove('active'));
     dots.forEach(d => d.classList.remove('active'));
     heroSlideIndex = (heroSlideIndex + 1) % slides.length;
     slides[heroSlideIndex].classList.add('active');
     dots[heroSlideIndex].classList.add('active');
   }
   
   function goToSlide(index) {
     heroSlideIndex = index;
     const slides = document.querySelectorAll('.hero-slide');
     const dots = document.querySelectorAll('.hero-dot');
     slides.forEach(s => s.classList.remove('active'));
     dots.forEach(d => d.classList.remove('active'));
     slides[index].classList.add('active');
     dots[index].classList.add('active');
   }
   
   function renderFooter(settings) {
     const footer = document.querySelector('.footer');
     if (!footer || !settings.footer) return;
     const cols = settings.footer.columns || [];
     
     footer.innerHTML = `
       <div class="footer-grid">
         <div>
           <h4 class="footer-brand">${settings.brand?.nameAr || 'h&D'} <span style="font-size:0.7rem;color:#888;letter-spacing:0.3em;">${settings.brand?.nameEn || 'store'}</span></h4>
           <p class="footer-about">${settings.footer.aboutText || ''}</p>
           <div class="footer-social">
             ${settings.footer.social?.instagram ? `<a href="${settings.footer.social.instagram}" class="social-link">📷</a>` : ''}
             ${settings.footer.social?.twitter ? `<a href="${settings.footer.social.twitter}" class="social-link">🐦</a>` : ''}
             ${settings.footer.social?.facebook ? `<a href="${settings.footer.social.facebook}" class="social-link">📘</a>` : ''}
             ${settings.footer.social?.snapchat ? `<a href="${settings.footer.social.snapchat}" class="social-link">👻</a>` : ''}
             ${settings.footer.social?.tiktok ? `<a href="${settings.footer.social.tiktok}" class="social-link">🎵</a>` : ''}
           </div>
         </div>
         ${cols.map(col => `
           <div>
             <h5 class="footer-title">${col.title}</h5>
             <ul class="footer-links">
               ${(col.links || []).map(link => `<li><a href="${link.url}">${link.text}</a></li>`).join('')}
             </ul>
           </div>
         `).join('')}
         <div>
           <h5 class="footer-title">تواصل معنا</h5>
           <ul class="footer-contact">
             <li><span class="footer-contact-icon">📞</span> ${settings.footer.contact?.phone || ''}</li>
             <li><span class="footer-contact-icon">✉️</span> ${settings.footer.contact?.email || ''}</li>
             <li><span class="footer-contact-icon">📍</span> ${settings.footer.contact?.address || ''}</li>
           </ul>
         </div>
       </div>
       <div class="footer-bottom">
         <p>${settings.footer.copyright || '© 2024 h&D store. جميع الحقوق محفوظة.'}</p>
       </div>
     `;
   }
   
   function renderFeatures(features) {
     const container = document.getElementById('features-section');
     if (!container) return;
     container.innerHTML = features.map(f => `
       <div class="feature-card">
         <div class="feature-icon">${f.icon}</div>
         <h3 class="feature-title">${f.title}</h3>
         <p class="feature-description">${f.description}</p>
       </div>
     `).join('');
   }
   
   function renderFloatingWhatsapp(contact) {
     let btn = document.getElementById('whatsapp-float');
     const number = contact?.whatsappNumber;
     if (!number) { if (btn) btn.remove(); return; }
     if (!btn) {
       btn = document.createElement('a');
       btn.id = 'whatsapp-float';
       btn.className = 'whatsapp-float';
       btn.target = '_blank';
       btn.innerHTML = '💬';
       document.body.appendChild(btn);
     }
     const msg = encodeURIComponent(contact.whatsappMessage || 'مرحباً، أرغب بالاستفسار');
     btn.href = `https://wa.me/${number}?text=${msg}`;
   }
   
   function initNavbarScroll() {
     const navbar = document.querySelector('.navbar-main');
     if (!navbar) return;
     window.addEventListener('scroll', () => {
       if (window.scrollY > 50) navbar.classList.add('scrolled');
       else navbar.classList.remove('scrolled');
     });
   }
   
   function initSearch() {
     const input = document.getElementById('search-input');
     const results = document.getElementById('search-results');
     if (!input || !results) return;
   
     input.addEventListener('input', (e) => {
       const query = e.target.value.trim().toLowerCase();
       if (query.length < 2) { results.classList.remove('active'); return; }
       const products = DataManager.getProducts().filter(p => 
         p.name.toLowerCase().includes(query) || (p.description || '').toLowerCase().includes(query) || (p.category || '').toLowerCase().includes(query)
       ).slice(0, 6);
       if (products.length === 0) {
         results.innerHTML = '<div style="padding:1.5rem;text-align:center;color:#999;">لا توجد نتائج</div>';
       } else {
         results.innerHTML = products.map(p => `
           <div class="search-result-item" onclick="openProductModal('${p.id}'); document.getElementById('search-results').classList.remove('active'); document.getElementById('search-input').value='';">
             <img src="${p.image || PLACEHOLDER_IMG}" onerror="handleImageError(this)">
             <div class="info"><h4>${p.name}</h4><p>${formatPrice(p.price)}</p></div>
           </div>
         `).join('');
       }
       results.classList.add('active');
     });
   
     document.addEventListener('click', (e) => {
       if (!input.contains(e.target) && !results.contains(e.target)) results.classList.remove('active');
     });
   }
   
   /* ===========================
      المفضلة (Wishlist)
      =========================== */
   function toggleWishlist(productId, event) {
     if (event) { event.stopPropagation(); event.preventDefault(); }
     const index = wishlist.indexOf(productId);
     const btn = event?.currentTarget;
     if (index > -1) {
       wishlist.splice(index, 1);
       if (btn) btn.classList.remove('active');
       showToast('تمت الإزالة من المفضلة', 'info');
     } else {
       wishlist.push(productId);
       if (btn) btn.classList.add('active');
       showToast('تمت الإضافة إلى المفضلة ❤️', 'success');
     }
     localStorage.setItem('hd_wishlist', JSON.stringify(wishlist));
     updateWishlistCount();
   }
   
   function updateWishlistCount() {
     const badge = document.getElementById('wishlist-count');
     if (badge) {
       badge.textContent = wishlist.length;
       badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
     }
   }
   
   function openWishlist() {
     renderWishlistItems();
     const modal = document.getElementById('wishlist-modal');
     if (modal) {
       modal.classList.add('active');
       document.body.style.overflow = 'hidden';
     }
   }
   
   function closeWishlist() {
     const modal = document.getElementById('wishlist-modal');
     if (modal) {
       modal.classList.remove('active');
       document.body.style.overflow = '';
     }
   }
   
   function renderWishlistItems() {
     const container = document.getElementById('wishlist-items');
     if (!container) return;
     if (wishlist.length === 0) {
       container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🤍</div><h3 style="color:#999;margin-bottom:0.5rem;">المفضلة فارغة</h3><p style="color:#aaa;">أضف منتجاتك المفضلة لتجدها بسهولة!</p></div>`;
       return;
     }
     const products = DataManager.getProducts();
     const wishlistProducts = wishlist.map(id => products.find(p => p.id === id)).filter(p => p);
     container.innerHTML = wishlistProducts.map(product => `
       <div class="cart-item">
         <div class="cart-item-image">
           <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this, '${PLACEHOLDER_IMG}')">
         </div>
         <div class="cart-item-details">
           <div class="cart-item-name">${product.name}</div>
           <div class="cart-item-meta">${product.category}</div>
           <div class="cart-item-price">${formatPrice(product.price)}</div>
           <div class="cart-item-actions">
             <button onclick="openProductModal('${product.id}'); closeWishlist();" class="btn-sm" style="background:var(--accent);color:white;border:none;">👁️ عرض</button>
             <button onclick="quickAddToCartFromWishlist('${product.id}')" class="btn-sm btn-primary">🛍️ أضف للسلة</button>
             <button onclick="removeFromWishlist('${product.id}')" style="margin-right:auto;background:transparent;border:none;color:#a04848;cursor:pointer;font-size:0.85rem;">🗑️ إزالة</button>
           </div>
         </div>
       </div>
     `).join('');
   }
   
   function removeFromWishlist(productId) {
     const index = wishlist.indexOf(productId);
     if (index > -1) {
       wishlist.splice(index, 1);
       localStorage.setItem('hd_wishlist', JSON.stringify(wishlist));
       updateWishlistCount();
       renderWishlistItems();
       showToast('تمت الإزالة من المفضلة', 'info');
     }
   }
   
   function quickAddToCartFromWishlist(productId) {
     const product = DataManager.getProduct(productId);
     if (!product) return;
     if (product.stock === 0) { showToast('المنتج غير متوفر', 'error'); return; }
     const size = product.sizes?.[0] || 'مقاس واحد';
     const color = product.colors?.[0] || 'افتراضي';
     const item = { productId: product.id, name: product.name, price: product.price, image: product.image, size, color, quantity: 1 };
     const existing = cart.find(i => i.productId === item.productId && i.size === size && i.color === color);
     if (existing) existing.quantity++;
     else cart.push(item);
     sessionStorage.setItem('hd_cart', JSON.stringify(cart));
     updateCartCount();
     showToast(`تمت إضافة "${product.name}" إلى السلة 🛍️`);
     removeFromWishlist(productId);
   }
   
   /* ===========================
      الفئات والترتيب
      =========================== */
   function renderCategoryButtons() {
     const categories = DataManager.getCategories().filter(c => c.visible).sort((a, b) => a.order - b.order);
     const container = document.getElementById('category-buttons');
     if (!container) return;
     container.innerHTML = categories.map(cat => `
       <button onclick="filterCategory('${cat.name}')" data-category="${cat.name}" class="category-pill ${cat.name === activeCategory ? 'active' : ''}">
         ${cat.icon ? cat.icon + ' ' : ''}${cat.name}
       </button>
     `).join('');
   }
   
   function filterCategory(category) {
     activeCategory = category;
     renderCategoryButtons();
     renderProducts();
     document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }
   
   function sortProducts(products) {
     const sorted = [...products];
     switch (activeSort) {
       case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
       case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
       case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
       case 'newest': 
       default: sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
     }
     return sorted;
   }
   
   /* ===========================
      عرض المنتجات
      =========================== */
   function renderProductsSkeleton() {
     const grid = document.getElementById('products-grid');
     if (!grid) return;
     grid.innerHTML = Array(8).fill(`<div class="skeleton-card"><div class="skeleton skeleton-image"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text skeleton-text-sm" style="margin-bottom:1rem;"></div></div>`).join('');
   }
   
   function renderProducts() {
     const grid = document.getElementById('products-grid');
     if (!grid) return;
     let products = DataManager.getProducts({ category: activeCategory }).filter(p => p.active !== false);
     products = sortProducts(products);
     if (products.length === 0) {
       grid.innerHTML = `<div class="cart-empty" style="grid-column: 1/-1;"><div class="cart-empty-icon">📦</div><p style="font-size:1.25rem;color:#999;">لا توجد منتجات في هذه الفئة</p></div>`;
       return;
     }
     grid.innerHTML = products.map(product => {
       const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
       const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
       const inWishlist = wishlist.includes(product.id);
       const stockClass = product.stock === 0 ? 'stock-out' : product.stock <= 5 ? 'stock-low' : 'stock-in';
       const stockText = product.stock === 0 ? '❌ نفذ المخزون' : product.stock <= 5 ? `⚠️ متبقي ${product.stock} فقط` : `✓ متوفر (${product.stock})`;
       const avgRating = product.rating || (Math.random() * 1.5 + 3.5).toFixed(1);
       const fullStars = Math.floor(avgRating);
       const emptyStars = 5 - fullStars;
       return `
         <div class="product-card" onclick="openProductModal('${product.id}')">
           <div class="product-image-wrapper">
             <div class="product-badges">
               ${discount > 0 ? `<span class="product-badge badge-sale">🔥 خصم ${discount}%</span>` : ''}
               ${isNew ? `<span class="product-badge badge-new">جديد</span>` : ''}
               ${product.featured ? `<span class="product-badge badge-featured">⭐ مميز</span>` : ''}
               ${product.stock === 0 ? `<span class="product-badge badge-out">نفذ</span>` : ''}
             </div>
             <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="toggleWishlist('${product.id}', event)"></button>
             <img src="${product.image || PLACEHOLDER_IMG}" alt="${product.name}" loading="lazy" onerror="handleImageError(this)">
             <div class="product-actions">
               <button class="action-btn primary" onclick="event.stopPropagation(); quickAddToCart('${product.id}')">أضف للسلة</button>
               <button class="action-btn" onclick="event.stopPropagation(); openProductModal('${product.id}')">عرض</button>
             </div>
           </div>
           <div class="product-content">
             <div class="product-category">${product.category}</div>
             <h3 class="product-name">${product.name}</h3>
             <div class="product-rating">
               <span class="stars">${'★'.repeat(fullStars)}${'☆'.repeat(emptyStars)}</span>
               <span>(${avgRating})</span>
             </div>
             <div class="product-price">
               <span class="price-current">${formatPrice(product.price)}</span>
               ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span><span class="price-discount">-${discount}%</span>` : ''}
             </div>
             <div class="product-stock-info ${stockClass}">${stockText}</div>
           </div>
         </div>
       `;
     }).join('');
   }
   
   function quickAddToCart(productId) {
     const product = DataManager.getProduct(productId);
     if (!product) return;
     if (product.stock === 0) { showToast('المنتج غير متوفر', 'error'); return; }
     const size = product.sizes?.[0] || 'مقاس واحد';
     const color = product.colors?.[0] || 'افتراضي';
     const item = { productId: product.id, name: product.name, price: product.price, image: product.image, size, color, quantity: 1 };
     const existing = cart.find(i => i.productId === item.productId && i.size === size && i.color === color);
     if (existing) existing.quantity++;
     else cart.push(item);
     sessionStorage.setItem('hd_cart', JSON.stringify(cart));
     updateCartCount();
     showToast(`تمت إضافة "${product.name}" إلى السلة`);
   }
   
   /* ===========================
      Modal المنتج
      =========================== */
   function openProductModal(productId) {
     const product = DataManager.getProduct(productId);
     if (!product) return;
     currentProduct = product;
     currentImageIndex = 0;
     selectedSize = null;
     selectedColor = null;
     quantity = 1;
     const modal = document.getElementById('product-modal');
     if (!modal) return;
     const images = product.images?.length ? product.images : [product.image || PLACEHOLDER_IMG];
     const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
     document.getElementById('product-modal-content').innerHTML = `
       <button class="modal-close" onclick="closeProductModal()">✕</button>
       <div class="product-modal-grid">
         <div class="product-gallery">
           <img id="modal-main-image" src="${images[0]}" class="product-main-image" onerror="handleImageError(this)">
           ${images.length > 1 ? `<div class="gallery-thumbs">${images.map((img, i) => `<div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="changeMainImage(${i}, this)"><img src="${img}" onerror="handleImageError(this)"></div>`).join('')}</div>` : ''}
         </div>
         <div class="product-info">
           <span class="product-info-cat">${product.category}</span>
           <h2 class="product-info-name">${product.name}</h2>
           <div class="product-rating"><span class="stars">★★★★★</span><span>(4.8) - 120 تقييم</span></div>
           <div class="product-info-price">
             <span class="price-current">${formatPrice(product.price)}</span>
             ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span><span class="price-discount">وفر ${discount}%</span>` : ''}
           </div>
           <p class="product-info-desc">${product.description}</p>
           ${product.sizes?.length ? `<div class="option-section"><div class="option-label"><span>المقاس</span><span class="option-selected" id="selected-size-text"></span></div><div class="size-options">${product.sizes.map(s => `<button class="size-btn" onclick="selectSize('${s}', this)">${s}</button>`).join('')}</div></div>` : ''}
           ${product.colors?.length ? `<div class="option-section"><div class="option-label"><span>اللون</span><span class="option-selected" id="selected-color-text"></span></div><div class="color-options">${(() => { const colorMap = { 'أسود': '#1a1a1a', 'أبيض': '#ffffff', 'كحلي': '#1e2a4a', 'رمادي': '#6b6b6b', 'بيج': '#d4c5a0', 'بني': '#6b4423', 'فضي': '#c0c0c0', 'ذهبي': '#d4af37', 'أحمر': '#a04848', 'أخضر': '#4a7c59', 'أزرق': '#4a6fa5', 'وردي': '#d4a5a5' }; return product.colors.map(c => `<div class="color-swatch" style="background-color: ${colorMap[c] || '#999'}" title="${c}" onclick="selectColor('${c}', this)"></div>`).join(''); })()}</div></div>` : ''}
           <div class="option-section">
             <div class="option-label"><span>الكمية</span></div>
             <div class="quantity-selector">
               <button class="qty-btn" onclick="changeQuantity(-1)">−</button>
               <div class="qty-value" id="modal-quantity">1</div>
               <button class="qty-btn" onclick="changeQuantity(1)">+</button>
             </div>
           </div>
           <div class="flex gap-3 mt-auto pt-4">
             <button onclick="addToCart()" class="btn btn-accent btn-lg flex-1">🛍️ أضف إلى السلة</button>
             <button onclick="toggleWishlist('${product.id}'); this.classList.toggle('active');" class="btn ${wishlist.includes(product.id) ? 'btn-primary' : 'btn-secondary'} btn-lg" style="padding: 0.875rem 1.25rem;">${wishlist.includes(product.id) ? '❤️' : '🤍'}</button>
           </div>
         </div>
       </div>
     `;
     modal.classList.add('active');
     document.body.style.overflow = 'hidden';
   }
   
   function changeMainImage(index, thumb) {
     currentImageIndex = index;
     const images = currentProduct.images?.length ? currentProduct.images : [currentProduct.image];
     document.getElementById('modal-main-image').src = images[index];
     document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
     thumb.classList.add('active');
   }
   
   function closeProductModal() {
     document.getElementById('product-modal').classList.remove('active');
     document.body.style.overflow = '';
     currentProduct = null;
   }
   
   function selectSize(size, btn) {
     selectedSize = size;
     document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
     btn.classList.add('selected');
     const txt = document.getElementById('selected-size-text');
     if (txt) txt.textContent = size;
   }
   
   function selectColor(color, swatch) {
     selectedColor = color;
     document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
     swatch.classList.add('selected');
     const txt = document.getElementById('selected-color-text');
     if (txt) txt.textContent = color;
   }
   
   function changeQuantity(delta) {
     if (!currentProduct) return;
     const maxStock = currentProduct.stock || 99;
     quantity = Math.max(1, Math.min(maxStock, quantity + delta));
     document.getElementById('modal-quantity').textContent = quantity;
   }
   
   function addToCart() {
     if (!currentProduct) return;
     if (!selectedSize && currentProduct.sizes?.length > 1) { showToast('الرجاء اختيار المقاس', 'error'); return; }
     if (!selectedColor && currentProduct.colors?.length > 1) { showToast('الرجاء اختيار اللون', 'error'); return; }
     if (currentProduct.stock === 0) { showToast('المنتج غير متوفر', 'error'); return; }
     const size = selectedSize || currentProduct.sizes?.[0] || 'مقاس واحد';
     const color = selectedColor || currentProduct.colors?.[0] || 'افتراضي';
     const existing = cart.find(i => i.productId === currentProduct.id && i.size === size && i.color === color);
     if (existing) existing.quantity += quantity;
     else cart.push({ productId: currentProduct.id, name: currentProduct.name, price: currentProduct.price, image: currentProduct.image, size, color, quantity });
     sessionStorage.setItem('hd_cart', JSON.stringify(cart));
     updateCartCount();
     closeProductModal();
     showToast(`تمت إضافة "${currentProduct.name}" إلى السلة 🛍️`);
   }
   
   /* ===========================
      السلة والدفع
      =========================== */
   function updateCartCount() {
     const count = cart.reduce((s, i) => s + i.quantity, 0);
     const badge = document.getElementById('cart-count');
     if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
   }
   
   function openCart() {
     renderCartItems();
     document.getElementById('cart-modal').classList.add('active');
     document.body.style.overflow = 'hidden';
   }
   
   function closeCart() {
     document.getElementById('cart-modal').classList.remove('active');
     document.body.style.overflow = '';
   }
   
   function renderCartItems() {
     const container = document.getElementById('cart-items');
     const totalEl = document.getElementById('cart-total');
     if (!container || !totalEl) return;
     if (cart.length === 0) {
       container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><h3 style="color:#999;margin-bottom:0.5rem;">السلة فارغة</h3><p style="color:#aaa;">ابدأ التسوق الآن!</p></div>`;
       totalEl.textContent = formatPrice(0);
       return;
     }
     container.innerHTML = cart.map((item, i) => `
       <div class="cart-item">
         <div class="cart-item-image"><img src="${item.image}" onerror="handleImageError(this, '${PLACEHOLDER_IMG}')"></div>
         <div class="cart-item-details">
           <div class="cart-item-name">${item.name}</div>
           <div class="cart-item-meta">المقاس: ${item.size} • اللون: ${item.color}</div>
           <div class="cart-item-price">${formatPrice(item.price)}</div>
           <div class="cart-item-actions">
             <div class="quantity-selector" style="height:36px;">
               <button class="qty-btn" style="width:36px;height:36px;" onclick="updateCartQuantity(${i}, -1)">−</button>
               <div class="qty-value" style="min-width:40px;height:36px;line-height:36px;">${item.quantity}</div>
               <button class="qty-btn" style="width:36px;height:36px;" onclick="updateCartQuantity(${i}, 1)">+</button>
             </div>
             <button onclick="removeFromCart(${i})" style="margin-right:auto;background:transparent;border:none;color:#a04848;cursor:pointer;font-size:0.85rem;">🗑️ حذف</button>
           </div>
         </div>
       </div>
     `).join('');
     let subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
     let discount = 0;
     if (appliedCoupon) {
       discount = appliedCoupon.type === 'percent' ? subtotal * (appliedCoupon.value / 100) : appliedCoupon.value;
       discount = Math.min(discount, subtotal);
     }
     const total = subtotal - discount;
     const subEl = document.getElementById('cart-subtotal');
     const discEl = document.getElementById('cart-discount');
     if (subEl) subEl.textContent = formatPrice(subtotal);
     if (discEl) discEl.textContent = discount > 0 ? `- ${formatPrice(discount)}` : formatPrice(0);
     totalEl.innerHTML = discount > 0 ? `<span style="text-decoration:line-through;color:#999;font-size:1rem;margin-left:0.5rem;">${formatPrice(subtotal)}</span> ${formatPrice(total)}` : formatPrice(total);
   }
   
   function updateCartQuantity(index, delta) {
     cart[index].quantity = Math.max(1, cart[index].quantity + delta);
     sessionStorage.setItem('hd_cart', JSON.stringify(cart));
     updateCartCount();
     renderCartItems();
   }
   
   function removeFromCart(index) {
     cart.splice(index, 1);
     sessionStorage.setItem('hd_cart', JSON.stringify(cart));
     updateCartCount();
     renderCartItems();
     showToast('تم حذف المنتج من السلة');
   }
   
   function applyCoupon() {
     const code = document.getElementById('coupon-input')?.value.trim();
     if (!code) return;
     const result = DataManager.validateCoupon(code);
     if (result.valid) { appliedCoupon = result.coupon; renderCartItems(); showToast('تم تطبيق الكوبون بنجاح 🎉'); }
     else { showToast(result.message, 'error'); }
   }
   
   function openCheckout() {
     if (cart.length === 0) { showToast('السلة فارغة', 'error'); return; }
     closeCart();
     document.getElementById('checkout-modal').classList.add('active');
     document.body.style.overflow = 'hidden';
   }
   
   function closeCheckout() {
     document.getElementById('checkout-modal').classList.remove('active');
     document.body.style.overflow = '';
   }
   
   function completeOrder(event) {
     event.preventDefault();
     const f = event.target;
     const customer = { name: f.name.value.trim(), phone: f.phone.value.trim(), city: f.city.value.trim(), address: f.address.value.trim(), notes: f.notes.value.trim() };
     if (!customer.name || !customer.phone || !customer.city || !customer.address) { showToast('الرجاء إكمال جميع البيانات', 'error'); return; }
     let total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
     if (appliedCoupon) {
       const discount = appliedCoupon.type === 'percent' ? total * (appliedCoupon.value / 100) : appliedCoupon.value;
       total = Math.max(0, total - discount);
     }
     const order = DataManager.addOrder({ items: [...cart], customer, total });
     const settings = DataManager.getSettings();
     const number = settings.contact?.whatsappNumber || '201000000000';
     let message = `🛍️ *طلب جديد - h&D store*\n━━━━━━━━━━━━━━━\n📋 *رقم الطلب:* ${order.id}\n👤 ${customer.name}\n📞 ${customer.phone}\n🏙️ ${customer.city}\n📍 ${customer.address}\n`;
     if (customer.notes) message += `📝 ${customer.notes}\n`;
     message += `━━━━━━━━━━━━━━━\n🛒 *المنتجات:*\n\n`;
     cart.forEach((item, i) => {
       message += `${i+1}. *${item.name}*\n   ${item.size} | ${item.color} | ${item.quantity}× ${formatPrice(item.price)}\n\n`;
     });
     message += `━━━━━━━━━━━━━━━\n💰 *الإجمالي:* ${formatPrice(total)}\n🌍 جمهورية مصر العربية\n⏰ ${new Date().toLocaleString('ar-EG')}`;
     window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
     cart = []; appliedCoupon = null;
     sessionStorage.setItem('hd_cart', JSON.stringify(cart));
     updateCartCount();
     closeCheckout();
     showToast('تم تجهيز طلبك! جاري التحويل لواتساب 🎉');
   }
   
   function toggleMobileMenu() {
     document.getElementById('mobile-menu')?.classList.toggle('active');
     document.getElementById('mobile-menu-overlay')?.classList.toggle('active');
     document.body.style.overflow = document.getElementById('mobile-menu')?.classList.contains('active') ? 'hidden' : '';
   }
   
   document.addEventListener('DOMContentLoaded', () => {
     loadDynamicSettings();
     renderCategoryButtons();
     renderProductsSkeleton();
     setTimeout(renderProducts, 300);
     updateCartCount();
     updateWishlistCount();
     initNavbarScroll();
     initSearch();
     
     document.querySelectorAll('.modal-overlay').forEach(modal => {
       modal.addEventListener('click', (e) => {
         if (e.target === modal) {
           modal.classList.remove('active');
           document.body.style.overflow = '';
         }
       });
     });
     
     document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') {
         document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
         document.body.style.overflow = '';
       }
     });
   });
   