import React from 'react';
import Card from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/Button';

export default function LoginView({ onLogin }){
  const [account, setAccount] = React.useState('');
  const [pass, setPass] = React.useState('');
  return (
    <section className="wrap">
      <h2 className="section-title">Đăng nhập</h2>
      <Card>
        <form className="flex flex-col" style={{gap:12}} onSubmit={(e)=>{
          e.preventDefault();
          try{ onLogin({ account, password: pass }); window.location.hash='#home'; }
          catch(err){ alert(err.message); }
        }}>
          <label className="field">Email hoặc Username
            <input value={account} onChange={e=>setAccount(e.target.value)} required />
          </label>
          <label className="field">Mật khẩu
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
          </label>
          <div className="row" style={{gap:8}}>
            <PrimaryButton type="submit">Đăng nhập</PrimaryButton>
            <a className="btn" href="#register">Chưa có tài khoản? Đăng ký</a>
          </div>
          <div className="muted" style={{marginTop:8}}>Admin mẫu: <code className="kbd">admin / 123</code></div>
        </form>
      </Card>
    </section>
  );
}
