import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EnquiryProvider } from './context/EnquiryContext';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Quote from './pages/Quote';
import EnquiryPreview from './pages/EnquiryPreview';

export default function App() {
  return (
    <BrowserRouter>
      <EnquiryProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/quote/preview" element={<EnquiryPreview />} />
        </Routes>
      </EnquiryProvider>
    </BrowserRouter>
  );
}
