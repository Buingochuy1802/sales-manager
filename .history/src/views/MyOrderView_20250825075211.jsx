import React from 'react';
import Card from '../components/ui/Card';
import Pill from '../components/Pill';
import { fmtVND, getOrders, getProducts } from '../lib/storage';

export default function MyOrdersView({ session }) {
  if (!session) return <section className="wrap"><Card>Vui lòng đăng nhập để xem đơn hàng.</Card></section>;
  const orders = (getOrders().filter(o => o.userId === session.id) || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!orders.length) return <section className="wrap"><Card>Bạn chưa có đơn hàng nào. Hãy mua sắm tại <a href="#home">Trang chủ</a>.</Card></section>;
  const productsById = Object.fromEntries(getProducts().map(p => [p.id, p]));
  const itemName = it => productsById[it.productId]?.name || it.name || 'Sản phẩm';
  const itemPrice = it => (productsById[it.productId]?.price ?? it.price ?? 0);
  const orderTotal = o => o.items.reduce((s, it) => s + itemPrice(it) * it.quantity, 0);

  return (
    <section className="wrap">
      <h2 className="section-title">Đơn hàng của tôi</h2>
      <table>
        <thead><tr><th>Mã đơn</th><th>Thời gian</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
              <td>
                {o.items.map((it, idx) => (
                  <div key={idx}>{itemName(it)} × {it.quantity}</div>
                ))}
              </td>
              <td>{fmtVND(orderTotal(o))}</td>
              <td><Pill status={o.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
