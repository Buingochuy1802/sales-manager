// src/App.js
import React from 'react';
import Header from './components/Header';
import useHashRoute from './lib/useHashRoute';
import { seedIfNeeded } from './lib/storage';
import { useSession } from './lib/auth';

import HomeView from './views/HomeView';
import ProductDetailView from './views/ProductDetailView';
import ManageProductsView from './views/ManageProductsView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import MyOrdersView from './views/MyOrdersView';
import AllOrdersView from './views/AllOrdersView';
import ProfileView from './views/ProfileView';

export default function App(){
  const hash = useHashRoute();
  const { session, isAdmin, login, logout, register, updateProfile } = useSession();

  React.useEffect(()=>{ seedIfNeeded(); },[]);

  const route = (hash||'#home').split('?')[0];
  const productId = hash.startsWith('#product-') ? hash.replace('#product-','').split('?')[0] : null;

  const hardReset = ()=>{
    Object.keys(localStorage).filter(k=>k.startsWith('shop_')).forEach(k=> localStorage.removeItem(k));
    seedIfNeeded();
    window.location.hash = '#home';
    window.location.reload();
  };

  return (
    <div>
      <Header session={session} onLogout={()=>{ logout(); window.location.hash='#home'; }} />

      {productId ? (
        <ProductDetailView id={productId} session={session} />
      ) : route === '#home' ? (
        <HomeView isAdmin={isAdmin} />
      ) : route === '#login' ? (
        <LoginView onLogin={login} />
      ) : route === '#register' ? (
        <RegisterView onRegister={register} />
      ) : route === '#orders' ? (
        <MyOrdersView session={session} />
      ) : route === '#all-orders' ? (
        <AllOrdersView session={session} />
      ) : route === '#manage-products' ? (
        <ManageProductsView session={session} />
      ) : route === '#profile' ? (
        <ProfileView session={session} onUpdateProfile={updateProfile} onHardReset={hardReset} />
      ) : (
        <HomeView isAdmin={isAdmin} />
      )}

      <footer>Chúc bạn có trải nghiệm mua sắm vui vẻ</footer>
    </div>
  );
}
