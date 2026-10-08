// Everything a store owner would edit lives in this file: brand, money, catalogue.

export const CONFIG = {
  brand: 'Halden',
  locale: 'en-US',
  currency: 'USD',
  // Prices below are written in USD. Switch to Indonesian rupiah with:
  //   locale: 'id-ID', currency: 'IDR', priceMultiplier: 16000, freeShippingThreshold: 150
  priceMultiplier: 1,
  freeShippingThreshold: 150,
};

export const CATEGORIES = ['Outerwear', 'Knitwear', 'Shirts', 'Bottoms', 'Accessories'];

const APPAREL_SIZES = ['S', 'M', 'L'];

// `image` is optional. Set it (e.g. '/img/field-coat.jpg') to show a real photo
// instead of the drawn garment. `type` + `bg` + `color` drive the drawn version.
export const products = [
  {
    id: 'field-coat',
    name: 'Field Coat',
    category: 'Outerwear',
    price: 420,
    type: 'coat',
    bg: '#d8c6aa',
    color: '#5a3b29',
    sizes: APPAREL_SIZES,
    badge: 'New',
    blurb: 'Boiled Portuguese wool, cut long and unlined. Gets better the more weather it sees.',
  },
  {
    id: 'poplin-shirt',
    name: 'Poplin Shirt',
    category: 'Shirts',
    price: 96,
    type: 'shirt',
    bg: '#c5d0c0',
    color: '#f0ead9',
    sizes: APPAREL_SIZES,
    blurb: 'Dense cotton poplin with a soft collar that sits right without starch.',
  },
  {
    id: 'rib-crew',
    name: 'Rib Knit Crew',
    category: 'Knitwear',
    price: 128,
    type: 'sweater',
    bg: '#e6bba3',
    color: '#7b2f24',
    sizes: APPAREL_SIZES,
    badge: 'Few left',
    blurb: 'Lambswool in a deep oxblood. Cable front, ribbed cuffs, nothing scratchy.',
  },
  {
    id: 'pleat-trouser',
    name: 'Pleat Trouser',
    category: 'Bottoms',
    price: 148,
    type: 'trouser',
    bg: '#d4d0c6',
    color: '#2d3b33',
    sizes: APPAREL_SIZES,
    blurb: 'A single forward pleat and a high waist, in a forest-green twill.',
  },
  {
    id: 'everyday-tote',
    name: 'Everyday Tote',
    category: 'Accessories',
    price: 185,
    type: 'tote',
    bg: '#ead7a9',
    color: '#9a5530',
    sizes: null,
    blurb: 'Vegetable-tanned leather that darkens with use. Fits a laptop and lunch.',
  },
  {
    id: 'merino-scarf',
    name: 'Merino Scarf',
    category: 'Accessories',
    price: 74,
    type: 'scarf',
    bg: '#bcc7d0',
    color: '#c3623a',
    sizes: null,
    blurb: 'Generous, striped, hand-fringed. Wears as a scarf or a small blanket.',
  },
  {
    id: 'wool-cap',
    name: 'Wool Cap',
    category: 'Accessories',
    price: 58,
    type: 'cap',
    bg: '#e5dbc9',
    color: '#2b3048',
    sizes: null,
    blurb: 'Six-panel cap in navy melton, with a brass-eyelet vent.',
  },
  {
    id: 'linen-overshirt',
    name: 'Linen Overshirt',
    category: 'Shirts',
    price: 132,
    type: 'shirt',
    bg: '#dcae94',
    color: '#85946a',
    sizes: APPAREL_SIZES,
    blurb: 'Washed linen in olive, worn open over a tee or buttoned to the neck.',
  },
];

export const byId = Object.fromEntries(products.map((p) => [p.id, p]));

const fmt = new Intl.NumberFormat(CONFIG.locale, {
  style: 'currency',
  currency: CONFIG.currency,
  maximumFractionDigits: CONFIG.currency === 'USD' ? 0 : undefined,
});

export const money = (n) => fmt.format(n * CONFIG.priceMultiplier);
