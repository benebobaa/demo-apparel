import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/hanken-grotesk';
import './style.css';

import { CONFIG, CATEGORIES, products, byId, money } from './products.js';
import { art } from './art.js';
import { cart } from './cart.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const page = $('#page');
const drawer = $('#drawer');
const scrim = $('#scrim');
const toastEl = $('#toast');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- static art + price slots ---------- */
$$('[data-art]').forEach((el) => {
  const p = byId[el.dataset.art];
  el.innerHTML = art(p, { label: false, grain: !el.hasAttribute('data-thumb') });
});
$$('[data-price]').forEach((el) => (el.textContent = money(byId[el.dataset.price].price)));
$$('[data-free-threshold]').forEach((el) => (el.textContent = money(CONFIG.freeShippingThreshold)));

/* ---------- collection ---------- */
let activeCategory = 'All';

function cardHTML(p, i, featured) {
  const sizes = p.sizes
    ? `<div class="sizes" role="radiogroup" aria-label="Size for ${p.name}">
        ${p.sizes
          .map(
            (s, k) =>
              `<button type="button" class="size" role="radio" aria-checked="${k === 1}" data-size="${s}">${s}</button>`,
          )
          .join('')}
       </div>`
    : '<span class="sizes sizes--one">One size</span>';

  return `
  <article class="card${featured ? ' card--feature' : ''}" data-id="${p.id}" style="--i:${i}">
    <div class="card__media">
      <div class="card__art">
        ${art(p, { label: true })}
        ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ''}
      </div>
      <div class="card__buy">
        ${sizes}
        <button type="button" class="add" data-add>Add to bag</button>
      </div>
    </div>
    <div class="card__meta">
      <div>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__cat">${p.category}</p>
      </div>
      <p class="card__price">${money(p.price)}</p>
    </div>
    ${featured ? `<p class="card__blurb">${p.blurb}</p>` : ''}
  </article>`;
}

const promoHTML = `
  <aside class="promo" style="--i:7">
    <p class="promo__big">Free delivery over ${money(CONFIG.freeShippingThreshold)}.</p>
    <p>Thirty days to change your mind, and we pay for the return.</p>
  </aside>`;

function renderGrid() {
  const grid = $('#grid');
  const all = activeCategory === 'All';
  const list = all ? products : products.filter((p) => p.category === activeCategory);
  grid.classList.toggle('grid--all', all);
  grid.innerHTML =
    list.map((p, i) => cardHTML(p, i, all && i === 0)).join('') + (all ? promoHTML : '');
  $('#grid-status').textContent = `Showing ${list.length} ${list.length === 1 ? 'piece' : 'pieces'}${all ? '' : ` in ${activeCategory}`}`;
}

function renderFilters() {
  const f = $('#filters');
  f.innerHTML = ['All', ...CATEGORIES]
    .map((c) => {
      const n = c === 'All' ? products.length : products.filter((p) => p.category === c).length;
      return `<button type="button" class="filter" data-cat="${c}" aria-pressed="${c === activeCategory}">${c}<sup>${n}</sup></button>`;
    })
    .join('');
}

function setCategory(cat) {
  if (cat === activeCategory) return;
  activeCategory = cat;
  renderFilters();
  renderGrid();
}

$('#filters').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]');
  if (b) setCategory(b.dataset.cat);
});

$$('[data-filter-link]').forEach((a) =>
  a.addEventListener('click', () => setCategory(a.dataset.filterLink)),
);

$('#grid').addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;

  const sizeBtn = e.target.closest('.size');
  if (sizeBtn) {
    $$('.size', card).forEach((b) => b.setAttribute('aria-checked', String(b === sizeBtn)));
    return;
  }

  const add = e.target.closest('[data-add]');
  if (add) {
    const chosen = $('.size[aria-checked="true"]', card)?.dataset.size ?? null;
    cart.add(card.dataset.id, chosen);
    add.textContent = 'Added ✓';
    add.classList.add('is-done');
    setTimeout(() => {
      add.textContent = 'Add to bag';
      add.classList.remove('is-done');
    }, 1400);
    openDrawer(add);
  }
});

renderFilters();
renderGrid();

/* ---------- hero quick-add + store-owner try-it ---------- */
const quick = $('[data-quick-add]');
quick.addEventListener('click', () => {
  cart.add(quick.dataset.quickAdd, quick.dataset.size);
  openDrawer(quick);
});
$('[data-try-bag]').addEventListener('click', (e) => {
  cart.add('field-coat', 'M');
  openDrawer(e.currentTarget);
});

/* ---------- cart drawer ---------- */
let lastFocus = null;
drawer.inert = true;

function openDrawer(trigger) {
  lastFocus = trigger || document.activeElement;
  renderCart();
  scrim.hidden = false;
  drawer.inert = false;
  drawer.setAttribute('aria-hidden', 'false');
  page.inert = true;
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => {
    drawer.classList.add('is-open');
    scrim.classList.add('is-open');
    $('#close-cart').focus({ preventScroll: true });
  });
}

function closeDrawer() {
  drawer.classList.remove('is-open');
  scrim.classList.remove('is-open');
  page.inert = false;
  document.body.classList.remove('is-locked');
  drawer.setAttribute('aria-hidden', 'true');
  const done = () => {
    scrim.hidden = true;
    drawer.inert = true;
  };
  reduceMotion ? done() : setTimeout(done, 420);
  lastFocus?.focus?.({ preventScroll: true });
}

$('#open-cart').addEventListener('click', (e) => openDrawer(e.currentTarget));
$('#close-cart').addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
});

function lineHTML(l) {
  const p = byId[l.id];
  return `
  <li class="line" data-id="${l.id}" data-size="${l.size ?? ''}">
    <div class="line__art">${art(p, { label: false, grain: false })}</div>
    <div class="line__info">
      <p class="line__name">${p.name}</p>
      <p class="line__sub">${l.size ? `Size ${l.size}` : 'One size'}</p>
      <div class="qty" role="group" aria-label="Quantity for ${p.name}">
        <button type="button" data-dec aria-label="Decrease quantity">−</button>
        <span aria-live="polite">${l.qty}</span>
        <button type="button" data-inc aria-label="Increase quantity" ${l.qty >= 9 ? 'disabled' : ''}>+</button>
      </div>
    </div>
    <div class="line__right">
      <p class="line__price">${money(p.price * l.qty)}</p>
      <button type="button" class="line__remove" data-remove>Remove</button>
    </div>
  </li>`;
}

function renderCart() {
  const n = cart.count();
  const count = $('#cart-count');
  count.textContent = n;
  count.setAttribute('aria-label', `${n} ${n === 1 ? 'item' : 'items'}`);
  count.classList.toggle('has-items', n > 0);
  $('#drawer-count').textContent = n ? `(${n})` : '';

  const body = $('#drawer-body');
  const foot = $('#drawer-foot');
  const ship = $('#ship');

  if (!n) {
    ship.innerHTML = '';
    body.innerHTML = `
      <div class="empty">
        <p class="empty__title">Nothing here yet.</p>
        <p>Most people start with the coat. It's the piece the rest of the collection is built around.</p>
        <button type="button" class="btn" data-empty-add>Add the Field Coat <span aria-hidden="true">→</span></button>
        <button type="button" class="text-link" data-empty-browse>or keep browsing</button>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  const left = cart.remaining();
  const pct = Math.min(100, (cart.subtotal() / CONFIG.freeShippingThreshold) * 100);
  ship.innerHTML = `
    <p>${
      left > 0
        ? `You're <strong>${money(left)}</strong> away from free delivery.`
        : `<strong>Free delivery unlocked.</strong> We'll cover the shipping.`
    }</p>
    <div class="ship__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}" aria-label="Progress to free delivery">
      <span class="ship__fill" style="--p:${pct / 100}"></span>
    </div>`;

  body.innerHTML = `<ul class="lines">${cart.lines.map(lineHTML).join('')}</ul>`;
  foot.innerHTML = `
    <div class="sum"><span>Subtotal</span><strong>${money(cart.subtotal())}</strong></div>
    <p class="sum__note">Delivery and taxes are calculated at checkout.</p>
    <button type="button" class="btn btn--block" data-checkout>Checkout <span aria-hidden="true">→</span></button>`;
}

$('#drawer-body').addEventListener('click', (e) => {
  if (e.target.closest('[data-empty-add]')) return cart.add('field-coat', 'M');
  if (e.target.closest('[data-empty-browse]')) {
    closeDrawer();
    return $('#shop').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  const row = e.target.closest('.line');
  if (!row) return;
  const { id } = row.dataset;
  const size = row.dataset.size || null;
  const line = cart.lines.find((l) => l.id === id && l.size === size);
  if (e.target.closest('[data-inc]')) cart.setQty(id, size, line.qty + 1);
  if (e.target.closest('[data-dec]')) cart.setQty(id, size, line.qty - 1);
  if (e.target.closest('[data-remove]')) cart.remove(id, size);
});

$('#drawer-foot').addEventListener('click', (e) => {
  if (e.target.closest('[data-checkout]')) {
    toast('This is a demo. In your store, checkout connects to your payment provider.');
  }
});

let bumpTimer;
cart.subscribe(() => {
  renderCart();
  const c = $('#cart-count');
  c.classList.remove('bump');
  void c.offsetWidth;
  c.classList.add('bump');
  clearTimeout(bumpTimer);
  bumpTimer = setTimeout(() => c.classList.remove('bump'), 600);
});
renderCart();

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 4200);
}

/* ---------- newsletter ---------- */
$('#news-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#email');
  const msg = $('#news-msg');
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
  msg.classList.toggle('is-error', !ok);
  if (!ok) {
    msg.textContent = 'That email looks off. Try name@example.com.';
    input.setAttribute('aria-invalid', 'true');
    return input.focus();
  }
  input.removeAttribute('aria-invalid');
  msg.textContent = 'Done. Your code is HALDEN10 (this is a demo, so no email was sent).';
  input.value = '';
});

/* ---------- header + reveals ---------- */
const header = $('#site-header');
const onScroll = () => header.classList.toggle('is-stuck', scrollY > 12);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const revealEls = $$('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealEls.forEach((el) => io.observe(el));
}
