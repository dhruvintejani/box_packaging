import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ClipboardList, PackageOpen } from 'lucide-react';
import ProductPhoto from '../components/ProductPhoto';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DemoBanner from '../components/DemoBanner';
import QuantityControl from '../components/QuantityControl';
import { products } from '../data/products';
import { useEnquiry } from '../context/EnquiryContext';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = products.find((entry) => entry.slug === slug || entry.id === slug);
  const { enquiry, addProduct, isSelected, updateSpecifications } = useEnquiry();
  // Changing the number should never silently add a product to the enquiry.
  const [draftQuantities, setDraftQuantities] = useState<Record<string, number>>({});

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-[70px]">
          <DemoBanner />
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <PackageOpen size={48} className="mx-auto mb-5 text-[#c4883a]" />
            <h1 className="mb-3 text-3xl font-extrabold text-[#1a1a1a]">Product not found</h1>
            <p className="mb-6 text-[#5a5550]">This product is not available in the current concept catalogue.</p>
            <Link to="/products" className="inline-flex min-h-11 items-center rounded-lg bg-[#c4883a] px-6 text-white hover:bg-[#ae742c]">
              Browse all products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selected = isSelected(product.id);
  const qty = draftQuantities[product.id] ?? enquiry.specifications[product.id]?.quantity ?? 100;
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  const addAndQuote = () => {
    // Commit the pending amount only after an explicit user action.
    if (!selected) addProduct(product.id);
    updateSpecifications(product.id, { quantity: qty });
    navigate('/quote');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-[70px]">
        <DemoBanner />
        <div className="border-b border-[#ebdfcf] bg-gradient-to-r from-[#fdfaf5] via-[#fffdf9] to-[#f3e9db]">
          <nav aria-label="Breadcrumb" className="mx-auto flex min-h-14 max-w-[1280px] flex-wrap items-center gap-2 px-4 py-3 text-xs font-semibold text-[#776b5f] sm:px-6 lg:px-8">
            <Link to="/" className="rounded-md py-1 hover:text-[#9b6624] focus-visible:outline-2">Home</Link>
            <span aria-hidden="true" className="text-[#b5a48e]">/</span>
            <Link to="/products" className="rounded-md py-1 hover:text-[#9b6624] focus-visible:outline-2">Products</Link>
            <span aria-hidden="true" className="text-[#b5a48e]">/</span>
            <span aria-current="page" className="min-w-0 text-[#78501f]">{product.name}</span>
          </nav>
        </div>
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-5 sm:px-6 sm:pt-8 lg:px-8">
          <Link to="/products" className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg px-1 text-sm font-bold text-[#9d6829] hover:text-[#754719] focus-visible:outline-2 sm:mb-7">
            <ArrowLeft size={17} /> All products
          </Link>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductPhoto key={product.id} src={product.image} alt={product.name} />
            <div className="min-w-0">
              <span className="mb-3 inline-block rounded-full bg-[#f5e8d0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#986425]">{product.category}</span>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-[#1a1a1a] sm:text-4xl">{product.name}</h1>
              <p className="mb-6 max-w-xl text-base leading-7 text-[#5a5550]">{product.description}</p>
              <div className="mb-7 rounded-xl border border-[#eadbc3] bg-[#fffaf3] p-4">
                <h2 className="mb-2 text-sm font-bold text-[#1a1a1a]">Customised to your requirements</h2>
                <p className="text-sm leading-6 text-[#665d52]">
                  Specify quantity, dimensions, board preference and printing in the guided enquiry.
                  This is a sample catalogue; final product specifications are agreed with the manufacturer.
                </p>
              </div>
              {selected && (
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-green-700" role="status">
                  <Check size={18} /> Already in your enquiry. Changes are saved when you continue.
                </div>
              )}
              <div className="mb-7">
                <QuantityControl quantity={qty}
                  onChange={(quantity) => setDraftQuantities((previous) => ({ ...previous, [product.id]: quantity }))}
                  label={`Quantity for ${product.name}`} />
                <p className="mt-2 text-xs leading-5 text-[#796e61]">Adjusting quantity does not add the product. Your choice is saved only when you continue.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={addAndQuote}
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#2c261f] bg-[#27231e] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(35,27,19,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b1844a] hover:bg-[#40352a] hover:shadow-[0_12px_27px_rgba(35,27,19,0.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4883a] active:translate-y-0 sm:w-auto">
                  <ClipboardList size={18} className="text-[#edc58f]" aria-hidden="true" /> Continue to Enquiry <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
                <Link to="/products"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#d8cfbf] bg-white px-5 py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f8f6f2] focus-visible:outline-2 sm:w-auto">
                  Explore More Products
                </Link>
              </div>
            </div>
          </div>
          {related.length > 0 && (
            <section className="mt-16 border-t border-[#e5e0d8] pt-10">
              <h2 className="mb-6 text-2xl font-extrabold text-[#1a1a1a]">Explore related packaging</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.id} to={`/products/${item.slug}`}
                    className="group flex min-w-0 items-center gap-4 rounded-xl border border-[#e5e0d8] bg-white p-3 transition-shadow hover:shadow-md">
                    <img src={item.image} alt="" loading="lazy"
                      className="h-20 w-20 shrink-0 rounded-lg bg-[#f8f6f2] object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1a1a1a] group-hover:text-[#a36e2b]">{item.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#5a5550]">{item.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
