import React from 'react';
import Card from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/Button';

export default function RegisterView({ onRegister }){
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  return (
    <section className="wrap">
      <h2 className="section-title">Đăng ký</h2>
      <Card>
        <form className="flex flex-col" style={{gap:12}} onSubmit={(e)=>{
          e.preventDefault();
          try{ onRegister({ name, username, email, password: pass }); alert('Đăng ký thành công!'); window.location.hash = '#home'; }
          catch(err){ alert(err.message); }
        }}>
          <label className="field">Họ tên<input value={name} onChange={e=>setName(e.target.value)} required /></label>
          <label className="field">Username (đăng nhập)<input value={username} onChange={e=>setUsername(e.target.value)} required /></label>
          <label className="field">Email (tuỳ chọn)<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Có thể bỏ trống" /></label>
          <label className="field">Mật khẩu<input type="password" value={pass} onChange={e=>setPass(e.target.value)} required /></label>
          <div className="muted">Tài khoản mới mặc định <b>role = user</b>.</div>
          <div className="row" style={{gap:8, marginTop:8}}>
            <PrimaryButton type="submit">Tạo tài khoản</PrimaryButton>
            <a className="btn" href="#login">Đã có tài khoản? Đăng nhập</a>
          </div>
        </form>
      </Card>
    </section>
  );
}
