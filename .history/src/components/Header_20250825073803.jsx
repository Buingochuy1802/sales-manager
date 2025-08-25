// src/components/Header.jsx
import { Button } from './ui/Button';

export default function Header({ session, onLogout }){
  return (
    <header>
      <div className="wrap row">
        <div className="nav-left">
          <a className="brand" href="#home">🛍️ SaleMgr</a>
          <a className="btn" href="#home">Trang chủ</a>
          {session?.role==='user' && <a className="btn" href="#orders">Đơn hàng của tôi</a>}
          {session?.role==='admin' && <>
            <a className="btn" href="#all-orders">Tất cả đơn hàng</a>
            <a className="btn" href="#manage-products">Quản lý sản phẩm</a>
          </>}
        </div>
        <div className="nav-right">
          {session ? (
            <>
              <span className="muted">Xin chào, {session.name} ({session.role})</span>
              <a className="btn" href="#profile">Tài khoản</a>
              <Button onClick={onLogout}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <a className="btn" href="#login">Đăng nhập</a>
              <a className="btn primary" href="#register">Đăng ký</a>
            </>
 )}
        </div>
      </div>
    </header>
  );
}