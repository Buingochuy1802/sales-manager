// src/lib/useHashRoute.js
import { useEffect, useState } from 'react';
export default function useHashRoute(){
  const [hash, setHash] = useState(window.location.hash || '#home');
  useEffect(()=>{
    const onHash = ()=> setHash(window.location.hash || '#home');
    window.addEventListener('hashchange', onHash);
    return ()=> window.removeEventListener('hashchange', onHash);
  },[]);
  return hash;
}
