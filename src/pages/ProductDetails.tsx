import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ClipboardList, PackageOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DemoBanner from '../components/DemoBanner';
import PageHero from '../components/PageHero';
import QuantityControl from '../components/QuantityControl';
import { products } from '../data/products';
import { useEnquiry } from '../context/EnquiryContext';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = products.find((entry) => entry.slug === slug || entry.id === slug);
  const { enquiry, addProduct, isSelected, updateSpecifications } = useEnquiry();
  const [imgError, setImgError] = useState(false);
  // Changing the number should never silently add a product to the enquiry.
  const [draftQuantities, setDraftQuantities] = useState<Record<string, number>>({});
  useEffect(() => setImgError(false), [slug]);

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
        <PageHero breadcrumbs={[{ label: 'Home' }, { label: 'Products' }, { label: product.name }]}
          title="Product" titleAccent="Details"
          subtitle="Explore this packaging option and add it to your sample quotation."
          image="/images/corrugated-stack.jpg" />
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/products" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#9d6829] hover:text-[#754719] focus-visible:outline-2">
            <ArrowLeft size={17} /> All products
          </Link>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#e5e0d8] bg-[#f8f6f2] shadow-sm">
              {imgError ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-[#756c62]">
                  <PackageOpen size={54} aria-hidden="true" /><span>Packaging concept illustration</span>
                </div>
              ) : (
                <img src={product.image} alt={product.name} onError={() => setImgError(true)}
                  className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <span className="mb-3 inline-block rounded-full bg-[#f5e8d0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#986425]">{product.category}</span>
              <h2 className="mb-4 text-3xl font-extrabold leading-tight text-[#1a1a1a] sm:text-4xl">{product.name}</h2>
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
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c4883a] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#ae742c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4883a] sm:w-auto">
                  <ClipboardList size={18} /> Continue to Enquiry <ArrowRight size={16} />
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
