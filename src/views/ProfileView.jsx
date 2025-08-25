import React from 'react';
import Card from '../components/ui/Card';
import { PrimaryButton, DangerButton } from '../components/ui/Button';

export default function ProfileView({ session, onUpdateProfile, onHardReset }){
  const [name, setName] = React.useState(session?.name||'');
  const [pass, setPass] = React.useState('');
  React.useEffect(()=> setName(session?.name||''), [session?.name]);
  if(!session) return <section className="wrap"><Card>Vui lòng đăng nhập.</Card></section>;
  return (
    <section className="wrap">
      <h2 className="section-title">Thông tin cá nhân</h2>
      <Card>
        <form className="flex" style={{flexDirection:'column', gap:12}} onSubmit={(e)=>{
          e.preventDefault();
          try{ onUpdateProfile({ name, password: pass || undefined }); alert('Đã lưu'); }
          catch(err){ alert(err.message); }
        }}>
          <label className="field">Họ tên<input value={name} onChange={e=>setName(e.target.value)} /></label>
          <label className="field">Đổi mật khẩu (tuỳ chọn)<input type="password" value={pass} onChange={e=>setPass(e.target.value)} /></label>
          <div className="muted">Tài khoản: <b>{session.username || session.email}</b></div>
          <div className="row" style={{gap:8, marginTop:10}}>
            <PrimaryButton type="submit">Lưu</PrimaryButton>
            {session.role==='admin' && (
              <DangerButton onClick={(e)=>{ e.preventDefault(); if(window.confirm('Xóa TẤT CẢ dữ liệu (users/products/orders)?')) onHardReset(); }}>
                Xóa sạch dữ liệu demo
              </DangerButton>
            )}
          </div>
        </form>
      </Card>
    </section>
  );
}
