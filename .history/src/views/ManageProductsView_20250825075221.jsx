import React from 'react';
import Card from '../components/ui/Card';
import { PrimaryButton, DangerButton } from '../components/ui/Button';
import { addProduct, updateProduct } from '../lib/data';
import { getProducts, setProducts, fmtVND } from '../lib/storage';

export default function ManageProductsView({ session }) {
  const isAdmin = session?.role === 'admin';
  const [form, setForm] = React.useState({ name: '', description: '', price: '', stock: '' });
  const [products, setProductsState] = React.useState(getProducts());

  // Lấy ?edit=... từ hash mỗi lần render (đơn giản, không cần hook)
  const params = new URLSearchParams((window.location.hash.split('?')[1] || ''));
  const editId = params.get('edit');

  React.useEffect(() => {
    if (editId) {
      const p = getProducts().find(x => x.id === editId);
      if (p) setForm({ name: p.name, description: p.description, price: String(p.price), stock: String(p.stock) });
    } else {
      setForm({ name: '', description: '', price: '', stock: '' });
    }
    setProductsState(getProducts());
  }, [editId]);

  if (!isAdmin) return <section className="wrap"><Card>Chỉ admin mới truy cập trang này.</Card></section>;

  return (
    <section className="wrap">
      <h2 className="section-title">{editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
      <Card>
        <form className="row" style={{ gap: 16, flexWrap: 'wrap' }} onSubmit={(e) => {
          e.preventDefault();
          try {
            const payload = { name: form.name.trim(), description: form.description.trim(), price: Number(form.price), stock: Number(form.stock) };
            if (!payload.name) throw new Error('Tên không được trống');
            if (editId) { updateProduct(editId, payload); alert('Đã lưu thay đổi'); window.location.hash = '#manage-products'; }
            else { addProduct(payload, session); alert('Đã thêm sản phẩm'); }
            setProductsState(getProducts()); setForm({ name: '', description: '', price: '', stock: '' });
          } catch (err) { alert(err.message); }
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="field"><label>Tên sản phẩm<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label></div>
            <div className="field"><label>Mô tả<textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea></label></div>
          </div>
          <div style={{ width: 260 }}>
            <div className="field"><label>Giá (VND)<input type="number" min="0" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label></div>
            <div className="field"><label>Tồn kho<input type="number" min="0" required value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></label></div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <PrimaryButton type="submit">{editId ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</PrimaryButton>
            {editId && <a className="btn" href="#manage-products">Hủy chỉnh sửa</a>}
          </div>
        </form>
      </Card>

      <h3 style={{ marginTop: 24 }}>Danh sách sản phẩm</h3>
      <div className="grid">
        {products.map(p => (
          <Card key={p.id}>
            <div className="row spread"><h3>{p.name}</h3><span className="tag">Tồn: {p.stock}</span></div>
            <div className="muted">{p.description}</div>
            <div className="row spread" style={{ marginTop: 6 }}>
              <div>{fmtVND(p.price)}</div>
              <div className="row">
                <a className="btn" href={`#manage-products?edit=${p.id}`}>Sửa</a>
                <DangerButton onClick={() => {
                  if (window.confirm('Xóa sản phẩm này?')) {
                    setProducts(getProducts().filter(x => x.id !== p.id));
                    setProductsState(getProducts());
                  }
                }}>Xóa</DangerButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
