import { byId, CONFIG } from './products.js';

const KEY = 'halden.cart.v1';
const listeners = new Set();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    // Drop anything that no longer exists in the catalogue. Sizes are checked
    // against the product so stored values can never reach the page as markup.
    return raw.filter((l) => {
      const p = byId[l.id];
      if (!p || !Number.isInteger(l.qty) || l.qty < 1 || l.qty > 9) return false;
      return p.sizes ? p.sizes.includes(l.size) : l.size === null;
    });
  } catch {
    return [];
  }
}

let lines = load();

function commit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* private mode: the cart still works for this session */
  }
  listeners.forEach((fn) => fn());
}

const same = (l, id, size) => l.id === id && l.size === size;

export const cart = {
  get lines() {
    return lines;
  },
  count: () => lines.reduce((n, l) => n + l.qty, 0),
  subtotal: () => lines.reduce((sum, l) => sum + byId[l.id].price * l.qty, 0),
  remaining: () => Math.max(0, CONFIG.freeShippingThreshold - cart.subtotal()),

  add(id, size = null) {
    const line = lines.find((l) => same(l, id, size));
    if (line) line.qty += 1;
    else lines = [...lines, { id, size, qty: 1 }];
    commit();
  },
  setQty(id, size, qty) {
    lines = lines
      .map((l) => (same(l, id, size) ? { ...l, qty: Math.min(qty, 9) } : l))
      .filter((l) => l.qty > 0);
    commit();
  },
  remove(id, size) {
    lines = lines.filter((l) => !same(l, id, size));
    commit();
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
