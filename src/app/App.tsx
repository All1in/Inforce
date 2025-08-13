import { Route, Routes } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail.tsx';
import ProductList from '../components/ProductList.tsx';

import '../styles/App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  )
}

export default App
