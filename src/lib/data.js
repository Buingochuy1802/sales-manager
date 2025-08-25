// src/lib/data.js
import { nowISO, uid, getProducts, setProducts, getOrders, setOrders } from './storage';

export function addProduct({ name, description, price, stock }, current){
  if(!current || current.role!=='admin') throw new Error('Chỉ admin được thêm sản phẩm');
  const p = { id: uid(), name, description, price: Number(price), stock: Number(stock), createdBy: current.id, createdAt: nowISO() };
  const list = getProducts(); list.push(p); setProducts(list); return p;
}

export function updateProduct(id, { name, description, price, stock }){
  const list = getProducts(); const idx = list.findIndex(p=>p.id===id);
  if(idx<0) throw new Error('Không tìm thấy sản phẩm');
  if(name!=null) list[idx].name = name;
  if(description!=null) list[idx].description = description;
  if(price!=null) list[idx].price = Number(price);
  if(stock!=null) list[idx].stock = Number(stock);
  setProducts(list); return list[idx];
}

export function deleteProduct(id){ setProducts(getProducts().filter(p=>p.id!==id)); }

export function createOrder({ productId, quantity }, current){
  if(!current) throw new Error('Bạn cần đăng nhập để mua hàng');
  const products = getProducts(); const p = products.find(x=>x.id===productId);
  if(!p) throw new Error('Sản phẩm không tồn tại');
  quantity = Number(quantity);
  if(quantity<=0) throw new Error('Số lượng không hợp lệ');
  if(p.stock<quantity) throw new Error('Không đủ hàng tồn');
  p.stock -= quantity; setProducts(products);
  const order = {
    id: uid(), userId: current.id,
    items: [{ productId: p.id, name: p.name, price: p.price, quantity }],
    total: p.price * quantity, status: 'pending', createdAt: nowISO()
  };
  const orders = getOrders(); orders.push(order); setOrders(orders); return order;
}

export function updateOrderStatus(orderId, newStatus, current){
  if(!current || current.role!=='admin') throw new Error('Chỉ admin được đổi trạng thái');
  const orders = getOrders(); const idx = orders.findIndex(o=>o.id===orderId);
  if(idx<0) throw new Error('Không tìm thấy đơn');
  orders[idx].status = newStatus; setOrders(orders); return orders[idx];
}
