import React from 'react';
import Card from '../components/ui/Card';
import { Button, DangerButton } from '../components/ui/Button';
import { fmtVND, getProducts, setProducts } from '../lib/storage';

export default function HomeView({ isAdmin }){
  const [products, setProductsState] = React.useState(getProducts());
  React.useEffect(()=>{
    const onStorage = ()=> setProductsState(getProducts());
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  },[]);

  return (
    <section className="wrap">
      <h2 className="section-title">Sản phẩm mới</h2>
      <div className="grid">
        {products.map(p=> (
          <Card key={p.id}>
            <div className="row spread">
              <h3>{p.name}</h3>
              <span className="tag">Tồn: {p.stock}</span>
            </div>
            <div className="muted">{p.description}</div>
            <div className="row spread" style={{marginTop:6, alignItems:'flex-end'}}>
              <div>
                <div className="muted" style={{fontSize:12}}>Giá</div>
                <div style={{fontWeight:700}}>{fmtVND(p.price)}</div>
              </div>
              <div className="row">
                <a className="btn" href={`#product-${p.id}`}>Xem</a>
                {isAdmin && <>
                  <a className="btn" href={`#manage-products?edit=${p.id}`}>Sửa</a>
               <DangerButton onClick={()=>{
  if(window.confirm('Xóa sản phẩm này?')){
    setProducts(getProducts().filter(x=>x.id!==p.id));
    setProductsState(getProducts());
  }
                  }}>Xóa</DangerButton>
                </>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
