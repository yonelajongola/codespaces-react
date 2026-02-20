import React from 'react';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import Cart from '../components/Cart';

export default function CartPage() {
  return (
    <div>
      <Navbar />
      <Cart />
      <Footer />
    </div>
  );
}
