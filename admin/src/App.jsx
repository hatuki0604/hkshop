import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import { Navigate, Routes, Route } from 'react-router-dom'
import LoginSignup from './Pages/Admin/LoginSignup';
import AddProduct from './Components/AddProduct/AddProduct';
import ListProduct from './Components/ListProduct/ListProduct';
import ListOrder from './Components/ListOrder/ListOrder';

const ProtectedRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem('auth-token');
  return <>
    {isAuth ? children : <Navigate to="/login" />}
  </>
}

const App = () => {
  return (
      <Routes>
        <Route path='login' element={<LoginSignup />} />
        <Route path='' element={
          <ProtectedRoute>
            <Navbar />
            <Admin />
          </ProtectedRoute>} >
          <Route path='/addproduct' element={<AddProduct/>}/>
            <Route path='/listproduct' element={<ListProduct/>}/>
            <Route path='/listorder' element={<ListOrder/>}/>
          </Route>
      </Routes>
  );
}

export default App;