import React from 'react';
import Card from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/Button';
import { createOrder } from '../lib/data';
import { fmtVND, getProducts } from '../lib/storage';

export default function ProductDetailView({ id, session }){
  const [product, setProduct] = React.useState(()=> getProducts().find(x=>x.id===id));
  const [qty, setQty] = React.useState(1);
  React.useEffect(()=>{ setProduct(getProducts().find(x=>x.id===id)); },[id]);
  if(!product) return <section className="wrap"><Card>Không tìm thấy sản phẩm.</Card></section>;
  return (
    <section className="wrap">
      <div className="row" style={{marginBottom:12}}><a className="btn" href="#home">← Quay lại</a></div>
      <Card>
        <h2 style={{margin:'0 0 8px 0'}}>{product.name}</h2>
        <div className="muted" style={{marginBottom:6}}>{product.description}</div>
        <div className="row" style={{gap:16}}>
          <div><b>Giá:</b> {fmtVND(product.price)}</div>
          <div className="muted">Tồn kho: {product.stock}</div>
        </div>
        <form className="row" style={{marginTop:10,gap:12,alignItems:'center'}} onSubmit={(e)=>{
          e.preventDefault();
          try{
            const order = createOrder({ productId: product.id, quantity: qty }, session);
            alert('Đặt hàng thành công! Mã đơn: '+order.id);
            setProduct(getProducts().find(x=>x.id===id));
          }catch(err){ alert(err.message); }
        }}>
          <label>Số lượng <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))} disabled={product.stock===0} style={{width:100}}/></label>
          <PrimaryButton disabled={!session || product.stock===0}>Mua</PrimaryButton>
          {!session && <span className="muted">Vui lòng đăng nhập để mua</span>}
          {product.stock===0 && <span className="muted">Hết hàng</span>}
        </form>
      </Card>
    </section>
  );
}
