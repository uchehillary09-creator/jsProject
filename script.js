document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '2348076550226';
  const BUSINESS_EMAIL = 'uchehillary09@gmail.com';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const openWhatsApp = message => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  };

  const showToast = (message, duration = 3200) => {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  window.showToast = showToast;

  const nav = document.querySelector('.nav');
  const handleScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 36);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const burger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    const spans = burger.querySelectorAll('span');

    const setBurgerState = open => {
      burger.setAttribute('aria-expanded', String(open));
      navLinks.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);

      if (spans.length === 3) {
        spans[0].style.transform = open ? 'rotate(45deg) translate(4.5px, 4.5px)' : '';
        spans[1].style.opacity = open ? '0' : '1';
        spans[2].style.transform = open ? 'rotate(-45deg) translate(4.5px, -4.5px)' : '';
      }
    };

    const closeMenu = () => setBurgerState(false);

    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      setBurgerState(!isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', event => {
      if (!navLinks.classList.contains('open')) return;
      if (nav.contains(event.target)) return;
      closeMenu();
    });
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });

  const revealElements = [...document.querySelectorAll('.reveal')];
  revealElements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 0.05, 0.4) * 0.8 }s`);
  });

  if (prefersReducedMotion) {
    revealElements.forEach(element => element.classList.add('visible'));
  } else {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealElements.forEach(element => revealObs.observe(element));
  }

  const animateCounter = element => {
    const target = parseInt(element.dataset.target || '0', 10);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 1200;
    const startTime = performance.now();

    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = `${prefix}${value.toLocaleString()}${suffix}`;

      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  };

  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  if (prefersReducedMotion) {
    statNumbers.forEach(element => {
      const prefix = element.dataset.prefix || '';
      const suffix = element.dataset.suffix || '';
      const target = parseInt(element.dataset.target || '0', 10);
      element.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
    });
  } else if (statNumbers.length) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(element => counterObs.observe(element));
  }

  const heroSlider = document.querySelector('[data-slider]');
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll('.hero-slide')];
    const dots = [...heroSlider.querySelectorAll('[data-slider-dot]')];
    const prevBtn = heroSlider.querySelector('[data-slider-prev]');
    const nextBtn = heroSlider.querySelector('[data-slider-next]');
    let activeIndex = slides.findIndex(slide => slide.classList.contains('is-active'));
    let sliderTimer = null;

    if (activeIndex < 0) activeIndex = 0;

    const setActiveSlide = index => {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    };

    const stopSlider = () => {
      if (!sliderTimer) return;
      window.clearInterval(sliderTimer);
      sliderTimer = null;
    };

    const startSlider = () => {
      if (prefersReducedMotion || slides.length < 2) return;
      stopSlider();
      sliderTimer = window.setInterval(() => setActiveSlide(activeIndex + 1), 5000);
    };

    prevBtn?.addEventListener('click', () => {
      setActiveSlide(activeIndex - 1);
      startSlider();
    });

    nextBtn?.addEventListener('click', () => {
      setActiveSlide(activeIndex + 1);
      startSlider();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        setActiveSlide(index);
        startSlider();
      });
    });

    heroSlider.addEventListener('mouseenter', stopSlider);
    heroSlider.addEventListener('mouseleave', startSlider);
    heroSlider.addEventListener('focusin', stopSlider);
    heroSlider.addEventListener('focusout', startSlider);

    heroSlider.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        setActiveSlide(activeIndex - 1);
        startSlider();
      }
      if (event.key === 'ArrowRight') {
        setActiveSlide(activeIndex + 1);
        startSlider();
      }
    });

    setActiveSlide(activeIndex);
    startSlider();
  }

  document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.shop-card, .featured-card');
      const name = card?.querySelector('.shop-card-name, .featured-name')?.textContent?.trim() || 'this piece';
      const price = card?.querySelector('.shop-card-price, .featured-price')?.textContent?.trim() || 'Price on request';
      const category = card?.querySelector('.shop-card-category, .featured-type')?.textContent?.trim() || 'Collection';

      openWhatsApp(
        [
          'Hello Neyduh\'s Fashion Hub,',
          '',
          `I would like to enquire about: ${name}`,
          `Category: ${category}`,
          `Price: ${price}`,
          '',
          'Please share the next step for ordering.'
        ].join('\n')
      );

      showToast(`Opening WhatsApp for ${name}.`);
    });
  });

  // CART BUTTONS (Add to Cart)
  document.querySelectorAll('.action-btn-cart').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const card = button.closest('.shop-card, .featured-card');
      const productId = card?.dataset.productId || card?.querySelector('.shop-card-name')?.textContent;
      const name = card?.querySelector('.shop-card-name, .featured-name')?.textContent?.trim() || 'Product';
      const price = card?.querySelector('.shop-card-price, .featured-price')?.textContent?.trim() || 'Price on request';
      const category = card?.querySelector('.shop-card-category, .featured-type')?.textContent?.trim() || 'Collection';
      const image = card?.querySelector('img')?.src || '';

      const productData = {
        id: productId,
        name,
        price,
        category,
        image
      };

      addToCart(productId, productData);
      showToast(`${name} added to cart.`);
      button.textContent = 'Added to Cart ✓';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.disabled = false;
      }, 2000);
    });
  });

  // WISHLIST MANAGEMENT
  const WISHLIST_KEY = 'neyduh_wishlist';
  const CART_KEY = 'neyduh_cart';

  const getWishlist = () => {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  };

  const saveWishlist = wishlist => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  };

  const updateWishlistBadge = () => {
    const wishlist = getWishlist();
    const badge = document.getElementById('wishlistBadge');
    if (badge) badge.textContent = wishlist.length;

    const count = document.getElementById('wishlistCount');
    if (count) count.textContent = `(${wishlist.length})`;
  };

  const isInWishlist = productId => {
    return getWishlist().some(item => item.id === productId);
  };

  const addToWishlist = (productId, productData) => {
    const wishlist = getWishlist();
    if (!wishlist.find(item => item.id === productId)) {
      wishlist.push(productData);
      saveWishlist(wishlist);
      updateWishlistBadge();
      return true;
    }
    return false;
  };

  const removeFromWishlist = productId => {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist(wishlist);
    updateWishlistBadge();
  };

  // CART MANAGEMENT
  const getCart = () => {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  };

  const saveCart = cart => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  const updateCartBadge = () => {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = totalItems;

    const count = document.getElementById('cartCount');
    if (count) count.textContent = `(${totalItems})`;
  };

  const addToCart = (productId, productData) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...productData, quantity: 1 });
    }

    saveCart(cart);
    updateCartBadge();
    return true;
  };

  const removeFromCart = productId => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(productId);

    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      saveCart(cart);
      updateCartBadge();
    }
  };

  const getCartTotal = () => {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + (price * (item.quantity || 1));
    }, 0);
    const shipping = 5000; // ₦5,000 shipping
    return { subtotal, shipping, total: subtotal + shipping };
  };

  document.querySelectorAll('.action-btn-outline').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const card = button.closest('.shop-card, .featured-card');
      const productId = card?.dataset.productId || card?.querySelector('.shop-card-name')?.textContent;
      const name = card?.querySelector('.shop-card-name, .featured-name')?.textContent?.trim() || 'Product';
      const price = card?.querySelector('.shop-card-price, .featured-price')?.textContent?.trim() || 'Price on request';
      const category = card?.querySelector('.shop-card-category, .featured-type')?.textContent?.trim() || 'Collection';
      const image = card?.querySelector('img')?.src || '';

      const productData = {
        id: productId,
        name,
        price,
        category,
        image
      };

      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        button.innerHTML = '♡';
        showToast(`${name} removed from wishlist.`);
      } else {
        addToWishlist(productId, productData);
        button.innerHTML = '♥️';
        showToast(`${name} added to wishlist.`);
      }
    });

    // Update heart appearance on page load
    const card = button.closest('.shop-card, .featured-card');
    const productId = card?.dataset.productId || card?.querySelector('.shop-card-name')?.textContent;
    if (isInWishlist(productId)) {
      button.innerHTML = '♥️';
    }
  });

  // WISHLIST PAGE RENDERING
  const renderWishlistPage = () => {
    const wishlist = getWishlist();
    const emptyState = document.getElementById('emptyWishlist');
    const container = document.getElementById('wishlistContainer');
    const itemsDiv = document.getElementById('wishlistItems');

    if (!itemsDiv) return; // Not on wishlist page

    if (wishlist.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (container) container.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (container) container.style.display = 'block';

    itemsDiv.innerHTML = wishlist.map(item => `
      <div class="wishlist-item" data-product-id="${item.id}">
        <div style="display:grid;grid-template-columns:180px 1fr;gap:1.5rem;align-items:start;padding:1.5rem;background:rgba(255,255,255,0.04);border-radius:0.75rem;border:1px solid rgba(198,160,93,0.15);">
          <div style="aspect-ratio:1/1;overflow:hidden;border-radius:0.5rem;background:rgba(255,255,255,0.05);">
            <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div style="display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <p style="color:var(--gold);font-size:0.68rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">${item.category}</p>
              <h3 style="color:var(--white);font-family:var(--serif);font-size:1.3rem;margin-bottom:0.5rem;">${item.name}</h3>
              <p style="color:var(--gray);font-size:0.9rem;margin-bottom:1rem;">${item.price.replace(/^\?/, '')}</p>
            </div>
            <div style="display:flex;gap:0.8rem;flex-wrap:wrap;">
              <a href="contact.html?subject=${encodeURIComponent('Enquiry: ' + item.name)}" class="btn btn-gold" style="flex:1;min-width:140px;text-align:center;padding:0.7rem 1.2rem;font-size:0.85rem;">
                Enquire Now →
              </a>
              <button class="btn btn-outline add-to-cart-btn" data-product-id="${item.id}" style="flex:1;min-width:140px;padding:0.7rem 1.2rem;font-size:0.85rem;">
                Add to Cart
              </button>
              <button class="btn btn-outline remove-wishlist-btn" data-product-id="${item.id}" style="padding:0.7rem 1rem;font-size:0.85rem;white-space:nowrap;">
                Remove ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Bind remove buttons
    document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const item = document.querySelector(`.wishlist-item[data-product-id="${productId}"]`);
        removeFromWishlist(productId);
        item?.remove();
        showToast('Item removed from wishlist.');
        renderWishlistPage();
      });
    });

    // Bind add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const item = wishlist.find(w => w.id === productId);
        if (!item) return;

        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        const existingItem = cart.find(c => c.id === productId);
        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
          cart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        showToast(`${item.name} added to cart.`);
        btn.textContent = 'Added to Cart ✓';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.disabled = false;
        }, 2000);
      });
    });
  };

  // Clear Wishlist Button
  const clearBtn = document.getElementById('clearWishlist');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all items from your wishlist?')) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify([]));
        updateWishlistBadge();
        renderWishlistPage();
        showToast('Wishlist cleared.');
      }
    });
  }

  // Render wishlist on page load if on wishlist page
  renderWishlistPage();
  updateWishlistBadge();

  // CART PAGE RENDERING
  const renderCartPage = () => {
    const cart = getCart();
    const emptyState = document.getElementById('emptyCart');
    const container = document.getElementById('cartContainer');
    const itemsDiv = document.getElementById('cartItems');

    if (!itemsDiv) return; // Not on cart page

    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (container) container.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (container) container.style.display = 'block';

    itemsDiv.innerHTML = cart.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <div style="display:grid;grid-template-columns:180px 1fr;gap:1.5rem;align-items:start;padding:1.5rem;background:rgba(255,255,255,0.04);border-radius:0.75rem;border:1px solid rgba(198,160,93,0.15);">
          <div style="aspect-ratio:1/1;overflow:hidden;border-radius:0.5rem;background:rgba(255,255,255,0.05);">
            <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div style="display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <p style="color:var(--gold);font-size:0.68rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">${item.category}</p>
              <h3 style="color:var(--white);font-family:var(--serif);font-size:1.3rem;margin-bottom:0.5rem;">${item.name}</h3>
              <p style="color:var(--gray);font-size:0.9rem;margin-bottom:1rem;">${item.price.replace(/^\?/, '')}</p>
            </div>
            <div style="display:flex;gap:0.8rem;flex-wrap:wrap;align-items:center;">
              <div style="display:flex;gap:0.5rem;align-items:center;">
                <button class="quantity-btn minus-btn" data-product-id="${item.id}" style="width:30px;height:30px;border:1px solid rgba(255,255,255,0.3);border-radius:50%;background:none;color:var(--white);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;">−</button>
                <span style="color:var(--white);min-width:30px;text-align:center;" id="qty-${item.id}">${item.quantity || 1}</span>
                <button class="quantity-btn plus-btn" data-product-id="${item.id}" style="width:30px;height:30px;border:1px solid rgba(255,255,255,0.3);border-radius:50%;background:none;color:var(--white);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;">+</button>
              </div>
              <button class="btn btn-outline remove-cart-btn" data-product-id="${item.id}" style="padding:0.5rem 0.8rem;font-size:0.75rem;white-space:nowrap;">
                Remove ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Update totals
    const totals = getCartTotal();
    document.getElementById('itemCount').textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById('subtotal').textContent = `₦${totals.subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `₦${totals.total.toLocaleString()}`;

    // Bind quantity buttons
    document.querySelectorAll('.minus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const currentQty = parseInt(document.getElementById(`qty-${productId}`).textContent) || 1;
        updateCartQuantity(productId, currentQty - 1);
        renderCartPage();
      });
    });

    document.querySelectorAll('.plus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const currentQty = parseInt(document.getElementById(`qty-${productId}`).textContent) || 1;
        updateCartQuantity(productId, currentQty + 1);
        renderCartPage();
      });
    });

    // Bind remove buttons
    document.querySelectorAll('.remove-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const item = cart.find(c => c.id === productId);
        removeFromCart(productId);
        showToast('Item removed from cart.');
        renderCartPage();
      });
    });
  };

  // Clear Cart Button
  const clearCartBtn = document.getElementById('clearCart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Clear all items from your cart?')) {
        localStorage.setItem(CART_KEY, JSON.stringify([]));
        updateCartBadge();
        renderCartPage();
        showToast('Cart cleared.');
      }
    });
  }

  // Checkout Modal
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeModal = document.getElementById('closeModal');
  const checkoutForm = document.getElementById('checkoutForm');

  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener('click', () => {
      checkoutModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', () => {
      checkoutModal.style.display = 'none';
      document.body.style.overflow = '';
    });

    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        checkoutModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(checkoutForm);
      const cart = getCart();
      const totals = getCartTotal();

      // Create order summary for confirmation page
      const orderSummary = {
        orderNumber: Math.floor(Math.random() * 900000 + 100000),
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        payment: formData.get('paymentMethod'),
        items: cart.map(item => ({
          name: item.name,
          category: item.category,
          price: item.price.replace(/^\?/, ''),
          quantity: item.quantity || 1
        })),
        total: totals.total.toLocaleString()
      };
      sessionStorage.setItem('neyduh_order_summary', JSON.stringify(orderSummary));

      // Redirect to confirmation page
      window.location.href = 'confirmation.html';

      // (Optional) Send to WhatsApp
      // openWhatsApp(orderMessage);
      // showToast('Order submitted! Opening WhatsApp for confirmation.');
    });
  }

  // Render cart on page load if on cart page
  renderCartPage();
  updateCartBadge();

  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.getCart = getCart;

  const filterTabs = [...document.querySelectorAll('.filter-tab')];
  const shopCards = [...document.querySelectorAll('.shop-card')];
  const shopCount = document.getElementById('shopCount');

  if (filterTabs.length && shopCards.length) {
    const updateVisibleCount = count => {
      if (shopCount) shopCount.textContent = `${count} pieces`;
    };

    const applyFilter = category => {
      let visible = 0;

      filterTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.cat === category);
      });

      shopCards.forEach(card => {
        const show = category === 'all' || card.dataset.cat === category;
        card.style.display = show ? 'block' : 'none';
        if (show) visible += 1;
      });

      updateVisibleCount(visible);
    };

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => applyFilter(tab.dataset.cat || 'all'));
    });

    const queryCategory = new URLSearchParams(window.location.search).get('cat');
    const hasMatchingQuery = queryCategory && filterTabs.some(tab => tab.dataset.cat === queryCategory);
    applyFilter(hasMatchingQuery ? queryCategory : (filterTabs.find(tab => tab.classList.contains('active'))?.dataset.cat || 'all'));
  }

  const sortSelect = document.getElementById('shopSort');
  const shopGrid = document.getElementById('shopGrid');
  if (sortSelect && shopGrid) {
    sortSelect.addEventListener('change', () => {
      const cards = [...shopGrid.querySelectorAll('.shop-card')];
      const getPrice = card => {
        const raw = card.querySelector('.shop-card-price')?.textContent || '0';
        return parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
      };

      if (sortSelect.value === 'low') cards.sort((first, second) => getPrice(first) - getPrice(second));
      if (sortSelect.value === 'high') cards.sort((first, second) => getPrice(second) - getPrice(first));
      cards.forEach(card => shopGrid.appendChild(card));
    });
  }

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(bookingForm);
      const firstName = formData.get('first_name') || '';
      const lastName = formData.get('last_name') || '';
      const serviceType = formData.get('service_type') || 'Bespoke enquiry';
      const date = formData.get('preferred_date') || 'Flexible';
      const time = formData.get('preferred_time') || 'Flexible';
      const email = formData.get('email') || BUSINESS_EMAIL;
      const phone = formData.get('phone') || 'Not provided';
      const note = formData.get('project_details') || 'No additional notes shared yet.';

      const submitButton = bookingForm.querySelector('[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Opening WhatsApp...';
      }

      const fullName = `${firstName} ${lastName}`.trim();
      let bookingMessage = "Hello Neyduh's Fashion Hub,\n\n";
      bookingMessage += 'I would like to request a fitting appointment.\n';
      bookingMessage += 'Name: ' + fullName + '\n';
      bookingMessage += 'Email: ' + email + '\n';
      bookingMessage += 'Phone: ' + phone + '\n';
      bookingMessage += 'Service: ' + serviceType + '\n';
      bookingMessage += 'Preferred date: ' + date + '\n';
      bookingMessage += 'Preferred time: ' + time + '\n\n';
      bookingMessage += 'Project details:\n';
      bookingMessage += note;

      openWhatsApp(bookingMessage);
      showToast('WhatsApp opened with your fitting request.');

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Continue on WhatsApp';
        }
      }, 1000);
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const firstName = formData.get('first_name') || '';
      const lastName = formData.get('last_name') || '';
      const email = formData.get('email') || BUSINESS_EMAIL;
      const phone = formData.get('phone') || 'Not provided';
      const subject = formData.get('subject') || 'General enquiry';
      const timeline = formData.get('timeline') || 'Flexible';
      const message = formData.get('message') || 'No message included.';

      const submitButton = contactForm.querySelector('[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Opening WhatsApp...';
      }

      const fullName = `${firstName} ${lastName}`.trim();
      let enquiryMessage = "Hello Neyduh's Fashion Hub,\n\n";
      enquiryMessage += 'I would like to make an enquiry.\n';
      enquiryMessage += 'Name: ' + fullName + '\n';
      enquiryMessage += 'Email: ' + email + '\n';
      enquiryMessage += 'Phone: ' + phone + '\n';
      enquiryMessage += 'Subject: ' + subject + '\n';
      enquiryMessage += 'Timeline: ' + timeline + '\n\n';
      enquiryMessage += 'Message:\n';
      enquiryMessage += message;

      openWhatsApp(enquiryMessage);
      showToast('WhatsApp opened with your message.');

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send via WhatsApp';
        }
      }, 1000);
    });
  }

  document.querySelectorAll('.faq-q').forEach(question => {
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.setAttribute('aria-expanded', 'false');

    const toggleItem = () => {
      const item = question.parentElement;
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(entry => {
        entry.classList.remove('open');
        entry.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    };

    question.addEventListener('click', toggleItem);
    question.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleItem();
      }
    });
  });

  const dateInput = document.getElementById('fittingDate');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
});

