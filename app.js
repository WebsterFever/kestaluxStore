(() => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // ===== PRODUCTS =====
  const products = [
    {
      id: 'f1',
      name: 'Radiance Face Cream',
      price: 28.80,
      category: 'Foundation',
      skin: 'Dry',
      popularity: 120,
      desc: 'Hydrating medium coverage with dewy finish.',
      img: 'https://i.ibb.co/hRWN40yd/loto.jpg' // ✅ Local image
    },
    {
      id: 'l1',
      name: 'Gentle Foaming Cleanser',
      price: 16.65,
      category: 'Lipstick',
      skin: 'All',
      popularity: 150,
      desc: 'Comfort matte that lasts all day.',
      img: 'https://i.ibb.co/wNrGX3Dn/Chat-GPT-Image-Nov-9-2025-11-59-49-AM.png'
    },
    {
      id: 'e1',
      name: 'Glow C Serum',
      price: 24.70,
      category: 'Eyeshadow',
      skin: 'All',
      popularity: 110,
      desc: '9-pan neutrals with buttery mattes.',
      img: 'https://i.ibb.co/N63wGMtT/lotion.jpg'
    },
    {
      id: 's1',
      name: 'Radiance Serum',
      price: 30.90,
      category: 'Serum',
      skin: 'Combination',
      popularity: 140,
      desc: 'Vitamin C + E for bright, even skin.',
      img: 'https://png.pngtree.com/png-clipart/20230511/original/pngtree-3d-skin-care-products-exquisite-care-set-png-image_9157466.png'
    },
    {
      id: 'c1',
      name: 'Balance Face Cream',
      price: 22.65,
      category: 'Face Cream',
      skin: 'Oily',
      popularity: 95,
      desc: 'Lightweight gel-cream controls shine.',
      img: 'https://static.vecteezy.com/system/resources/previews/048/053/161/non_2x/a-pastel-paradise-of-skincare-products-png.png'
    },
    {
      id: 'f2',
      name: 'Pure Mineral Foundation',
      price: 26.70,
      category: 'Foundation',
      skin: 'Sensitive',
      popularity: 85,
      desc: 'Mineral formula with SPF 20.',
      img: 'https://png.pngtree.com/png-vector/20241213/ourmid/pngtree-pink-floral-lipstick-packaging-png-image_14723876.png'
    },
    {
      id: 'm1',
      name: 'Luminous Mist Setting Spray',
      price: 18.40,
      category: 'Setting Spray',
      skin: 'All',
      popularity: 90,
      desc: 'Locks in makeup with a radiant, dewy glow that lasts all day.',
      img: 'https://w7.pngwing.com/pngs/302/877/png-transparent-sk-ii-cream-facial-beauty-sh2-eye-cream-cosmetology-service-people.png'
    },
    {
      id: 'b1',
      name: 'Rose Bliss Body Lotion',
      price: 20.80,
      category: 'Body Care',
      skin: 'Dry',
      popularity: 100,
      desc: 'Nourishing lotion infused with rose oil for silky, hydrated skin.',
      img: 'https://w7.pngwing.com/pngs/787/10/png-transparent-makeup-brush-cosmetics-eye-liner-eye-shadow-lipstick-miscellaneous-microphone-face-thumbnail.png'
    }
  ];

  const state = {
    cart: loadCart(),
    filters: { text: '', category: 'all', skin: 'all', sort: 'popularity', maxPrice: 100 }
  };

  // ===== ELEMENTS =====
  const grid = $('#productGrid');
  const searchInput = $('#searchInput');
  const categoryFilter = $('#categoryFilter');
  const skinFilter = $('#skinFilter');
  const priceRange = $('#priceRange');
  const priceVal = $('#priceVal');
  const sortSelect = $('#sortSelect');
  const clearFiltersBtn = $('#clearFiltersBtn');
  const cartButton = $('#cartButton');
  const cartDrawer = $('#cartDrawer');
  const cartItemsEl = $('#cartItems');
  const cartCount = $('#cartCount');
  const subtotalEl = $('#subtotal');
  const closeCartBtn = $('#closeCartBtn');
  const backdrop = $('#backdrop');
  const checkoutBtn = $('#checkoutBtn');
  const year = $('#year');

  // ===== INIT =====
  function init() {
    year.textContent = new Date().getFullYear();

    // Populate categories
    const cats = Array.from(new Set(products.map(p => p.category)));
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      categoryFilter.appendChild(opt);
    });

    // Filters
    searchInput.addEventListener('input', e => { state.filters.text = e.target.value.toLowerCase().trim(); renderProducts(); });
    categoryFilter.addEventListener('change', e => { state.filters.category = e.target.value; renderProducts(); });
    skinFilter.addEventListener('change', e => { state.filters.skin = e.target.value; renderProducts(); });
    priceRange.addEventListener('input', e => {
      state.filters.maxPrice = Number(e.target.value);
      priceVal.textContent = e.target.value;
      renderProducts();
    });
    sortSelect.addEventListener('change', e => { state.filters.sort = e.target.value; renderProducts(); });
    clearFiltersBtn.addEventListener('click', () => {
      state.filters = { text: '', category: 'all', skin: 'all', sort: 'popularity', maxPrice: 100 };
      searchInput.value = '';
      categoryFilter.value = 'all';
      skinFilter.value = 'all';
      priceRange.value = 100;
      priceVal.textContent = '100';
      sortSelect.value = 'popularity';
      renderProducts();
    });

    cartButton.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    backdrop.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', handleCheckout);

    renderProducts();
    renderCart();
  }

  // ===== PRODUCT GRID =====
  function renderProducts() {
    grid.innerHTML = '';
    let list = products.slice();

    // Apply filters
    if (state.filters.category !== 'all') list = list.filter(p => p.category === state.filters.category);
    if (state.filters.skin !== 'all') list = list.filter(p => p.skin === state.filters.skin || p.skin === 'All');
    if (state.filters.text) list = list.filter(p => (p.name + ' ' + p.desc).toLowerCase().includes(state.filters.text));
    list = list.filter(p => p.price <= state.filters.maxPrice);

    // Sort
    switch (state.filters.sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: list.sort((a, b) => b.popularity - a.popularity);
    }

    if (!list.length) {
      grid.innerHTML = '<p class="muted">No products match your filters.</p>';
      return;
    }

    const tpl = $('#productCardTpl');
    list.forEach(p => {
      const card = tpl.content.firstElementChild.cloneNode(true);
      const thumb = $('.thumb', card);
      const title = $('.title', card);
      const desc = $('.desc', card);
      const price = $('.price', card);
      const btn = $('.add-to-cart', card);

      // ✅ Render image (local or remote)
      thumb.innerHTML = `
        <img src="${p.img}" 
             alt="${p.name}" 
             onerror="this.src='assets/placeholder.png';" 
             style="width:100%;height:100%;object-fit:cover;border-radius:12px;">
      `;

      title.textContent = p.name;
      desc.textContent = p.desc;
      price.textContent = formatCurrency(p.price);

      [thumb, title].forEach(el => el.addEventListener('click', () => openProductModal(p)));
      btn.addEventListener('click', () => addToCart(p.id));

      grid.appendChild(card);
    });
  }

  // ===== MODAL =====
  function openProductModal(p) {
    const modal = $('#productModal');
    $('#productModalTitle').textContent = p.name;
    $('#modalDesc').textContent = `${p.desc} • Category: ${p.category} • Skin: ${p.skin}`;
    $('#modalPrice').textContent = formatCurrency(p.price);
    $('#modalImage').src = p.img;
    $('#modalAddBtn').onclick = () => addToCart(p.id);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    $('#closeModalBtn').onclick = closeModal;
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  function closeModal() {
    const modal = $('#productModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  // ===== CART =====
  function loadCart() { try { return JSON.parse(localStorage.getItem('kestalux_cart') || '{}'); } catch { return {}; } }
  function saveCart() { localStorage.setItem('kestalux_cart', JSON.stringify(state.cart)); }
  function addToCart(id, qty = 1) { state.cart[id] = (state.cart[id] || 0) + qty; saveCart(); renderCart(); openCart(); }
  function removeFromCart(id) { delete state.cart[id]; saveCart(); renderCart(); }
  function setQty(id, qty) { if (qty <= 0) { removeFromCart(id); return; } state.cart[id] = qty; saveCart(); renderCart(); }

  function cartItems() {
    return Object.entries(state.cart).map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      if (!product) return { id, name: 'Unknown', price: 0, category: 'Misc', qty };
      return { ...product, id, qty };
    });
  }

  function cartTotals() {
    const items = cartItems();
    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    return { items, subtotal };
  }

  function renderCart() {
    const { items, subtotal } = cartTotals();
    cartItemsEl.innerHTML = '';

    if (!items.length) {
      cartItemsEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
      cartCount.textContent = '0';
      subtotalEl.textContent = '$0.00';
      return;
    }

    items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="thumb">
          <img src="${it.img}" alt="${it.name}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;">
        </div>
        <div>
          <h4 class="item-title">${it.name}</h4>
          <div class="item-meta">${it.category} • ${formatCurrency(it.price)}</div>
          <div class="qty">
            <button class="icon-btn minus">−</button>
            <span>${it.qty}</span>
            <button class="icon-btn plus">+</button>
            <button class="remove">Remove</button>
          </div>
        </div>
        <div class="price">${formatCurrency(it.price * it.qty)}</div>
      `;

      row.querySelector('.minus').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); setQty(it.id, it.qty - 1); });
      row.querySelector('.plus').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); setQty(it.id, it.qty + 1); });
      row.querySelector('.remove').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); removeFromCart(it.id); });

      cartItemsEl.appendChild(row);
    });

    cartCount.textContent = Object.values(state.cart).reduce((a, b) => a + b, 0);
    subtotalEl.textContent = formatCurrency(subtotal);
  }

  // ===== CART DRAWER =====
  function openCart() {
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.activeElement?.blur();
  }

  // ===== CHECKOUT =====
  function handleCheckout() {
    const { items, subtotal } = cartTotals();
    if (!items.length) {
      alert('Your cart is empty.');
      return;
    }
    localStorage.setItem('kestalux_checkout_total', subtotal);
    window.location.href = 'creditcard.html';
  }

  // ===== UTILITIES =====
  function formatCurrency(n) {
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }

  // ===== START APP =====
  document.addEventListener('DOMContentLoaded', init);
})();
