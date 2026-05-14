// Pegá acá la URL del web app de Google Apps Script después del setup
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxq8YGQjUpUOpi5toJe-aL4vMf-BPiMcLz4bia8aevA0teycHZ7uR7R4-D_usrmV773/exec';

const PRODUCTS = [
  {
    id: 'bufanda',
    name: 'Bufanda',
    description: 'Tejido premium con caída perfecta. Invierno 2026.',
    image: 'Productos/bufanda nobg.png',
  },
  {
    id: 'cartera-tote-tachas',
    name: 'Cartera Tote con Tachas',
    description: 'Tote bag con tachas metálicas plateadas. Tres versiones.',
    image: 'Productos/carteratote con tachas nobg.png',
    variants: [
      { label: 'Natural', image: 'Productos/carteratote con tachas nobg.png' },
      { label: 'Blanca',  image: 'Productos/carteratote con tachas blanca.webp' },
      { label: 'Marrón',  image: 'Productos/carteratote con tachas marron.webp' },
    ],
  },
  {
    id: 'gorro-pompon',
    name: 'Gorro Pompón',
    description: 'Gorro blanco con pompón. Tejido suave, look minimal.',
    image: 'Productos/gorro pompon blanco.png',
  },
  {
    id: 'gorro-roturas',
    name: 'Gorro Roturas',
    description: 'Gorro con roturas. El desastre como estética.',
    image: 'Productos/Gorro roturas nobg.png',
  },
  {
    id: 'guantes-sin-dedo',
    name: 'Guantes Sin Dedo',
    description: 'Guantes urbanos sin dedo. Estilo y funcionalidad.',
    image: 'Productos/Guantes_sin_dedo_nobg.png',
  },
  {
    id: 'boston-bag',
    name: 'Boston Bag',
    description: 'Bolso estructurado con asa corta. Silueta clásica, uso diario.',
    image: 'Productos/BOSTON_BAG-removebg-preview(1).png',
  },
  {
    id: 'cinto-tachas-hebilla-semicirculo',
    name: 'Cinto Tachas · Hebilla Semicírculo',
    description: 'Tachas chicas y grandes, hebilla semicírculo. Actitud rock.',
    image: 'Productos/CINTO_TACHAS_CHICAS_Y_GRANDES_HEBILLA_SEMICIRCULO-removebg-preview.png',
  },
  {
    id: 'cinto-ancho-trenzado',
    name: 'Cinto Ancho Trenzado',
    description: 'Trenzado ancho con maxi hebilla labrada. Textura y presencia.',
    image: 'Productos/CINTO_ANCHO_TRENZADO_MAXI_HEBILLA_LABRADA-removebg-preview.png',
  },
  {
    id: 'cinto-ancho-apliques-piedra',
    name: 'Cinto Ancho Apliques',
    description: 'Apliques y hebilla circular con piedra. Detalle que marca.',
    image: 'Productos/CINTO_ANCHO_CON_APLIQUES_Y_HEBILLA_CIRCULAR_CON_PIEDRA-removebg-preview.png',
  },
];

// Drop release date
const DROP_DATE = new Date('2026-05-26T20:00:00-03:00');

const selected       = new Set();
const activeVariants = {}; // productId -> label de la variante activa

// Inicializar variante default para productos con opciones
PRODUCTS.forEach(p => {
  if (p.variants) activeVariants[p.id] = p.variants[0].label;
});

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function updateCountdown() {
  const diff = DROP_DATE - new Date();

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML =
      '<p style="font-family:var(--font-display);font-size:28px;color:var(--gold);letter-spacing:.06em">El drop ya está disponible</p>';
    return;
  }

  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);

  document.getElementById('days').textContent    = String(d).padStart(2, '0');
  document.getElementById('hours').textContent   = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ─── RENDER PRODUCTS ──────────────────────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById('products-grid');

  grid.innerHTML = PRODUCTS.map(product => {
    const variantsHTML = product.variants
      ? `<div class="card-variants">${product.variants.map((v, i) =>
          `<button class="variant-pill ${i === 0 ? 'active' : ''}"
                   data-product="${product.id}"
                   data-variant="${i}">${v.label}</button>`
        ).join('')}</div>`
      : '';

    return `
      <div class="product-card" data-id="${product.id}" role="button" tabindex="0"
           aria-label="Seleccionar ${product.name}">
        <div class="card-tag">DROP 01</div>
        <div class="card-check">
          <svg viewBox="0 0 12 10"><polyline points="1 5 4.5 8.5 11 1"/></svg>
        </div>
        <div class="card-image">
          <img src="${encodeURI(product.image)}"
               alt="${product.name}"
               id="img-${product.id}"
               loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">${product.name}</h3>
          <p class="card-desc">${product.description}</p>
          ${variantsHTML}
          <div class="card-footer">
            <span class="card-price-badge">Precio a confirmar</span>
            <span class="card-btn">Me interesa</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Card click — toggle selection
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.variant-pill')) return;
      toggleProduct(card.dataset.id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!e.target.closest('.variant-pill')) toggleProduct(card.dataset.id);
      }
    });
  });

  // Variant pills — switch image + track active variant
  grid.querySelectorAll('.variant-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId    = pill.dataset.product;
      const variantIndex = parseInt(pill.dataset.variant, 10);
      const product      = PRODUCTS.find(p => p.id === productId);

      grid.querySelectorAll(`.variant-pill[data-product="${productId}"]`)
          .forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      activeVariants[productId] = product.variants[variantIndex].label;

      document.getElementById(`img-${productId}`).src =
        encodeURI(product.variants[variantIndex].image);
    });
  });
}

// ─── TOGGLE SELECTION ─────────────────────────────────────────────────────────
function toggleProduct(id) {
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.add(id);
  }

  document.querySelector(`.product-card[data-id="${id}"]`)
          .classList.toggle('selected', selected.has(id));

  updateSelectionBar();
}

function updateSelectionBar() {
  const bar     = document.getElementById('selection-bar');
  const countEl = document.getElementById('selection-count');
  const count   = selected.size;

  if (count > 0) {
    bar.classList.add('visible');
    countEl.innerHTML =
      `<strong>${count} producto${count !== 1 ? 's' : ''}</strong>`
      + ` seleccionado${count !== 1 ? 's' : ''}`;
  } else {
    bar.classList.remove('visible');
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getColorForProduct(product) {
  return product.variants ? activeVariants[product.id] : 'Unico';
}

function getSelectedProductsData() {
  return PRODUCTS
    .filter(p => selected.has(p.id))
    .map(p => ({ nombre: p.name, color: getColorForProduct(p) }));
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
const overlay  = document.getElementById('modal-overlay');
const closeBtn = document.getElementById('modal-close');

document.getElementById('selection-cta').addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function openModal() {
  document.getElementById('modal-products').innerHTML =
    getSelectedProductsData().map(p =>
      `<div class="modal-product-item">${p.nombre} &middot; ${p.color}</div>`
    ).join('');

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── FORM SUBMIT ──────────────────────────────────────────────────────────────
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form  = e.target;
  const btn   = form.querySelector('button[type="submit"]');
  const email = form.querySelector('input[type="email"]').value.trim();

  const payload = {
    email,
    productos: getSelectedProductsData(),
  };

  btn.disabled    = true;
  btn.textContent = 'Enviando...';

  try {
    // no-cors evita el preflight; Apps Script recibe el body en e.postData.contents
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      body:   JSON.stringify(payload),
    });

    form.style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
    setTimeout(closeModal, 3500);

    setTimeout(() => {
      form.reset();
      form.style.display = 'flex';
      document.getElementById('modal-success').style.display = 'none';
      btn.disabled    = false;
      btn.textContent = 'Anotarme al drop';
    }, 4000);
  } catch {
    showFormError(form, 'Sin conexion. Revisa tu internet.');
    btn.disabled    = false;
    btn.textContent = 'Anotarme al drop';
  }
});

function showFormError(form, msg) {
  let err = form.querySelector('.form-error');
  if (!err) {
    err = document.createElement('p');
    err.className  = 'form-error';
    err.style.cssText = 'color:#e05252;font-size:12px;margin-top:4px;';
    form.appendChild(err);
  }
  err.textContent = msg;
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderProducts();
