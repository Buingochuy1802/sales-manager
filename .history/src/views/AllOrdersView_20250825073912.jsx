import React from 'react';
import Card from '../components/ui/Card';
import Pill from '../components/Pill';
import { PrimaryButton } from '../components/ui/Button';
import { updateOrderStatus } from '../lib/data';
import { fmtVND, getOrders, getUsers, getProducts } from '../lib/storage';

export default function AllOrdersView({ session }){
  if(session?.role!=='admin') return <section className="wrap"><Card>Chỉ admin mới truy cập trang này.</Card></section>;
  const orders = (getOrders()||[]).sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
  const usersById = Object.fromEntries(getUsers().map(u=>[u.id,u]));
  const productsById = Object.fromEntries(getProducts().map(p=>[p.id,p]));
  const [statuses, setStatuses] = React.useState(()=> Object.fromEntries(orders.map(o=>[o.id,o.status])));

  const itemName = it => productsById[it.productId]?.name || it.name || 'Sản phẩm';
  const itemPrice = it => (productsById[it.productId]?.price ?? it.price ?? 0);
  const orderTotal = o => o.items.reduce((s,it)=> s + itemPrice(it)*it.quantity, 0);

  return (
    <section className="wrap">
      <h2 className="section-title">Tất cả đơn hàng</h2>
      <table>
        <thead><tr><th>Mã đơn</th><th>Thời gian</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>
          {orders.map(o=> {
            const user = usersById[o.userId];
            return (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                <td>{user?.name||''}</td>
                <td>
                  {o.items.map((it, idx)=> (
                    <div key={idx}>{itemName(it)} × {it.quantity}</div>
                  ))}
                </td>
                <td>{fmtVND(orderTotal(o))}</td>
                <td><Pill status={statuses[o.id]} /></td>
                <td>
                  <select value={statuses[o.id]} onChange={e=> setStatuses({ ...statuses, [o.id]: e.target.value })}>
                    {['pending','delivered','cancelled'].map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                  <PrimaryButton style={{marginLeft:8}} onClick={()=>{
                    try{ updateOrderStatus(o.id, statuses[o.id], session); alert('Đã cập nhật trạng thái'); }
                    catch(err){ alert(err.message); }
                  }}>Cập nhật</PrimaryButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
