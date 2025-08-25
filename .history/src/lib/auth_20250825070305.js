// src/lib/auth.js
import { KEYS, ls, getUsers, setUsers, nowISO, uid } from './storage';
import { useState } from 'react';

export function useSession(){
  const [session, setSession] = useState(()=> ls.get(KEYS.current, null));

  const login = ({ account, password }) => {
    const acc = String(account||'').trim().toLowerCase();
    const users = getUsers();
    const u = users.find(x =>
      (x.email && x.email.toLowerCase()===acc) ||
      (x.username && x.username.toLowerCase()===acc)
    );
    if(!u || u.password!==password) throw new Error('Sai tài khoản hoặc mật khẩu');
    const cur = { id: u.id, name: u.name, role: u.role, email: u.email, username: u.username };
    ls.set(KEYS.current, cur); setSession(cur); return cur;
  };

  const logout = ()=> { ls.set(KEYS.current, null); setSession(null); };

  const register = ({ name, username, email, password }) => {
    const users = getUsers();
    if(username && users.some(u=>u.username?.toLowerCase()===(username||'').toLowerCase())) throw new Error('Username đã tồn tại');
    if(email && users.some(u=>u.email?.toLowerCase()===(email||'').toLowerCase())) throw new Error('Email đã tồn tại');
    const user = { id: uid(), name, username, email, password, role: 'user', createdAt: nowISO() };
    users.push(user); setUsers(users);
    const cur = { id: user.id, name: user.name, role: user.role, email: user.email, username: user.username };
    ls.set(KEYS.current, cur); setSession(cur); return user;
  };

  const updateProfile = ({ name, password }) => {
    if(!session) throw new Error('Chưa đăng nhập');
    const users = getUsers();
    const idx = users.findIndex(u=>u.id===session.id);
    if(idx<0) throw new Error('Không tìm thấy tài khoản');
    if(name) users[idx].name = name;
    if(password) users[idx].password = password;
    setUsers(users);
    const cur = { id: users[idx].id, name: users[idx].name, role: users[idx].role, email: users[idx].email, username: users[idx].username };
    ls.set(KEYS.current, cur); setSession(cur);
  };

  return { session, isAdmin: session?.role==='admin', isLogged: !!session, login, logout, register, updateProfile };
}
