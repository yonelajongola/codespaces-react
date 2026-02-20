import Main from './home/Main';
import Login from './components/Login';
import { CartProvider } from './components/ContextReducer';
import MyOrder from './home/MyOrder';
import SignUp from './components/SignUp';
import CartPage from './home/CartPage';
import Payment from './home/Payment';
import Receipt from './home/Receipt';

import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  return (
    <CartProvider>
        <Router> 

    <div>
      <Routes>
        <Route exact path='/' element={< Main/>} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/createuser' element={<SignUp />} />
        <Route exact path='/myOrder' element={<MyOrder />} />
        <Route exact path='/cart' element={<CartPage />} />
        <Route exact path='/payment' element={<Payment />} />
        <Route exact path='/receipt' element={<Receipt />} />
        </Routes>


    </div> 
    </Router>
      </CartProvider>
  );
}

export default App;
