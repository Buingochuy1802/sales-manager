// src/lib/storage.js
export const KEYS = {
  users: 'shop_users',
  products: 'shop_products',
  orders: 'shop_orders',
  current: 'shop_currentUser',
  seeded: 'shop_seeded_v1',
};

export const fmtVND = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);
export const uid = () => 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
export const nowISO = () => new Date().toISOString();

export const ls = {
  get: (k, fallback) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : (fallback ?? null); } catch { return fallback ?? null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  remove: (k) => localStorage.removeItem(k),
};

export const getUsers = () => ls.get(KEYS.users, []) || [];
export const setUsers = (v) => ls.set(KEYS.users, v);
export const getProducts = () => ls.get(KEYS.products, []) || [];
export const setProducts = (v) => ls.set(KEYS.products, v);
export const getOrders = () => ls.get(KEYS.orders, []) || [];
export const setOrders = (v) => ls.set(KEYS.orders, v);

// Seed với dataset bạn đã gửi
export function seedIfNeeded(){
  if(ls.get(KEYS.seeded)) return;
  const data = {
    users: [
      { id: 'u1', name: 'Nguyễn Văn Admin', username: 'admin', password: '123', role: 'admin' },
      { id: 'u2', name: 'Trần Thị Khách', username: 'user1', password: '123', role: 'user' },
      { id: 'u3', name: 'Lê Văn Người Mua', username: 'user2', password: '123', role: 'user' },
    ],
    products: [
      { id: 'p1', name: 'Laptop Dell XPS 13', description: 'Laptop mỏng nhẹ, hiệu năng cao, phù hợp cho dân văn phòng', price: 32000000, stock: 5, createdBy: 'u1', createdAt: '2024-07-01T09:00:00.000Z' },
      { id: 'p2', name: 'Điện thoại iPhone 15 Pro', description: 'Điện thoại flagship của Apple, chip A17 Bionic', price: 35000000, stock: 8, createdBy: 'u1', createdAt: '2024-07-02T10:30:00.000Z' },
      { id: 'p3', name: 'Chuột Logitech MX Master 3S', description: 'Chuột không dây cao cấp, pin trâu, hỗ trợ đa thiết bị', price: 2500000, stock: 15, createdBy: 'u1', createdAt: '2024-07-03T14:00:00.000Z' },
      { id: 'p4', name: 'Bàn phím cơ Keychron K2', description: 'Bàn phím cơ gọn nhẹ, switch Gateron Brown, kết nối Bluetooth', price: 2200000, stock: 12, createdBy: 'u1', createdAt: '2024-07-04T09:15:00.000Z' },
    ],
    orders: [
      { id: 'o1', userId: 'u2', items: [ { productId: 'p1', quantity: 1 }, { productId: 'p3', quantity: 2 } ], status: 'delivered', createdAt: '2024-07-05T16:00:00.000Z' },
      { id: 'o2', userId: 'u3', items: [ { productId: 'p2', quantity: 1 } ], status: 'pending', createdAt: '2024-07-06T09:30:00.000Z' },
      { id: 'o3', userId: 'u2', items: [ { productId: 'p4', quantity: 1 } ], status: 'cancelled', createdAt: '2024-07-07T11:45:00.000Z' },
      { id: 'o4', userId: 'u3', items: [ { productId: 'p3', quantity: 3 } ], status: 'delivered', createdAt: '2024-07-08T15:20:00.000Z' },
    ],
  };
  const byId = Object.fromEntries(data.products.map(p=>[p.id,p]));
  const enriched = data.orders.map(o=>{
    const items = o.items.map(it=>({ ...it, name: byId[it.productId]?.name, price: byId[it.productId]?.price }));
    const total = items.reduce((s,it)=> s + (it.price||0)*it.quantity, 0);
    return { ...o, items, total };
  });
  setUsers(data.users);
  setProducts(data.products);
  setOrders(enriched);
  ls.set(KEYS.seeded, true);
}
