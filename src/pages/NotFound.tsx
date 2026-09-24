import { ArrowLeft, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DemoBanner from '../components/DemoBanner';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col pt-16 outline-none lg:pt-[70px]">
        <DemoBanner />
        <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f5e8d0]">
            <PackageOpen size={39} className="text-[#9c6220]" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#a67539]">404 · Page not found</p>
          <h1 className="mb-3 text-3xl font-extrabold leading-tight text-[#1a1a1a] sm:text-4xl">This page isn't in the demo.</h1>
          <p className="mb-8 max-w-md text-sm leading-7 text-[#5a5550]">
            The link might be incorrect, or this page may not be included in the Packform website concept.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#976020] px-6 py-3 text-sm font-bold text-white hover:bg-[#794919] sm:w-auto">
              <ArrowLeft size={17} /> Back to Home
            </Link>
            <Link to="/products" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#e5e0d8] bg-white px-6 py-3 text-sm font-bold text-[#1a1a1a] hover:bg-[#f8f6f2] sm:w-auto">
              Browse Products
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
